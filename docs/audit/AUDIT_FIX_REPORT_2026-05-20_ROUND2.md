# FairMeme 第三轮审计修复报告

日期：2026-05-20
范围：`apps/*`、`contracts/*`、`assets/*`、根文档、部署配置。

## 结论

本轮在已有 monorepo 整合和二次修复基础上继续做了安全边界、运行时日志、依赖卫生、文档一致性和品牌残留复扫。新增直接修复 6 项，并整理了主审计文档中的重复条目和过期说明。

## 新增修复

| ID | 严重度 | 位置 | 问题 | 修复 |
|---|---|---|---|---|
| R2-01 | High | `apps/web/src/app/api/key/route.ts` | `/api/key` 可被匿名 GET 调用并创建 Pinata 临时上传 key | 改为 `POST`，并通过 `getServerSession(authOptions)` 要求 NextAuth 登录态 |
| R2-02 | High | `apps/web/src/hooks/useIpfsUpload.ts`, `apps/web/src/utils/pinata.ts` | 客户端 Hook 直接导入服务端 Pinata SDK helper，服务端 secret 边界不清晰 | `pinata.ts` 改为 `import 'server-only'`；新增 `pinataClient.ts` 给浏览器端仅使用临时 JWT |
| R2-03 | Medium | `apps/web/src/app/api/auth/[...nextauth]/route.js`, `next-auth.d.ts` | session callback 先写 `session.user.id` 后整体覆盖 `session.user`，导致 id 丢失 | 合并 session/token user 并保留 `id`；补充类型 |
| R2-04 | Medium | `apps/indexer/src/{config,index,dataSource,redis}.ts` | 索引器默认打印 DB 拓扑、事件 payload、Redis publish 信息，生产日志噪声且可能泄露运营数据 | 新增 `INDEXER_DEBUG` 和 `debugLog()`，默认关闭敏感/高噪声日志 |
| R2-05 | Low | `apps/indexer/package.json` | 依赖 `fs` npm shim 且缺少 Node 类型 | 删除 `fs` shim，增加 `@types/node` |
| R2-06 | Low | `contracts/solana/core/package-lock.json`, `apps/api/docs/gen.info`, generated headers | 生成/锁文件中仍有旧 `crazymeme-sol` / `crazy` 元信息 | 更新为 `fairmeme-sol` / `fairmeme-api` / `sponge` |
| R2-07 | Low | `apps/web/src/constants/solana.ts` | 常量名拼写 `DEFUALT_*` | 改为 `DEFAULT_INITIAL_VIRTUAL_TOKEN_RESERVE` |
| R2-08 | Low | `apps/airdrop/internal/services/coingecko/coingecko.go` | 日志拼写 `avaiable` | 改为 `available` |

## 安全复扫

扫描范围排除了 `.archive-original/`、第三方依赖、构建产物与锁文件，重点查：

- AWS / GitHub / JWT / CoinGecko / Ankr / API key 格式
- 明文密码模式
- 旧 `crazyairdrop` ELB
- `crazy`/`Crazy` 品牌残留

结论：

- 活动代码中未发现完整泄露密钥。
- 文档中的历史泄露值已保持 redacted。
- 仍存在两个生产地址字符串形如 `CRAZY...`，位于 `apps/web/src/constants/solana.ts`，这是 Solana 公钥地址而非密钥；保留。
- 文档中保留 `CrazyMeme`/`crazy-state` 仅用于迁移说明。

## 验证结果

本轮已运行：

```bash
go test ./internal/services/coingecko
```

结果：

```text
ok  	github.com/fair-meme/fairmeme/apps/airdrop/internal/services/coingecko
```

全量验证限制：

- `apps/web` / `apps/indexer` 未安装 `node_modules`，无法执行完整 `pnpm build` / `tsc`。
- 本机未安装 Foundry/Anchor，无法执行 `forge build` / `anchor test`。
- Go 全量测试依赖下载仍可能受网络影响；本轮只验证了被改动且可独立运行的 CoinGecko 单元测试。

## 后续建议

1. 安装依赖后运行：
   - `cd apps/web && pnpm install && pnpm lint && pnpm build:test`
   - `cd apps/indexer && pnpm install && pnpm run build`
   - `cd apps/api && go test ./...`
   - `cd apps/listener && go test ./...`
   - `cd apps/airdrop && go test ./...`
   - `cd contracts/evm && forge build && forge test`
   - `cd contracts/solana/core && anchor build && anchor test`
2. 重新生成 Anchor IDL，并替换 `apps/web/src/abi/*` 与 `apps/indexer/src/idl/*` 的手工同步文件。
3. 如果生产环境依赖旧 flash-swap callback `crazySwapCall`，需要外部集成方同步升级到 `fairMemeSwapCall` 或增加兼容适配。
4. 继续推进历史密钥轮换与原仓库历史清理。
