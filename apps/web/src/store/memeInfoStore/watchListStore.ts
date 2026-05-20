import { WatchUpdateData } from '@/hooks/useWsHub';
import { create } from 'zustand';

interface MemeInfoStore {
    watchList: WatchUpdateData[];
    clearWatchList: () => void;
    updateWatchList: (updates: Partial<WatchUpdateData>[]) => void;
    updateWatchListFollowStatus: (tokenAddress: string, status: boolean) => void;
    addToWatchList: (item: WatchUpdateData) => void;
    removeFromWatchList: (tokenAddress: string) => void;
}

const useWatchListStore = create<MemeInfoStore>((set) => ({
    watchList: [],
    clearWatchList: () => set({ watchList: [] }),
    updateWatchList: (updates) =>
        set((state) => {
            const newList = [...state.watchList];
            updates.forEach((update) => {
                const index = newList.findIndex((item) => item.tokenAddress === update.tokenAddress);
                if (index !== -1) {
                    newList[index] = { ...newList[index], ...update };
                } else if (update.tokenAddress) {
                    newList.push(update as WatchUpdateData);
                }
            });
            return { watchList: newList };
        }),
    updateWatchListFollowStatus: (tokenAddress, status) =>
        set((state) => ({
            watchList: state.watchList.map((item) =>
                item.tokenAddress === tokenAddress ? { ...item, followed: status } : item,
            ),
        })),
    // spare
    addToWatchList: (item) =>
        set((state) => ({
            watchList: [...state.watchList, item],
        })),
    // spare
    removeFromWatchList: (tokenAddress) =>
        set((state) => ({
            watchList: state.watchList.filter((item) => item.tokenAddress !== tokenAddress),
        })),
}));

export default useWatchListStore;
