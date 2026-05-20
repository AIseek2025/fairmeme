'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { CHAIN_ICON_MAP } from '@/constants';
import useWalletAddress from '@/hooks/useWalletAddress';
import { getTokenList } from '@/services/api/home';
import useStore from '@/store/zustand';
import { safeMergeClassName } from '@/utils/common';
import { useDebounce, useSafeState } from 'ahooks';
import { InputText } from 'primereact/inputtext';
import SearchItem from './SearchItem';
import { usePathname } from 'next/navigation';

const NavSearch = () => {
    const pathname = usePathname();
    const currentChain = useStore((store) => store.currentChain);
    const { addressTokenStr } = useWalletAddress();
    const [keyword, setKeyword] = useSafeState('');
    const debouncedKeyword = useDebounce(keyword, { wait: 500 });
    const ref = useRef<HTMLDivElement>(null);
    const [data, setData] = useSafeState<{ list: any[]; nextPage?: number }>({ list: [], nextPage: 1 });
    const [loading, setLoading] = useSafeState(false);
    const [loadingMore, setLoadingMore] = useSafeState(false);

    const fetchData = useCallback(
        async (page: number) => {
            if (!debouncedKeyword) return { list: [], nextPage: undefined };
            const result = await getTokenList({
                columns: {
                    keyword: debouncedKeyword,
                    chainName: CHAIN_ICON_MAP[currentChain].key,
                    type: 'home',
                    address: addressTokenStr,
                },
                limit: 20,
                page: page,
            });

            const hasMore = result.items !== null ? result.items.length === 20 : true;
            // console.log('API result:', result.items.length, 'items. Has more:', hasMore);

            return {
                list: result.items ?? [],
                nextPage: hasMore ? page + 1 : undefined,
            };
        },
        [debouncedKeyword, currentChain, addressTokenStr],
    );

    const loadMore = useCallback(async () => {
        if (loadingMore || !data.nextPage) return;
        setLoadingMore(true);
        try {
            const newData = await fetchData(data.nextPage);
            setData((prev) => ({
                list: [...prev.list, ...newData.list],
                nextPage: newData.nextPage,
            }));
        } finally {
            setLoadingMore(false);
        }
    }, [data.nextPage, fetchData, loadingMore]);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const { scrollTop, scrollHeight, clientHeight } = ref.current;
                if (scrollHeight - scrollTop <= clientHeight * 1.5) {
                    loadMore();
                }
            }
        };

        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loadMore]);

    useEffect(() => {
        if (debouncedKeyword) {
            setLoading(true);
            fetchData(1).then((newData) => {
                setData(newData);
                setLoading(false);
            });
        } else {
            setData({ list: [], nextPage: 1 });
        }
    }, [debouncedKeyword, fetchData]);
    return (
        <div className="relative hidden h-full justify-center lg:flex-items-center">
            <div className="p-inputgroup hidden rounded-[3px] border-[1px] border-solid border-[#34363D] bg-[#1E2028] md:w-[200px] lg:flex 2xl:w-[424px]">
                <InputText
                    pt={{
                        root: () => ({
                            className: safeMergeClassName('focus:shadow-none border-0 text-[#fff]'),
                        }),
                    }}
                    className="bg-transparent px-2"
                    placeholder="Token name/ticker/address"
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <span className="p-inputgroup-addon border-0 bg-transparent">
                    <i className="pi pi-search text-[24px] text-[#fff]"></i>
                </span>
            </div>
            {keyword && data.list.length > 0 && (
                <div
                    ref={ref}
                    className="customScrollbar absolute top-full z-[999] max-h-64 w-[424px] overflow-auto rounded-md bg-[#1E2028] px-4 py-3"
                >
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {data.list.map((item, index) => (
                                <SearchItem key={index} data={item} />
                            ))}
                            {loadingMore && <p className="text-center">Loading more...</p>}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavSearch;
