'use client';
import TradingViewChart from '@/components/TradingViewChart/TradingViewChart';
import { useTokenInfo } from '@/services/hooks/useGetTokenInfo';

import { useParams } from 'next/navigation';
import React from 'react';

const WTradingViewChart = () => {
    const { token }: { token: string } = useParams();
    const { data: tokenInfo, loading } = useTokenInfo(token);

    return (
        <div className="h-[608px] w-full">
            <TradingViewChart tokenInfo={tokenInfo} />
        </div>
    );
};

export default WTradingViewChart;
