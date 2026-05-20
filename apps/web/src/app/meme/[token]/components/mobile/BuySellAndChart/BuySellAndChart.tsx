'use client';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react';
import Trade from '../../right/trade/Trade';
import MobleTreadingView from './MobleTreadingView';
import TokenInfo from '../../right/tokenInfo/TokenInfo';
import CustomConnectButton from '@/components/connectbutton/CustomConnectButton';
import WatchDataTable from '../../left/watchAndHold/watch/WatchDataTable';
import Holding from '../../left/watchAndHold/holding/Holding';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import TrendingTable from '../../left/Trending/TrendingTable';
import MemeRelatedData from '../../center/memeRelatedData/MemeRelatedData';
import WTrendingTable from '../../left/Trending/WTrendingTable';

type Props = {};

const BuySellAndChart = (props: Props) => {
    const { isConnected } = useGetIsConnected();
    return (
        <TabView panelContainerClassName="bg-nav-bgc p-0" className="memeinfo-custom-tabview">
            <TabPanel header="Buy/Sell" className="flex flex-col gap-4">
                <div className="py-[1.5rem]">
                    <Trade />
                </div>
                <TabView panelContainerClassName="bg-nav-bgc p-0">
                    <TabPanel header="Info" className="flex flex-col gap-4">
                        <TokenInfo />
                    </TabPanel>
                    <TabPanel header="Watchlist" className="flex flex-col gap-4">
                        {!isConnected ? (
                            <div className="flex w-full items-center justify-center py-6">
                                <CustomConnectButton
                                    className="border border-[#34363D] bg-[#1E2028] text-white"
                                    // mobileDom={<div>Connect Wallet</div>}
                                />
                            </div>
                        ) : (
                            <div>
                                <WatchDataTable />
                            </div>
                        )}
                    </TabPanel>
                    <TabPanel header="Holding" className="flex flex-col gap-4">
                        {!isConnected ? (
                            <div className="flex w-full items-center justify-center py-6">
                                <CustomConnectButton
                                    className="border border-[#34363D] bg-[#1E2028] text-white"
                                    // mobileDom={<div>Connect Wallet</div>}
                                />
                            </div>
                        ) : (
                            <div>
                                <Holding />
                            </div>
                        )}
                    </TabPanel>
                    <TabPanel header="Trending" className="flex flex-col gap-4">
                        <WTrendingTable />
                    </TabPanel>
                </TabView>
            </TabPanel>
            <TabPanel header="Chart">
                <div className="p-[1.5rem]">
                    <MobleTreadingView />
                </div>
                <MemeRelatedData />
            </TabPanel>
        </TabView>
    );
};

export default BuySellAndChart;
