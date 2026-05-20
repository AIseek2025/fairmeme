# `contracts/solana/core` — `fairmeme-sol` (Anchor)

Bonding-curve memecoin launcher on Solana.

## Program ID

```
AyVwefFVyuwgtBQ2cTteN3ZKo4Z4rCgvBtr3tgvnaPpb       (devnet)
```

> Existing program ID is preserved. Renaming is purely at the source
> level (crate name, struct name, field names, PDA seed). On-chain seed
> changed from `b"crazy-state"` (11 bytes) → `b"fair-meme-state"` (15 bytes);
> **PDA addresses change** with the seed length, so the program must be
> re-deployed and clients re-bound when this change is shipped.

## Prerequisites

* Rust ≥ 1.75
* Solana CLI ≥ 1.16
* Anchor 0.29.0 (`avm install 0.29.0 && avm use 0.29.0`)
* Yarn / Node 20 (for tests)

## Configure

`Anchor.toml` already wires up:

* `[programs.devnet] fairmeme_sol = "AyVwef..."`.
* metaplex_metadata test genesis program.

## Build / test

```bash
anchor build
anchor test                  # spins up local validator + runs tests/fairmeme-sol.ts
yarn run ts-mocha tests/devnet.ts  # devnet smoke test
```

## Deploy

```bash
anchor deploy --provider.cluster devnet
# capture the printed program ID into Anchor.toml + lib.rs `declare_id!`
```

## Layout

```
programs/fairmeme-sol/
├── Cargo.toml
└── src/
    ├── lib.rs
    ├── amm/
    ├── errors.rs
    ├── instructions/
    │   ├── buy.rs
    │   ├── sell.rs
    │   ├── create.rs
    │   ├── initialize.rs
    │   ├── set_global.rs
    │   ├── get_buy_price.rs
    │   ├── get_sell_price.rs
    │   ├── events.rs
    │   ├── mod.rs
    │   └── utils.rs
    └── state/
        ├── constants.rs
        ├── fairmeme_state.rs   (pub struct FairMemeState, SEED_PREFIX = b"fair-meme-state")
        ├── global.rs
        └── mod.rs
```
