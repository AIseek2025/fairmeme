import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { isNil } from 'lodash-es';
import { areKeysAndTypesEqual } from '@/utils/common';
import { ChainsType } from '@/types/common';

interface StoreState {
    currentChain: ChainsType;
    loginId?: number;
    slippagePresets: number[];
    currentSlippage: number;
    navSearch: {
        isShow: boolean;
        keyword: string;
    };
    setCurrentChain: (chain: ChainsType) => void;
    setLoginId: (id?: number) => void;
    setCurrentSlippage: (slippage: number) => void;
    setSearchVisibility: (isShow: boolean) => void;
    setSearchKeyword: (keyword: string) => void;
}

const useStore = create<StoreState>()(
    devtools(
        persist(
            (set) => ({
                currentChain: 'sol' as ChainsType,
                slippagePresets: [5, 10, 15, 20],
                currentSlippage: 5, // default slippage
                navSearch: {
                    isShow: false,
                    keyword: '',
                },
                loginId: undefined,
                setCurrentChain: (chain) => set({ currentChain: chain }),
                setLoginId: (id) => set({ loginId: id }),
                setCurrentSlippage: (slippage) => set({ currentSlippage: slippage }),
                setSearchVisibility: (isShow) =>
                    set((state) => ({
                        navSearch: { ...state.navSearch, isShow },
                    })),
                setSearchKeyword: (keyword) =>
                    set((state) => ({
                        navSearch: { ...state.navSearch, keyword },
                    })),
            }),
            {
                name: 'fairmeme-storage',
                getStorage: () => localStorage,
                partialize: (state) => ({
                    currentChain: state.currentChain,
                    loginId: state.loginId,
                    currentSlippage: state.currentSlippage,
                }),
                merge: (persistedState: any, currentState) => {
                    const merged = {
                        ...currentState,
                        ...persistedState,
                    };

                    if (!isNil(persistedState.currentChain)) {
                        if (
                            typeof persistedState.currentChain !== typeof currentState.currentChain ||
                            !areKeysAndTypesEqual(currentState.currentChain, persistedState.currentChain)
                        ) {
                            merged.currentChain = currentState.currentChain;
                        }
                    }

                    if (!isNil(persistedState.loginId) && typeof persistedState.loginId !== 'number') {
                        merged.loginId = currentState.loginId;
                    }

                    if (!isNil(persistedState.currentSlippage) && typeof persistedState.currentSlippage !== 'number') {
                        merged.currentSlippage = currentState.currentSlippage;
                    }

                    return merged;
                },
            },
        ),
    ),
);

export default useStore;
