# `@fairmeme/web` — Frontend (Next.js 14)

The FairMeme web app. Next.js 14 (App Router) + Tailwind + Ant Design.
Connects to both Solana (`@solana/wallet-adapter-*` + Anchor) and EVM
(`wagmi` + `RainbowKit` + `viem`).

## Prerequisites

* Node.js 20.x
* pnpm 9.x

## Configure

```bash
cp .env.example .env          # local dev
# (optional)
cp .env.example .env.test
cp .env.example .env.production
```

Fill in:

* `TWITTER_ID` / `TWITTER_SECRET` — Twitter OAuth (next-auth)
* `AUTH_SECRET` — `openssl rand -hex 32`
* `PINATA_JWT`, `PINATA_JWT_FOR_PROD` — IPFS uploads
* Optional `NEXT_PUBLIC_*` runtime URLs

## Develop

```bash
pnpm install
pnpm dev                # NEXT_PUBLIC_ENV=test, http://localhost:3000
pnpm devTest            # exposes 0.0.0.0 (Docker / LAN)
pnpm devTurbo           # Turbo dev server
```

## Build

```bash
pnpm build:test         # NEXT_PUBLIC_ENV=test, runs prettier + eslint-fix + next build
pnpm build:prod         # NEXT_PUBLIC_ENV=prod
pnpm start              # serve next build (production)
pnpm start:test         # serve next build with NODE_ENV=test
```

## Lint / format

```bash
pnpm lint               # next lint
pnpm eslint-fix         # eslint --fix
pnpm prettier           # prettier --write
```

## Notes

* `next.config.mjs` rewrites `/airdrop-api/*` to an internal AWS ELB. Update
  the hostname before going to production (see `AUDIT.md` §3.2).
* `src/abi/fairmemeSolana.json` and the `fairMemeSolanaProgram*.ts` are the
  Anchor IDL exports. After re-deploying the Solana program, regenerate them
  via `anchor build` and copy the IDL into this folder.
