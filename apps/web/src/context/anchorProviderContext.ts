import { AnchorProvider } from '@coral-xyz/anchor';
import { createContext, useContext } from 'react';

export const AnchorProviderContext = createContext<AnchorProvider | null>(null);
export const useAnchorProvider = () => useContext(AnchorProviderContext);
