import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import starGray from '@/assets/icon/star-gray.png';
import starYellow from '@/assets/icon/star-yellow.png';
import { AddressTokenRebuild } from '@/components/AddressToken/AddressTokenRebuild';
import { useParams } from 'next/navigation';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import { followActionReq } from '@/services/api/home';
import { useToast } from '@/context/ToastContext';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useRequest } from 'ahooks';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import { useWatchListStore } from '@/store/memeInfoStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
const HeaderCollect = () => {
    const { token }: { token: string } = useParams();
    const { isConnected } = useGetIsConnected();
    const { showToast } = useToast();
    const { addressTokenStr } = useWalletAddress();
    const { memeItem, updateFollowStatus } = useMemeInfoStore();
    const { updateWatchListFollowStatus, removeFromWatchList } = useWatchListStore();
    const { run } = useRequest(() => followActionReq({ creatorAddress: addressTokenStr!, tokenAddress: token }), {
        manual: true,
        onError: () => {
            if (memeItem?.followed) {
                return showToast({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to Unfollow',
                    position: 'bottom-right',
                    life: 3000,
                });
            }
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to Follow',
                position: 'bottom-right',
                life: 3000,
            });
        },
        onSuccess: () => {
            if (memeItem?.followed) {
                showToast({
                    severity: 'success',
                    summary: 'Unfollow',
                    detail: 'Unfollow successful',
                    position: 'bottom-right',
                    life: 3000,
                });
                updateFollowStatus(!memeItem?.followed);
                if (memeItem?.followed) {
                    removeFromWatchList(token);
                }
                // updateWatchListFollowStatus(token, !memeItem?.followed);
                return;
            }
            showToast({
                severity: 'success',
                summary: 'Follow',
                detail: 'Follow successful',
                position: 'bottom-right',
                life: 3000,
            });
            updateFollowStatus(!memeItem?.followed);
        },
    });

    const handleFollowAction = async () => {
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
    const timeAgo = memeItem?.createdAt ? dayjs(+memeItem.createdAt * 1000).fromNow() : '';
    return (
        <div className="gap-3 flex-items-center">
            <div
                className="h-4 w-4"
                onClick={() => {
                    handleFollowAction();
                }}
            >
                <Image src={memeItem?.followed ? starYellow : starGray} alt="" width={16} height={16} />
            </div>
            <div className="h-12 w-12 overflow-hidden rounded-md flex-items-center">
                {/* {loading ? (
                    <Skeleton shape="circle" className="h-11 w-11 rounded-full"></Skeleton>
                ) : ( */}

                {memeItem?.tokenLogo && (
                    <Image
                        src={memeItem?.tokenLogo!}
                        alt="tokenLogo"
                        width={48}
                        height={48}
                        className="rounded-md object-center"
                    />
                )}

                {/* )} */}
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm">
                    {memeItem?.tokenName} <span className="text-grey-blue">(${memeItem?.tokenTicker})</span>
                </p>
                <div className="text-xs text-grey-blue flex-items-center">
                    <AddressTokenRebuild
                        address={memeItem?.tokenAddress}
                        copyable={true}
                        className="mr-3 gap-2 flex-items-center"
                    />
                    {memeItem?.createdAt && <span className="ml-1">{timeAgo}</span>}
                </div>
            </div>
        </div>
    );
};

export default HeaderCollect;
