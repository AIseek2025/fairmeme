import CreateForm from '@/components/Create/CreateForm';
import React from 'react';

const page = () => {
    return (
        <div className="bg-[#141519] py-4 sm:pb-[110px] sm:pt-8">
            <div className="mx-auto w-[608px] bg-[url('../assets/svgs/create-bg.svg')] bg-center bg-no-repeat p-9 sm:p-8">
                <CreateForm />
            </div>
        </div>
    );
};

export default page;
