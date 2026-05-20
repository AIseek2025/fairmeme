import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, TransactionInstruction, ComputeBudgetProgram } from '@solana/web3.js';
import { useCreation, useMemoizedFn, useSetState, useUpdateEffect } from 'ahooks';
import { getAndParseTransactionError, simulateTransaction } from '@/utils/common';

interface UseSolanaTransactionOptions {
    instructions: TransactionInstruction[];
    feePayer?: PublicKey;
    unitsRatio?: number;
}

interface TxStatus {
    isSuccess: boolean;
    hash: string;
    isLoading: boolean;
    errorMessage: string;
    toastShown: boolean;
}

type ShowToastFunction = (
    type: 'success' | 'error',
    message: string,
    description: string | React.ReactNode,
    signature?: string,
) => void;

interface ToastConfig {
    successMessage: string;
    successDescription: (params: any) => string;
    errorMessage: string;
    errorDescription: (error: string) => string;
}

export const useSolanaTransaction = (showToast: ShowToastFunction, toastConfig: ToastConfig) => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const anchorWallet = useAnchorWallet();
    const [txStatus, setTxStatus] = useSetState<TxStatus>({
        isSuccess: false,
        hash: '',
        isLoading: false,
        errorMessage: '',
        toastShown: false,
    });
    const toastParamsRef = useCreation<any>(() => ({}), []);

    useUpdateEffect(() => {
        if (!txStatus.toastShown && (txStatus.isSuccess || txStatus.errorMessage)) {
            const toastType = txStatus.isSuccess ? 'success' : 'error';
            const message = txStatus.isSuccess ? toastConfig.successMessage : toastConfig.errorMessage;
            const description = txStatus.isSuccess
                ? toastConfig.successDescription(toastParamsRef.current)
                : toastConfig.errorDescription(txStatus.errorMessage);

            showToast(toastType, message, description, txStatus.hash);
            setTxStatus({ toastShown: true });
        }
    }, [txStatus, showToast, toastConfig]);

    const execute = useMemoizedFn(
        async ({ instructions, feePayer, unitsRatio }: UseSolanaTransactionOptions, toastParams?: any) => {
            setTxStatus({
                isSuccess: false,
                hash: '',
                isLoading: true,
                errorMessage: '',
                toastShown: false,
            });
            toastParamsRef.current = toastParams;

            if (!publicKey) throw new Error('Wallet Not Connected');
            if (!anchorWallet) throw new Error('AnchorWallet Not Initialized');

            try {
                const transaction = new Transaction().add(...instructions);
                const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = feePayer ?? publicKey;

                const messageV0 = transaction.compileMessage();
                const {
                    value: { unitsConsumed },
                } = await simulateTransaction(connection, messageV0);

                if (unitsRatio) {
                    const unitsWithBuffer = Math.ceil(unitsConsumed ? unitsConsumed * unitsRatio : 500_000);
                    const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({ units: unitsWithBuffer });
                    transaction.instructions.unshift(computeBudgetIx);
                }

                const signedTransaction = await anchorWallet.signTransaction(transaction);
                const rawTransaction = signedTransaction.serialize();
                const signature = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true });

                await connection.confirmTransaction(signature, 'confirmed');
                const errorResult = await getAndParseTransactionError(connection, signature);

                setTxStatus({
                    isSuccess: !errorResult?.parsed,
                    hash: signature,
                    isLoading: false,
                    errorMessage: errorResult?.parsed?.errorMessage ?? '',
                    toastShown: false,
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setTxStatus({
                    isSuccess: false,
                    isLoading: false,
                    errorMessage: errorMessage.includes('User rejected the request.') ? '' : errorMessage,
                    hash: '',
                    toastShown: errorMessage.includes('User rejected the request.'),
                });
            }
        },
    );

    const resetStatus = useMemoizedFn(() => {
        setTxStatus({
            isSuccess: false,
            hash: '',
            isLoading: false,
            errorMessage: '',
            toastShown: false,
        });
    });

    return { execute, txStatus, resetStatus };
};
