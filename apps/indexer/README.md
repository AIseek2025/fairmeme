# `@fairmeme/indexer` — Solana event indexer (TypeScript)

Subscribes to the `fairmeme_sol` and `fairmeme_referral` Anchor program logs
and stores normalized entities in PostgreSQL via TypeORM. Pushes change
notifications via Redis pub/sub.

## Prerequisites

* Node.js 20.x
* pnpm 9.x
* PostgreSQL 14
* Redis 6+

## Configure

```bash
cp .env.example .env
# fill DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME, REDIS_*, SOLANA_RPC_URL
```

## Develop

```bash
pnpm install
pnpm run dev         # ts-node src/index.ts
pnpm run watch       # tsc -w
pnpm run build       # emit dist/
pnpm start           # node dist/index.js
```

## Production

Use PM2:

```bash
pm2 start pnpm --name "fairmeme-indexer" -- start
pm2 save
pm2 startup
```

PM2 reference commands:

```bash
pm2 list
pm2 logs fairmeme-indexer
pm2 restart fairmeme-indexer
pm2 stop fairmeme-indexer
pm2 monit
```

## Notes

* IDL JSON in `src/idl/fairmeme_sol.ts` and `src/idl/fairmeme_referral.ts` are
  manually synchronized with the Rust source. After every Anchor program
  rebuild (`anchor build`), copy the freshly generated IDL into these files.
* Runtime checkpoint state (e.g. last processed slot) **must not** be
  committed; it lives in Redis or, optionally, a gitignored
  `last_processed.json`.
