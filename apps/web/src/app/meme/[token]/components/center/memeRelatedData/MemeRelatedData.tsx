'use client';
import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import Comments from './comments/Comments';
import Holder from './holder/Holder';
import Trade from './trade/Trade';
import { getHoldersList, getTradeList } from '@/services/api/meme';
import { useParams } from 'next/navigation';
import { GetHoldersList, GetTradeList } from '@/types/meme';

type Props = {};

const MemeRelatedData = (props: Props) => {
    const { token }: { token: string } = useParams();
    const [holderTotal, setHolderTotal] = useState<number>(0);
    const [holders, setHolders] = useState<GetHoldersList.HolderItem[]>([]);
    const [holdersLoading, setHoldersLoading] = useState(false);
    const [holdersPage, setHoldersPage] = useState(1);
    const [holdersHasMore, setHoldersHasMore] = useState(true);
    const [trades, setTrades] = useState<GetTradeList.TradeItem[]>([]);
    const [tradesLoading, setTradesLoading] = useState(false);
    const [tradesPage, setTradesPage] = useState(1);
    const [tradesHasMore, setTradesHasMore] = useState(true);
    const holdersLoadLazyData = async () => {
        if (holdersLoading || !holdersHasMore) return;

        setHoldersLoading(true);
        try {
            const result: GetHoldersList.Response = await getHoldersList({
                columns: {
                    tokenAddress: token,
                },
                limit: 100,
                page: holdersPage,
            });
            setHolders((prevHolders) => [...prevHolders, ...result.items]);
            setHolderTotal(result.total);
            if (result.items.length < 100 || holders?.length + result.items.length >= result.total) {
                setHoldersHasMore(false);
            } else {
                setHoldersPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching trade list:', error);
        } finally {
            setHoldersLoading(false);
        }
    };
    const tradesLoadLazyData = async () => {
        if (tradesLoading || !tradesHasMore) return;

        setTradesLoading(true);
        try {
            const result = await getTradeList({
                columns: {
                    tokenAddress: token,
                },
                limit: 100,
                page: tradesPage,
            });

            setTrades((prevTrades) => [...prevTrades, ...result.items]);

            if (result.items.length < 100 || trades.length + result.items.length >= result.total) {
                setTradesHasMore(false);
            } else {
                setTradesPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching trade list:', error);
        } finally {
            setTradesLoading(false);
        }
    };
    useEffect(() => {
        tradesLoadLazyData();
        holdersLoadLazyData();
    }, [token]);

    const onHolderScroll = (event: React.UIEvent<HTMLElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 50 && !holdersLoading && holdersHasMore) {
            holdersLoadLazyData();
        }
    };
    const onTradeScroll = (event: React.UIEvent<HTMLElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 50 && !tradesLoading && tradesHasMore) {
            tradesLoadLazyData();
        }
    };
    return (
        <div className="w-full rounded-md bg-[#171821] text-white">
            <TabView panelContainerClassName="bg-nav-bgc p-0" className="memeinfo-custom-tabview">
                <TabPanel header="Comments">
                    <Comments />
                </TabPanel>
                <TabPanel header={`Holders(${holderTotal})`}>
                    <Holder onScroll={onHolderScroll} holders={holders} />
                </TabPanel>
                <TabPanel header="Trade">
                    <Trade onScroll={onTradeScroll} trades={trades} />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default MemeRelatedData;
