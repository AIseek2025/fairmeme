import React from 'react';
import MemeHeaderInfo from './center/Header/MemeHeaderInfo';
import WTradingViewChart from './center/WTradingViewChart/WTradingViewChart';
import MemeRelatedData from './center/memeRelatedData/MemeRelatedData';
import WatchAndHold from './left/watchAndHold/WatchAndHold';
import Trending from './left/Trending/Trending';
import Trade from './right/trade/Trade';
import MemeDescribe from './right/memeInfo/MemeDescribe';
import HourData from './right/hourData/HourData';
import PriceChange from './right/PriceChange/PriceChange';
import TokenInfo from './right/tokenInfo/TokenInfo';

const Desktop = () => {
    return (
        <div className="hidden h-[calc(100vh-64px)] w-screen gap-2 overflow-hidden bg-black p-2 md:flex">
            <div className="scrollbar-hide flex w-[24rem] flex-col gap-2 overflow-y-auto">
                <div>
                    <WatchAndHold />
                </div>
                <div>
                    <Trending />
                </div>
            </div>
            <div className="scrollbar-hide flex-1 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <div>
                        <MemeHeaderInfo />
                    </div>
                    <div>
                        <WTradingViewChart />
                    </div>
                    <div>
                        <MemeRelatedData />
                    </div>
                </div>
            </div>

            <div className="scrollbar-hide flex max-w-[24rem] flex-col gap-2 overflow-x-hidden overflow-y-scroll">
                <Trade />
                <MemeDescribe />
                <div>
                    <HourData />
                </div>
                <PriceChange />
                <TokenInfo />
            </div>
        </div>
    );
};

export default Desktop;
