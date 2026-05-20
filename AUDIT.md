# FairMeme — Code Audit & Migration Report

Date: 2026-05-20
Scope: 13 source repositories merged into this monorepo. See [`README.md`](./README.md#provenance)
for the provenance map.

This document records (1) what was changed during the consolidation, (2) the issues found
during the audit, (3) the remediation that was applied or is recommended, and (4)
the **mandatory secret rotation** that the maintainer must perform after reading.

---

## 0. URGENT: rotate every credential listed in §1

The following secrets were committed in plaintext to private GitHub repositories
and are therefore considered **leaked**. Removing them from this monorepo does
**not** remove them from the original repositories' git history (still on
GitHub). They must be rotated at the source provider before the new monorepo
is published.

### 1. Leaked credentials inventory

| File (in `.archive-original/`) | Type | Value (redacted) | Action |
|---|---|---|---|
| `fair-go/config.yaml` | AWS access key + secret | `AKIA…WUL6` / `tt9G…YlF` (bucket `crazymeme-bucket`) | **Rotate in IAM**; create a new key for the new bucket |
| `fairmeme-go/configs/crazy.yml` | same AWS access key/secret | duplicated | **Same** |
| `fair-go/config.yaml` | Redis pwd | `zqhqkl2022qp` | Rotate |
| `fair-go/config.yaml` | MongoDB pwd | `123456` | Rotate |
| `fairmeme-go/configs/crazy.yml` | Postgres pwd | `ZbG5…fDcXT` | Rotate |
| `fairmeme-go/configs/crazy.yml` | Redis pwd | `123456` | Rotate |
| `fairmeme-go/configs/crazy.yml` | Ankr Solana RPC API key | `00aaa…185c` | Rotate |
| `fairmeme-airdrop-service/.env` | Moralis JWT (exp 2124) | `eyJ…UO8q8` | **Revoke at moralis.io** |
| `fairmeme-airdrop-service/.env` | CoinGecko API key | `CG-Uhed…RMqUy` | Rotate at coingecko.com |
| `fairmeme-airdrop-service/config.toml` | Helius RPC API key | `e8f5…78ac` | Rotate at helius.dev |
| `fairmeme-airdrop-service/config.toml` | Postgres pwd | `dynY…RawCSwp` | Rotate |
| `fairmeme-airdrop-service/config.toml` | Redis pwd | `123456` | Rotate |
| `events-store-service/.env` | Postgres pwd (same DB as above) | (same) | Rotate (covered above) |
| `fairmeme-web/.env` | Twitter OAuth secret | `sZP_…AK82ijd4y` | Regenerate Twitter app secret |
| `fairmeme-web/.env` | next-auth `AUTH_SECRET` | `a2e8…b575f` | Regenerate (`openssl rand -hex 32`) |
| `fairmeme-web/.env` | Pinata dev JWT (`grayjiang0228@gmail.com`) | `eyJ…fCXY` | Revoke at pinata.cloud |
| `fairmeme-web/.env` | **Pinata prod JWT** (`david@crazy.meme`) | `eyJ…cR4E` | **Revoke** |
| `apps/indexer/src/redis.ts` (was) | Redis password literal | `123456` | Removed in this monorepo (now from env) |
| `apps/airdrop/internal/business/member.go` (was) | TweetScout API key | `4652…b28` | Removed in this monorepo (now `TWEETSCOUT_API_KEY`); rotate provider key |
| `apps/indexer/src/index.ts` (was) | Ankr Solana RPC API key | `00aaa…185c` | Removed in this monorepo (now `SOLANA_RPC_URL`); rotate Ankr key |
| `apps/listener/bootstrap/eth.go` (was) | Ankr Solana RPC API key | `00aaa…185c` | Removed in this monorepo (now config/env); rotate Ankr key |

The current monorepo no longer contains any of these values; instead it ships
`*.example` templates with `REPLACE_ME` placeholders and gitignores the
real-config filenames.

### 2. Recommended hardening (post-rotation)

* Pin secrets in a vault (1Password / AWS SSM / Doppler) instead of `.env`/yaml.
* Run `git filter-repo` or `bfg` against the original GitHub repos to scrub
  history, then force-push (alternatively: archive & delete the repos).
* Enable [GitHub secret scanning push protection](https://docs.github.com/en/code-security/secret-scanning).

---

## 3. Brand migration (CrazyMeme → FairMeme)

### 3.1 What was renamed

| Layer | Symbol before | Symbol after |
|---|---|---|
| Go module | `crazy` | `github.com/fair-meme/fairmeme/apps/api` |
| Go module | `crazy` | `github.com/fair-meme/fairmeme/apps/listener` |
| Go module | `github.com/crazy-meme/crazymeme-airdrop-service` | `github.com/fair-meme/fairmeme/apps/airdrop` |
| Go cmd dir | `apps/api/cmd/crazy/` | `apps/api/cmd/api/` |
| Go binary | `crazy` | `fairmeme-api` |
| Sponge config | `configs/crazy.yml`, `crazy_cc.yml` | `configs/fairmeme.yml`, `fairmeme_cc.yml` |
| K8s manifests | `crazy-{configmap,deployment,namespace,svc}.yml` | `fairmeme-api-*.yml` |
| ABI bindings | `CrazyMemeFactory.{go,json}`, `CrazyMemeMarket.go` | `FairMemeFactory.*`, `FairMemeMarket.*` |
| Solidity contract | `CrazyMeme`, `CrazyPairFactory`, `CrazySwapPair`, `CrazySwapRouter`, `CrazySwapLibrary` | `FairMeme`, `FairMemePairFactory`, `FairMemeSwapPair`, `FairMemeSwapRouter`, `FairMemeSwapLibrary` |
| Solidity interfaces | `ICrazy*` | `IFairMeme*` |
| Solidity script | `DeployCrazyMeme.s.sol` | `DeployFairMeme.s.sol` |
| Solidity legacy | `CrazyMemeFactory`, `CrazyMemeMarket` | `FairMemeFactory`, `FairMemeMarket` |
| Anchor crate | `crazymeme-sol`, `crazymeme_sol` | `fairmeme-sol`, `fairmeme_sol` |
| Anchor crate | `crazymeme-referral`, `crazymeme_referral` | `fairmeme-referral`, `fairmeme_referral` |
| Rust struct | `CrazyState` | `FairMemeState` |
| Rust field | `crazy_token`, `crazy_token_account` | `fair_meme_token`, `fair_meme_token_account` |
| Anchor PDA seed | `b"crazy-state"` (11 bytes) | `b"fair-meme-state"` (15 bytes) |
| IDL field | `crazyState`, `crazyToken*` | `fairMemeState`, `fairMemeToken*` |
| Web URLs | `https://crazy.meme`, `wss://crazy.meme/...` | `https://fairmeme.io`, `wss://fairmeme.io/...` |
| Web socials | `t.me/crazydotmeme`, `x.com/crazydotmeme` | `t.me/fairmemeofficial`, `x.com/fairmemeofficial` |
| Web meta title | `CrazyMeMe \| The fairest meme launch platform` | `FairMeme \| The fairest meme launch platform` |
| Web ABI files | `crazy*Abi.ts`, `crazymemeSolana.json` | `fair*Abi.ts`, `fairmemeSolana.json` |
| Web component dir | `src/components/CrazyLayout/` | `src/components/MainLayout/` |
| Web component | `CrazyAllocation.tsx` | `Allocation.tsx` |
| Asset | `public/images/common/CrazyMeMe.png` | `FairMeme.png` |
| Token symbol in copy | `$CRAZY` | `$FAIR` |
| Bucket name | `crazymeme-bucket` | `fairmeme-bucket` |

### 3.2 What was **NOT** renamed

* **Solana program IDs** stay the same — they are public keys of already-published
  binaries. Re-deployment is required only if the maintainer wants to publish
  under a new key.
* Already-deployed EVM contract addresses inside deployment scripts
  (`DeployFairMeme.s.sol`, `DeployRouter.s.sol`, etc.) — they are historical
  references, not live wiring. Update them when redeploying.
* Token names inside off-chain copy that still describe the bonding-curve
  mechanic ("Meme Token", "MEME20") — these are not Crazy-specific.
* Historical `crazyairdrop-…elb.amazonaws.com`
  rewrite has been replaced with `NEXT_PUBLIC_API_V2_BASE_URL`.

### 3.3 Breaking on-chain changes

> Renaming the Anchor PDA seed from `crazy-state` (11 bytes) to `fair-meme-state`
> (15 bytes) **changes every PDA address** derived by the program. **Existing
> on-chain state cannot be migrated**; the renamed program must be re-deployed
> and clients re-bound. If the chain state must be preserved, revert the seed
> rename in `contracts/solana/core/programs/fairmeme-sol/src/state/fairmeme_state.rs`
> and in client code (`apps/web`, `apps/indexer`, tests).

> Renaming Solidity contract names changes the **artifact name** but does not
> change the deployed bytecode address. ABI consumers that key off the
> contract name (Etherscan verification, subgraph schema, OpenZeppelin
> Defender) must be re-pointed.

---

## 4. Code-quality findings

| ID | Severity | Area | Finding | Status |
|---|---|---|---|---|
| Q-1 | high | apps/airdrop | folder typo `internal/businsess/` | **fixed** → `internal/business/` |
| Q-2 | high | apps/indexer | `last_processed_slot.json` (runtime state) was committed | **fixed** — file removed, `.gitignore` updated |
| Q-3 | high | apps/indexer | hardcoded Redis password `'123456'` | **fixed** — now from `process.env.REDIS_PASS` |
| Q-4 | high | apps/indexer | typo `process.env.DB_Port` (would silently use undefined) | **fixed** |
| Q-5 | medium | all repos | `.DS_Store` files committed | **fixed** — stripped & gitignored |
| Q-6 | medium | apps/web | README claimed *"vite + react"*, actually Next.js | **fixed** in top-level README |
| Q-7 | medium | apps/api | empty README (`## crazy`) | **superseded** by top-level + service-level docs |
| Q-8 | medium | apps/listener (was `fair-go`) | duplicate HTTP API in `cmd/server` overlapping with `apps/api` | flagged for **deprecation**; track in CHANGELOG |
| Q-9 | medium | apps/web | next-auth `AUTH_SECRET` shipped in `.env.production` | **fixed** — `.env*` files removed, `.env.example` ships placeholder |
| Q-10 | low | apps/web | dependency `i: ^0.3.7` (likely typo for `iconify`) | **kept** — manual review; upstream package is unmaintained |
| Q-11 | low | apps/web | uses Next.js 14.2.5 — Next.js 15 is current and brings React 19 | recommended upgrade; not done because requires test sweep |
| Q-12 | low | apps/web | ESLint 8 (deprecated, ESLint 9 flat config recommended) | recommended upgrade |
| Q-13 | low | apps/api | `Makefile` `make graph` command had module path stripped during early sed pass | **fixed** in this commit |
| Q-14 | low | apps/listener | tightly coupled monolith with multiple `cmd/*` sharing `models/`, `services/`, `bootstrap/`; renaming individual entry points is straightforward but extracting them into independent services is significant refactor | recommended for next milestone |
| Q-15 | low | contracts/evm | uses `solc 0.8.26` + `viaIR` + `optimizer_runs = 1_000_000` — fine but very long compile times; consider lowering for CI | informational |
| Q-16 | low | contracts/legacy/evm-v0 | depends on Sablier v2 + PRBMath; verify versions still work with current Foundry | informational |
| Q-17 | low | contracts/solana/* | Anchor 0.29 — current is 0.30; upgrade window will require re-derivation | informational |
| Q-18 | high | apps/airdrop | TweetScout API key remained hardcoded in `internal/business/member.go` | **fixed** — now `TWEETSCOUT_API_KEY` |
| Q-19 | high | apps/indexer | Ankr Solana RPC key remained hardcoded in `src/index.ts` | **fixed** — now `SOLANA_RPC_URL` |
| Q-20 | high | apps/listener | Ankr Solana RPC key remained hardcoded in `bootstrap/eth.go` and `cmd/test` | **fixed** — config/env driven |
| Q-21 | high | apps/web | NextAuth route printed env secrets, OAuth profile, JWT and session in server logs | **fixed** — sensitive logs removed |
| Q-22 | medium | apps/api deployments | K8s/Docker manifests still used `crazy` namespace/labels/images and default DB/Redis passwords | **fixed** |
| Q-23 | medium | apps/airdrop tests | CoinGecko test hit the real API with a live API key and flaky schema assumptions | **fixed** — local `httptest` fixture |
| Q-24 | medium | apps/web | `next.config.mjs` duplicated `hostname`, dropping `img.fairmeme.io`; rewrites hardcoded old ELB hosts | **fixed** |
| Q-25 | high | apps/web | `DEFAULT_DECIMALS` was `60`, while Solana program uses 6 decimals | **fixed** |
| Q-26 | medium | contracts/evm | Remaining `crazySwapCall` callback and LP symbol `CRAZY-ETH` conflicted with rename-all decision | **fixed** |
| Q-27 | high | apps/web | `/api/key` allowed unauthenticated creation of temporary Pinata upload keys | **fixed** — endpoint is POST-only and requires a NextAuth session |
| Q-28 | high | apps/web | `useIpfsUpload` imported a server Pinata SDK helper into client code | **fixed** — split into server-only `pinata.ts` and client `pinataClient.ts` |
| Q-29 | medium | apps/web | NextAuth session callback set `session.user.id` then overwrote `session.user`, dropping the ID | **fixed** |
| Q-30 | medium | apps/indexer | verbose event/DB/Redis logs could expose operational data in production | **fixed** — `INDEXER_DEBUG` gates noisy logs |
| Q-31 | low | apps/indexer | dependency on `fs` npm shim and missing `@types/node` | **fixed** — removed shim, added `@types/node` |
| Q-32 | low | contracts/solana/core | `package-lock.json` still named `crazymeme-sol` | **fixed** |

---

## 5. Files dropped from the consolidation

Reason: empty repositories (no tracked files).

* `hellocoleo/fairmeme-airdrop`
* `hellocoleo/deploy-test`
* `fair-meme/fairmeme-contracts`

These remain in `.archive-original/` for reference and can be re-introduced if
their contents become relevant.

---

## 6. Recommended next steps

1. **Rotate every credential listed in §1.**
2. Sanitize the original 13 repositories (`git filter-repo` + force push) or
   archive/delete them.
3. Re-deploy:
   * Anchor programs (because the PDA seed changed).
   * EVM contracts if you also want artifact verification under the new names.
4. Re-generate the Solana IDL JSON (`anchor build`) and replace the manual
   IDL files under `apps/web/src/abi/` and `apps/indexer/src/idl/` so that
   field names match exactly.
5. Wire up CI:
   * `forge test` for `contracts/evm` and `contracts/legacy/evm-v0`.
   * `anchor test` for both Solana programs.
   * `go build ./... && go test ./...` for each Go module.
   * `pnpm build` for `apps/web` and `apps/indexer`.
6. Update `apps/web/next.config.mjs` ELB rewrite to the new airdrop service
   hostname.
7. Decide on the canonical brand domain (`fairmeme.io` placeholder used here)
   and replace it across docs.
