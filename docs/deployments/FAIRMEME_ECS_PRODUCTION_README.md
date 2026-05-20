# FairMeme ECS 正式部署手册

## 1. 文档目的

本文档记录 `FairMeme` 在阿里云 ECS 上的正式部署流程，目标是：

- 只部署 `fairmeme.top` 自己的站点资源
- 不影响同机其他十几个项目
- 把上线步骤沉淀成后续可复用的标准 SOP

当前这套方案采用：

- 部署形态：`Next.js 14 + systemd + Nginx + Certbot`
- 部署范围：当前先上线 `apps/web`
- 后端依赖：前端继续请求现有外部接口 `api.fairmeme.io`、`airdrop.fairmeme.io`

说明：

- 这次没有把 `apps/api`、`apps/listener`、`apps/airdrop` 一并自托管上线到 ECS
- 原因是仓库里缺少可直接用于生产的后端私有配置，且现有前端默认就是连接外部 FairMeme API
- 因此本次交付的是一个独立域名、独立 systemd、独立 Nginx、独立 HTTPS 的前端生产站

---

## 2. 当前生产目标

| 项目 | 值 |
| --- | --- |
| 域名 | `fairmeme.top` |
| 别名 | `www.fairmeme.top` |
| ECS IP | `8.218.209.218` |
| SSH 用户 | `admin` |
| 站点目录 | `/var/www/fairmeme/current` |
| 共享配置 | `/var/www/fairmeme/shared/fairmeme-web.env` |
| 日志目录 | `/var/log/fairmeme/` |
| systemd 服务 | `fairmeme-web` |
| 本地监听端口 | `127.0.0.1:3007` |
| Nginx 配置 | `/etc/nginx/conf.d/fairmeme.top.conf` |
| 证书目录 | `/etc/letsencrypt/live/fairmeme.top/` |

端口选择说明：

- 同机已有项目占用 `3003`、`3006`、`8000`、`8002`、`8003`、`8080`、`18080`
- `FairMeme` 独立使用 `3007`
- 不复用其他项目目录、端口、证书或服务名

---

## 3. 仓库推送策略

建议推送到新仓库的内容：

- 顶层文档：`README.md`、`ARCHITECTURE.md`、`AUDIT.md`、`CHANGELOG.md`、`CONTRIBUTING.md`
- 核心源码：`apps/`、`contracts/`、`assets/token-metadata/`
- 文档：`docs/`
- 部署脚本：`scripts/ecs/`
- 生产模板：`infra/ecs/fairmeme-web.env.example`

建议排除：

- `graphify-out/`
- `apps/listener/solprice`
- 所有 `.env`、真实 `config.*`
- 所有构建产物，如 `node_modules/`、`.next/`、`dist/`、`build/`、`target/`

---

## 4. 本地部署前检查

### 4.1 前端构建验证

由于当前工作区存在若干历史 lint / prettier 问题，正式构建建议使用：

```bash
cd /Users/surferboy/FairMeme/apps/web

TWITTER_ID=dummy \
TWITTER_SECRET=dummy \
AUTH_SECRET=dummy \
NEXT_PUBLIC_ENV=prod \
NEXT_PUBLIC_API_V1_BASE_URL=https://api.fairmeme.io/api/v1 \
NEXT_PUBLIC_API_V2_BASE_URL=https://airdrop.fairmeme.io \
NEXT_PUBLIC_WS_URL=wss://api.fairmeme.io/v1/ws \
pnpm exec next build --no-lint
```

已修复的真实构建阻断：

- `apps/web/src/app/api/key/route.ts`
- `apps/web/src/app/api/auth/[...nextauth]/route.js`
- `apps/web/src/utils/pinata.ts`
- `apps/web/src/lib/authOptions.ts`

修复内容是把 NextAuth 与 Pinata 的服务端配置拆到合法导出形式，避免 Next.js 因 `use server` 模块导出对象而在生产构建时报错。

### 4.2 DNS 检查

```bash
dig fairmeme.top +short
dig www.fairmeme.top +short
```

预期：

- `fairmeme.top` -> `8.218.209.218`
- `www.fairmeme.top` -> `8.218.209.218`

---

## 5. 一键部署

### 5.1 首次或普通发布

在仓库根目录执行：

```bash
cd /Users/surferboy/FairMeme
chmod +x scripts/ecs/*.sh
DEPLOY_REMOTE=admin@8.218.209.218 DEPLOY_DOMAIN=fairmeme.top ./scripts/ecs/deploy-web.sh
```

脚本会完成：

1. 打包 `apps/web` 与 `infra/ecs`
2. 上传到 ECS
3. 建立 `fairmeme` 独立目录与日志目录
4. 若共享环境文件不存在，则按模板创建并自动生成 `AUTH_SECRET`
5. 在 ECS 上执行 `pnpm install --frozen-lockfile`
6. 在 ECS 上执行 `next build --no-lint`
7. 写入 `fairmeme-web.service`
8. 写入 `fairmeme.top` 的 HTTP Nginx 配置
9. 校验 `nginx -t` 并 reload

### 5.2 首次 HTTPS

DNS 生效且 HTTP 已通后执行：

```bash
cd /Users/surferboy/FairMeme
DEPLOY_REMOTE=admin@8.218.209.218 DEPLOY_DOMAIN=fairmeme.top ./scripts/ecs/setup-ssl.sh
```

脚本会完成：

1. 使用 `certbot webroot` 为 `fairmeme.top` 与 `www.fairmeme.top` 申请证书
2. 把 Nginx 切换到 HTTPS 配置
3. 检查证书续签
4. 做公网访问验证

---

## 6. 生产环境变量

当前模板文件：

- `infra/ecs/fairmeme-web.env.example`

服务器实际文件：

- `/var/www/fairmeme/shared/fairmeme-web.env`

建议至少包含：

```bash
NODE_ENV=production
PORT=3007
HOSTNAME=127.0.0.1
NEXT_PUBLIC_ENV=prod
NEXT_PUBLIC_GATEWAY_URL=gateway.pinata.cloud
NEXT_PUBLIC_API_V1_BASE_URL=https://api.fairmeme.io/api/v1
NEXT_PUBLIC_API_V2_BASE_URL=https://airdrop.fairmeme.io
NEXT_PUBLIC_WS_URL=wss://api.fairmeme.io/v1/ws
NEXTAUTH_URL=https://fairmeme.top
AUTH_SECRET=<random>
```

补充说明：

- `TWITTER_ID` / `TWITTER_SECRET` 当前若未接真实 Twitter OAuth，可先保留占位值
- `PINATA_JWT` / `PINATA_JWT_FOR_PROD` 未配置时，上传相关功能不可用
- 站点主体浏览、行情、列表与详情页仍可依赖外部 FairMeme API 正常工作

---

## 7. 运维命令

```bash
cd /Users/surferboy/FairMeme

# 服务状态
./scripts/ecs/ops.sh status

# 重启服务
./scripts/ecs/ops.sh restart

# 查看应用日志
./scripts/ecs/ops.sh logs 100

# 查看 Nginx 状态与错误日志
./scripts/ecs/ops.sh nginx 100

# 查看证书
./scripts/ecs/ops.sh cert

# 健康检查
./scripts/ecs/ops.sh health
```

---

## 8. 隔离原则

部署 `FairMeme` 时必须遵守：

- 不修改其他项目的 `/etc/nginx/conf.d/*.conf`
- 不重启其他项目的 systemd、Docker、pm2 服务
- 不复用其他项目目录
- 不复用其他项目端口
- 不执行全局清理命令
- 不删除其他项目证书、日志、构建目录

这次 `FairMeme` 的新增对象仅限：

- `/var/www/fairmeme/`
- `/var/log/fairmeme/`
- `/etc/systemd/system/fairmeme-web.service`
- `/etc/nginx/conf.d/fairmeme.top.conf`
- `/etc/letsencrypt/live/fairmeme.top/`

---

## 9. 回滚

如需快速回滚：

1. 用上一个可用工作区重新执行 `deploy-web.sh`
2. 若只是 Nginx 误改，恢复 `/etc/nginx/conf.d/fairmeme.top.conf`
3. 若只是服务异常：

```bash
ssh admin@8.218.209.218
sudo systemctl restart fairmeme-web
journalctl -u fairmeme-web -n 200 --no-pager
```

---

## 10. 当前结论

本次最稳妥的生产方案是：

- 新仓库保留 FairMeme 的核心源码、文档与部署资产
- ECS 上先正式部署 `apps/web`
- `fairmeme.top` 独立绑定 Nginx / systemd / HTTPS
- 不影响同机其他项目
- 后续若拿到 `apps/api` 的完整生产密钥、数据库、Redis、S3、RPC 配置，再补做后端自托管
