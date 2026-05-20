'use client';
import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import CustomConnectButton from '@/components/connectbutton/CustomConnectButton';
import WatchDataTable from './watch/WatchDataTable';
import Holding from './holding/Holding';

type Props = {};

const WatchAndHold = (props: Props) => {
    const { isConnected } = useGetIsConnected();
    return (
        <div className="h-full rounded-md text-white">
            <TabView panelContainerClassName="bg-nav-bgc p-0" className="memeinfo-custom-tabview">
                <TabPanel header="WatchList">
                    {!isConnected ? (
                        <div className="flex w-full items-center justify-center py-6">
                            <CustomConnectButton
                                className="border border-[#34363D] bg-[#1E2028] px-4 py-2.5 text-white"
                                // mobileDom={<div>Connect Wallet</div>}
                            />
                        </div>
                    ) : (
                        <div>
                            <WatchDataTable />
                        </div>
                    )}
                </TabPanel>
                <TabPanel header="Holding">
                    {!isConnected ? (
                        <div className="flex w-full items-center justify-center py-6">
                            <CustomConnectButton
                                className="cursor-pointer border border-[#34363D] bg-[#1E2028] px-4 py-2.5 text-white"
                                // mobileDom={<div>Connect Wallet</div>}
                            />
                        </div>
                    ) : (
                        <div>
                            <Holding />
                        </div>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
};

export default WatchAndHold;
