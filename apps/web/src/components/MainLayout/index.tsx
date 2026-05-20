'use client';
import { WagmiProvider } from 'wagmi';
import { ConnectionProvider as SolanaConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { clusterApiUrl } from '@solana/web3.js';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import Header from './Header';
import AnchorProviderWrapper from '../AnchorProviderWrapper/AnchorProviderWrapper';
import { ReactNode, useMemo } from 'react';
import wagmiConfig from '@/config/wagmiConfig';
import { ToastProvider } from '@/context/ToastContext';
import { IS_TEST } from '@/constants/env';
import { walletAdapters } from '@/constants/walletAdapters';

const LayoutIndex = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const network = IS_TEST ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => walletAdapters, [network]);
    return (
        <SolanaConnectionProvider endpoint={IS_TEST ? endpoint : 'https://ada-78on5x-fast-mainnet.helius-rpc.com'}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <AnchorProviderWrapper>
                        <WagmiProvider config={wagmiConfig}>
                            <QueryClientProvider client={queryClient}>
                                <RainbowKitProvider theme={darkTheme()} locale="en-US">
                                    <ToastProvider>
                                        <Header />
                                        <main className="text-white">{children}</main>
                                    </ToastProvider>
                                </RainbowKitProvider>
                            </QueryClientProvider>
                        </WagmiProvider>
                    </AnchorProviderWrapper>
                </WalletModalProvider>
            </WalletProvider>
        </SolanaConnectionProvider>
    );
};

export default LayoutIndex;
