# `contracts/evm` — Current generation EVM contracts (Foundry)

Solidity 0.8.26, viaIR, optimizer 1,000,000 runs, EVM Cancun.

## Components

| Type     | Symbol                                                  |
|----------|---------------------------------------------------------|
| Bonding  | `FairMeme`                                              |
| Token    | `MEME20`                                                |
| AMM      | `FairMemePairFactory`, `FairMemeSwapPair`               |
| Router   | `FairMemeSwapRouter`                                    |
| Library  | `FairMemeSwapLibrary`, `Math`, `SafeMath`, `UQ112x112`, `TransferHelper` |
| Iface    | `IFairMeme`, `IFairMemeSwapRouter`, `IFairMemePairFactory`, `IFairMemeSwapPair`, `IFairMemeSwapCallee`, `IERC20`, `IWETH` |

## Prerequisites

* [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Build / test

```bash
forge install        # fetch lib/openzeppelin-contracts, lib/solmate, lib/forge-std
forge build
forge test
forge fmt
forge snapshot       # gas snapshots
```

## Deploy

```bash
# example: FairMeme launcher (uses already-deployed router/factory/feeTo)
forge script script/DeployFairMeme.s.sol:DeployFairMeme \
    --broadcast \
    --rpc-url   $RPC_URL \
    --private-key $PRIV
```

> The pre-set addresses inside `script/DeployFairMeme.s.sol` are historical.
> Verify them against your target chain before broadcasting.

## Anvil

```bash
anvil
```

## Notes

* Renamed from `CrazyMeme*`/`ICrazy*`/`CrazySwap*` during the brand migration.
  See `../../AUDIT.md` §3 for the symbol map.
