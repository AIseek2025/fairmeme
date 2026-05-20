#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEPLOY_REMOTE="${DEPLOY_REMOTE:-admin@8.218.209.218}"
DEPLOY_DOMAIN="${DEPLOY_DOMAIN:-fairmeme.top}"
DEPLOY_APP_ROOT="${DEPLOY_APP_ROOT:-/var/www/fairmeme}"
DEPLOY_PORT="${DEPLOY_PORT:-3007}"
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

echo "[6/6] 写入 HTTP Nginx 配置并验证回环"
ssh "${DEPLOY_REMOTE}" "bash -s" <<EOF
set -euo pipefail
cat <<NGINX | sudo tee /etc/nginx/conf.d/${DEPLOY_DOMAIN}.conf >/dev/null
server {
    listen 80;
    server_name ${DEPLOY_DOMAIN} www.${DEPLOY_DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:${DEPLOY_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    access_log /var/log/nginx/fairmeme_access.log;
    error_log  /var/log/nginx/fairmeme_error.log;
}
NGINX
sudo nginx -t
sudo systemctl reload nginx
curl -I http://127.0.0.1:${DEPLOY_PORT} | head -5
EOF

echo "部署完成：先确认 http://${DEPLOY_DOMAIN} 可访问，再执行 scripts/ecs/setup-ssl.sh"
