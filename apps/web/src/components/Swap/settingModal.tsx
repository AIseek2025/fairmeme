'use client';

import React, { useState } from 'react';
import useStore from '@/store/zustand';
import { useSafeState } from 'ahooks';
import { safeMergeClassName } from '@/utils/common';
import { InputText } from 'primereact/inputtext';

const SettingModal = (props: { close: any }) => {
    const currentSlippage = useStore((state) => state.currentSlippage);
    const slippagePresets = useStore((state) => state.slippagePresets);
    const setCurrentSlippage = useStore((state) => state.setCurrentSlippage);
    const [temporarySlippage, setTemporarySlippage] = useSafeState(currentSlippage);

    const { close } = props;

    const [custom, setCustom] = useState<boolean>(false);

    const handleChange = (value: number) => {
        setTemporarySlippage(value);
        setCustom(true);
    };
    const onBulrChange = (value: string) => {
        if (Number(value) > 50) {
            setTemporarySlippage(50);
        } else if (Number(value) < 1) {
            setTemporarySlippage(1);
        }
    };
    const handleSelect = (d: number) => {
        setTemporarySlippage(d);
        setCustom(false);
    };
    const handleSave = () => {
        setCurrentSlippage(temporarySlippage);
        close();
    };
    return (
        <div className="overflow-hidden p-[1.5rem] font-helvetica">
            <div className="flex items-center justify-between">
                <div className="flex">
                    {slippagePresets.map((item) => (
                        <div
                            key={item}
                            onClick={() => {
                                handleSelect(item);
                            }}
                            className={safeMergeClassName(
                                'h-[2.625rem]] mr-[1rem] cursor-pointer rounded-[.1875rem] border-[1px] border-solid border-[#34363D] bg-[#1E2028] px-[1.1875rem] text-[1rem] leading-[2.625rem] text-[#EAECEF]',
                                temporarySlippage === item ? 'bg-[#FFD41A] font-bold text-[#171821]' : '',
                            )}
                        >
                            {item}%
                        </div>
                    ))}
                </div>
                <div className="p-inputgroup h-[3rem] w-[8.25rem] rounded-[.1875rem] border-[1px] border-solid border-[#252831] bg-[#1E2028] hover:border-[#FFD41A]">
                    <InputText
                        min={1}
                        max={50}
                        pt={{
                            root: () => ({
                                className: safeMergeClassName('focus:shadow-none border-0 text-[#fff]'),
                            }),
                        }}
                        className="bg-transparent"
                        value={`${temporarySlippage}`}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            if (!/^\d*$/.test(newValue)) return;
                            if (newValue === '') {
                                handleChange(0);
                                return;
                            }
                            const numericValue = parseInt(newValue, 10);
                            if (numericValue > 50) {
                                handleChange(50);
                            } else {
                                handleChange(+newValue);
                            }
                        }}
                        onBlur={(e) => {
                            onBulrChange(e.target.value);
                        }}
                        placeholder="Custom"
                    />
                    <span className="p-inputgroup-addon border-none bg-transparent text-[#fff]">%</span>
                </div>
            </div>
            <div
                className="mt-[24px] h-[4rem] cursor-pointer rounded-[.1875rem] bg-[#FFD41A] text-[1.25rem] font-bold text-[#333] flex-center hover:border-[1px] hover:border-solid hover:border-[#FFD41A] hover:bg-transparent hover:text-[#fff]"
                onClick={handleSave}
            >
                Save Slippage
            </div>
        </div>
    );
};

export default SettingModal;
