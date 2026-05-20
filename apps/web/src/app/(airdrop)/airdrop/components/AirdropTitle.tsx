import React from 'react';

type Props = { title: string };

const AirdropTitle: React.FC<Props> = ({ title }) => {
    return (
        <div className="mb-[30px] flex w-full items-center">
            <div className="mr-3 h-[28px] w-[9px] bg-[#FFD41A]" />
            <h3 className="text-2xl font-bold text-[#EAECEF]">{title}</h3>
        </div>
    );
};

export default AirdropTitle;
