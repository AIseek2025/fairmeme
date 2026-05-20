'use client';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import { formatAddress, formatNumber } from '@/utils/common';
import React from 'react';

const RenderHeaderItem = ({ filed, data }: { filed: string; data: string }) => {
    return (
        <div className="text-sm">
            <div className="mb-1 text-grey-blue">{filed}</div>
            <div className="text-white">{data}</div>
        </div>
    );
};
const HeaderData = () => {
    const { memeItem } = useMemeInfoStore();
    return (
        <div className="flex items-center justify-between gap-4 text-nowrap p-3 px-4">
            <div className="gap-6 flex-items-center">
                <RenderHeaderItem filed="Market Cap" data={`$${formatNumber(memeItem?.marketCap)}`} />
                <RenderHeaderItem filed="FDMC" data={`$${formatNumber(memeItem?.fdmc)}`} />
                <RenderHeaderItem filed="Liquidity" data={`$${formatNumber(memeItem?.liquidity)}`} />
                <RenderHeaderItem filed="Vol(24h)" data={`$${formatNumber(memeItem?.vol24)}`} />
                <RenderHeaderItem filed="24h%" data={`${formatNumber(memeItem?.change24)}%`} />
                <RenderHeaderItem filed="Turnover(24h)" data={`${memeItem?.turnover24 ?? 0}%`} />
                <RenderHeaderItem filed="TXs(24h)" data={`${memeItem?.txs24?.toLocaleString() ?? '-'}`} />
                <RenderHeaderItem filed="Holders" data={`${memeItem?.holders?.toLocaleString() ?? '-'}`} />
                <RenderHeaderItem filed="Watchers" data={`${memeItem?.watchers?.toLocaleString() ?? '-'}`} />
                <RenderHeaderItem filed="Views(24h)" data={`${memeItem?.viewCount?.toLocaleString() ?? '-'}`} />
                {/* {memeItem?.creatorAddress && (
                    <RenderHeaderItem filed="Creator" data={`${formatAddress(memeItem?.creatorAddress!)}`} />
                )} */}
            </div>
        </div>
    );
};

export default HeaderData;
