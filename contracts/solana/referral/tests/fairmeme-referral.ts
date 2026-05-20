import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FairMemeReferral } from "../target/types/fairmeme_referral";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("fairmeme-referral", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .FairMemeReferral as Program<FairMemeReferral>;
  const confirmOptions = {
    skipPreflight: true,
  };
  const REFERRAL_SEED = "referral";
  const user = anchor.web3.Keypair.generate();

  const [referralPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(REFERRAL_SEED), user.publicKey.toBuffer()],
    program.programId
  );

  before(async () => {
    await airdropSol(
      program.provider.connection,
      user.publicKey,
      10 * LAMPORTS_PER_SOL
    );
  });

  it("Create a referral!", async () => {
    // Add your test here.
    console.log("user address: ", user.publicKey.toString());
    const testCode = "1";
    await program.methods
      .store(testCode)
      .accounts({
        user: user.publicKey,
        referral: referralPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc(confirmOptions);

    let referralState = await program.account.referral.fetch(referralPDA);
    console.log("referral user: ", referralState.user.toString());
    console.log("referral invited code: ", referralState.invitedCode);
    assert.equal(referralState.user.toString(), user.publicKey.toString());
    assert.equal(referralState.invitedCode, testCode);
  });
});

export const airdropSol = async (
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey,
  amount: number
) => {
  let signature = await connection.requestAirdrop(publicKey, amount);
  return getTxDetails(connection, signature);
};

export const getTxDetails = async (
  connection: anchor.web3.Connection,
  signature: string
) => {
  const latestBlockHash = await connection.getLatestBlockhash("processed");

  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    },
    "confirmed"
  );

  return await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });
};
