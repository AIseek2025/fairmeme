import { MY_AIRDROP_TABS } from '@/constants/airdrop';
import { useEffect, useState } from 'react';
import { AIRDROP_TABS } from '@/constants/airdrop';
import { formatNumber, formatTimestamp, safeMergeClassName } from '@/utils/common';
import { Column, ColumnContext } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useCreation, useMemoizedFn, useRequest } from 'ahooks';
import { inviteLogs } from '@/services/api/airdrop';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
    Paginator,
    PaginatorNextPageLinkOptions,
    PaginatorPageChangeEvent,
    PaginatorPageLinksOptions,
    PaginatorPrevPageLinkOptions,
} from 'primereact/paginator';
import dayjs from 'dayjs';

const InvitationRewards = () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const paginatorTemplate = {
        PrevPageLink: (options: PaginatorPrevPageLinkOptions) => (
            <button
                type="button"
                className={safeMergeClassName(
                    `p-paginator-prev p-paginator-element p-link mr-[12px] border-[1px] border-solid border-[#34363D] bg-[#24262E] text-white`,
                )}
                onClick={options.onClick}
                aria-label="Previous Page"
            >
                <span className="pi pi-angle-left"></span>
            </button>
        ),
        PageLinks: (options: PaginatorPageLinksOptions) => (
            <button
                type="button"
                className={safeMergeClassName(
                    `p-paginator-page p-paginator-element p-link mr-[12px] border-[1px] border-solid border-[#34363D] bg-[#24262E] text-[#fff]`,
                    {
                        'bg-[#FFD41A] text-[#333]': options.page === current - 1,
                    },
                )}
                onClick={options.onClick}
            >
                {options.page + 1}
            </button>
        ),
        NextPageLink: (options: PaginatorNextPageLinkOptions) => (
            <button
                type="button"
                className={safeMergeClassName(
                    `p-paginator-next p-paginator-element p-link border-[1px] border-solid border-[#34363D] bg-[#24262E] text-white`,
                )}
                onClick={options.onClick}
                aria-label="Next Page"
            >
                <span className="pi pi-angle-right"></span>
            </button>
        ),
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setCurrent(event.page + 1);
    };
    const { addressTokenStr } = useWalletAddress();
    const { data, loading } = useRequest(
        () => inviteLogs({ pageSize, page: current, creatorAddress: addressTokenStr }),
        {
            ready: !!addressTokenStr,
            refreshDeps: [current],
        },
    );
    const { list, total } = useCreation(() => {
        // console.log('data?.item', data?.item);
        return {
            list: data?.item || [],
            total: data?.total || 0,
        };
    }, [data]);
    const emptyMessage = useMemoizedFn(() => {
        return <div className="flex h-[10rem] items-center justify-center text-[#7A89A2]">No data.</div>;
    });
    return (
        <>
            <div className="border-x-[1px] border-solid border-[#2B3139] px-[1.5rem]">
                {loading ? (
                    <div className="flex h-[15.5rem] w-full items-center justify-center">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <DataTable
                        emptyMessage={emptyMessage}
                        stripedRows
                        pt={{
                            column: {
                                headerCell: () => ({
                                    className: safeMergeClassName(
                                        'bg-[#181A20] text-nowrap text-[#848E9C] border-[1px] border-solid border-[#2B3139] text-[.875rem] border-x-0  h-[3.125rem] font-normal',
                                    ),
                                }),
                                bodyCell: () => {
                                    return {
                                        className: safeMergeClassName(
                                            'bg-[#181A20] text-[#fff] text-[1.25rem] border-[1px] border-solid border-[#2B3139] text-[.875rem] h-[4rem] border-x-0',
                                        ),
                                    };
                                },
                            },
                            bodyRow: () => ({
                                className: safeMergeClassName('bg-[#181A20]'),
                            }),
                        }}
                        value={list}
                        showGridlines
                    >
                        <Column
                            className=""
                            field="time"
                            header="Time"
                            body={(record) => {
                                return <>{dayjs.unix(record.createdTime).format('YYYY-MM-DD HH:mm')}</>;
                            }}
                        ></Column>
                        <Column
                            field="invitee"
                            header="Invitee"
                            body={(record) => {
                                return <>{record.invitedAddress}</>;
                            }}
                        ></Column>
                        <Column
                            field="invitationRewards"
                            header="Invitation Rewards"
                            body={(record) => {
                                return <>{formatNumber(record.total)}</>;
                            }}
                        ></Column>
                    </DataTable>
                )}
            </div>
            {total ? (
                <Paginator
                    pt={{
                        root: {
                            className: safeMergeClassName('bg-transparent mt-[48px] mb-[64px]'),
                        },
                    }}
                    first={(current - 1) * pageSize}
                    rows={pageSize}
                    template={paginatorTemplate}
                    totalRecords={total}
                    onPageChange={onPageChange}
                />
            ) : (
                ''
            )}
        </>
    );
};
export default InvitationRewards;
