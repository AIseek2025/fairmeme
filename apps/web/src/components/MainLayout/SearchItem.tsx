import { useToast } from '@/context/ToastContext';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import useWalletAddress from '@/hooks/useWalletAddress';
import { followActionReq } from '@/services/api/home';
import { useRequest, useSafeState } from 'ahooks';
import React from 'react';
import starGray from '@/assets/icon/star-gray.png';
import starYellow from '@/assets/icon/star-yellow.png';
import Image from 'next/image';
import { formatAddress, formatNumber, formatTimestamp } from '@/utils/common';
import FormattedNumber from '../common/FormattedNumber';
import { useRouter } from 'next/navigation';
import { paths } from '@/utils/paths';
type Props = {
    data: FairMemeHome.Item;
};

const SearchItem = ({ data }: Props) => {
    const router = useRouter();
    const { isConnected, currentChain, isSupportedChain } = useGetIsConnected();
    const { showToast } = useToast();
    const { addressTokenStr } = useWalletAddress();
    const [isFollow, setIsFollow] = useSafeState<boolean | undefined>(data.followed);
    const { run } = useRequest(
        () => followActionReq({ creatorAddress: addressTokenStr!, tokenAddress: data.tokenAddress }),
        {
            manual: true,
            onError: () => {
                if (isFollow) {
                    return showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to UnFollow',
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
                if (isFollow) {
                    showToast({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'UnFollow successful',
                        position: 'bottom-right',
                        life: 3000,
                    });
                    setIsFollow(!isFollow);
                    return;
                }
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Follow successful',
                    position: 'bottom-right',
                    life: 3000,
                });
                setIsFollow(!isFollow);
            },
        },
    );
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
                detail: 'Failed to UnFollow',
                position: 'bottom-right',
                life: 3000,
            });
        }
    };
    return (
        <div
            className="cursor-pointer gap-2 py-3 text-[10px] flex-items-center"
            onClick={() => router.push(paths.memeInfo(data.tokenAddress))}
        >
            <div
                className="h-4 w-4"
                onClick={(e) => {
                    e.stopPropagation();
                    handleFollowAction();
                }}
            >
                <Image src={isFollow ? starYellow : starGray} alt="" width={16} height={16} />
            </div>
            <div className="h-8 w-8 overflow-hidden rounded-md flex-items-center">
                <Image
                    src={data.tokenLogo}
                    alt="tokenLogo"
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full bg-white object-cover object-center"
                />
            </div>
            <div className="flex-1">
                <div className="w-full gap-1 flex-items-center">
                    <div className="flex-1 text-sm">
                        {data.tokenName}
                        <span className="text-grey-blue">({data.tokenTicker})</span>
                    </div>
                    <FormattedNumber value={data.tokenPrice} prefix="$" />
                    <span className={`${+data.change24 >= 0 ? 'text-[#0ECB81]' : 'text-[#FF3B54]'}`}>
                        {+data.change24 >= 0 ? '+' + data.change24 + '%' : data.change24 + '%'}
                    </span>
                </div>
                <div className="flex-1">
                    <div className="w-full gap-3 text-[#7A89A2] flex-items-center">
                        <div className="flex-1 flex-items-center">{formatAddress(data.tokenAddress)}</div>
                        <div className="flex h-full">
                            <span className="text-white">Market Cap</span> &nbsp; ${formatNumber(data.marketCap)}
                        </div>
                        <div className="flex">
                            <span className="text-white">24H Volume</span> &nbsp; ${formatNumber(data.vol24)}
                        </div>
                        <div className="flex items-end text-xs text-grey-blue">
                            <span className="ml-1">{formatTimestamp(data.auctionTime!)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;
