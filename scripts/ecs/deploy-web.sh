#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEPLOY_REMOTE="${DEPLOY_REMOTE:-admin@8.218.209.218}"
DEPLOY_DOMAIN="${DEPLOY_DOMAIN:-fairmeme.top}"
DEPLOY_APP_ROOT="${DEPLOY_APP_ROOT:-/var/www/fairmeme}"
DEPLOY_PORT="${DEPLOY_PORT:-3007}"
API_PORT="${API_PORT:-18081}"
AIRDROP_PORT="${AIRDROP_PORT:-18082}"
TMP_DIR="$(mktemp -d)"
ARCHIVE_PATH="${TMP_DIR}/fairmeme-web.tgz"
SERVICE_NAME="fairmeme-web"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "[1/6] 打包前端代码"
tar \
  --exclude='.git' \
  --exclude='apps/web/node_modules' \
  --exclude='apps/web/.next' \
  --exclude='apps/web/coverage' \
  -czf "${ARCHIVE_PATH}" \
  -C "${ROOT_DIR}" \
  apps/web infra/ecs

echo "[2/6] 上传到 ECS"
scp "${ARCHIVE_PATH}" "${DEPLOY_REMOTE}:/tmp/fairmeme-web.tgz"

echo "[3/6] 同步目录并准备环境文件"
ssh "${DEPLOY_REMOTE}" "bash -s" <<EOF
set -euo pipefail
sudo mkdir -p "${DEPLOY_APP_ROOT}/current" "${DEPLOY_APP_ROOT}/shared" /var/log/fairmeme /var/www/certbot
sudo chown -R admin:admin "${DEPLOY_APP_ROOT}" /var/log/fairmeme /var/www/certbot
rm -rf "${DEPLOY_APP_ROOT}/current/apps" "${DEPLOY_APP_ROOT}/current/infra"
tar -xzf /tmp/fairmeme-web.tgz -C "${DEPLOY_APP_ROOT}/current"
if [ ! -f "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env" ]; then
  cp "${DEPLOY_APP_ROOT}/current/infra/ecs/fairmeme-web.env.example" "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
  python3 - <<'PY'
from pathlib import Path
import secrets
path = Path("${DEPLOY_APP_ROOT}/shared/fairmeme-web.env")
text = path.read_text()
text = text.replace("AUTH_SECRET=replace-me-with-openssl-rand-hex-32", f"AUTH_SECRET={secrets.token_hex(32)}")
path.write_text(text)
PY
fi
EOF

echo "[4/6] 安装依赖并构建"
ssh "${DEPLOY_REMOTE}" "bash -s" <<EOF
set -euo pipefail
cd "${DEPLOY_APP_ROOT}/current/apps/web"
pnpm install --frozen-lockfile
set -a
. "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
set +a
pnpm exec next build --no-lint
EOF

echo "[5/6] 写入 systemd 服务"
ssh "${DEPLOY_REMOTE}" "bash -s" <<EOF
set -euo pipefail
cat <<UNIT | sudo tee /etc/systemd/system/${SERVICE_NAME}.service >/dev/null
[Unit]
Description=FairMeme Web
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=${DEPLOY_APP_ROOT}/current/apps/web
EnvironmentFile=${DEPLOY_APP_ROOT}/shared/fairmeme-web.env
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/bin/env bash -lc 'pnpm exec next start -H 127.0.0.1 -p \${PORT:-3007}'
Restart=always
RestartSec=5
StandardOutput=append:/var/log/fairmeme/web.log
StandardError=append:/var/log/fairmeme/web-error.log

[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}
sudo systemctl restart ${SERVICE_NAME}
systemctl is-active ${SERVICE_NAME}
EOF

echo "[6/6] 写入 Nginx 配置并验证回环"
ssh "${DEPLOY_REMOTE}" "DEPLOY_DOMAIN='${DEPLOY_DOMAIN}' DEPLOY_PORT='${DEPLOY_PORT}' API_PORT='${API_PORT}' AIRDROP_PORT='${AIRDROP_PORT}' bash -s" <<'EOF'
set -euo pipefail
cat <<'NGINX' >/tmp/fairmeme-web-nginx.conf
server {
    listen 80;
    server_name __DEPLOY_DOMAIN__ www.__DEPLOY_DOMAIN__;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://__DEPLOY_DOMAIN__$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name www.__DEPLOY_DOMAIN__;

    ssl_certificate /etc/letsencrypt/live/__DEPLOY_DOMAIN__/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/__DEPLOY_DOMAIN__/privkey.pem;

    return 301 https://__DEPLOY_DOMAIN__$request_uri;
}

server {
    listen 443 ssl;
    server_name __DEPLOY_DOMAIN__;

    ssl_certificate /etc/letsencrypt/live/__DEPLOY_DOMAIN__/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/__DEPLOY_DOMAIN__/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;

    location = /health {
        default_type text/plain;
        return 200 "ok\n";
    }

    location /api/v1/ {
        proxy_pass http://127.0.0.1:__API_PORT__/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v2/ {
        proxy_pass http://127.0.0.1:__AIRDROP_PORT__/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:__DEPLOY_PORT__;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    access_log /var/log/nginx/fairmeme_access.log;
    error_log  /var/log/nginx/fairmeme_error.log;
}
NGINX
sed -i "s/__DEPLOY_DOMAIN__/${DEPLOY_DOMAIN}/g; s/__DEPLOY_PORT__/${DEPLOY_PORT}/g; s/__API_PORT__/${API_PORT}/g; s/__AIRDROP_PORT__/${AIRDROP_PORT}/g" /tmp/fairmeme-web-nginx.conf
sudo mv /tmp/fairmeme-web-nginx.conf /etc/nginx/conf.d/${DEPLOY_DOMAIN}.conf
sudo nginx -t
sudo systemctl reload nginx
curl -I http://127.0.0.1:${DEPLOY_PORT} | head -5
curl -I https://${DEPLOY_DOMAIN}/health | head -5
EOF

echo "部署完成：站点、API、Airdrop 与 HTTPS 路由已保持一致"
