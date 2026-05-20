import { CHAIN_LIST, getIsChainSupported } from '@/constants';
import useStore from '@/store/zustand';
import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
export const useChainIdListener = () => {
    const currentChain = useStore((state) => state.currentChain);
    const setCurrentChain = useStore((state) => state.setCurrentChain);
    const { connector } = useAccount();
    const onChainChanged = useCallback(
        ({ chainId }: { chainId?: number }) => {
            if (chainId === undefined) return;
            const isEvmSupportChain = currentChain !== 'sol' && chainId ? getIsChainSupported(chainId) : false;
            if (!isEvmSupportChain) {
                // console.log(`Because currentChain --> ${currentChain}, isEvmSupportChain return ${isEvmSupportChain}`);
                return;
            }
            setCurrentChain(CHAIN_LIST.find((item) => item.chainId === chainId)?.key!);
            // console.log('setCurrentChain', CHAIN_LIST.find((item) => item.chainId === chainId)?.key!);
        },
        [setCurrentChain],
    );
    useEffect(() => {
        connector?.emitter?.on('change', onChainChanged);
        return () => connector?.emitter?.off('change', onChainChanged);
    });
};
// TODO:MORE Listener
export const useEvmEventListener = () => {
    useChainIdListener();
};
