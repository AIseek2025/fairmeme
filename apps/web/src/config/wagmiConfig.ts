import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { mainnet, base, sepolia, baseSepolia, Chain, bsc, bscTestnet } from 'wagmi/chains';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { rainbowWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { argentWallet, trustWallet, ledgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { IS_TEST } from '@/constants/env';
export const supportChains: [Chain, ...Chain[]] = IS_TEST ? [sepolia, baseSepolia, bscTestnet] : [mainnet, base, bsc];
const isClient = typeof window === 'undefined' ? true : false;
const connectors = !isClient
    ? connectorsForWallets(
          [
              {
                  groupName: 'Recommended',
                  wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet],
              },
              {
                  groupName: 'Other',
                  wallets: [argentWallet, trustWallet, ledgerWallet],
              },
          ],
          { appName: 'fairmeme', projectId: '6282198948ecdf0c177cfe3496ffa9f1' },
      )
    : [];
export const config = createConfig({
    chains: supportChains,
    connectors,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
    },
});
export default config;
