'use client';
import React, { useEffect, useState } from 'react';
import { DataTable, DataTableRowClickEvent } from 'primereact/datatable';
import { Column, ColumnContext } from 'primereact/column';
import { formatNumber, safeMergeClassName } from '@/utils/common';
import { useMemoizedFn, useRequest } from 'ahooks';
import { followActionReq } from '@/services/api/home';
import Image from 'next/image';
import starGray from '@/assets/icon/star-gray.png';
import starYellow from '@/assets/icon/star-yellow.png';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import { useToast } from '@/context/ToastContext';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useParams, useRouter } from 'next/navigation';
import CustomSortIcon from '@/components/customSortIcon/CustomSortIcon';
import useWsHub, { ActionType, WatchUpdateData } from '@/hooks/useWsHub';
import FormattedNumber from '@/components/common/FormattedNumber';
import { paths } from '@/utils/paths';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import useWatchListStore from '@/store/memeInfoStore/watchListStore';
import useTrendingStore from '@/store/memeInfoStore/trendingStore';
type Props = {};

export const WatchRenderItem = ({ item }: { item: WatchUpdateData }) => {
    const { updateWatchListFollowStatus, removeFromWatchList } = useWatchListStore();
    const { updateFollowStatus: updateTrendingFollowStatus } = useTrendingStore();
    const { token }: { token: string } = useParams();
    const { updateFollowStatus, memeItem } = useMemeInfoStore();

    useEffect(() => {
        updateWatchListFollowStatus(item.tokenAddress, true);
    }, []);
    const { isConnected } = useGetIsConnected();
    const { showToast } = useToast();
    const { addressTokenStr } = useWalletAddress();
    const toastText = item.followed
        ? { title: 'Unfollow', error: 'Failed to Unfollow', success: 'Unfollow successful' }
        : { title: 'Follow', error: 'Failed to Follow', success: 'Follow successful' };
    const { run } = useRequest(
        () => followActionReq({ creatorAddress: addressTokenStr!, tokenAddress: item.tokenAddress }),
        {
            manual: true,
            onError: () =>
                showToast({
                    severity: 'error',
                    summary: toastText.title,
                    detail: toastText.error,
                    position: 'bottom-right',
                    life: 3000,
                }),
            onSuccess: () => {
                showToast({
                    severity: 'success',
                    summary: toastText.title,
                    detail: toastText.success,
                    position: 'bottom-right',
                    life: 3000,
                });
                if (item.followed) {
                    removeFromWatchList(item.tokenAddress);
                }
                // updateWatchListFollowStatus(item.tokenAddress, !item.followed);
                updateTrendingFollowStatus(item.tokenAddress, !item.followed);
                if (token === item.tokenAddress && memeItem) {
                    updateFollowStatus(!memeItem?.followed);
                }
            },
        },
    );
    const handleFollowAction = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!isConnected) {
            showToast({
                severity: 'error',
                summary: 'Connect Wallet',
                detail: 'Place Connect Wallet',
                position: 'bottom-right',
                life: 3000,
            });
            return;
        }
        try {
            run();
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to Unfollow',
                position: 'bottom-right',
                life: 3000,
            });
        }
    };

    return (
        <div className="w-full py-3">
            <div className="flex w-full flex-shrink-0 items-center gap-2">
                <div onClick={(e) => handleFollowAction(e)} className="flex-shrink-0">
                    <Image src={item.followed ? starYellow : starGray} alt="follow" width={16} height={16} />
                </div>
                <div className="h-12 w-12 flex-shrink-0 rounded-full md:h-8 md:w-8">
                    {item.tokenLogo && (
                        <Image
                            src={item.tokenLogo}
                            width={32}
                            height={32}
                            className="h-full w-full flex-shrink-0 rounded-full bg-white object-cover object-center"
                            alt="star"
                        />
                    )}
                </div>
                <div className="ml-1 flex items-center gap-1 text-left md:flex-col md:items-start md:justify-center">
                    <span className="text-nowrap text-lg text-white md:text-xs">{item.tokenTicker}</span>
                    <span className="text-lg text-grey-blue md:text-xs">${formatNumber(item.vol24)}</span>
                </div>
            </div>
        </div>
    );
};
const WatchDataTable = (props: Props) => {
    const router = useRouter();

    const { addressTokenStr } = useWalletAddress();
    // const [watchList, setWatchList] = useSafeState<WatchUpdateData[]>([]);
    const { updateWatchList, watchList, updateWatchListFollowStatus, clearWatchList } = useWatchListStore();
    const { sendMessage, connectionStatus } = useWsHub<ActionType.watch>({
        onOpen: () => {
            console.log('WebSocket connected watchList');
        },
        onClose: () => {
            console.log('WebSocket disconnected watchList===========================');
        },
        onMessage: (message, event) => {
            const updateData = message.data as WatchUpdateData[];
            updateWatchList(updateData);
            // setWatchList((prevList) => {
            //     const newList = [...prevList];
            //     updateData?.forEach((update) => {
            //         const index = newList.findIndex((item) => item.tokenAddress === update.tokenAddress);
            //         if (index !== -1) {
            //             newList[index] = { ...newList[index], ...update };
            //         } else {
            //             newList.push(update);
            //         }
            //     });
            //     return newList;
            // });
        },
        onError: (event) => {
            console.error('WebSocket error:', event);
        },
    });
    const establishWatchInfoChannel = useMemoizedFn(({ creatorAddress }: { creatorAddress: string }) => {
        sendMessage({
            action: ActionType.watch,
            payload: {
                creatorAddress,
            },
        });
    });

    useEffect(() => {
        if (addressTokenStr && connectionStatus === 'connected' && establishWatchInfoChannel) {
            establishWatchInfoChannel({ creatorAddress: addressTokenStr });
        }
    }, [addressTokenStr, connectionStatus, establishWatchInfoChannel]);

    return (
        <div className="scrollbar-hide h-full">
            <DataTable
                value={watchList}
                emptyMessage={'No data.'}
                scrollable
                size="small"
                onPage={(a) => {
                    // console.log(a);
                }}
                onRowClick={(event: DataTableRowClickEvent) => {
                    const { data } = event;
                    router.push(paths.memeInfo((data as WatchUpdateData).tokenAddress));
                }}
                stripedRows
                sortIcon={CustomSortIcon}
                className="w-full"
                pt={{
                    thead: () => ({
                        className: safeMergeClassName('bg-transparent border-none w-full '),
                    }),
                    tbody: () => ({
                        className: safeMergeClassName('bg-[#131418]'),
                    }),
                    column: {
                        headerCell: () => ({
                            className: safeMergeClassName(
                                'bg-transparent text-nowrap text-[#7A89A2] border-0 md:text-xs font-normal  leading-[14px]  px-6 md:px-4',
                            ),
                        }),
                        bodyCell: ({ context }: { context: ColumnContext }) => {
                            return {
                                className: safeMergeClassName('text-white md:text-xs border-0', {
                                    'bg-[#131418] text-center': !watchList?.length,
                                    'z-10': context.index === 0,
                                }),
                            };
                        },
                    },
                    bodyRow: ({ context }: any) => ({
                        className: safeMergeClassName('hover:bg-[#131418] text-nowrap  bg-[#1D1F27] cursor-pointer', {
                            'bg-[#181A20]': context.index % 2 === 0,
                        }),
                    }),
                }}
            >
                <Column
                    frozen
                    field="Vol"
                    header="Token/Vol"
                    sortable
                    className="pl-6 md:px-4"
                    body={(item) => {
                        // return <RenderItem item={item} tokenAddress={token} refetchWatchList={refetchWatchList} />;
                        return <WatchRenderItem item={item} />;
                    }}
                ></Column>
                <Column
                    field="tokenPrice"
                    header="Price"
                    sortable
                    // body={(item: WatchUpdateData) => <FormattedNumber value={Number(item.tokenPrice)} prefix="$" />}
                    body={(item: WatchUpdateData) => <span>{'$' + Number(item.tokenPrice).toFixed(9)} </span>}
                ></Column>
                <Column
                    field="priceChangePct"
                    header="24h%"
                    sortable
                    alignHeader="right"
                    align="right"
                    className="min-w-20 pr-6 md:px-4"
                    body={(item: WatchUpdateData) => (
                        <span className={`${+item.priceChangePct >= 0 ? 'text-[#0ECB81]' : 'text-[#FF3B54]'}`}>
                            {+item.priceChangePct >= 0 ? '+' + item.priceChangePct + '%' : item.priceChangePct + '%'}
                        </span>
                    )}
                ></Column>
            </DataTable>
        </div>
    );
};

export default WatchDataTable;
