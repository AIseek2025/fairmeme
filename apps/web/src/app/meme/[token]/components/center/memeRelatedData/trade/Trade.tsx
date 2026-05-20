import { AddressTokenRebuild } from '@/components/AddressToken/AddressTokenRebuild';
import { CHAIN_ICON_MAP } from '@/constants';
import { useMemeInfoStore } from '@/store/memeInfoStore';
import useStore from '@/store/zustand';
import { GetTradeList } from '@/types/meme';
import { formattedTime, openExplorer, safeMergeClassName } from '@/utils/common';
import { Column, ColumnContext } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
type Props = {
    onScroll: (event: React.UIEvent<HTMLElement>) => void;
    trades: GetTradeList.TradeItem[];
};
const Trade = ({ onScroll, trades }: Props) => {
    const currentChain = useStore((store) => store.currentChain);
    const { memeItem } = useMemeInfoStore();
    return (
        <div className="pb-4">
            <DataTable
                value={trades}
                emptyMessage={() => <div className="text-center">No data.</div>}
                scrollable
                rows={100}
                stripedRows
                virtualScrollerOptions={{
                    lazy: false,
                    onScroll: onScroll,
                    itemSize: 46,
                    className: 'customScrollbar',
                }}
                scrollHeight="32rem"
                size="small"
                pt={{
                    thead: () => ({
                        className: safeMergeClassName('bg-[#171821] border-none h-10'),
                    }),
                    column: {
                        headerCell: () => ({
                            className: safeMergeClassName(
                                'bg-transparent text-nowrap text-[#7A89A2] border-0 text-sm font-normal px-4 ',
                            ),
                        }),
                        bodyCell: ({ context }: { context: ColumnContext }) => {
                            return {
                                className: safeMergeClassName('text-white text-sm border-0 px-4  h-14', {
                                    'z-10': context.index === 0,
                                    'bg-[#131418] text-center': !trades?.length,
                                }),
                            };
                        },
                    },
                    bodyRow: ({ context }: any) => ({
                        className: safeMergeClassName('hover:bg-[#131418] flex-shrink-0  bg-[#1D1F27]', {
                            // 'bg-[#181A20]': context.index % 2 === 0,
                        }),
                    }),
                }}
            >
                <Column
                    field="holders"
                    header="Account"
                    align="left"
                    alignHeader="left"
                    body={(item) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <AddressTokenRebuild address={item.creatorAddress} />
                            </div>
                        );
                    }}
                ></Column>
                <Column
                    field="act"
                    header="Act"
                    body={(item) => {
                        return item.act === 1 ? (
                            <span className="text-[#FF3B54]">Sell</span>
                        ) : (
                            <span className="text-[#1BAB75]">Buy</span>
                        );
                    }}
                ></Column>
                <Column
                    field="tradeAmount"
                    header={CHAIN_ICON_MAP[currentChain].nativeCoin}
                    body={(item) => {
                        return <span>{item.tradeAmount}</span>;
                    }}
                ></Column>
                <Column
                    field="tokenAmount"
                    header={`${memeItem?.tokenTicker}`}
                    body={(item) => {
                        return <span>{item.tokenAmount}</span>;
                    }}
                ></Column>
                {/* <Column
                    field="tradeAmount"
                    header="Costs"
                    body={(item) => {
                        return (
                            <div>
                                <span className="w-11">{item.tradeAmount}</span>
                                <span className="w-11">{CHAIN_ICON_MAP[currentChain].nativeCoin}</span>
                            </div>
                        );
                    }}
                ></Column>
                <Column
                    field="tokenAmount"
                    header="Proceeds"
                    body={(item) => {
                        return (
                            <span>
                                {item.tokenAmount} {tokenInfo?.token.tokenName}
                            </span>
                        );
                    }}
                ></Column> */}
                <Column
                    field="createdAt"
                    header="Date"
                    body={(item) => {
                        return <div className="text-white">{formattedTime(item.createdAt, false)}</div>;
                    }}
                ></Column>
                <Column
                    field="txn"
                    header="TXN"
                    alignHeader="right"
                    align="right"
                    body={(item) => (
                        <p onClick={() => openExplorer(item.txHash, 'tx')}>
                            <i className="pi pi-external-link text-[#848E9C]" />
                        </p>
                    )}
                ></Column>
            </DataTable>
        </div>
    );
};

export default Trade;
