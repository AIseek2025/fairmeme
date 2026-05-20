#!/usr/bin/env bash

set -euo pipefail

DEPLOY_REMOTE="${DEPLOY_REMOTE:-admin@8.218.209.218}"
SERVICE_NAME="${SERVICE_NAME:-fairmeme-web}"
DEPLOY_DOMAIN="${DEPLOY_DOMAIN:-fairmeme.top}"
LINES="${2:-100}"
ACTION="${1:-status}"

case "${ACTION}" in
  status)
    ssh "${DEPLOY_REMOTE}" "systemctl status ${SERVICE_NAME} --no-pager"
    ;;
  restart)
    ssh "${DEPLOY_REMOTE}" "sudo systemctl restart ${SERVICE_NAME} && systemctl is-active ${SERVICE_NAME}"
    ;;
  logs)
    ssh "${DEPLOY_REMOTE}" "tail -n ${LINES} /var/log/fairmeme/web.log /var/log/fairmeme/web-error.log"
    ;;
  nginx)
    ssh "${DEPLOY_REMOTE}" "sudo nginx -t && sudo tail -n ${LINES} /var/log/nginx/fairmeme_error.log"
    ;;
  cert)
    ssh "${DEPLOY_REMOTE}" "sudo certbot certificates | grep -A2 -i '${DEPLOY_DOMAIN}' || true"
    ;;
  health)
    ssh "${DEPLOY_REMOTE}" "systemctl is-active ${SERVICE_NAME} && curl -I http://127.0.0.1:3007 | head -5"
    curl -sI "https://${DEPLOY_DOMAIN}" | head -5
    ;;
  *)
    echo "用法: $0 {status|restart|logs [n]|nginx [n]|cert|health}"
    exit 1
    ;;
esac
