// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { FairMemeSol } from "../target/types/fairmeme_sol";
// import {
//   ComputeBudgetProgram,
//   PublicKey,
//   SYSVAR_RENT_PUBKEY,
// } from "@solana/web3.js";
// import { assert } from "chai";
// import {
//   ASSOCIATED_TOKEN_PROGRAM_ID,
//   getAssociatedTokenAddress,
//   getMint,
// } from "@solana/spl-token";
// import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
// import { Metaplex } from "@metaplex-foundation/js";
// import { BN } from "bn.js";
// import {
//   FAIR_MEME_STATE_SEED,
//   DEFAULT_DECIMALS,
//   DEFAULT_TOKEN_SUPPLY,
//   GLOBAL_SEED,
//   sendTransaction,
// } from "./utils";

// import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

// describe("fairmeme-sol", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);

//   const program = anchor.workspace.FairMemeSol as Program<FairMemeSol>;

//   const confirmOptions = {
//     skipPreflight: true,
//   };

//   const authority = anchor.web3.Keypair.fromSecretKey(
//     Uint8Array.from([
//       21, 21, 67, 255, 79, 126, 27, 118, 154, 46, 185, 76, 113, 140, 171, 18,
//       232, 222, 215, 46, 186, 206, 165, 137, 136, 141, 91, 252, 97, 125, 90, 32,
//       168, 242, 53, 253, 141, 165, 12, 126, 138, 128, 97, 89, 199, 122, 181, 93,
//       149, 65, 251, 180, 82, 250, 71, 149, 202, 59, 38, 238, 149, 184, 241, 17,
//     ])
//   );
//   console.log("authority: ", authority.publicKey.toString());
//   const creator = authority;
//   const feeRecipient = authority;
//   const mint = anchor.web3.Keypair.generate();
//   const user = anchor.web3.Keypair.generate();

//   const discountToken = new PublicKey(
//     "2CibNdtGN93RxjQ85xHKpFMSNLLMEQmfpMdgPZ4G7rbT"
//   );

//   const [globalPDA] = PublicKey.findProgramAddressSync(
//     [Buffer.from(GLOBAL_SEED)],
//     program.programId
//   );
//   console.log("global PDA: ", globalPDA.toString());

//   const [fairMemeStatePDA] = PublicKey.findProgramAddressSync(
//     [Buffer.from(FAIR_MEME_STATE_SEED), mint.publicKey.toBuffer()],
//     program.programId
//   );
//   console.log("fairMemeState PDA: ", fairMemeStatePDA.toString());

//   // it("Initialized!", async () => {
//   //   await program.methods
//   //     .initialize({
//   //       feeRecipient: feeRecipient.publicKey,
//   //       fairMemeToken: discountToken,
//   //     })
//   //     .accounts({
//   //       authority: authority.publicKey,
//   //       global: globalPDA,
//   //       systemProgram: anchor.web3.SystemProgram.programId,
//   //     })
//   //     .signers([authority])
//   //     .rpc(confirmOptions);

//   //   let global = await program.account.global.fetch(globalPDA);

//   //   assert.equal(global.authority.toBase58(), authority.publicKey.toBase58());
//   //   assert.equal(global.initialized, true);
//   // });

//   it("Set discount token!", async () => {
//     let globalParams = {
//       fairMemeToken: discountToken,
//     };

//     await program.methods
//       .setGlobal(globalParams)
//       .accounts({
//         user: authority.publicKey,
//         global: globalPDA,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([authority])
//       .rpc(confirmOptions);
//   });

//   // it("Mint a token!", async () => {
//   //   const fairMemeTokenAccount = await getAssociatedTokenAddress(
//   //     mint.publicKey,
//   //     fairMemeStatePDA,
//   //     true
//   //   );

//   //   const creatorTokenAccount = await getAssociatedTokenAddress(
//   //     mint.publicKey,
//   //     creator.publicKey
//   //   );

//   //   let name = "test";
//   //   let symbol = "tst";
//   //   let uri = "https://www.test.com";
//   //   let auctionPeriod = new BN(10 * 3600); // ~4h

//   //   // Derive the PDA of the metadata account for the mint.
//   //   const [metadataAddress] = PublicKey.findProgramAddressSync(
//   //     [
//   //       Buffer.from("metadata"),
//   //       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//   //       mint.publicKey.toBuffer(),
//   //     ],
//   //     TOKEN_METADATA_PROGRAM_ID
//   //   );

//   //   const [mintAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
//   //     [Buffer.from("mint-authority")],
//   //     program.programId
//   //   );

//   //   const tx = await program.methods
//   //     .create(name, symbol, uri, auctionPeriod)
//   //     .accounts({
//   //       mint: mint.publicKey,
//   //       creator: creator.publicKey,
//   //       mintAuthority: mintAuthority,
//   //       fairMemeState: fairMemeStatePDA,
//   //       global: globalPDA,
//   //       fairMemeTokenAccount: fairMemeTokenAccount,
//   //       creatorTokenAccount: creatorTokenAccount,
//   //       metadata: metadataAddress,
//   //       systemProgram: anchor.web3.SystemProgram.programId,
//   //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//   //       tokenProgram: TOKEN_PROGRAM_ID,
//   //       tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//   //       rent: SYSVAR_RENT_PUBKEY,
//   //     })
//   //     .signers([mint, creator])
//   //     .preInstructions([
//   //       ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }),
//   //     ])
//   //     .rpc(confirmOptions);

//   //   const creatorTokenReceived =
//   //     500_000n * BigInt(10 ** Number(DEFAULT_DECIMALS));

//   //   const creatorTokenAmount = await provider.connection.getTokenAccountBalance(
//   //     creatorTokenAccount
//   //   );
//   //   assert.equal(
//   //     creatorTokenAmount.value.amount,
//   //     creatorTokenReceived.toString()
//   //   );

//   //   const fairMemeTokenAmount = await provider.connection.getTokenAccountBalance(
//   //     fairMemeTokenAccount
//   //   );
//   //   assert.equal(
//   //     fairMemeTokenAmount.value.amount,
//   //     (DEFAULT_TOKEN_SUPPLY - creatorTokenReceived).toString()
//   //   );

//   //   const createdMint = await getMint(provider.connection, mint.publicKey);
//   //   assert.equal(createdMint.isInitialized, true);
//   //   assert.equal(createdMint.decimals, Number(DEFAULT_DECIMALS));
//   //   assert.equal(createdMint.supply, DEFAULT_TOKEN_SUPPLY);
//   //   assert.equal(createdMint.mintAuthority, null);

//   //   const metaplex = Metaplex.make(provider.connection);
//   //   const token = await metaplex
//   //     .nfts()
//   //     .findByMint({ mintAddress: mint.publicKey });
//   //   assert.equal(token.name, name);
//   //   assert.equal(token.symbol, symbol);
//   //   assert.equal(token.uri, uri);
//   // });
// });
