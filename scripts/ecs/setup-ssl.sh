#!/usr/bin/env bash

set -euo pipefail

DEPLOY_REMOTE="${DEPLOY_REMOTE:-admin@8.218.209.218}"
DEPLOY_DOMAIN="${DEPLOY_DOMAIN:-fairmeme.top}"
DEPLOY_PORT="${DEPLOY_PORT:-3007}"

echo "[1/4] 申请 Let’s Encrypt 证书"
ssh "${DEPLOY_REMOTE}" "bash -s" <<EOF
set -euo pipefail
sudo mkdir -p /var/www/certbot
sudo certbot certonly \
  --webroot -w /var/www/certbot \
  -d "${DEPLOY_DOMAIN}" \
  -d "www.${DEPLOY_DOMAIN}" \
  --non-interactive \
  --agree-tos \
  -m "ops@${DEPLOY_DOMAIN}"
EOF

echo "[2/4] 切换为 HTTPS Nginx 配置"
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
        return 301 https://${DEPLOY_DOMAIN}\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name www.${DEPLOY_DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DEPLOY_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DEPLOY_DOMAIN}/privkey.pem;

    return 301 https://${DEPLOY_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${DEPLOY_DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DEPLOY_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DEPLOY_DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;

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
EOF

echo "[3/4] 校验证书与续签"
ssh "${DEPLOY_REMOTE}" "sudo certbot renew --dry-run"

echo "[4/4] 公网验证"
curl -sI "https://${DEPLOY_DOMAIN}" | head -5
curl -sI "https://www.${DEPLOY_DOMAIN}" | head -5
