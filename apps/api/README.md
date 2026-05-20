# `fairmeme-api` — Backend HTTP API (Go + sponge)

Main backend for FairMeme. Built on the [sponge](https://github.com/zhufuyi/sponge)
framework and serves REST + WebSocket endpoints under `/api/v1`.

## Prerequisites

* Go 1.22.x
* PostgreSQL 14 (or MySQL 8) — see `configs/fairmeme.yml`
* Redis 6+
* Optional: ClickHouse for OLAP, MongoDB for raw chain dumps
* Optional: Nacos for centralized config

## Configure

```bash
cp configs/fairmeme.example.yml    configs/fairmeme.yml
cp configs/fairmeme_cc.example.yml configs/fairmeme_cc.yml
```

Edit values (DSNs, S3 keys, Solana RPC, etc.). **Never commit** the filled
`fairmeme.yml`/`fairmeme_cc.yml` — they are gitignored.

## Run

```bash
make run                       # local dev
make run-nohup                 # background
make run-nohup CMD=stop        # stop background server
make run-docker                # build + run in Docker

# direct binary build
make build                     # outputs cmd/api/fairmeme-api
./cmd/api/fairmeme-api -c ./configs/fairmeme.yml
```

## Test / lint

```bash
make ci-lint                   # gofmt + golangci-lint
make test                      # go test ./...
make cover                     # produce HTML coverage report
```

## Deployment

* `deployments/docker-compose/` — `docker compose up -d`
* `deployments/kubernetes/` — `kubectl apply -f deployments/kubernetes/`
* `deployments/binary/` — bare-metal install scripts

K8s manifests are pre-named:

```
fairmeme-api-namespace.yml
fairmeme-api-configmap.yml
fairmeme-api-svc.yml
fairmeme-api-deployment.yml
```

## Generated artifacts (gitignored)

* `cmd/api/fairmeme-api*` — built binaries
* `internal/{ecode,routers,handler,service}/*.go.gen*` — sponge codegen output
* `cover.out`, `fairmeme-api.gv`
