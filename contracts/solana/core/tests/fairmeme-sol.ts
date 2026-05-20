import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FairMemeSol } from "../target/types/fairmeme_sol";
import {
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { assert } from "chai";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { Metaplex } from "@metaplex-foundation/js";
import { BN } from "bn.js";
import {
  airdropSol,
  FAIR_MEME_STATE_SEED,
  DEFAULT_DECIMALS,
  DEFAULT_TOKEN_SUPPLY,
  DEFAULT_PLATFORM_TRADE_FEE,
  GLOBAL_SEED,
  sendTransaction,
} from "./utils";

import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

describe("fairmeme-sol", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FairMemeSol as Program<FairMemeSol>;

  const confirmOptions = {
    skipPreflight: true,
  };

  const authority = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      21, 21, 67, 255, 79, 126, 27, 118, 154, 46, 185, 76, 113, 140, 171, 18,
      232, 222, 215, 46, 186, 206, 165, 137, 136, 141, 91, 252, 97, 125, 90, 32,
      168, 242, 53, 253, 141, 165, 12, 126, 138, 128, 97, 89, 199, 122, 181, 93,
      149, 65, 251, 180, 82, 250, 71, 149, 202, 59, 38, 238, 149, 184, 241, 17,
    ])
  );
  console.log("authority: ", authority.publicKey.toString());
  const creator = authority;
  const feeRecipient = authority;
  const mint = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();

  const airdropMint = anchor.web3.Keypair.generate();

  const [globalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_SEED)],
    program.programId
  );
  console.log("global PDA: ", globalPDA.toString());

  const [fairMemeStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(FAIR_MEME_STATE_SEED), mint.publicKey.toBuffer()],
    program.programId
  );
  console.log("fairMemeState PDA: ", fairMemeStatePDA.toString());

  const simpleBuy = async (
    user: anchor.web3.Keypair,
    solAmount: bigint,
    minTokenOutput: bigint,
    airdropToken: PublicKey,
  ) => {
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      user,
      mint.publicKey,
      user.publicKey
    );

    const fairMemeTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      fairMemeStatePDA,
      true
    );

    const userDiscountTokenAccount = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      user,
      airdropToken,
      user.publicKey
    );
    const globalParams = await program.account.global.fetch(globalPDA);
    const state = await program.account.fairMemeState.fetch(fairMemeStatePDA);

    let tx = await program.methods
      .buy(new BN(solAmount.toString()), new BN(minTokenOutput.toString()))
      .accounts({
        user: user.publicKey,
        mint: mint.publicKey,
        feeRecipient: globalParams.feeRecipient,
        creator: state.creator,
        userTokenAccount: userTokenAccount.address,
        fairMemeTokenAccount: fairMemeTokenAccount,
        userDiscountTokenAccount: userDiscountTokenAccount.address,
        fairMemeState: fairMemeStatePDA,
        global: globalPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    let txResults = await sendTransaction(program, tx, [user], user.publicKey);

    return {
      tx: txResults,
      userTokenAccount,
      fairMemeTokenAccount,
      fairMemeStatePDA,
    };
  };

  const simpleSell = async (
    user: anchor.web3.Keypair,
    tokenAmount: bigint,
    minSolAmount: bigint,
    airdropToken: PublicKey
  ) => {
    const fairMemeTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      fairMemeStatePDA,
      true
    );

    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      user,
      mint.publicKey,
      user.publicKey
    );

    const userDiscountTokenAccount = await getOrCreateAssociatedTokenAccount(
      anchor.getProvider().connection,
      user,
      airdropToken,
      user.publicKey
    );

    const globalParams = await program.account.global.fetch(globalPDA);
    const state = await program.account.fairMemeState.fetch(fairMemeStatePDA);

    let tx = await program.methods
      .sell(new BN(tokenAmount.toString()), new BN(minSolAmount.toString()))
      .accounts({
        user: user.publicKey,
        mint: mint.publicKey,
        feeRecipient: globalParams.feeRecipient,
        creator: state.creator,
        userTokenAccount: userTokenAccount.address,
        fairMemeTokenAccount: fairMemeTokenAccount,
        userDiscountTokenAccount: userDiscountTokenAccount.address,
        fairMemeState: fairMemeStatePDA,
        global: globalPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    let txResults = await sendTransaction(program, tx, [user], user.publicKey);

    return {
      tx: txResults,
      userTokenAccount,
      fairMemeTokenAccount,
      fairMemeStatePDA,
    };
  };

  const calcFee = (amount: bigint, fee: number): bigint => {
    return (amount * BigInt(fee)) / 10000n;
  };

  before(async () => {
    await airdropSol(
      provider.connection,
      authority.publicKey,
      100 * LAMPORTS_PER_SOL
    );
    await airdropSol(
      provider.connection,
      creator.publicKey,
      100 * LAMPORTS_PER_SOL
    );

    await airdropSol(
      provider.connection,
      user.publicKey,
      100 * LAMPORTS_PER_SOL
    );
    await createMint(provider.connection, creator, creator.publicKey, null, 9, airdropMint);
  });

  it("Initialized and set params!", async () => {
    await program.methods
      .initialize({
        feeRecipient: feeRecipient.publicKey,
        fairMemeToken: null,
      })
      .accounts({
        authority: authority.publicKey,
        global: globalPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc(confirmOptions);

    let global = await program.account.global.fetch(globalPDA);

    assert.equal(global.authority.toBase58(), authority.publicKey.toBase58());
    assert.equal(global.initialized, true);

    let globalParams = {
      fairMemeToken: airdropMint.publicKey,
    };

    await program.methods
      .setGlobal(globalParams)
      .accounts({
        user: authority.publicKey,
        global: globalPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc(confirmOptions);
  });

  it("Mint a token!", async () => {
    const fairMemeTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      fairMemeStatePDA,
      true
    );

    const creatorTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      creator.publicKey
    );

    let name = "test";
    let symbol = "tst";
    let uri = "https://www.test.com";
    let auctionPeriod = new BN(10 * 3600); // ~4h

    // Derive the PDA of the metadata account for the mint.
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [mintAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint-authority")],
      program.programId
    );

    const tx = await program.methods
      .create(name, symbol, uri, auctionPeriod)
      .accounts({
        mint: mint.publicKey,
        creator: creator.publicKey,
        mintAuthority: mintAuthority,
        fairMemeState: fairMemeStatePDA,
        global: globalPDA,
        fairMemeTokenAccount: fairMemeTokenAccount,
        creatorTokenAccount: creatorTokenAccount,
        metadata: metadataAddress,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mint, creator])
      .preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }),
      ])
      .rpc(confirmOptions);

    const creatorTokenReceived =
      500_000n * BigInt(10 ** Number(DEFAULT_DECIMALS));

    const creatorTokenAmount = await provider.connection.getTokenAccountBalance(
      creatorTokenAccount
    );
    assert.equal(
      creatorTokenAmount.value.amount,
      creatorTokenReceived.toString()
    );

    const fairMemeTokenAmount = await provider.connection.getTokenAccountBalance(
      fairMemeTokenAccount
    );
    assert.equal(
      fairMemeTokenAmount.value.amount,
      (DEFAULT_TOKEN_SUPPLY - creatorTokenReceived).toString()
    );

    const createdMint = await getMint(provider.connection, mint.publicKey);
    assert.equal(createdMint.isInitialized, true);
    assert.equal(createdMint.decimals, Number(DEFAULT_DECIMALS));
    assert.equal(createdMint.supply, DEFAULT_TOKEN_SUPPLY);
    assert.equal(createdMint.mintAuthority, null);

    const metaplex = Metaplex.make(provider.connection);
    const token = await metaplex
      .nfts()
      .findByMint({ mintAddress: mint.publicKey });
    assert.equal(token.name, name);
    assert.equal(token.symbol, symbol);
    assert.equal(token.uri, uri);
  });

  const logFairMemeState = async (
    program: anchor.Program<FairMemeSol>,
    fairMemeStatePDA: anchor.web3.PublicKey
  ) => {
    let fairMemeState = await program.account.fairMemeState.fetch(fairMemeStatePDA);

    console.log("========== fairMemeState ========== ");
    console.log("solReserves: ", fairMemeState.solReserves.toString());
    console.log("tokenReserves: ", fairMemeState.tokenReserves.toString());
    console.log("tokenLocked: ", fairMemeState.tokenLocked.toString());
    console.log("lastUpdateTime: ", fairMemeState.lastUpdateSlot.toString());
    console.log("startTime: ", fairMemeState.startTime.toString());
    console.log("startSlot: ", fairMemeState.startSlot.toString());
    console.log("auctionPeriod: ", fairMemeState.auctionPeriod.toString());
    console.log(
      "tokenReleasePerSlot: ",
      fairMemeState.tokenReleasePerSlot.toString()
    );
  };

  it("Can buy and sell token!", async () => {
    let buySolAmount = 0.1 * LAMPORTS_PER_SOL;

    logFairMemeState(program, fairMemeStatePDA);

    console.log("buySolAmount: ", buySolAmount.toString());

    let buyMaxSOLAmount = BigInt(5 * LAMPORTS_PER_SOL);
    let fee = calcFee(buyMaxSOLAmount, Number(DEFAULT_PLATFORM_TRADE_FEE));
    buyMaxSOLAmount = buyMaxSOLAmount + fee;
    await simpleBuy(user, BigInt(buySolAmount), buyMaxSOLAmount, airdropMint.publicKey);

    logFairMemeState(program, fairMemeStatePDA);

    // sell token
    let sellTokenAmount = 100_000n;
    console.log("sellTokenAmount: ", sellTokenAmount.toString());
    await simpleSell(user, sellTokenAmount, BigInt(0), airdropMint.publicKey);

    logFairMemeState(program, fairMemeStatePDA);

    let tokenAmount = 100_000n * BigInt(10 ** Number(DEFAULT_DECIMALS));
    let solAmount = 1 * LAMPORTS_PER_SOL;

    let buyPrice = await program.methods
      .getBuyPrice(new BN(solAmount))
      .accounts({
        mint: mint.publicKey,
        fairMemeState: fairMemeStatePDA,
      })
      .view();

    console.log("buy price: ", buyPrice.toString());

    let sellPrice = await program.methods
      .getSellPrice(new BN(tokenAmount.toString()))
      .accounts({
        mint: mint.publicKey,
        fairMemeState: fairMemeStatePDA,
      })
      .view();

    console.log("sell price: ", sellPrice.toString());
  });
});
