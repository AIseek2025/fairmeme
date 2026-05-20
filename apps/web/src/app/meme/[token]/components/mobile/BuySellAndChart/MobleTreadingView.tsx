'use client';
import TradingViewChart from '@/components/TradingViewChart/TradingViewChart';
import { useTokenInfo } from '@/services/hooks/useGetTokenInfo';
import { useParams } from 'next/navigation';
import React from 'react';

type Props = {};

const MobleTreadingView = (props: Props) => {
    const { token }: { token: string } = useParams();
    const { data: tokenInfo } = useTokenInfo(token);
    return (
        <div className="h-[32rem] w-full border border-black">
            <TradingViewChart tokenInfo={tokenInfo} />
        </div>
    );
};

export default MobleTreadingView;
