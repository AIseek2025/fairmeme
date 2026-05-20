// import { useCallback, useState } from 'react';
// import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
// import { useAccount, useSignMessage } from 'wagmi';
// import useStore from '@/store/zustand';
// import useWalletAddress from '../useWalletAddress';
// import { ChainsType } from '@/types/common';
// import bs58 from 'bs58';
// import useAuthStatusStore from '@/store/authStore/authStore';
// import { get } from '@/services/request';
// import { login } from '@/services/api/login';
// export const getNonce = (publicKey: string, currentChain?: ChainsType): Promise<{ nonce: string }> =>
//     get(`/api/v1/nonce?creatorAddress=${publicKey}`);

// export const createSolanaMessage = (nonce: string): string => {
//     return `Sign in to FairMeme:${nonce}`;
// };
// // TODO:EVM SIGN IN  TODO:SIWE
// export const createEvmMessage = (address: string, nonce: string, chainId: number): string => {
//     return 'Sign in with Ethereum to FairMeme';
//     // const message = new SiweMessage({
//     //     domain: window.location.host,
//     //     address,
//     //     statement: 'Sign in with Ethereum to FairMeme',
//     //     uri: window.location.origin,
//     //     version: '1',
//     //     chainId,
//     //     nonce: nonce
//     // });
//     // return message.prepareMessage();
// };
// export const useSignIn = () => {
//     const currentChain = useStore((state) => state.currentChain);
//     const { authStatus, setAuthStatus } = useAuthStatusStore();
//     const { signMessage: signSolanaMessage, disconnect } = useSolanaWallet();
//     const { signMessageAsync: signEvmMessageAsync } = useSignMessage();
//     const { addressTokenStr } = useWalletAddress();
//     const { chainId } = useAccount();
//     const signIn = useCallback(async () => {
//         try {
//             if (!addressTokenStr) {
//                 throw new Error('Wallet address not found');
//             }
//             if (!currentChain) {
//                 throw new Error('Current chain not set');
//             }
//             setAuthStatus('loading');
//             const { nonce } = await getNonce(addressTokenStr!, currentChain);
//             let signature: string;
//             let message: string;

//             if (currentChain === 'sol') {
//                 if (!signSolanaMessage) {
//                     throw new Error('Solana wallet not connected');
//                 }
//                 message = createSolanaMessage(nonce);
//                 const encodedMessage = new TextEncoder().encode(message);
//                 const signatureUnitArray = await signSolanaMessage(encodedMessage);
//                 signature = bs58.encode(signatureUnitArray);
//             } else {
//                 message = createEvmMessage(addressTokenStr, nonce, chainId!);
//                 signature = await signEvmMessageAsync({ message });
//             }
//             const res = await login({
//                 creatorAddress: addressTokenStr,
//                 chainID: currentChain,
//                 sign: signature,
//                 message: message,
//                 nonce,
//             });
//             setAuthStatus('authenticated');
//         } catch (err) {
//             disconnect();
//             setAuthStatus('unauthenticated');
//             console.error('Error during login:', err);
//         }
//     }, [
//         currentChain,
//         addressTokenStr,
//         getNonce,
//         signSolanaMessage,
//         signEvmMessageAsync,
//         createEvmMessage,
//         createSolanaMessage,
//         chainId,
//     ]);
//     return { signIn };
// };
