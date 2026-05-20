import React from 'react';
import { AddressTokenRebuild } from '@/components/AddressToken/AddressTokenRebuild';
import { InfoProps } from './TokenInfo';
import { formatNumber, formattedTime, formatTimestamp, openExplorer } from '@/utils/common';
import useStore from '@/store/zustand';
import { CHAIN_ICON_MAP } from '@/constants';
import { useMemeInfoStore } from '@/store/memeInfoStore';
// @ts-ignore
import dayjs from 'dayjs';
export const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-[#7A89A2]">{label}</span>
        {value}
    </div>
);
const Liquidity: React.FC<InfoProps> = ({ token }) => {
    const currentChain = useStore((store) => store.currentChain);
    const { memeItem } = useMemeInfoStore();
    return (
        <div className="border-b border-[#010102] pb-6 pt-4 text-[1.125rem] md:text-[10px]">
            <div className="mb-4 text-sm font-bold text-[#EAECEF]">Liquidity</div>
            <div className="flex flex-col gap-1 text-[#EAECEF]">
                {/* <InfoItem label="Liquidity" value={`$${+token.nativeUsd * 2}`} /> */}
                <InfoItem label="Liquidity" value={`$${memeItem?.liquidity ?? 0}`} />
                <InfoItem label={`Pooled ${token.tokenTicker}`} value={formatNumber(token.tokenAmount)} />
                <InfoItem label={`Pooled ${CHAIN_ICON_MAP[currentChain].nativeCoin}`} value={token.nativeAmount} />
                <InfoItem
                    label="Pool(FairMemeSwap)"
                    value={
                        <div className="gap-2 flex-items-center">
                            <AddressTokenRebuild
                                address={token.pairAddress}
                                copyable={true}
                                className="text-[12px] text-[#EAECEF]"
                            />
                            <i
                                className="pi pi-external-link cursor-pointer text-base hover:text-yellow"
                                onClick={() => {
                                    openExplorer(token.pairAddress, 'account');
                                }}
                            ></i>
                        </div>
                    }
                />
                <InfoItem
                    label={token.tokenTicker}
                    value={
                        <div className="gap-2 flex-items-center">
                            <AddressTokenRebuild
                                address={token.tokenAddress}
                                copyable={true}
                                className="text-[12px] text-[#EAECEF]"
                            />
                            <i
                                className="pi pi-external-link cursor-pointer text-base hover:text-yellow"
                                onClick={() => openExplorer(token.pairAddress, 'token')}
                            ></i>
                        </div>
                    }
                />
                <InfoItem
                    label={CHAIN_ICON_MAP[currentChain].nativeCoin}
                    value={
                        <div className="gap-2 flex-items-center">
                            <AddressTokenRebuild
                                address="So11111111111111111111111111111111111111112"
                                copyable={true}
                                className="text-[12px] text-[#EAECEF]"
                            />
                            <i
                                className="pi pi-external-link cursor-pointer text-base hover:text-yellow"
                                onClick={() => {
                                    openExplorer('So11111111111111111111111111111111111111112', 'token');
                                }}
                            ></i>
                        </div>
                    }
                />
                {/* TODO: Create Time */}
                <InfoItem label="Pool Created" value={dayjs(+token.createdAt * 1000).format('DD/MM/YYYY HH:mm')} />
            </div>
        </div>
    );
};

export default Liquidity;
{
    /* <InfoItem label={token.tokenName} value={`$${formatNumber(token.tokenUsd)}`} />
                <InfoItem label={CHAIN_ICON_MAP[currentChain].nativeCoin} value={`$${formatNumber(token.nativeUsd)}`} /> */
}
{
    /* <InfoItem label="SOL" value={`$${formatNumber(token.)}`} /> */
}
