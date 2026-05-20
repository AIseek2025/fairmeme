'use client';

import useStore from '@/store/zustand';
import { getAddressDisplayName } from '@/utils/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

/**
 * @description: addressToken: eth account address / publicKey: account address
 * @return {addressToken, publicKey}
 */
const useWalletAddress = () => {
    const { address } = useAccount();
    const { publicKey } = useWallet();
    const currentChain = useStore((state) => state.currentChain);
    const addressTokenStr = useMemo(
        () => (currentChain === 'sol' ? publicKey?.toString() : address),
        [address, currentChain, publicKey],
    );
    const addressTokenDisplayName = useMemo(() => getAddressDisplayName(addressTokenStr), [addressTokenStr]);
    return { addressToken: address, publicKey, addressTokenDisplayName, addressTokenStr };
};
export default useWalletAddress;
