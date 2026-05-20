# `fairmeme-listener` — Chain listener & price aggregator (Go)

Originally `fair-go`. Provides multiple background processes:

| Entry point                | Role                                         |
|----------------------------|----------------------------------------------|
| `cmd/listen_event`         | Subscribe EVM logs (FairMeme*)               |
| `cmd/solprice`             | Pull SOL/USD reference price into Redis      |
| `cmd/price`                | Aggregate per-token snapshots into ClickHouse|
| `cmd/kline`                | K-line candle generator                      |
| `cmd/server` (legacy)      | Older HTTP API; **superseded by `apps/api`** |
| `cmd/clickServer` (legacy) | ClickHouse-fronted REST helper               |

## Prerequisites

* Go 1.21.x
* MongoDB 5+
* MySQL 8+
* Redis 6+
* Optional: ClickHouse 23+

## Configure

```bash
cp config.example.yaml config.yaml
# fill in MongoDB / MySQL / Redis / S3 / RPC values
```

## Run

```bash
go build ./cmd/listen_event && ./listen_event
go build ./cmd/solprice     && ./solprice
go build ./cmd/price        && ./price
go build ./cmd/kline        && ./kline
```

Or use the bundled shell scripts:

```bash
cd cmd/server && ./start.sh        # legacy HTTP API
cd cmd/solprice && ./solprice.sh   # SOL price loop
cd cmd/price    && ./price.sh
```

## Status

This package is intentionally kept intact during consolidation but the legacy
HTTP entry points (`cmd/server`, `cmd/clickServer`) overlap with `apps/api`
and are slated for **deprecation** — see `AUDIT.md` Q-8.
