'use client';
import { safeMergeClassName } from '@/utils/common';
import React, { useState } from 'react';
import TrendingTable from './TrendingTable';
import useStore from '@/store/zustand';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useRequest } from 'ahooks';
import { getTrendingList } from '@/services/api/meme';
import useTrendingStore from '@/store/memeInfoStore/trendingStore';

type Props = {};
type MinuteOption = 60 | 360 | 720 | 1440;
const hourToMinute = (hour: '1h' | '6h' | '12h' | '24h'): MinuteOption => {
    switch (hour) {
        case '1h':
            return 60;
        case '6h':
            return 360;
        case '12h':
            return 720;
        case '24h':
            return 1440;
        default:
            return 360;
    }
};
const WTrendingTable = (props: Props) => {
    const [hour, setHour] = useState<'1h' | '6h' | '12h' | '24h'>('6h');
    const currentChain = useStore((store) => store.currentChain);
    const { setTrendingList, trendingList } = useTrendingStore();
    const { addressTokenStr } = useWalletAddress();
    useRequest(
        () =>
            getTrendingList({
                chainName: currentChain,
                duration: hourToMinute(hour),
                creatorToken: addressTokenStr ?? '',
                limit: 15,
            }),

        {
            refreshDeps: [hour, addressTokenStr],
            pollingInterval: 20 * 1000,
            onSuccess: (data) => {
                setTrendingList(data);
            },
        },
    );
    return (
        <div>
            <div className="px-6 py-3 md:px-2">
                <div className="mb-2 flex overflow-hidden rounded-md border border-r-0 border-[#34363D] bg-[#1E2028]">
                    {['1h', '6h', '12h', '24h'].map((item) => {
                        return (
                            <div
                                key={item}
                                className={safeMergeClassName(
                                    'flex flex-1 cursor-pointer items-center justify-center border-r border-[#34363D] py-4 md:py-2',
                                    {
                                        'bg-[#34363D] text-white': item === hour,
                                    },
                                )}
                                onClick={() => setHour(item as '1h' | '6h' | '12h' | '24h')}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
            </div>
            <TrendingTable data={trendingList} />
        </div>
    );
};
export default WTrendingTable;
