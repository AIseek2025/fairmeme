'use client';
import React, { useRef } from 'react';

import Image from 'next/image';
import useStore from '@/store/zustand';
import { CHAIN_ICON_MAP, CHAIN_LIST, ChainMapProps } from '@/constants';
import { useHover } from 'ahooks';
import { Button } from 'primereact/button';
import { useSwitchChain } from 'wagmi';
const SelectChain = () => {
    const currentChain = useStore((state) => state.currentChain);
    const setCurrentChain = useStore((state) => state.setCurrentChain);
    const { switchChain: evmSwitchChain } = useSwitchChain();
    const ref = useRef(null);
    const isHover = useHover(ref);
    return (
        <div className="relative h-full flex-items-center" ref={ref}>
            <div
                className="flex items-center justify-between gap-4 rounded-md border-2 border-[#29313F] bg-transparent px-4 py-2 hover:cursor-pointer hover:border-yellow"
                // hover:bg-yellow hover:text-black
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Image
                            width={24}
                            height={24}
                            src={CHAIN_ICON_MAP[currentChain].icon}
                            alt={CHAIN_ICON_MAP[currentChain].title}
                        />
                        <span className="text-[14px]">{CHAIN_ICON_MAP[currentChain].title}</span>
                    </div>
                </div>
                <i className="pi pi-sort-down-fill text-[0.5rem] text-[#848E9C]" />
            </div>
            {isHover && (
                <div className="absolute left-0 right-0 top-full z-[999] flex flex-col border-2 border-[#29313F] bg-[#181A20] py-2 shadow-lg">
                    {CHAIN_LIST.map((item) => (
                        <div key={item.key} className={``}>
                            <Button
                                disabled={item.key !== 'sol'}
                                onClick={() => {
                                    setCurrentChain(item.key);
                                    if (item.key !== 'sol') {
                                        evmSwitchChain({
                                            chainId: item.chainId,
                                        });
                                    }
                                }}
                                className={`w-full hover:bg-black hover:text-yellow ${item.key !== 'sol' ? 'cursor-not-allowed opacity-45' : ''}`}
                                unstyled={true}
                            >
                                <div className="flex w-full items-center gap-2 px-4 py-2">
                                    <Image width={24} height={24} src={item.icon} alt={item.title} />
                                    <span className="text-sm">{item.title}</span>
                                </div>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectChain;
