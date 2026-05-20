'use client';
import { useRequest, useMemoizedFn, useDebounceEffect } from 'ahooks';
import { safeMergeClassName } from '@/utils/common';

import React, { forwardRef, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { getTokenList, followActionReq } from '@/services/api/home';
import Filter from './Filter';
import Search from './Search';
import TableList from './TableList';
import CardList from './CardList';
import useMediaQuery from '@/hooks/useMediaQuery';

import {
    Paginator,
    PaginatorPageChangeEvent,
    PaginatorNextPageLinkOptions,
    PaginatorPageLinksOptions,
    PaginatorPrevPageLinkOptions,
} from 'primereact/paginator';
import { ChainsType } from '@/types/common';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { CHAIN_LIST } from '@/constants';
import useStore from '@/store/zustand';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useToast } from '@/context/ToastContext';
import useGetIsConnected from '@/hooks/useGetIsConnected';

const HomeContent = forwardRef<HomeContentMethods>(() => {
    const { showToast } = useToast();
    const { connect } = useConnect();
    const currentChain = useStore((state) => state.currentChain);
    const [chainName, setChainName] = useState<ChainsType | ''>('');

    const { addressTokenStr } = useWalletAddress();

    const [listType, setListType] = useState('terminal');
    const [tableShow, setTableShow] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [switchCard, setSwitchCard] = useState(false);
    const router = useRouter();
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const isMobile = useMediaQuery('(max-width: 1280px)');
    const navSearch = useStore((state) => state.navSearch);
    const setSearchVisibility = useStore((state) => state.setSearchVisibility);
    const setSearchKeyword = useStore((state) => state.setSearchKeyword);
    const { isConnected } = useGetIsConnected();
    useEffect(() => {
        if (!isMobile) {
            setSearchVisibility(false);
            setSearchKeyword('');
        }
    }, [isMobile]);

    const {
        data: terminal,
        run: getList,
        loading,
    } = useRequest(getTokenList, {
        pollingInterval: 10000,
        defaultParams: [
            {
                columns: {
                    keyword,
                    chainName,
                    type: listType === 'terminal' ? 'home' : 'watch',
                    address: addressTokenStr,
                },
                limit: pageSize,
                page: current,
            },
        ],
    });
    const [filteredData, setFilteredData] = useState<FairMemeHome.Item[]>([]);
    useEffect(() => {
        setFilteredData(terminal?.items ?? []);
    }, [terminal?.items]);
    const searchClick = (params?: Record<string, any>) => {
        getList({
            columns: { keyword, type: listType === 'terminal' ? 'home' : 'watch', chainName, address: addressTokenStr },
            limit: pageSize,
            page: current,
            ...params,
        });
    };
    const followedHandle = async (tokenAddress: string) => {
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
        await followActionReq({ tokenAddress, creatorAddress: addressTokenStr! });
        searchClick();
    };
    const toMemeIndex = useMemoizedFn((token: string) => {
        router.push(`/meme/${token}`);
    });

    useDebounceEffect(
        () => {
            searchClick({
                columns: {
                    keyword: navSearch.isShow ? navSearch.keyword : keyword,
                    type: listType === 'terminal' ? 'home' : 'watch',
                    chainName,
                    address: addressTokenStr,
                },
            });
        },
        [chainName, current, keyword, listType, addressTokenStr, navSearch],
        {
            wait: 500,
        },
    );

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setCurrent(event.page + 1);
    };

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

    return (
        <div className="z-9 relative lg:-top-[44px]">
            <div className="mx-auto w-[34.875rem] md:w-[34.875rem] lg:w-[996px] xl:w-[1340px] 2xl:w-[1680px]">
                <div className="flex items-start justify-between lg:bg-black-opcity lg:p-[24px]">
                    <Filter
                        chainName={chainName}
                        setChainName={setChainName}
                        listType={listType}
                        setListType={setListType}
                        tableShow={tableShow}
                        setTableShow={setTableShow}
                        switchCard={switchCard}
                        setSwitchCard={setSwitchCard}
                    />
                    <Search keyword={keyword} setKeyword={setKeyword} />
                </div>
                <TableList
                    followedHandle={followedHandle}
                    filteredData={filteredData}
                    setFilteredData={setFilteredData}
                    tableShow={tableShow}
                    toMemeIndex={toMemeIndex}
                />
                {!tableShow && (
                    <CardList
                        followedHandle={followedHandle}
                        switchCard={switchCard}
                        toMemeIndex={toMemeIndex}
                        list={filteredData}
                    />
                )}
                {terminal?.total ? (
                    <Paginator
                        pt={{
                            root: {
                                className: safeMergeClassName('bg-transparent mt-[48px] mb-[64px]'),
                            },
                        }}
                        first={(current - 1) * pageSize}
                        rows={pageSize}
                        template={paginatorTemplate}
                        totalRecords={terminal?.total}
                        onPageChange={onPageChange}
                    />
                ) : (
                    ''
                )}
            </div>
            <div
                className={safeMergeClassName(
                    'border-t-[1px] border-solid border-[#000] pb-[32px] pt-[32px] text-center text-[14px] text-[#666] lg:pb-0',
                )}
            >
                © 2024 FairMeme. All rights reserved
            </div>
        </div>
    );
});
export default HomeContent;
