import * as anchor from "@coral-xyz/anchor";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { FairMemeSol } from "../target/types/fairmeme_sol";

// Consts
export const GLOBAL_SEED = "global";
export const FAIR_MEME_STATE_SEED = "fair-meme-state";
export const DEFAULT_DECIMALS = 6n;
export const DEFAULT_TOKEN_SUPPLY =
  1_000_000_000n * BigInt(10 ** Number(DEFAULT_DECIMALS));
export const DEFAULT_INITIAL_DEV_BUY_AMOUNT = 1_000_000_000n;
export const DEFAULT_INITIAL_DEV_BUY_PERCENT = 10n; // 0.1 %
export const DEFAULT_PLATFORM_TRADE_FEE = 100n; // 2%
export const DEFAULT_CREATOR_TRADE_FEE = 100n; // 1%

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

export const airdropSol = async (
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey,
  amount: number
) => {
  let signature = await connection.requestAirdrop(publicKey, amount);
  return getTxDetails(connection, signature);
};

export const buildVersionedTx = async (
  connection: anchor.web3.Connection,
  payer: PublicKey,
  tx: Transaction
) => {
  const blockHash = (await connection.getLatestBlockhash("processed"))
    .blockhash;

  let messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockHash,
    instructions: tx.instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};

export const sendTransaction = async (
  program: anchor.Program<FairMemeSol>,
  tx: Transaction,
  signers: anchor.web3.Signer[],
  payer: PublicKey
) => {
  const versionedTx = await buildVersionedTx(
    program.provider.connection,
    payer,
    tx
  );
  versionedTx.sign(signers);

  let sig = await program.provider.connection.sendTransaction(versionedTx);
  let response = await getTxDetails(program.provider.connection, sig);
  let events = getTransactionEvents(program, response);
  return {
    response,
    events,
  };
};

export const getTransactionEvents = (
  program: anchor.Program<FairMemeSol>,
  txResponse: anchor.web3.VersionedTransactionResponse | null
) => {
  if (!txResponse) {
    return [];
  }

  let [eventPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("__event_authority")],
    program.programId
  );

  let indexOfEventPDA =
    txResponse.transaction.message.staticAccountKeys.findIndex((key) =>
      key.equals(eventPDA)
    );

  if (indexOfEventPDA === -1) {
    return [];
  }

  const matchingInstructions = txResponse.meta?.innerInstructions
    ?.flatMap((ix) => ix.instructions)
    .filter(
      (instruction) =>
        instruction.accounts.length === 1 &&
        instruction.accounts[0] === indexOfEventPDA
    );

  if (matchingInstructions) {
    let events = matchingInstructions.map((instruction) => {
      const ixData = anchor.utils.bytes.bs58.decode(instruction.data);
      const eventData = anchor.utils.bytes.base64.encode(ixData.slice(8));
      const event = program.coder.events.decode(eventData);
      return event;
    });
    const isNotNull = <T>(value: T | null): value is T => {
      return value !== null;
    };
    return events.filter(isNotNull);
  } else {
    return [];
  }
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
