import { formatInteger } from '@/utils/common';
import React from 'react';

type Props = {
    title: string;
    percent: number;
    amount: number;
    color: string;
    sub?: string;
};

const AirdropItem = ({ title, percent, amount, sub, color }: Props) => {
    return (
        <div className="h-full min-h-fit w-full min-w-fit max-w-[268px] rounded-[10px] bg-[#303843] p-3">
            <div className="mb-[27px] flex items-center">
                <div className={`mr-3 h-[42px] w-[9px] bg-[${color}]`} />
                <div>
                    <div className="text-lg text-[#EAECEF]">{title}</div>
                    <div className={`text-[${color}]`}>{percent}% of total</div>
                </div>
            </div>
            <div className={`mb-[6px] text-right font-bold text-[${color}]`}>{formatInteger(amount)}</div>
            <p className="text-[9px] text-[#848E9C]">{sub}</p>
        </div>
    );
};

export default AirdropItem;
