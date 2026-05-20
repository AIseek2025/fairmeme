import MyAirdropTab from '@/components/Airdrop/MyAirdropTab';
import { Suspense } from 'react';

const MyAirdrop = () => {
    return (
        <Suspense fallback="">
            <MyAirdropTab />
        </Suspense>
    );
};

export default MyAirdrop;
