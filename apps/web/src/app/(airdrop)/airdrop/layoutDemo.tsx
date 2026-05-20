'use client';

import { ReactNode } from 'react';
import TopSidebar from '@/components/Airdrop/Sidebar';
import { usePathname } from 'next/navigation';
import useWalletAddress from '@/hooks/useWalletAddress';

export default function AirdropLayout({ children }: { children: ReactNode }) {
    const { addressTokenStr } = useWalletAddress();
    const pathname = usePathname();

    return (
        <main className="bg-background flex min-h-[calc(100vh-100px)] w-full min-w-[1080px] justify-center space-x-8 bg-contain px-20">
            <TopSidebar />
            <div className="mt-9 flex w-full flex-col">
                {pathname === '/airdrop/myAirdrop' ? (
                    addressTokenStr ? (
                        children
                    ) : (
                        <div className="text-primary text-center text-xl">Connect your wallet to explore more</div>
                    )
                ) : (
                    children
                )}
            </div>
        </main>
    );
}
