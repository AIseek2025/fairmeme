import { getIsChainSupported } from '@/constants';
import useStore from '@/store/zustand';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

const useGetIsConnected = () => {
    const { address, chainId: evmChainId } = useAccount();
    const { publicKey } = useWallet();
    const currentChain = useStore((state) => state.currentChain);
    const isEvmConnected = currentChain !== 'sol' && address ? true : false;
    const isSolanaConnected = currentChain === 'sol' && publicKey ? true : false;
    const isConnected = useMemo(() => isSolanaConnected || isEvmConnected, [address, currentChain, publicKey]);
    const isSupportedChain = evmChainId ? getIsChainSupported(evmChainId) : false;
    return { isConnected, currentChain, isSupportedChain };
};
export default useGetIsConnected;
