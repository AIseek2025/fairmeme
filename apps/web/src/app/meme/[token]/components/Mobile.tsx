import React from 'react';
import MemeDescribe from './mobile/memeInfo/MemeDescribe';
import BuySellAndChart from './mobile/BuySellAndChart/BuySellAndChart';

type Props = {};

const Mobile = (props: Props) => {
    return (
        <div className="flex flex-col gap-2 bg-black md:hidden">
            <div>
                <MemeDescribe />
            </div>
            <div>
                <BuySellAndChart />
            </div>
        </div>
    );
};

export default Mobile;
