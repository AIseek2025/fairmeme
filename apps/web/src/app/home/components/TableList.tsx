import { DataTable } from 'primereact/datatable';
import { Column, ColumnContext } from 'primereact/column';
import Image from 'next/image';
import starGray from '@/assets/icon/star-gray.png';
import starYellow from '@/assets/icon/star-yellow.png';
import farcaster from '@/assets/icon/farcaster.svg';
import farcasterYellow from '@/assets/icon/farcaster-yellow.svg';
import { CHAIN_ICON_MAP } from '@/constants';
import { formatNumber, formatTimestamp, safeMergeClassName } from '@/utils/common';
import { CHANGE_FILTER, TURNOVER_FILTER, TXS_FILTER, VOL_FILTER } from '@/constants/home';
import { useEffect, useMemo, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressBar } from 'primereact/progressbar';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useCreation, useHover, useMemoizedFn } from 'ahooks';

interface Props {
    tableShow: boolean;
    toMemeIndex: (address: string) => void;
    filteredData: FairMemeHome.Item[];
    setFilteredData: (list: FairMemeHome.Item[]) => void;
    followedHandle: (tokenAddress: string) => void;
}

interface FilterOption {
    label: string;
    value: string;
}

type Filters = Record<string, FilterOption>;
const TableList = ({ toMemeIndex, tableShow, filteredData, setFilteredData, followedHandle }: Props) => {
    const ref = useRef(null);
    const isHovering = useHover(ref);
    const isMobile = useMediaQuery('(max-width: 750px)');
    const [sortField, setSortField] = useState<keyof FairMemeHome.Item | ''>('');
    const [sortOrder, setSortOrder] = useState(0);
    const [filters, setFilters] = useState<Filters>({
        vol: {
            label: 'Vol(24h)',
            value: 'vol24',
        },
        h: {
            label: '24h %',
            value: 'change24',
        },
        turnover: {
            label: 'Turnover(24h)',
            value: 'turnover24',
        },
        txs: {
            label: 'TXs(24h)',
            value: 'txs24',
        },
    });
    const [currentFilter, setCurrentFilter] = useState<string>('');
    const [currentFilterList, setCurrentFilterList] = useState<any[]>([]);
    const op = useRef<OverlayPanel>(null);

    const sortedData = useCreation(() => {
        if (sortField && sortOrder !== 0) {
            return [...filteredData].sort((a, b) => {
                const left = Number(a[sortField]);
                const right = Number(b[sortField]);
                return sortOrder * (left < right ? -1 : left > right ? 1 : 0);
            });
        }
        return filteredData;
    }, [filteredData, sortField, sortOrder]);

    useEffect(() => {
        setFilteredData(sortedData);
    }, [sortedData, setFilteredData]);

    const handleSortChange = (field: any) => {
        let order = 0;
        if (sortField === field) {
            order = sortOrder >= 1 ? -1 : sortOrder + 1;
        } else {
            order = 1;
        }
        setSortField(field);
        setSortOrder(order);
    };

    const handleFilterChange = (field: string, selectedOption: { label: string; value: string }) => {
        op.current?.hide();
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: selectedOption,
        }));
        setSortField(selectedOption.value as keyof FairMemeHome.Item);
        setSortOrder(0);
    };
    const renderHeader = (title: string, field: string, filterList?: any[]) => {
        const newField = filters[field] ? filters[field].value : field;
        return (
            <div
                className="flex h-[26px] cursor-pointer items-center"
                onClick={(e) => {
                    if (filterList) {
                        e.preventDefault();
                        setCurrentFilterList(filterList);
                        setCurrentFilter(field);
                        op?.current?.toggle(e);
                    }
                }}
            >
                <div
                    className="flex h-full items-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSortChange(newField);
                    }}
                >
                    <div>{title}</div>
                    <div className="ml-[8px] flex flex-col items-center justify-center">
                        <i
                            className={safeMergeClassName('pi-sort-up-fill pi text-[9px] text-[#7A89A2]', {
                                'text-[#fff]': sortField === newField && sortOrder === 1,
                            })}
                        ></i>
                        <i
                            className={safeMergeClassName('pi-sort-down-fill pi text-[9px] text-[#7A89A2]', {
                                'text-[#fff]': sortField === newField && sortOrder === -1,
                            })}
                        ></i>
                    </div>
                </div>

                {filterList && (
                    <>
                        <div className="ml-[8px] rounded-[6px] px-[3px] py-[6px] text-[#7A89A2] transition duration-300 ease-in-out hover:bg-[#6b7280] hover:text-[#fff]">
                            <i className={safeMergeClassName('pi pi-filter-fill text-[12px]')}></i>
                        </div>
                    </>
                )}
            </div>
        );
    };
    const handleClick = useMemoizedFn((event: any) => {
        event.stopPropagation();
    });

    const emptyMessage = useMemoizedFn(() => {
        return <div className="flex h-[10rem] items-center justify-center text-[#7A89A2]">No data.</div>;
    });

    return (
        <div className="mt-[1.5rem] lg:mt-0">
            <DataTable
                emptyMessage={emptyMessage}
                scrollable
                size="small"
                stripedRows
                pt={{
                    wrapper: { className: 'homeCustomScrollbar' },
                    thead: () => ({
                        className: safeMergeClassName(
                            'bg-[#131418] border-t-[1px] border-b-[1px] border-solid border-[#000]',
                        ),
                    }),
                    tbody: () => ({
                        className: safeMergeClassName('bg-[#131418] ', { hidden: !tableShow }),
                    }),
                    column: {
                        headerCell: () => ({
                            className: safeMergeClassName(
                                'bg-[#131418] text-nowrap text-[#7A89A2] border-0 text-[12px] font-normal leading-[14px]',
                            ),
                        }),
                        bodyCell: ({ context }: { context: ColumnContext }) => {
                            return {
                                className: safeMergeClassName('text-[#7A89A2] text-[12px] border-0 font-normal', {
                                    'bg-[#131418] text-center': !filteredData.length,
                                    'z-10': context.index === 0,
                                }),
                            };
                        },
                    },
                    bodyRow: ({ context }: any) => ({
                        className: safeMergeClassName('hover:bg-[#131418]  bg-[#1D1F27]', {
                            'bg-[#181A20]': context.index % 2 === 0,
                        }),
                    }),
                }}
                value={sortedData}
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column
                    frozen={isMobile ? false : true}
                    field="tokenName"
                    header="Token"
                    body={(record) => {
                        return (
                            <div className="mr-[1rem] flex min-w-[330px] cursor-pointer items-center">
                                <Image
                                    src={record.followed ? starYellow : starGray}
                                    alt=""
                                    width={16}
                                    height={16}
                                    onClick={() => followedHandle(record.tokenAddress)}
                                    className="mr-[12px]"
                                />
                                <div
                                    onClick={() => toMemeIndex(record.tokenAddress)}
                                    className="flex flex-1 items-center"
                                >
                                    <div className="relative mr-[.75rem] h-[44px] w-[44px] flex-shrink-0 overflow-hidden rounded-[3px]">
                                        <Image src={record.tokenLogo} alt="" layout="fill" objectFit="contain" />
                                    </div>
                                    <div className="ml-2 flex h-[44px] flex-1 grow flex-col justify-between py-[4px]">
                                        <div className="flex text-[14px] leading-[16px]">
                                            <p className="text-[#fff] hover:text-yellow">{record.tokenName}</p>
                                            <p className="ml-[2px] text-[#7A89A2]">({record.tokenTicker})</p>
                                        </div>
                                        <div className="flex">
                                            {record.webSite && (
                                                <i
                                                    className="pi pi-globe mr-[4px] cursor-pointer text-[16px] hover:text-[#FFD41A]"
                                                    onClick={(e) => {
                                                        handleClick(e);
                                                        window.open(record.webSite);
                                                    }}
                                                ></i>
                                            )}

                                            {record.telegramUrl && (
                                                <i
                                                    className="pi pi-telegram mr-[4px] cursor-pointer text-[16px] hover:text-[#FFD41A]"
                                                    onClick={(e) => {
                                                        handleClick(e);
                                                        window.open(record.telegramUrl);
                                                    }}
                                                ></i>
                                            )}
                                            {record.twitterUrl && (
                                                <i
                                                    className="pi pi-twitter mr-[4px] cursor-pointer text-[16px] hover:text-[#FFD41A]"
                                                    onClick={(e) => {
                                                        handleClick(e);
                                                        window.open(record.twitterUrl);
                                                    }}
                                                ></i>
                                            )}
                                            {record.farcaster && (
                                                <Image
                                                    ref={ref}
                                                    src={isHovering ? farcasterYellow : farcaster}
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                    className="cursor-pointer"
                                                    onClick={(e) => {
                                                        handleClick(e);
                                                        window.open(record.farcaster);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-[.75rem] h-[20px] w-[20px]">
                                        <Image
                                            src={CHAIN_ICON_MAP[record.chainID]?.icon ?? ''}
                                            width={20}
                                            height={20}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                ></Column>
                <Column
                    field="tokenPrice"
                    header={renderHeader('Price', 'tokenPrice')}
                    body={(record) => {
                        return <>${formatNumber(record.tokenPrice, 9)}</>;
                    }}
                ></Column>
                <Column
                    field="created"
                    header={renderHeader('Created', 'created')}
                    body={(record) => {
                        return <>{formatTimestamp(record.created)}</>;
                    }}
                ></Column>
                <Column
                    field="marketCap"
                    header={renderHeader('Mar.Cap', 'marketCap')}
                    body={(record) => {
                        return <>${formatNumber(record.marketCap)}</>;
                    }}
                ></Column>
                <Column
                    field="fdmc"
                    header={renderHeader('FDMC', 'fdmc')}
                    body={(record) => {
                        return <>${formatNumber(record.fdmc)}</>;
                    }}
                ></Column>
                <Column
                    field="liquidity"
                    header={renderHeader('Liquidity', 'liquidity')}
                    body={(record) => {
                        return <>${formatNumber(record.liquidity)}</>;
                    }}
                ></Column>
                <Column
                    field={filters.vol.label}
                    header={renderHeader(filters.vol.label, 'vol', VOL_FILTER)}
                    body={(record) => {
                        return <>${formatNumber(record[filters.vol.value])}</>;
                    }}
                ></Column>
                <Column
                    field={filters.h.label}
                    header={renderHeader(filters.h.label, 'h', CHANGE_FILTER)}
                    body={(record) => {
                        return (
                            <div className={`${record[filters.h.value] >= 0 ? 'text-[#1BAB75]' : 'text-[#FF3B54]'}`}>
                                {formatNumber(record[filters.h.value])}%
                            </div>
                        );
                    }}
                ></Column>
                <Column
                    field={filters.turnover.label}
                    header={renderHeader(filters.turnover.label, 'turnover', TURNOVER_FILTER)}
                    body={(record) => {
                        return <>{record[filters.turnover.value]}%</>;
                    }}
                ></Column>
                <Column
                    field={filters.txs.label}
                    header={renderHeader(filters.txs.label, 'txs', TXS_FILTER)}
                    body={(record) => {
                        return <>{formatNumber(record[filters.txs.value], 0)}</>;
                    }}
                ></Column>

                <Column
                    field="holders"
                    header={renderHeader('Holders', 'holders')}
                    body={(record) => {
                        return <>{formatNumber(record.holders, 0)}</>;
                    }}
                ></Column>
                <Column
                    field="watchers"
                    header={renderHeader('Watchers', 'watchers')}
                    body={(record) => {
                        return <>{formatNumber(record.watchers, 0)}</>;
                    }}
                ></Column>
                <Column
                    field="viewCount"
                    header={renderHeader('Views(24h)', 'viewCount')}
                    body={(record) => {
                        return <>{formatNumber(record.viewCount, 0)}</>;
                    }}
                ></Column>
                <Column
                    field="aucT"
                    header={renderHeader('Auc.T', 'aucT')}
                    body={(record) => {
                        return <>{formatTimestamp(record.aucT)}</>;
                    }}
                ></Column>
                <Column
                    field="aucP"
                    header={renderHeader('Auc.P', 'aucP')}
                    body={(record) => {
                        return (
                            <div className="flex flex-col items-end leading-[14px]">
                                <div className="mb-[4px] mt-[3px] text-xs text-[#848E9C]">{record.aucP}%</div>
                                <ProgressBar
                                    color="#FFD41A"
                                    showValue={false}
                                    pt={{
                                        root: {
                                            className: safeMergeClassName('bg-[#848E9C] h-[6px] w-[60px]'),
                                        },
                                    }}
                                    value={Number(record.aucP)}
                                />
                            </div>
                        );
                    }}
                ></Column>
            </DataTable>
            <OverlayPanel
                pt={{
                    root: {
                        className: safeMergeClassName(
                            'bg-[#1E2028] border-[1px] border-solid border-[#34363D] text-[#7A89A2] after:border-0 before:border-0',
                        ),
                    },
                }}
                onClick={(e) => e.stopPropagation()}
                ref={op}
            >
                {currentFilterList.map((filter: any) => {
                    return (
                        <div key={filter.value} className="align-items-center flex cursor-pointer">
                            <div
                                onClick={() => handleFilterChange(currentFilter, filter)}
                                className={safeMergeClassName('hover:text-[#fff]', {
                                    'text-[#fff]': filter.value === currentFilter,
                                })}
                            >
                                {filter.label}
                            </div>
                        </div>
                    );
                })}
            </OverlayPanel>
        </div>
    );
};
export default TableList;
