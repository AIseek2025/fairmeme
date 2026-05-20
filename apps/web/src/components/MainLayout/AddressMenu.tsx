'use client';
import React, { useRef } from 'react';
import { useHover } from 'ahooks';
import useWalletAddress from '@/hooks/useWalletAddress';
import { paths } from '@/utils/paths';
import { safeMergeClassName } from '@/utils/common';
import Link from 'next/link';
interface Props {
    handleDisconnect: () => void;
}
const AddressMenu = ({ handleDisconnect }: Props) => {
    const { addressTokenDisplayName, addressTokenStr } = useWalletAddress();
    const ref = useRef(null);
    const isHover = useHover(ref);
    const MenuItems: { title: string; icon: string; link: string }[] = [
        { title: 'Profile', icon: 'pi-user', link: paths.square },
    ];
    return (
        <div className="relative h-full flex-items-center" ref={ref}>
            <div className="flex items-center justify-between gap-4 rounded-md border-2 border-[#29313F] bg-transparent px-4 py-2.5 hover:cursor-pointer hover:border-yellow">
                <div className="flex-1 hover:text-yellow">{addressTokenDisplayName}</div>
                <i className="pi pi-sort-down-fill text-[0.5rem] text-[#848E9C]" />
            </div>
            {isHover && (
                <div className="absolute left-0 right-0 top-full z-[999] flex flex-col border-2 border-[#29313F] bg-[#181A20] shadow-lg">
                    {MenuItems.map((item) => (
                        <Link
                            href={item.link}
                            key={item.title}
                            className="flex items-center justify-between px-4 py-2 text-white hover:bg-black hover:text-yellow"
                        >
                            <h3 className="text-sm">{item.title}</h3>
                            <i className={safeMergeClassName('pi text-[1rem]', item.icon)} />
                        </Link>
                    ))}

                    <div
                        className="flex cursor-pointer items-center justify-between px-4 py-2 text-white hover:bg-black hover:text-yellow"
                        onClick={() => handleDisconnect()}
                    >
                        <h3 className="text-sm">Disconnect</h3>
                        <i className="pi pi-sign-out text-[1rem]" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressMenu;
