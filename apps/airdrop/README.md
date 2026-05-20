# `fairmeme-airdrop` — Cross-chain airdrop snapshot service (Go)

Computes airdrop allocations across EVM (eth / base / bsc) and Solana for the
FairMeme launch.

## Prerequisites

* Go 1.22.x
* PostgreSQL 14
* Redis 6+
* Account at Helius (Solana RPC), Moralis (EVM data), CoinGecko (price reference)

## Configure

```bash
cp config.example.toml config.toml
cp .env.example        .env
```

Fill in `MORALIS_API_KEY`, `CGK_API_KEY`, `HELIUS_API_KEY`, DB credentials,
Redis credentials, and any chain-specific `[[chains]]` overrides.

## Run

```bash
# Token metadata loader
go build ./cmd/token   && ./token

# Main airdrop snapshot server
go build ./cmd/server  && ./server -c ./config.toml
```

## Build container

```bash
docker build -t fairmeme/airdrop:dev .
```

## Layout

```
internal/
├── airdrop/        # snapshot orchestration
├── business/       # business rules (renamed from typo "businsess")
├── cond/
├── db/
├── queue/
├── services/
│   ├── balance/
│   ├── chains/
│   ├── coingecko/
│   ├── eth/
│   ├── solana/
│   └── tokenprice/
└── utils/
```
