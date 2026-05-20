import React, { useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { safeMergeClassName } from '@/utils/common';
import { InputText } from 'primereact/inputtext';

type Props = {
    inputSlippageValue: number;
    setSlippageInputValue: React.Dispatch<React.SetStateAction<number>>;
};

const SlippageSelector = ({ inputSlippageValue, setSlippageInputValue }: Props) => {
    const op = useRef<OverlayPanel>(null);
    const [tempSlippage, setTempSlippage] = useState(inputSlippageValue);

    const handleSave = () => {
        setSlippageInputValue(tempSlippage);
        op.current?.hide();
    };

    return (
        <div>
            <div className="flex cursor-pointer items-center gap-1 text-white" onClick={(e) => op.current?.toggle(e)}>
                <span className="text-xs text-[#7A89A2]">
                    Slippage <span className="text-white">{inputSlippageValue}%</span>
                </span>
                <i className="pi pi-cog h-4 w-4 text-[#7A89A2]" />
            </div>

            <OverlayPanel ref={op} closeOnEscape className="w-[25rem] rounded-md bg-[#171821] p-0 text-base text-white">
                <div className="justify-between border-b border-black pb-2 flex-items-center">
                    <h2 className="text-xl font-bold text-white">Set max. slippage (%)</h2>
                    <i className="pi pi-times p-1 text-xl" onClick={() => op.current?.hide()} />
                </div>
                <div className="justify-between gap-3 p-5 flex-items-center">
                    <div className="flex items-center gap-3 text-xs">
                        {[5, 10, 15, 20].map((value) => (
                            <button
                                key={value}
                                onClick={() => setTempSlippage(value)}
                                className={`rounded px-3 py-2 ${tempSlippage === value ? 'bg-yellow text-black' : 'border border-[#34363D] bg-[#1E2028] text-white'}`}
                            >
                                {value}%
                            </button>
                        ))}
                    </div>

                    <div className="relative w-[6.3125rem]">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={tempSlippage}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (!/^\d*$/.test(newValue)) return;
                                if (newValue === '') {
                                    setTempSlippage(0);
                                    return;
                                }
                                const numericValue = parseInt(newValue, 10);
                                if (numericValue > 50) {
                                    setTempSlippage(50);
                                } else {
                                    setTempSlippage(+newValue);
                                }
                                // setTempSlippage(Number(e.target.value))
                            }}
                            className="w-full rounded border border-yellow bg-[#1E2028] p-1 text-white focus:outline-none"
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-white">%</span>
                    </div>
                </div>
                <div className="p-4">
                    <button
                        onClick={handleSave}
                        className="w-full rounded bg-yellow py-3 text-sm font-bold text-[#333333]"
                    >
                        Save Slippage
                    </button>
                </div>
            </OverlayPanel>
        </div>
    );
};

export default SlippageSelector;
