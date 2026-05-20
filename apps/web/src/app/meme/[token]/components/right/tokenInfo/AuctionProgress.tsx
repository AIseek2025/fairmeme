import { ProgressBar } from 'primereact/progressbar';
import React from 'react';

type Props = { percentage: number; available: string; released: string; auctionTime: string };

const AuctionProgress = ({ percentage, available, released, auctionTime }: Props) => {
    return (
        <div className="flex flex-col gap-4 border-b border-[#010102] py-6 md:pt-4">
            <div className="text-xl text-[#848E9C] md:text-xs">
                Auction Progress: <span className="text-yellow">{percentage > 100 ? 100 : percentage}%</span>
            </div>
            <div>
                <ProgressBar
                    pt={{
                        value: () => ({ className: 'rounded-full' }),
                    }}
                    value={percentage > 100 ? 100 : percentage}
                    color="#00C47A"
                    className="mb-4 h-4 rounded-full bg-[#1E2028] md:mb-2 md:h-3"
                    showValue={false}
                />
                <div className="flex justify-between md:text-[10px]">
                    <p className="">
                        Auction Time <span className="text-white">{auctionTime}</span>
                    </p>
                    <p>
                        <span className="text-white">{released}</span> Released / &nbsp;
                        <span className="text-white">{available}</span>
                        Available
                    </p>
                </div>
            </div>
            <p className="text-base md:text-xs">
                {available} tokens will be linearly released into the liquidity per block in the auction cycle. When no
                one buys, the price will fall linearly.
            </p>
        </div>
    );
};

export default AuctionProgress;
