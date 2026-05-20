# FairMeme 二次审计修复报告

日期：2026-05-20
范围：`apps/*`、`contracts/*`、`assets/*`、顶层文档与部署配置。

## 结论

本轮审计在首次 monorepo 整合基础上继续检查了安全配置、品牌一致性、构建可用性、部署清单、前端运行时配置和链上/链下 IDL 命名一致性。已直接修复 18 项确定问题，其中高风险项包括：

- 剩余硬编码 API key / RPC key
- NextAuth 服务端敏感日志
- 部署清单中的默认密码与旧 namespace/image
- 前端 Solana token decimals 与链上不一致
- Live API 单测导致 CI 不稳定且含 API key

## 已修复问题

| ID | 严重度 | 位置 | 问题 | 修复 |
|---|---|---|---|---|
| F-01 | High | `apps/airdrop/internal/business/member.go` | `TweetScout` API key 仍硬编码在代码里 | 改为 `os.Getenv("TWEETSCOUT_API_KEY")`，并补充 `.env.example` |
| F-02 | High | `apps/indexer/src/index.ts` | Ankr Solana RPC key 硬编码 | 改为 `SOLANA_RPC_URL`，程序 ID 改为 `.env` 配置 |
| F-03 | High | `apps/listener/bootstrap/eth.go` | Ankr Solana RPC key 硬编码 | 新增 `chains` 配置块，支持 config/env 覆盖 |
| F-04 | High | `apps/listener/cmd/test/main.go` | 测试入口硬编码 Ankr WebSocket key | 改为要求 `SOLANA_WS_URL` 环境变量 |
| F-05 | High | `apps/web/src/app/api/auth/[...nextauth]/route.js` | 服务端打印 env、OAuth profile、JWT、session | 删除敏感日志 |
| F-06 | High | `apps/web/src/constants/solana.ts` | `DEFAULT_DECIMALS = 60n`，与链上 `6` 不一致 | 改为 `DEFAULT_DECIMALS = 6` |
| F-07 | Medium | `apps/api/deployments/kubernetes/*` | namespace/label/image 仍是 `crazy`，ConfigMap 含默认 DB/Redis 密码 | 统一为 `fairmeme-api`，密码改 `REPLACE_ME` |
| F-08 | Medium | `apps/api/deployments/docker-compose/docker-compose.yml` | service/image 仍是 `crazy` | 改为 `fairmeme-api` / `fairmeme/fairmeme-api` |
| F-09 | Medium | `apps/api/.golangci.yml` | `local-prefixes: crazy` | 改为新 module path |
| F-10 | Medium | `apps/api/docs/docs.go` | Swagger title 仍是 `crazy api docs` | 改为 `FairMeme API docs` |
| F-11 | Medium | `apps/web/next.config.mjs` | 生产 API rewrite 写死旧 ELB，图片 remotePatterns 重复 hostname | 改为 env 驱动，拆分 `img.fairmeme.io` / `ipfs.io` |
| F-12 | Medium | `apps/airdrop/internal/services/coingecko/coingecko_test.go` | 单测打真实 CoinGecko API 且含 live key | 改为 `httptest` 本地 fixture |
| F-13 | Medium | `contracts/solana/core` | `CrazymemeError` 等类型残留 | 改为 `FairMemeError`，同步调用点 |
| F-14 | Medium | `apps/indexer/src/idl/*` | IDL TypeScript 类型仍叫 `Crazymeme*` | 改为 `FairMemeSol` / `FairMemeReferral` |
| F-15 | Medium | `contracts/evm` | 回调 `crazySwapCall` 与 rename-all 决策冲突 | 改为 `fairMemeSwapCall`，同步调用 |
| F-16 | Medium | `contracts/evm/src/FairMemeSwapPair.sol` | LP symbol 仍为 `CRAZY-ETH` | 改为 `FAIR-ETH` |
| F-17 | Low | `assets/token-metadata`, `contracts/solana/core/metadata` | 元数据仍是 CrazyMeme / CRAZY / crazy.meme | 改为 FairMeme / FAIR / fairmeme.io |
| F-18 | Low | `apps/listener/models/*` | 表名/交易所标识仍是 `crazy_*` / `CRAZY` | 改为 `fairmeme_*` / `FAIR` |

## 安全复扫

执行了针对以下模式的二次扫描：

- AWS access key
- GitHub PAT
- Ankr leaked key
- TweetScout leaked key
- `rootroot` / `default:123456`
- Twitter OAuth secret 片段
- Pinata / Moralis JWT 前缀
- 旧 `crazyairdrop` ELB 主机名

结果：活动代码区未发现匹配项（排除了 `.archive-original/` 和第三方依赖目录）。

## 验证结果

已运行：

```bash
go test ./internal/services/coingecko
```

结果：

```text
ok  	github.com/fair-meme/fairmeme/apps/airdrop/internal/services/coingecko
```

全量验证尝试：

```bash
go test ./...    # apps/airdrop, apps/listener, apps/api
pnpm exec tsc --noEmit    # apps/indexer
forge build      # contracts/evm
```

结果与限制：

- `apps/airdrop`, `apps/listener`, `apps/api` 全量 Go 测试因 `proxy.golang.org` 多个依赖下载 `unexpected EOF` 失败，属于当前网络/依赖下载问题；其中 `apps/airdrop` 暴露的真实 CoinGecko live-test 问题已修复并单独验证通过。
- `apps/indexer` 未安装依赖，`pnpm exec tsc --noEmit` 返回 `tsc not found`。
- 本机未安装 Foundry，`forge build` 返回 `command not found: forge`。
- IDE lints 对修改范围未报告错误。

## 仍需人工决策/后续事项

1. **轮换所有历史泄露密钥**：本轮又确认了 TweetScout 和 Ankr key 仍在原历史里，需一起轮换。
2. **数据库表迁移**：`apps/listener` 表名已从 `crazy_*` 改成 `fairmeme_*`。如果生产数据库已有旧表，需要迁移脚本或兼容视图。
3. **EVM 回调兼容性**：`crazySwapCall` 改为 `fairMemeSwapCall` 会影响外部 flash-swap callee 合约；若已有外部集成，需要同步升级或提供兼容适配器。
4. **安装 toolchain 后重跑全量验证**：
   - `go test ./...`
   - `pnpm install && pnpm exec tsc --noEmit`
   - `forge build && forge test`
   - `anchor build && anchor test`
5. **重新生成 Anchor IDL**：手工同步后的 IDL 应由 `anchor build` 重新生成并复制到 `apps/web` / `apps/indexer`。

