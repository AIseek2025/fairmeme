'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AIRDROP_PATH } from '@/constants/airdrop';

const TopSidebar = () => {
    const pathname = usePathname();

    return (
        <div className="mt-[1.5rem] px-[1.5rem] lg:mx-auto lg:w-[73.75rem] lg:px-0">
            <div className="inline-flex overflow-hidden rounded-[3px] border-[1px] border-solid border-[#34363D] bg-transparent p-0">
                {AIRDROP_PATH.map((i) => (
                    <Link
                        key={i.path}
                        href={i.path}
                        className={`h-[3rem] border-0 bg-transparent px-[1.5rem] text-[1.125rem] font-normal leading-[3rem] text-[#707070] hover:text-yellow focus:shadow-none ${
                            pathname === i.path ? '!bg-[#1E2329] font-bold text-[#fff]' : ''
                        }`}
                    >
                        {i.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TopSidebar;
