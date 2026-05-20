# Token metadata

Static JSON metadata for FairMeme tokens (Solana SPL standard, can be lifted
to NFT-style metadata if needed).

## Structure

```
metadata/
└── metadata.json     — primary token metadata referenced by mint authority
```

## Notes

* Hosted on IPFS via Pinata (see `apps/web/.env.example` → `PINATA_*`).
* Long-term, prefer pinning the JSON to multiple gateways
  (Pinata + IPFS + Arweave) for redundancy.
