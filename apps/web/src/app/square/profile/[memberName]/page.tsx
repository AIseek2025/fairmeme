import React from 'react';
import SquareTabs from '../../components/SquareTabs';

type Props = {
    params: { memberName: string };
};

const page = ({ params }: Props) => {
    const { memberName } = params;
    return (
        <div className="mt-6 flex items-center justify-center px-[390px]">
            <SquareTabs memberName={memberName} />
            {/* <div className="w-[248px]">Search poster/user</div> */}
        </div>
    );
};

export default page;
