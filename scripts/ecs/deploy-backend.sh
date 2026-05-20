#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEPLOY_REMOTE="${DEPLOY_REMOTE:-admin@8.218.209.218}"
DEPLOY_APP_ROOT="${DEPLOY_APP_ROOT:-/var/www/fairmeme}"
API_PORT="${API_PORT:-18081}"
AIRDROP_PORT="${AIRDROP_PORT:-18082}"
TMP_DIR="$(mktemp -d)"
ARCHIVE_PATH="${TMP_DIR}/fairmeme-backend.tgz"
API_BIN="${TMP_DIR}/fairmeme-api"
AIRDROP_BIN="${TMP_DIR}/fairmeme-airdrop"
BUNDLE_DIR="${TMP_DIR}/bundle"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "[1/10] 交叉编译 Linux 二进制"
(
  cd "${ROOT_DIR}/apps/api"
  GOPROXY="${GOPROXY:-https://goproxy.cn,direct}" CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "${API_BIN}" ./cmd/api
)
(
  cd "${ROOT_DIR}/apps/airdrop"
  GOPROXY="${GOPROXY:-https://goproxy.cn,direct}" CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "${AIRDROP_BIN}" ./cmd/server
)

echo "[2/10] 打包后端代码与部署资产"
mkdir -p "${BUNDLE_DIR}/bin"
rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='build' \
  --exclude='coverage' \
  "${ROOT_DIR}/apps" "${ROOT_DIR}/infra" "${ROOT_DIR}/scripts" "${ROOT_DIR}/docs" \
  "${BUNDLE_DIR}/"
cp "${API_BIN}" "${BUNDLE_DIR}/bin/fairmeme-api"
cp "${AIRDROP_BIN}" "${BUNDLE_DIR}/bin/fairmeme-airdrop"
tar -czf "${ARCHIVE_PATH}" -C "${BUNDLE_DIR}" .

echo "[3/10] 上传到 ECS"
scp "${ARCHIVE_PATH}" "${DEPLOY_REMOTE}:/tmp/fairmeme-backend.tgz"

echo "[4/10] 准备目录与共享配置"
ssh "${DEPLOY_REMOTE}" "DEPLOY_APP_ROOT='${DEPLOY_APP_ROOT}' bash -s" <<'EOF'
set -euo pipefail
sudo mkdir -p "${DEPLOY_APP_ROOT}/current" "${DEPLOY_APP_ROOT}/shared" /var/log/fairmeme
sudo chown -R admin:admin "${DEPLOY_APP_ROOT}" /var/log/fairmeme
rm -rf "${DEPLOY_APP_ROOT}/current/apps" "${DEPLOY_APP_ROOT}/current/infra" "${DEPLOY_APP_ROOT}/current/scripts" "${DEPLOY_APP_ROOT}/current/docs" "${DEPLOY_APP_ROOT}/current/bin"
tar -xzf /tmp/fairmeme-backend.tgz -C "${DEPLOY_APP_ROOT}/current"
if [ ! -f "${DEPLOY_APP_ROOT}/shared/fairmeme-backend.env" ]; then
  python3 - <<PY
from pathlib import Path
import secrets
path = Path("${DEPLOY_APP_ROOT}/shared/fairmeme-backend.env")
path.write_text(
    "FAIRMEME_DB_PASSWORD=" + secrets.token_urlsafe(24) + "\n" +
    "FAIRMEME_REDIS_PASSWORD=" + secrets.token_urlsafe(24) + "\n"
)
PY
fi
if [ ! -f "${DEPLOY_APP_ROOT}/shared/fairmeme-api.yml" ]; then
  cp "${DEPLOY_APP_ROOT}/current/infra/ecs/fairmeme-api.yml.example" "${DEPLOY_APP_ROOT}/shared/fairmeme-api.yml"
fi
if [ ! -f "${DEPLOY_APP_ROOT}/shared/config.toml" ]; then
  cp "${DEPLOY_APP_ROOT}/current/infra/ecs/fairmeme-airdrop.config.example.toml" "${DEPLOY_APP_ROOT}/shared/config.toml"
fi
if [ ! -f "${DEPLOY_APP_ROOT}/shared/fairmeme-airdrop.env" ]; then
  cp "${DEPLOY_APP_ROOT}/current/infra/ecs/fairmeme-airdrop.env.example" "${DEPLOY_APP_ROOT}/shared/fairmeme-airdrop.env"
fi
EOF

echo "[5/10] 注入共享密码到配置文件"
ssh "${DEPLOY_REMOTE}" "DEPLOY_APP_ROOT='${DEPLOY_APP_ROOT}' API_PORT='${API_PORT}' AIRDROP_PORT='${AIRDROP_PORT}' bash -s" <<'EOF'
set -euo pipefail
set -a
. "${DEPLOY_APP_ROOT}/shared/fairmeme-backend.env"
set +a
python3 - <<PY
from pathlib import Path
root = Path("${DEPLOY_APP_ROOT}/shared")
db_pwd = "${FAIRMEME_DB_PASSWORD}"
redis_pwd = "${FAIRMEME_REDIS_PASSWORD}"

api = root / "fairmeme-api.yml"
text = api.read_text()
text = text.replace("CHANGE_ME", db_pwd, 1)
text = text.replace("CHANGE_ME", redis_pwd, 1)
text = text.replace("port: 18081", f"port: ${API_PORT}")
api.write_text(text)

airdrop = root / "config.toml"
text = airdrop.read_text()
text = text.replace("CHANGE_ME", redis_pwd, 1)
text = text.replace("CHANGE_ME", db_pwd, 1)
text = text.replace('port = "18082"', f'port = "${AIRDROP_PORT}"')
airdrop.write_text(text)
PY
EOF

echo "[6/10] 启动 FairMeme 独立 Postgres/Redis"
ssh "${DEPLOY_REMOTE}" "DEPLOY_APP_ROOT='${DEPLOY_APP_ROOT}' bash -s" <<'EOF'
set -euo pipefail
cd "${DEPLOY_APP_ROOT}/current/infra/ecs"
docker compose --env-file "${DEPLOY_APP_ROOT}/shared/fairmeme-backend.env" -f fairmeme-backend.compose.yml up -d
EOF

echo "[7/10] 初始化数据库结构"
ssh "${DEPLOY_REMOTE}" "DEPLOY_APP_ROOT='${DEPLOY_APP_ROOT}' bash -s" <<'EOF'
set -euo pipefail
for i in $(seq 1 20); do
  if docker exec fairmeme-postgres pg_isready -U fairmeme -d fairmeme >/dev/null 2>&1; then
    break
  fi
  sleep 2
done
docker exec -i fairmeme-postgres psql -U fairmeme -d fairmeme < "${DEPLOY_APP_ROOT}/current/apps/api/migrations/20240909001_initial.sql"
docker exec -i fairmeme-postgres psql -U fairmeme -d fairmeme < "${DEPLOY_APP_ROOT}/current/apps/api/migrations/20240909002_airdrop.sql"
docker exec -i fairmeme-postgres psql -U fairmeme -d fairmeme < "${DEPLOY_APP_ROOT}/current/apps/api/migrations/20240909003_airdrop_support.sql"
EOF

echo "[8/10] 写入并启动 API/Airdrop systemd"
ssh "${DEPLOY_REMOTE}" "DEPLOY_APP_ROOT='${DEPLOY_APP_ROOT}' bash -s" <<'EOF'
set -euo pipefail
cat <<UNIT | sudo tee /etc/systemd/system/fairmeme-api.service >/dev/null
[Unit]
Description=FairMeme API
After=network.target docker.service

[Service]
Type=simple
User=admin
WorkingDirectory=${DEPLOY_APP_ROOT}/current/apps/api
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=${DEPLOY_APP_ROOT}/current/bin/fairmeme-api -c ${DEPLOY_APP_ROOT}/shared/fairmeme-api.yml
Restart=always
RestartSec=5
StandardOutput=append:/var/log/fairmeme/api.log
StandardError=append:/var/log/fairmeme/api-error.log

[Install]
WantedBy=multi-user.target
UNIT

cat <<UNIT | sudo tee /etc/systemd/system/fairmeme-airdrop.service >/dev/null
[Unit]
Description=FairMeme Airdrop
After=network.target docker.service

[Service]
Type=simple
User=admin
WorkingDirectory=${DEPLOY_APP_ROOT}/shared
EnvironmentFile=-${DEPLOY_APP_ROOT}/shared/fairmeme-airdrop.env
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=${DEPLOY_APP_ROOT}/current/bin/fairmeme-airdrop
Restart=always
RestartSec=5
StandardOutput=append:/var/log/fairmeme/airdrop.log
StandardError=append:/var/log/fairmeme/airdrop-error.log

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable fairmeme-api fairmeme-airdrop
sudo systemctl restart fairmeme-api fairmeme-airdrop
systemctl is-active fairmeme-api
systemctl is-active fairmeme-airdrop
EOF

echo "[9/10] 更新 Web 环境并重新构建"
ssh "${DEPLOY_REMOTE}" "DEPLOY_APP_ROOT='${DEPLOY_APP_ROOT}' bash -s" <<'EOF'
set -euo pipefail
if ! grep -q '^NEXT_PUBLIC_API_V1_BASE_URL=' "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"; then
  echo 'NEXT_PUBLIC_API_V1_BASE_URL=https://fairmeme.top/api/v1' >> "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
else
  sed -i 's|^NEXT_PUBLIC_API_V1_BASE_URL=.*|NEXT_PUBLIC_API_V1_BASE_URL=https://fairmeme.top/api/v1|' "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
fi
if ! grep -q '^NEXT_PUBLIC_API_V2_BASE_URL=' "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"; then
  echo 'NEXT_PUBLIC_API_V2_BASE_URL=https://fairmeme.top/api/v2' >> "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
else
  sed -i 's|^NEXT_PUBLIC_API_V2_BASE_URL=.*|NEXT_PUBLIC_API_V2_BASE_URL=https://fairmeme.top/api/v2|' "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
fi
cd "${DEPLOY_APP_ROOT}/current/apps/web"
pnpm install --frozen-lockfile
set -a
. "${DEPLOY_APP_ROOT}/shared/fairmeme-web.env"
set +a
pnpm exec next build --no-lint
sudo systemctl restart fairmeme-web
EOF

echo "[10/10] 写入 Nginx 路由并检查"
ssh "${DEPLOY_REMOTE}" "API_PORT='${API_PORT}' AIRDROP_PORT='${AIRDROP_PORT}' bash -s" <<'EOF'
set -euo pipefail
cat <<'NGINX' >/tmp/fairmeme.top.conf
server {
    listen 80;
    server_name fairmeme.top www.fairmeme.top;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://fairmeme.top$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name www.fairmeme.top;

    ssl_certificate /etc/letsencrypt/live/fairmeme.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fairmeme.top/privkey.pem;

    return 301 https://fairmeme.top$request_uri;
}

server {
    listen 443 ssl;
    server_name fairmeme.top;

    ssl_certificate /etc/letsencrypt/live/fairmeme.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fairmeme.top/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;

    location = /health {
        proxy_pass http://127.0.0.1:__API_PORT__/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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
        proxy_pass http://127.0.0.1:3007;
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
sed -i "s/__API_PORT__/${API_PORT}/g; s/__AIRDROP_PORT__/${AIRDROP_PORT}/g" /tmp/fairmeme.top.conf
sudo mv /tmp/fairmeme.top.conf /etc/nginx/conf.d/fairmeme.top.conf
sudo nginx -t
sudo systemctl reload nginx
curl -fsS http://127.0.0.1:${API_PORT}/health >/dev/null
EOF

echo "后端部署完成"
