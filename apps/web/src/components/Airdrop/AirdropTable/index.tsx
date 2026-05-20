'use client';
import { AIRDROP_TABS } from '@/constants/airdrop';
import { formatNumber, safeMergeClassName } from '@/utils/common';
import { Column, ColumnContext } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import {
    Paginator,
    PaginatorNextPageLinkOptions,
    PaginatorPageChangeEvent,
    PaginatorPageLinksOptions,
    PaginatorPrevPageLinkOptions,
} from 'primereact/paginator';
import { useState } from 'react';
import bgHot from '@/assets/images/bg-hot.png';
import { useCreation, useMemoizedFn, useRequest } from 'ahooks';
import { getAirdropRank, getTwRank } from '@/services/api/airdrop';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image';

const AirdropTable = () => {
    const [tab, setTab] = useState('totalAirdrop');
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
    const { data, loading: rankLoading } = useRequest(
        () =>
            tab === 'totalAirdrop'
                ? getAirdropRank({ pageSize, page: current })
                : getTwRank({ pageSize, page: current }),
        {
            refreshDeps: [tab, current],
        },
    );
    const { products, total } = useCreation(() => {
        if (!data) {
            return {
                products: [],
                total: 0,
            };
        }
        const newList = (data.item || []).map((item: any, index: number) => {
            return { ...item, ranking: pageSize * (current - 1) + index + 1 };
        });
        return {
            products: newList,
            total: data.total ?? 0,
        };
    }, [data, current]);
    const emptyMessage = useMemoizedFn(() => {
        return <div className="flex h-[10rem] items-center justify-center text-[#7A89A2]">No data.</div>;
    });
    return (
        <div className="mt-[3.125rem]">
            <div className="flex h-[4.5rem] border-[1px] border-b-0 border-solid border-[#2B3139] px-[1.5rem]">
                {AIRDROP_TABS.map((i) => (
                    <div
                        onClick={() => setTab(i.key)}
                        className={`relative mr-[1.5rem] flex h-full cursor-pointer items-center text-[1.25rem] font-bold ${i.key === tab ? 'text-[#fff]' : 'text-[#848E9C]'}`}
                        key={i.key}
                    >
                        <div
                            className={`absolute bottom-0 left-[50%] h-[.125rem] w-[2rem] -translate-x-[50%] rounded-[.1875rem] bg-[#FFD41A] ${i.key === tab ? 'visible' : 'invisible'}`}
                        ></div>
                        {i.title}
                    </div>
                ))}
            </div>
            <div className="border-x-[1px] border-solid border-[#2B3139] px-[1.5rem]">
                {rankLoading ? (
                    <div className="flex min-h-[43.75rem] w-full items-center justify-center">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <DataTable
                        emptyMessage={emptyMessage}
                        loading={rankLoading}
                        stripedRows
                        pt={{
                            column: {
                                headerCell: () => ({
                                    className: safeMergeClassName(
                                        'bg-[#181A20] text-nowrap text-[#848E9C] border-[1px] border-solid border-[#2B3139] text-[.875rem]  h-[3.125rem] font-normal border-x-0',
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
                        value={products}
                        showGridlines
                    >
                        <Column
                            field="ranking"
                            header="Ranking"
                            body={(record) => {
                                return (
                                    <>
                                        {record.ranking <= 5 ? (
                                            <div
                                                style={{ backgroundImage: `url('${bgHot.src}')` }}
                                                className={`h-[1.5rem] w-[1.5rem] bg-contain bg-center bg-no-repeat text-center text-[#000]`}
                                            >
                                                <span className="relative top-[.375rem]">{record.ranking}</span>
                                            </div>
                                        ) : (
                                            <div className="h-[1.5rem] w-[1.5rem] text-center">{record.ranking}</div>
                                        )}
                                    </>
                                );
                            }}
                        ></Column>
                        {tab === 'totalAirdrop' ? (
                            <Column
                                field="address"
                                header="Address"
                                body={(record) => {
                                    return <>{record.creatorAddress}</>;
                                }}
                            ></Column>
                        ) : (
                            <Column
                                field="xAccount"
                                header="X Account"
                                body={(record) => {
                                    return (
                                        <div className="flex items-center">
                                            {record.twAvatarUrl?.startsWith('http') ? (
                                                <Image
                                                    alt={record.memberName}
                                                    src={record.twAvatarUrl}
                                                    width={32}
                                                    height={32}
                                                    className="mr-[0.5rem] h-[2rem] w-[2rem] rounded-full"
                                                ></Image>
                                            ) : (
                                                ''
                                            )}
                                            {record.memberName}
                                        </div>
                                    );
                                }}
                            ></Column>
                        )}

                        <Column
                            field="airdrop"
                            header="Airdrop"
                            body={(record) => {
                                return <>{(tab === 'totalAirdrop' ? record.total : record.total).toLocaleString()}</>;
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
        </div>
    );
};
export default AirdropTable;
