'use client';

import { Images } from '@/utils/imagesMap';
import { useSafeState } from 'ahooks';
import Image from 'next/image';
import React from 'react';
import Profile from './Profile';
import useStore from '@/store/zustand';
import { useRouter } from 'next/navigation';

const MENUS = [
    {
        key: 'home',
        title: 'Home',
        icon: Images.SQUARE.HOME_SVG,
        disabled: true,
    },
    {
        key: 'settings',
        title: 'Settings',
        icon: Images.SQUARE.SETTING_SVG,
        disabled: true,
    },
    {
        key: 'profile',
        title: 'Profile',
        icon: Images.SQUARE.PROFILE_SVG,
        disabled: false,
    },
] as const;
type MenuKey = (typeof MENUS)[number]['key'];

const DEFAULT_TAB = 'profile';
const SquareTabs = ({ memberName }: { memberName?: string }) => {
    const [currentTab, setCurrentTab] = useSafeState<MenuKey>(DEFAULT_TAB);
    const router = useRouter();

    return (
        <div className="flex gap-2">
            <div className="w-[240px]">
                {MENUS.map((i) => (
                    <div
                        key={i.key}
                        className={`flex h-12 w-full items-center gap-2 rounded-[3px] px-3 py-4 text-sm font-bold ${i.disabled ? 'cursor-not-allowed text-[#848E9C]' : 'cursor-pointer hover:bg-[#1E2329]'} ${i.key === currentTab && !memberName && 'cursor-auto bg-[#1E2329] text-[#FFD41A]'}`}
                        onClick={() => {
                            router.push('/square');
                            // !i.disabled && i.key !== currentTab && setCurrentTab(i.key);
                        }}
                    >
                        <Image src={i.icon} width={24} height={24} alt="icon" />
                        <div>{i.title}</div>
                    </div>
                ))}
            </div>
            {currentTab === 'home' && <div className="w-[600px] rounded-sm border-[1px] border-[#2B3139]">Home</div>}
            {currentTab === 'settings' && (
                <div className="w-[600px] rounded-sm border-[1px] border-[#2B3139]">settings</div>
            )}
            {currentTab === 'profile' && (
                <div className="w-[600px] rounded-sm border-[1px] border-[#2B3139]">
                    <Profile />
                </div>
            )}
        </div>
    );
};

export default SquareTabs;
