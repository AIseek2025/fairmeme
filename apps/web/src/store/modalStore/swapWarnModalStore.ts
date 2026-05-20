import { create } from 'zustand';

interface ModalStore {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    toggle: () => void;
}

const useSwapWarnModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSwapWarnModalStore;
