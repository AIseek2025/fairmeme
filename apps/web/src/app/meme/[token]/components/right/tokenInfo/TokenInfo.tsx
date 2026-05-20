'use client';
import React, { useMemo } from 'react';
import AuctionProgress from './AuctionProgress';
import Liquidity from './Liquidity';
import TokenAllocation from './TokenAllocation';
import Info from './Info';
import { useParams } from 'next/navigation';
import { useTokenInfo } from '@/services/hooks/useGetTokenInfo';
import { calculatePercentage, formatNumber, formatRelativeTime } from '@/utils/common';
import { GetTokenDetailInfo } from '@/types/meme';

export interface InfoProps {
    token: GetTokenDetailInfo.Response['token'];
}
const TokenInfo = () => {
    const { token } = useParams();
    const { data: tokenInfo } = useTokenInfo(token as string);
    const calculatedValues = useMemo(() => {
        if (!tokenInfo?.token) return null;
        const { totalSupply, tokenReleased, aucT } = tokenInfo.token;
        const totalSupplyNum = Number(totalSupply);
        const tokenReleasedNum = Number(tokenReleased);
        const available = (totalSupplyNum / 100) * 99.9;
        const percentage = calculatePercentage(Number(tokenReleasedNum), available);
        const lockAmount = available - tokenReleasedNum;
        const unLockAmount = available - lockAmount;
        const lock = calculatePercentage(Number(lockAmount), totalSupplyNum);
        const unLock = 99.9 - lock;
        return {
            formatAvailable: formatNumber(available),
            percentage: percentage,
            formatReleased: formatNumber(tokenReleasedNum),
            formatAuctionTime: formatRelativeTime(Number(aucT ?? 0)),
            lock: Number(lock.toFixed(2)),
            unLock: Number(unLock.toFixed(2)),
            lockAmount: lockAmount > 0 ? lockAmount : 0,
            unLockAmount: unLockAmount > 0 ? unLockAmount : 0,
            circulatingSupply: tokenReleased + 100_0000,
        };
    }, [tokenInfo?.token]);

    if (!tokenInfo?.token || !calculatedValues) {
        return null;
    }

    const {
        formatAvailable,
        percentage,
        formatReleased,
        formatAuctionTime,
        lock,
        unLock,
        lockAmount,
        unLockAmount,
        circulatingSupply,
    } = calculatedValues;

    return (
        <div className="bg-[#171821] px-6 text-[#7A89A2] md:px-4 md:text-sm">
            {tokenInfo && (
                <>
                    <AuctionProgress
                        percentage={tokenInfo?.token?.aucP}
                        available={formatAvailable}
                        released={formatReleased}
                        auctionTime={formatAuctionTime}
                    />
                    <Liquidity token={tokenInfo.token} />
                    <TokenAllocation
                        token={tokenInfo.token}
                        lock={lock}
                        unlock={unLock}
                        lockAmount={lockAmount}
                        unLockAmount={unLockAmount}
                    />
                    <Info
                        token={tokenInfo.token}
                        formatAuctionTime={formatAuctionTime}
                        circulatingSupply={circulatingSupply}
                    />
                </>
            )}
        </div>
    );
};

export default TokenInfo;
