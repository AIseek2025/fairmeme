# Contributing to FairMeme

Thanks for your interest! FairMeme is a polyglot monorepo (Go, TypeScript,
Solidity, Rust). Each package owns its own toolchain — please respect each
package's `README.md` for setup specifics.

## TL;DR rules

1. **Never commit secrets.** All real `.env`, `config.toml`, `config.yaml`
   are gitignored. Use the `*.example` template instead.
2. **Conventional commits.** Format your commit messages as
   `type(scope): summary`, e.g. `fix(api): handle nil token reserves`.
3. **One subsystem per PR.** Don't mix changes that touch
   `apps/web` and `contracts/solana/core` in a single PR unless they are
   intentional cross-cutting upgrades (e.g. an Anchor IDL bump).
4. **Tests** must pass:
   * `apps/api`, `apps/listener`, `apps/airdrop`: `go test ./...`
   * `apps/web`, `apps/indexer`: `pnpm typecheck && pnpm lint && pnpm test`
   * `contracts/evm`, `contracts/legacy/evm-v0`: `forge test`
   * `contracts/solana/core`, `contracts/solana/referral`: `anchor test`

## Workspace layout

| Path | Tech | Owner subsystem |
|---|---|---|
| `apps/web` | Node 20 + pnpm 9 + Next 14 | Frontend |
| `apps/api` | Go 1.22 + sponge | API platform |
| `apps/listener` | Go 1.21 | Indexers / pricing |
| `apps/airdrop` | Go 1.22 | Airdrop tooling |
| `apps/indexer` | Node 20 + pnpm + TypeORM | Solana ingestion |
| `contracts/evm` | Solidity 0.8.26 + Foundry | EVM |
| `contracts/legacy/evm-v0` | Solidity 0.8.19 + Foundry | Historical EVM |
| `contracts/solana/core` | Anchor 0.29 + Rust | Solana core |
| `contracts/solana/referral` | Anchor + Rust | Solana referral |
| `assets/token-metadata` | JSON | Token metadata |

## Local setup checklist

```bash
# 1. Copy every example into a real config (never commit these)
cp apps/web/.env.example                  apps/web/.env
cp apps/airdrop/.env.example              apps/airdrop/.env
cp apps/airdrop/config.example.toml       apps/airdrop/config.toml
cp apps/indexer/.env.example              apps/indexer/.env
cp apps/listener/config.example.yaml      apps/listener/config.yaml
cp apps/api/configs/fairmeme.example.yml  apps/api/configs/fairmeme.yml

# 2. Install per-package toolchains
( cd apps/web      && pnpm install )
( cd apps/indexer  && pnpm install )
( cd apps/api      && go mod download )
( cd apps/listener && go mod download )
( cd apps/airdrop  && go mod download )
( cd contracts/evm                && forge install && forge build )
( cd contracts/legacy/evm-v0      && forge install && forge build )
( cd contracts/solana/core        && yarn && anchor build )
( cd contracts/solana/referral    && yarn && anchor build )
```

## Branching strategy

* `main` — protected, releasable.
* `feat/*` — feature branches, opened against `main`.
* `fix/*`, `chore/*`, `docs/*` — same convention.

## Code style

* Go: `gofmt -s` and `golangci-lint run`. CI matches the legacy
  `apps/api/Makefile :: make ci-lint`.
* TypeScript: ESLint flat config + Prettier (web also enforces
  `prettier-plugin-tailwindcss`).
* Solidity: `forge fmt`.
* Rust: `cargo fmt && cargo clippy --all-targets`.

## Issue reporting

Please file issues against the appropriate subsystem and include:

* Reproduction steps
* Service version / commit hash
* Logs (with secrets redacted!)
* For chain-related issues: tx hash + cluster (mainnet / devnet)
