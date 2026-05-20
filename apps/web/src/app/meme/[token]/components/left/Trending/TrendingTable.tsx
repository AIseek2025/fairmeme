import CustomSortIcon from '@/components/customSortIcon/CustomSortIcon';
import { formatNumber, safeMergeClassName } from '@/utils/common';
import { Column, ColumnContext, ColumnSortEvent } from 'primereact/column';
import { DataTable, DataTableRowClickEvent, DataTableSortEvent } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import FormattedNumber from '@/components/common/FormattedNumber';
import { followActionReq } from '@/services/api/home';
import { useRequest } from 'ahooks';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useToast } from '@/context/ToastContext';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import Image from 'next/image';
import starGray from '@/assets/icon/star-gray.png';
import starYellow from '@/assets/icon/star-yellow.png';
import { GetTrendingList } from '@/types/meme';
import { paths } from '@/utils/paths';
import { useParams, useRouter } from 'next/navigation';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import useWatchListStore from '@/store/memeInfoStore/watchListStore';

const TrendingRenderItem = ({ item }: { item: GetTrendingList.TrendItem }) => {
    const { token }: { token: string } = useParams();
    const [follow, setFollow] = useState<boolean>(item.followed);
    const { updateWatchListFollowStatus, removeFromWatchList } = useWatchListStore();
    useEffect(() => {
        setFollow(item.followed);
    }, [item.followed, item]);
    const { isConnected } = useGetIsConnected();
    const { showToast } = useToast();
    const { addressTokenStr } = useWalletAddress();
    const { updateFollowStatus, memeItem } = useMemeInfoStore();
    const toastText = follow
        ? { title: 'Unfollow', error: 'Failed to UnFollow', success: 'Unfollow successful' }
        : { title: 'Follow', error: 'Failed to follow', success: 'Follow successful' };
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
                setFollow(!follow);
                // updateWatchListFollowStatus(item.tokenAddress, !follow);
                if (item.followed) {
                    removeFromWatchList(item.tokenAddress);
                }
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
        <div className="flex w-full items-center justify-between py-3 text-xs">
            <div className="flex w-full flex-shrink-0 items-center gap-1">
                <div onClick={(e) => handleFollowAction(e)}>
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
                <div className="h-12 w-12 rounded-full md:h-8 md:w-8">
                    {item.tokenLogo && (
                        <Image
                            src={item.tokenLogo}
                            width={32}
                            height={32}
                            className="h-full w-full rounded-full bg-white object-cover object-center"
                            alt="tokenLogo"
                        />
                    )}
                </div>
                <div className="ml-1 flex flex-1 items-center gap-1 text-left md:flex-col md:items-start md:justify-center">
                    <span className="text-nowrap text-lg text-white md:text-xs">{item.tokenTicker}</span>
                    <span className="text-lg text-grey-blue md:text-xs">${formatNumber(item.tokenVolume)}</span>
                </div>
            </div>
        </div>
    );
};
type Props = {
    data: GetTrendingList.TrendItem[];
};
const TrendingTable = ({ data: trendingListData }: Props) => {
    const router = useRouter();
    return (
        <DataTable
            value={trendingListData}
            emptyMessage={'No data.'}
            size="small"
            scrollable
            stripedRows
            sortIcon={CustomSortIcon}
            onRowClick={(event: DataTableRowClickEvent) => {
                const { data } = event;
                router.push(paths.memeInfo((data as GetTrendingList.TrendItem).tokenAddress));
            }}
            className="w-full"
            pt={{
                thead: () => ({
                    className: safeMergeClassName('bg-transparent border-none w-full'),
                }),
                tbody: () => ({
                    className: safeMergeClassName('bg-[#131418]'),
                }),
                column: {
                    headerCell: () => ({
                        className: safeMergeClassName(
                            'bg-transparent text-nowrap text-[#7A89A2] border-0 text-[12px] font-normal leading-[14px] px-6 md:px-4',
                        ),
                    }),
                    bodyCell: ({ context }: { context: ColumnContext }) => {
                        return {
                            className: safeMergeClassName('text-[#7A89A2] text-[12px] border-0  text-white ', {
                                'bg-[#131418] text-center': !trendingListData?.length,
                                'z-10': context.index === 0,
                            }),
                        };
                    },
                },
                bodyRow: ({ context }: any) => ({
                    className: safeMergeClassName('hover:bg-[#131418]  bg-[#1D1F27] cursor-pointer', {
                        'bg-[#181A20]': context.index % 2 === 0,
                    }),
                }),
            }}
        >
            <Column
                field="tokenVolume"
                header="Token/Vol"
                className="pl-6 md:px-4"
                sortable
                frozen
                body={(item) => {
                    return <TrendingRenderItem item={item} />;
                }}
            ></Column>
            <Column
                field="tokenPrice"
                header="Price"
                sortable
                // body={(item: GetTrendingList.TrendItem) => (
                //     <FormattedNumber value={Number(item.tokenPrice)} prefix="$" />
                // )}
                body={(item: GetTrendingList.TrendItem) => <span>{'$' + Number(item.tokenPrice).toFixed(9)} </span>}
            ></Column>
            <Column
                field="tokenChange"
                header="%"
                sortable
                alignHeader="right"
                align="right"
                className="pr-6 md:px-4"
                body={(item: GetTrendingList.TrendItem) => (
                    <span className={`${+item.tokenChange >= 0 ? 'text-[#0ECB81]' : 'text-[#FF3B54]'}`}>
                        {+item.tokenChange >= 0 ? '+' + item.tokenChange + '%' : item.tokenChange + '%'}
                    </span>
                )}
            ></Column>
        </DataTable>
    );
};

export default TrendingTable;
