import {
    AddressLookupTableAccount,
    Commitment,
    ComputeBudgetProgram,
    Connection,
    PublicKey,
    RpcResponseAndContext,
    SignatureResult,
    SimulatedTransactionResponse,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
export const getErrorFromRPCResponse = (
    rpcResponse: RpcResponseAndContext<SignatureResult | SimulatedTransactionResponse>,
) => {
    const error = rpcResponse.value.err;
    if (error) {
        if (typeof error === 'object') {
            const errorKeys = Object.keys(error);
            if (errorKeys.length === 1) {
                if (errorKeys[0] === 'AccountNotFound') {
                    throw new Error('AccountNotFound: The account does not exist or has no SOL');
                }
                if (errorKeys[0] !== 'InstructionError') {
                    throw new Error(`Unknown RPC error: ${error}`);
                }
                // @ts-ignore
                const instructionError = error.InstructionError;
                throw new Error(
                    `Error in transaction: instruction index ${instructionError[0]}, custom program error ${instructionError[1].Custom}`,
                );
            }
        }
        throw Error(error.toString());
    }
};
export const confirmTransaction = async (
    connection: Connection,
    signature: string,
    commitment: Commitment = 'finalized',
): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    const rpcResponse = await connection.confirmTransaction(
        {
            signature,
            ...block,
        },
        commitment,
    );

    getErrorFromRPCResponse(rpcResponse);

    return signature;
};
export const getSimulationComputeUnits = async (
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: PublicKey,
    lookupTables: AddressLookupTableAccount[] | [],
): Promise<number | null> => {
    try {
        const testInstructions = [ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }), ...instructions];

        const testTransaction = new VersionedTransaction(
            new TransactionMessage({
                instructions: testInstructions,
                payerKey: payer,
                recentBlockhash: PublicKey.default.toString(),
            }).compileToV0Message(lookupTables),
        );

        const rpcResponse = await connection.simulateTransaction(testTransaction, {
            replaceRecentBlockhash: true,
            sigVerify: false,
        });

        getErrorFromRPCResponse(rpcResponse);
        return rpcResponse.value.unitsConsumed ?? 200000;
    } catch (error) {
        if (error instanceof Error && error.message.includes('AccountNotFound')) {
            console.error('Account not found or has no SOL. Using default compute units.');
            return 200000;
        }
        throw error;
    }
};

export async function buildOptimalTransaction(
    connection: Connection,
    instructions: TransactionInstruction[],
    publicKey: PublicKey,
    lookupTables: AddressLookupTableAccount[],
) {
    const [microLamports, units, recentBlockhash] = await Promise.all([
        100 /* Get optimal priority fees - https://solana.com/developers/guides/advanced/how-to-use-priority-fees*/,
        getSimulationComputeUnits(connection, instructions, publicKey, lookupTables),
        connection.getLatestBlockhash(),
    ]);
    instructions.unshift(ComputeBudgetProgram.setComputeUnitPrice({ microLamports }));
    if (units) {
        const increasedUnits = units * 1.2;
        // probably should add some margin of error to units
        instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({ units: increasedUnits }));
    }
    return {
        transaction: new VersionedTransaction(
            new TransactionMessage({
                instructions,
                recentBlockhash: recentBlockhash.blockhash,
                payerKey: publicKey,
            }).compileToV0Message(lookupTables),
        ),
        recentBlockhash,
    };
}
