'use client';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import useWalletAddress from '@/hooks/useWalletAddress';
import { getTokenList } from '@/services/api/home';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import { useRequest } from 'ahooks';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {};

const MemeInfoInitData = (props: Props) => {
    const { token }: { token: string } = useParams();
    const { currentChain } = useGetIsConnected();
    const { addressTokenStr } = useWalletAddress();
    const { setMemeItem, updateFollowStatus } = useMemeInfoStore();
    const [retryCount, setRetryCount] = useState(0);
    const { run: fetchData, cancel } = useRequest(
        () =>
            getTokenList({
                columns: {
                    type: 'home',
                    keyword: token,
                    chainName: currentChain,
                    address: addressTokenStr,
                },
                limit: 1,
                page: 1,
            }),
        {
            manual: true,
            onSuccess: (res) => {
                if (res.items.length > 0) {
                    setMemeItem(res.items[0]);
                    updateFollowStatus(res.items[0].followed);

                    setRetryCount(0);
                } else {
                    setMemeItem(null);

                    if (retryCount < 4) {
                        setTimeout(() => {
                            setRetryCount((prev) => prev + 1);
                        }, 2000);
                    }
                }
            },
        },
    );
    useEffect(() => {
        fetchData();
        return () => {
            cancel();
        };
    }, [addressTokenStr, token, retryCount]);
    useEffect(() => {
        setMemeItem(null);
    }, []);
    useEffect(() => {
        const pollingInterval = setInterval(() => {
            fetchData();
        }, 10 * 1000);
        return () => {
            clearInterval(pollingInterval);
        };
    }, []);

    return <div></div>;
};

export default MemeInfoInitData;
