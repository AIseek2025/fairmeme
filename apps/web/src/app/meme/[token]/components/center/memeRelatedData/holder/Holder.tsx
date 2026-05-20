import { AddressTokenRebuild } from '@/components/AddressToken/AddressTokenRebuild';
import CustomSortIcon from '@/components/customSortIcon/CustomSortIcon';
import { useMemeInfoStore } from '@/store/memeInfoStore';
import { GetHoldersList } from '@/types/meme';
import { formatNumber, safeMergeClassName } from '@/utils/common';
import { paths } from '@/utils/paths';
import Link from 'next/link';
import { Column, ColumnContext } from 'primereact/column';
import { DataTable, SortOrder } from 'primereact/datatable';

import React from 'react';

type Props = {
    onScroll: (event: React.UIEvent<HTMLElement>) => void;
    holders: GetHoldersList.HolderItem[];
};
const Holder = ({ onScroll, holders }: Props) => {
    const { memeItem } = useMemeInfoStore();
    return (
        <div>
            <div className="pb-4">
                {/* {true && <div className="flex h-48 w-full items-center justify-center">No Data</div>} */}
                <DataTable
                    scrollable
                    scrollHeight="32rem"
                    value={holders}
                    virtualScrollerOptions={{
                        lazy: false,
                        onScroll: onScroll,
                        itemSize: 46,
                        showLoader: true,
                        className: 'customScrollbar',
                    }}
                    emptyMessage={<div className="text-center">No data.</div>}
                    size="small"
                    sortIcon={CustomSortIcon}
                    stripedRows
                    pt={{
                        thead: () => ({
                            className: safeMergeClassName('bg-[#171821] border-none h-10 p-0'),
                        }),
                        column: {
                            headerCell: () => ({
                                className: safeMergeClassName(
                                    'bg-transparent text-nowrap text-[#7A89A2] border-0 text-sm font-normal px-4',
                                ),
                            }),
                            bodyCell: ({ context }: { context: ColumnContext }) => {
                                return {
                                    className: safeMergeClassName(
                                        'text-white text-base md:text-sm   border-0  px-4 h-14',
                                        {
                                            'bg-[#131418] text-center': !holders?.length,
                                            'z-10': context.index === 0,
                                        },
                                    ),
                                };
                            },
                        },
                        bodyRow: ({ context }: any) => ({
                            className: safeMergeClassName('hover:bg-[#131418]  bg-[#1D1F27]', {
                                // 'bg-[#181A20]': context.index % 2 === 0,
                            }),
                        }),
                    }}
                >
                    <Column
                        field="creatorAddress"
                        header="Holders"
                        sortable
                        body={(item: GetHoldersList.HolderItem) => {
                            return (
                                <Link href={paths.profile(memeItem?.memberName)} className="flex-items-center">
                                    <AddressTokenRebuild address={item.creatorAddress} />
                                    {item.creatorAddress === memeItem?.creatorAddress && `(dev)`}
                                </Link>
                            );
                        }}
                    ></Column>
                    <Column
                        field="balance"
                        header="Balance"
                        sortable
                        body={(item: GetHoldersList.HolderItem) => (
                            <div className="flex flex-col gap-1">
                                {/* {+item.balanceRate < 0.01 ? (
                                    <div>&lt; 0.01%</div>
                                ) : (
                                    <div>{Number(item.balanceRate).toFixed(2)}%</div>
                                )} */}
                                {/* <div>{item.balanceAmount}</div> */}
                                <div>{formatNumber(item.balanceAmount)}</div>
                                <div className="text-[#7A89A2]">${item.balance}</div>
                            </div>
                        )}
                    ></Column>
                    <Column
                        field="cost"
                        header="Cost"
                        sortable
                        body={(item: GetHoldersList.HolderItem) => <div>${item.cost}</div>}
                    ></Column>
                    <Column
                        field="sold"
                        header="Sold"
                        sortable
                        body={(item: GetHoldersList.HolderItem) => <div>${item.sold}</div>}
                    ></Column>
                    {/* Profit=sold+balance-cost */}
                    <Column
                        field="profit"
                        header="Profit"
                        sortable
                        body={(item: GetHoldersList.HolderItem) => {
                            return (
                                <div className={`${item.profit < 0 ? 'text-red' : 'text-green'}`}>
                                    {item.profit < 0 ? `-$${Math.abs(item.profit)}` : `+$${item.profit}`}
                                </div>
                            );
                        }}
                    ></Column>
                    {/* Rate=profit/cost*100% */}
                    <Column
                        field="profitRate"
                        header="Rate"
                        sortable
                        align="right"
                        alignHeader="right"
                        body={(item: GetHoldersList.HolderItem) => (
                            <div className={`${item.profitRate < 0 ? 'text-red' : 'text-green'}`}>
                                {item.profitRate < 0
                                    ? Number(item.profitRate).toFixed(2)
                                    : '+' + Number(item.profitRate).toFixed(2)}
                                %
                            </div>
                        )}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Holder;
