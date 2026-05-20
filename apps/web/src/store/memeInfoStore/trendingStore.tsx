import { GetTrendingList } from '@/types/meme';
import { create } from 'zustand';

interface TrendingStore {
    trendingList: GetTrendingList.TrendItem[];
    setTrendingList: (items: GetTrendingList.TrendItem[]) => void;
    updateFollowStatus: (tokenAddress: string, status: boolean) => void;
}

const useTrendingStore = create<TrendingStore>((set) => ({
    trendingList: [],

    setTrendingList: (items) => set({ trendingList: items }),

    updateFollowStatus: (tokenAddress, status) =>
        set((state) => ({
            trendingList: state.trendingList.map((item) =>
                item.tokenAddress === tokenAddress ? { ...item, followed: status } : item,
            ),
        })),
}));

export default useTrendingStore;
