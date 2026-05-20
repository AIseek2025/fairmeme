import React from 'react';
import { Flex } from 'antd';
import { formatNumber } from '@/utils/common';
import { InfoItem } from './Liquidity';
import { GetTokenDetailInfo } from '@/types/meme';

interface AllocationProps {
    token: GetTokenDetailInfo.Response['token'];
    lock: number;
    unlock: number;
    lockAmount: number;
    unLockAmount: number;
}
const BranchItem: React.FC<{ label: string; value: string; text: string; isLast?: boolean }> = ({
    label,
    value,
    text,
    isLast,
}) => (
    <div className={`item ${isLast ? 'mt-[-16px]' : 'mt-[-8px]'} leading-8`}>
        <div className="line">
            <div className={`branch ${isLast ? 'top-[-6px] h-[13px] before:top-full' : 'h-full before:top-1/2'}`}></div>
        </div>
        <div className="my-[1rem] ml-[3rem] md:my-2 md:ml-7">
            <span className="text-[#7A89A2]">{label} </span>
            <span>
                {text} &nbsp;({value} %){' '}
            </span>
        </div>
    </div>
);
const TokenAllocation = ({ token, lock, unlock, lockAmount, unLockAmount }: AllocationProps) => {
    return (
        <div className="border-b border-[#010102] pb-6 pt-4 text-[1.125rem] md:text-[10px]">
            <div className="mb-4 text-sm font-bold text-[#EAECEF]">Token Allocation</div>
            <Flex vertical className="text-[#EAECEF]">
                <InfoItem label="Total Supply" value={<span>1000,000,000(1B)</span>} />
                <InfoItem label="Dev Purchase" value={<span>500K(0.05%)</span>} />
                <InfoItem label="Initial liquidity" value={<span>500K(0.05%)</span>} />
                <InfoItem label="Auction Supply" value={<span>999M(99.9%)</span>} />

                <BranchItem label="Locked" value={lock.toString()} text={`${formatNumber(lockAmount, 2)}`} />
                <BranchItem
                    label="Unlocked"
                    value={unlock.toString()}
                    text={`${formatNumber(unLockAmount, 2)}`}
                    isLast
                />
            </Flex>
        </div>
    );
};

export default TokenAllocation;
