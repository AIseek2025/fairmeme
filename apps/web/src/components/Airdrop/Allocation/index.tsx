import PieChartComponent from '../PieChartComponent';
import { formatInteger } from '@/utils/common';
import React from 'react';

type AllocationItemProps = {
    title: string;
    percent: number;
    amount: string;
    color: string;
    sub?: string;
};

const AllocationItem = ({ title, percent, amount, color }: AllocationItemProps) => {
    return (
        <div className="relative border-[1px] border-solid border-[#252831] px-[1.5rem] py-[2rem]">
            <div
                className={`absolute right-[1.5rem] top-0 h-[2rem] rounded-bl-[.1875rem] rounded-br-[.1875rem] px-[1rem] text-[.875rem] font-bold leading-[2rem] text-[#000] ${color}`}
            >
                {percent}% of total
            </div>
            <div className="flex items-center">
                <div className={`mr-[.75rem] h-[1rem] w-[.25rem] rounded-[.625rem] ${color}`} />
                <div className="text-[1rem] leading-[1.25rem] text-[#EAECEF]">{title}</div>
            </div>
            <div className="ml-[1rem] text-[1.875rem] font-bold leading-[2.25rem]">{amount}</div>
        </div>
    );
};

const Allocation = () => {
    const chartData = [
        { name: 'Yellow', value: 45 },
        { name: 'Green', value: 40 },
        { name: 'Blue', value: 5 },
        { name: 'Red', value: 10 },
    ];

    const allocationList = [
        {
            title: 'Twitter Airdrop',
            percent: 45,
            amount: '45,000,000,000',
            color: 'bg-[#FFD41A]',
        },
        {
            title: 'Address Airdrop',
            percent: 40,
            amount: '40,000,000,000',
            color: 'bg-[#367EFF]',
        },
        {
            title: 'Creation&Trading rewards',
            percent: 5,
            amount: '5,000,000,000',
            color: 'bg-[#FF3665]',
        },
        {
            title: 'Listing&Liquidity',
            percent: 10,
            amount: '10,000,000,000',
            color: 'bg-[#00E8BA]',
        },
    ];

    const totalValue = 100000000000;
    return (
        <div className="mt-[3rem]">
            <p className="text-[1.5rem] font-bold">FAIR Token Allocation</p>
            <div className="flex flex-col items-center justify-between lg:flex-row">
                <PieChartComponent data={chartData} total={totalValue} />
                <div className="grid flex-1 grid-cols-2 gap-[1.5rem] lg:ml-[6.25rem]">
                    {allocationList.map((i, index) => (
                        <AllocationItem
                            key={index}
                            title={i.title}
                            percent={i.percent}
                            amount={i.amount}
                            color={i.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Allocation;
