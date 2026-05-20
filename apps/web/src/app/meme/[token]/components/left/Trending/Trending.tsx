'use client';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react';
import WTrendingTable from './WTrendingTable';

const Trending = () => {
    return (
        <TabView panelContainerClassName="bg-nav-bgc p-0" className="memeinfo-custom-tabview">
            <TabPanel header="Trending">
                <WTrendingTable />
            </TabPanel>
        </TabView>
    );
};

export default Trending;
