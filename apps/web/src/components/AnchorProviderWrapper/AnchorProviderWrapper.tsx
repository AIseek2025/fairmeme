'use client';

import { AnchorProviderContext } from '@/context/anchorProviderContext';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { ReactNode, useMemo } from 'react';

interface AnchorProviderWrapperProps {
    children: ReactNode;
}
const AnchorProviderWrapper = ({ children }: AnchorProviderWrapperProps) => {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const provider = useMemo(() => {
        if (anchorWallet) {
            const anchorProvider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
            return anchorProvider;
        }
        return null;
    }, [connection, anchorWallet]);

    return <AnchorProviderContext.Provider value={provider}>{children}</AnchorProviderContext.Provider>;
};
export default AnchorProviderWrapper;
