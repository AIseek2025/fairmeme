import React from 'react';
import { formatNumber, openExplorer } from '@/utils/common';
import { AddressTokenRebuild } from '@/components/AddressToken/AddressTokenRebuild';
import { InfoItem } from './Liquidity';
import { GetTokenDetailInfo } from '@/types/meme';

interface InfoProps {
    token: GetTokenDetailInfo.Response['token'];
    formatAuctionTime: string;
    circulatingSupply: number;
}

const Info: React.FC<InfoProps> = ({ token, formatAuctionTime, circulatingSupply }) => {
    return (
        <div className="border-b border-[#010102] pb-6 pt-4 text-[1.125rem] md:text-[10px]">
            <div className="mb-4 text-sm font-bold text-[#EAECEF]">Info</div>
            <div className="flex flex-col text-[#EAECEF]">
                <InfoItem
                    label="Token Address"
                    value={
                        <div className="gap-2 flex-items-center">
                            <AddressTokenRebuild
                                address={token.tokenAddress}
                                copyable
                                className="text-[12px] text-[#EAECEF]"
                            />
                            <i
                                className="pi pi-external-link cursor-pointer text-base hover:text-yellow"
                                onClick={() => openExplorer(token.tokenAddress, 'token')}
                            ></i>
                        </div>
                    }
                />
                <InfoItem label="Circulating Supply" value={formatNumber(circulatingSupply, 3)} />
                <InfoItem
                    label="Creator Address"
                    value={
                        <div className="gap-2 flex-items-center">
                            <AddressTokenRebuild
                                address={token.creatorAddress}
                                className="text-[12px] text-[#EAECEF]"
                                copyable
                            />
                            <i
                                className="pi pi-external-link cursor-pointer text-base hover:text-yellow"
                                onClick={() => {
                                    openExplorer(token.creatorAddress, 'account');
                                }}
                            ></i>
                        </div>
                    }
                />
                <InfoItem label="Auction Time" value={formatAuctionTime} />
                <InfoItem label="Start Block of Auction" value={token.startBlock} />
                <InfoItem label="End Block of Auction" value={token.endBlock} />
            </div>
        </div>
    );
};

export default Info;
