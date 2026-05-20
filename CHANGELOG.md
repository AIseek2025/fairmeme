# Changelog

All notable changes to the FairMeme monorepo are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — 2026-05-20 — initial monorepo

### Added

- Top-level `README.md`, `ARCHITECTURE.md`, `AUDIT.md`, `CONTRIBUTING.md`,
  `CHANGELOG.md`.
- Root `.gitignore` and per-package `.gitignore` files.
- `*.example` configuration templates for every service that previously
  shipped real `.env`/`config.toml`/`config.yaml`.

### Changed (Brand migration: CrazyMeme → FairMeme)

- Folder layout consolidated from 13 repositories into a single monorepo.
  Provenance map: see `README.md`.
- Renamed Solidity contracts, interfaces and scripts (`Crazy*` → `FairMeme*`).
- Renamed Anchor crates (`crazymeme-sol`/`crazymeme-referral`) and the Rust
  symbol surface (`CrazyState` → `FairMemeState`, `crazy_token*` →
  `fair_meme_token*`). PDA seed migrated from `b"crazy-state"` (11 bytes) to
  `b"fair-meme-state"` (15 bytes) — **breaking; programs must be redeployed**.
- Renamed Go modules from `module crazy` /
  `github.com/crazy-meme/crazymeme-airdrop-service` to
  `github.com/fair-meme/fairmeme/apps/{api,listener,airdrop}` and rewrote
  every `import "crazy/..."` accordingly.
- Renamed sponge config files, K8s manifests, deployment scripts and binary
  names from `crazy*` to `fairmeme-api*`.
- Renamed web ABI files, layout component (`CrazyLayout` → `MainLayout`),
  airdrop component (`CrazyAllocation` → `Allocation`) and asset
  (`CrazyMeMe.png` → `FairMeme.png`).
- Replaced runtime URLs (`https://crazy.meme` → `https://fairmeme.io`,
  social handles `crazydotmeme` → `fairmemeofficial`).
- Replaced token-in-copy `$CRAZY` → `$FAIR`.

### Fixed

- `apps/airdrop/internal/businsess/` typo → `internal/business/`.
- `apps/indexer/src/config.ts`: typo `process.env.DB_Port` → `DB_PORT`,
  added `?? defaults` for all variables, added `SOLANA_RPC_URL`.
- `apps/indexer/src/redis.ts`: removed hardcoded `password: '123456'`,
  now uses environment variables with safe defaults.
- All committed `.DS_Store` and runtime state files removed.
- `apps/airdrop/internal/business/member.go`: removed hardcoded TweetScout API key and
  wired it through `TWEETSCOUT_API_KEY`.
- `apps/airdrop/internal/services/coingecko/coingecko_test.go`: replaced flaky live
  CoinGecko API test with deterministic `httptest` fixture.
- `apps/indexer/src/index.ts`: removed hardcoded Ankr Solana RPC key; program IDs and
  RPC URL now come from `.env`.
- `apps/listener/bootstrap/eth.go`: removed hardcoded Ankr Solana RPC key and moved
  chain RPC URLs into config/env.
- `apps/web/src/app/api/auth/[...nextauth]/route.js`: removed logs that printed
  OAuth profile, JWT, session, and secret-bearing environment variables.
- `apps/web/next.config.mjs`: replaced hardcoded API/airdrop ELB rewrites with
  `NEXT_PUBLIC_API_V1_BASE_URL` / `NEXT_PUBLIC_API_V2_BASE_URL`, and split the duplicated
  image `hostname` entry.
- `apps/web/src/constants/solana.ts`: corrected `DEFAULT_DECIMALS` from `60` to `6`
  to match the Solana program.
- `contracts/evm`: renamed flash-swap callback `crazySwapCall` to `fairMemeSwapCall`
  and LP token symbol `CRAZY-ETH` to `FAIR-ETH`.
- `contracts/solana/core`: renamed `CrazymemeError` and remaining test/IDL types to
  FairMeme names.
- `apps/web/src/app/api/key/route.ts`: changed the Pinata temporary upload key endpoint
  to POST-only and protected it with NextAuth session checks.
- `apps/web/src/hooks/useIpfsUpload.ts`: split client-side Pinata uploads from the
  server-only Pinata admin client to keep provider JWTs out of client bundles.
- `apps/web/src/app/api/auth/[...nextauth]/route.js`: fixed session callback ordering so
  `session.user.id` is preserved.
- `apps/indexer`: gated verbose event/Redis/database logs behind `INDEXER_DEBUG`, removed
  the `fs` npm shim, and added `@types/node`.
- `contracts/solana/core/package-lock.json`: updated package name to `fairmeme-sol`.

### Security

- Stripped 16 distinct hardcoded secrets across `.env`, `config.toml`,
  `config.yaml` files. **All must be rotated** at the source provider —
  details in `AUDIT.md` §1.
- Second-pass scan removed remaining hardcoded Ankr, TweetScout, ELB, and deployment
  default-password references from active code/config.
- Protected the upload-key minting route so unauthenticated users cannot create Pinata
  temporary keys.

### Removed

- Three empty source repositories (`fairmeme-airdrop`, `deploy-test`,
  `fairmeme-contracts`).
- Original `.git` directories from each merged repo (the consolidated
  history starts fresh; original clones live under `.archive-original/`).

### Known issues / deferred work

- See `AUDIT.md` §6 (recommended next steps) for the remaining queue.
- Install each package's toolchain and rerun full validation before production deployment.
