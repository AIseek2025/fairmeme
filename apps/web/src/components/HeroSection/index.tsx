'use client';
import Image from 'next/image';
import logo from '@/assets/icon/logo.png';
import logoName from '@/assets/icon/logo-name.png';
import useStore from '@/store/zustand';
import { safeMergeClassName } from '@/utils/common';

const HeroSection = () => {
    const navSearch = useStore((state) => state.navSearch);
    return (
        <div
            className={safeMergeClassName('flex justify-center', {
                hidden: navSearch.isShow,
            })}
        >
            <Image src={logo} alt="logo" className="hidden lg:mr-[24px] lg:block lg:h-[262px] lg:w-[280px]" />
            <div className="relative flex flex-col items-end py-[3.125rem] lg:pb-0 lg:pt-[76px]">
                <p className="absolute right-0 top-[3.125rem] font-helvetica text-[1.25rem] text-[#fff] lg:top-[65px] lg:text-[1.25rem]">
                    The fairest meme launch platform
                </p>
                <Image
                    className="h-[6.37506rem] w-[31.875rem] lg:h-[95px] lg:w-[480px]"
                    src={logoName}
                    alt="The fairest meme launch platform"
                />

                <div className="z-9 absolute -bottom-[7rem] right-0 h-[10.6875rem] w-[11.3125rem] bg-gradient-to-r from-yellow-60 to-blue-60 blur-[7.3125rem]"></div>
            </div>
        </div>
    );
};
export default HeroSection;
