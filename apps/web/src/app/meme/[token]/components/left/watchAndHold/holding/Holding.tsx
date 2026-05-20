import CustomSortIcon from '@/components/customSortIcon/CustomSortIcon';
import { formatNumber, safeMergeClassName } from '@/utils/common';
import { Column, ColumnContext } from 'primereact/column';
import { DataTable, DataTableRowClickEvent } from 'primereact/datatable';
import React, { useEffect } from 'react';

import useWsHub, { ActionType, HoldUpdateData } from '@/hooks/useWsHub';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useMemoizedFn, useRequest, useSafeState } from 'ahooks';
import Image from 'next/image';
import starGray from '@/assets/icon/star-gray.png';
import starYellow from '@/assets/icon/star-yellow.png';
import { useParams, useRouter } from 'next/navigation';
import { paths } from '@/utils/paths';
import FormattedNumber from '@/components/common/FormattedNumber';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import { useToast } from '@/context/ToastContext';
import { followActionReq } from '@/services/api/home';
import useTrendingStore from '@/store/memeInfoStore/trendingStore';

type Props = {};
export const HoldRenderItem = ({ item }: { item: HoldUpdateData }) => {
    const { token }: { token: string } = useParams();
    const { updateFollowStatus, memeItem } = useMemeInfoStore();
    const { updateFollowStatus: updateTrendingFollowStatus } = useTrendingStore();
    const [follow, setFollow] = useSafeState(item.followed);
    const { isConnected } = useGetIsConnected();
    const { showToast } = useToast();
    useEffect(() => {
        setFollow(item.followed);
    }, [item.followed, item]);
    const { addressTokenStr } = useWalletAddress();
    const toastText = follow
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
                    {item.tokenAddress === memeItem?.tokenAddress ? (
                        <Image
                            src={memeItem.followed ? starYellow : starGray}
                            alt="follow"
                            width={16}
                            height={16}
                            className="mr-[12px]"
                        />
                    ) : (
                        <Image
                            src={follow ? starYellow : starGray}
                            alt="follow"
                            width={16}
                            height={16}
                            className="mr-[12px]"
                        />
                    )}
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
                    <span className="text-lg text-grey-blue md:text-xs">
                        {formatNumber(item.tokenBalance)}(${formatNumber(item.tokenUsdPrice)})
                    </span>
                </div>
            </div>
        </div>
    );
};
const Holding = (props: Props) => {
    const router = useRouter();
    const { addressTokenStr } = useWalletAddress();
    const [holdList, setHoldList] = useSafeState<HoldUpdateData[]>([]);
    const { sendMessage, latestMessage, connectionStatus, connect } = useWsHub<ActionType.hold>({
        onOpen: () => {
            console.log('WebSocket connected Holding');
        },
        onClose: () => {
            console.log('WebSocket disconnected Holding');
        },
        onMessage: (message, event) => {
            const updateData = message.data as HoldUpdateData[];
            setHoldList((prevList) => {
                const newList = [...prevList];
                updateData?.forEach((update) => {
                    const index = newList.findIndex((item) => item.tokenAddress === update.tokenAddress);
                    if (index !== -1) {
                        newList[index] = { ...newList[index], ...update };
                    } else {
                        newList.push(update);
                    }
                });
                return newList;
            });
        },
        onError: (event) => {
            console.error('WebSocket error Holding:', event);
        },
    });
    const establishWatchInfoChannel = useMemoizedFn(({ creatorAddress }: { creatorAddress: string }) => {
        sendMessage({
            action: ActionType.hold,
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
        <div>
            <DataTable
                value={holdList}
                emptyMessage={'No data.'}
                scrollable
                size="small"
                onPage={(a) => {
                    // console.log(a);
                }}
                onRowClick={(event: DataTableRowClickEvent) => {
                    const { data } = event;
                    router.push(paths.memeInfo((data as HoldUpdateData).tokenAddress));
                }}
                stripedRows
                sortIcon={CustomSortIcon}
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
                                'bg-transparent text-nowrap text-[#7A89A2] border-0 text-[12px] font-normal  px-6 md:px-4 leading-[14px]',
                            ),
                        }),
                        bodyCell: ({ context }: { context: ColumnContext }) => {
                            return {
                                className: safeMergeClassName('text-white text-[12px] border-0 ', {
                                    'bg-[#131418] text-center': !holdList?.length,
                                    'z-10': context.index === 0,
                                }),
                            };
                        },
                    },
                    bodyRow: ({ context }: any) => ({
                        className: safeMergeClassName('hover:bg-[#131418]  bg-[#1D1F27]  cursor-pointer', {
                            'bg-[#181A20]': context.index % 2 === 0,
                        }),
                    }),
                }}
            >
                <Column
                    field="tokenBalance"
                    header="Token/Bal"
                    sortable
                    className="flex-1 pl-6 md:px-4"
                    body={(item) => {
                        // return <RenderItem item={item} tokenAddress={token} refetchWatchList={refetchWatchList} />;
                        return <HoldRenderItem item={item} />;
                    }}
                ></Column>
                <Column
                    field="tokenPrice"
                    header="Price"
                    sortable
                    className="w-10"
                    body={(item: HoldUpdateData) => <span>{'$' + Number(item.tokenPrice).toFixed(9)} </span>}
                    // body={(item: HoldUpdateData) => <FormattedNumber value={Number(item.tokenPrice)} prefix="$" />}
                ></Column>
                <Column
                    field="priceChangePct"
                    header="24h%"
                    sortable
                    className="pr-6 md:px-4"
                    alignHeader="right"
                    align="right"
                    body={(item: HoldUpdateData) => (
                        <span className={`${+item.priceChangePct >= 0 ? 'text-[#0ECB81]' : 'text-[#FF3B54]'}`}>
                            {+item.priceChangePct >= 0 ? '+' + item.priceChangePct + '%' : item.priceChangePct + '%'}
                        </span>
                    )}
                ></Column>
            </DataTable>
        </div>
    );
};

export default Holding;
