# FairMeme

> The fairest meme launch platform — multi-chain (Solana + EVM) bonding-curve memecoin
> launchpad, swap, indexer and airdrop in one monorepo.

This repository is a consolidated rebrand of 13 separate `crazymeme/*` and `fair-meme/*` repositories.
The original codebases used the **CrazyMeme** brand internally; identifiers, file names, package
names, configs, and contract names have been migrated to **FairMeme** (see [`AUDIT.md`](./AUDIT.md)
for the full migration report).

---

## Repository layout

```
FairMeme/
├── apps/                     # Off-chain services and frontend
│   ├── web/                  # Next.js 14 frontend (Solana + EVM dual-chain)
│   ├── api/                  # Main backend HTTP API (Go + Gin, sponge framework)
│   ├── listener/             # On-chain event listener + price aggregator (Go)
│   ├── indexer/              # Solana event indexer (TypeScript + TypeORM)
│   └── airdrop/              # Airdrop snapshot/calculation service (Go)
│
├── contracts/                # Smart contracts
│   ├── evm/                  # Current EVM contracts (Solidity 0.8.26 + Foundry)
│   ├── solana/
│   │   ├── core/             # Bonding curve program (Anchor 0.29)
│   │   └── referral/         # Referral program (Anchor)
│   └── legacy/
│       └── evm-v0/           # First-generation EVM contracts (kept for reference)
│
├── assets/
│   └── token-metadata/       # Token metadata JSON
│
├── docs/                     # Documentation hub
│   ├── audit/
│   └── deployments/
│
├── ARCHITECTURE.md           # Architecture diagram & data flow
├── AUDIT.md                  # Code audit & rebrand report
├── CHANGELOG.md
├── CONTRIBUTING.md
└── README.md                 # (this file)
```

---

## Architecture at a glance

```
                   ┌────────────────────────┐
                   │        Browser         │
                   │  apps/web (Next.js)    │
                   └───────┬─────────┬──────┘
                           │ HTTP/WS │ Wallet RPC
                           ▼         ▼
                   ┌────────────────────────┐    Postgres / MySQL
                   │   apps/api (Go/Gin)    │◄───►ClickHouse, Redis
                   └───────┬───────┬────────┘
                           │       │
              read prices  │       │ read indexed events
                           ▼       ▼
   ┌─────────────────────────┐   ┌─────────────────────────────┐
   │   apps/listener (Go)    │   │   apps/indexer (TypeScript) │
   │ EVM chain events +      │   │ Solana program events       │
   │ price feeds (SolPrice)  │   │ (TypeORM → Postgres)        │
   └────────────┬────────────┘   └─────────────┬───────────────┘
                │                              │
                ▼                              ▼
       EVM chains (ETH/BSC/Base)         Solana mainnet/devnet
       contracts/evm                     contracts/solana/{core,referral}

                   ┌────────────────────────┐
                   │  apps/airdrop (Go)     │
                   │  cross-chain snapshots │
                   └────────────────────────┘
```

---

## Quick start

Each service / contract suite has its own README with build & run instructions.
Common prerequisites:

| Component        | Toolchain                                        |
|------------------|--------------------------------------------------|
| `apps/web`       | Node 20 + pnpm 9                                 |
| `apps/api`       | Go 1.22 + sponge CLI                             |
| `apps/listener`  | Go 1.21                                          |
| `apps/airdrop`   | Go 1.22 + Postgres 14 + Redis 6                  |
| `apps/indexer`   | Node 20 + pnpm + Postgres 14                     |
| `contracts/evm`  | Foundry (forge, cast, anvil)                     |
| `contracts/solana/*` | Rust + Anchor 0.29 + Solana CLI 1.16        |

### Bootstrapping any service

Every service ships a `*.example` config or `.env.example`. Copy and fill it before running:

```bash
cp apps/web/.env.example          apps/web/.env
cp apps/airdrop/.env.example      apps/airdrop/.env
cp apps/airdrop/config.example.toml apps/airdrop/config.toml
cp apps/indexer/.env.example      apps/indexer/.env
cp apps/listener/config.example.yaml apps/listener/config.yaml
cp apps/api/configs/fairmeme.example.yml apps/api/configs/fairmeme.yml
```

> **Never commit a real `.env` or filled `config.*` file.** See [`AUDIT.md`](./AUDIT.md)
> for the credential rotation that must happen before going to production.

---

## Source-of-truth identifiers

| Layer          | Symbol                              | Notes |
|----------------|-------------------------------------|-------|
| Anchor program | `fairmeme_sol`                      | crate `fairmeme-sol`, program ID still `AyVwefFVyuwgtBQ2cTteN3ZKo4Z4rCgvBtr3tgvnaPpb` |
| Anchor program | `fairmeme_referral`                 | crate `fairmeme-referral`, program ID `B5LrGrvdsdsmjYQPrg24kneF8DpztYm2RScq1DsbE92B` |
| PDA seed       | `b"fair-meme-state"` (15 bytes)     | renamed from `b"crazy-state"` — **all clients & on-chain state require redeploy** |
| EVM contracts  | `FairMeme`, `FairMemeSwapRouter`, …| renamed; ABI signatures changed (event topics & function selectors are unchanged because event/function names were preserved internally where they don't have a `Crazy` prefix) |
| Go modules     | `github.com/fair-meme/fairmeme/apps/{api,listener,airdrop}` | replaces `crazy` and `github.com/crazy-meme/crazymeme-airdrop-service` |
| Brand domain   | `fairmeme.io` (placeholder)         | update once production DNS is decided |

---

## Provenance

| New path                       | Original repo                                  | Last commit captured |
|--------------------------------|------------------------------------------------|----------------------|
| `apps/web`                     | `hellocoleo/fairmeme-web`                      | `8346794` |
| `apps/api`                     | `hellocoleo/fairmeme-go`                       | `a6f317f` |
| `apps/listener`                | `hellocoleo/fair-go`                           | `04ee068` |
| `apps/indexer`                 | `hellocoleo/events-store-service`              | `e37349e` |
| `apps/airdrop`                 | `hellocoleo/fairmeme-airdrop-service`          | `291ed84` |
| `contracts/evm`                | `fair-meme/fairmeme-evm`                       | `1e57c39` |
| `contracts/solana/core`        | `fair-meme/fairmeme-sol`                       | `640a1b7` |
| `contracts/solana/referral`    | `fair-meme/fairmeme-referral`                  | `c913524` |
| `contracts/legacy/evm-v0`      | `fair-meme/fair-meme`                          | `51c0d1c` |
| `assets/token-metadata`        | `fair-meme/fairmeme-token`                     | `5275fa2` |
| (dropped — empty)              | `hellocoleo/fairmeme-airdrop`                  | empty     |
| (dropped — empty)              | `hellocoleo/deploy-test`                       | empty     |
| (dropped — empty)              | `fair-meme/fairmeme-contracts`                 | empty     |

The full original clones (with their own git history) live under `.archive-original/`
and are excluded from this monorepo's git history.

---

## License

See per-package SPDX headers (mostly `UNLICENSED` in source). Dependency licenses live with
their respective vendor folders (`lib/`, `node_modules/`, `target/`).
