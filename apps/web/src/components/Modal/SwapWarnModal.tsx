'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import useStore from '@/store/zustand';
import { CHAIN_ICON_MAP } from '@/constants';
import useSwapWarnModalStore from '@/store/modalStore/swapWarnModalStore';
interface Props {
    amount: number | string;
    currencyName: string | undefined;
}
export default function SwapWarnModal({ amount, currencyName }: Props) {
    const { isOpen, closeModal } = useSwapWarnModalStore();
    return (
        <div className="card justify-content-center flex">
            <Dialog
                header="Excessive Input Amount"
                visible={isOpen}
                onHide={() => {
                    closeModal();
                }}
                modal
                className="w-96"
                contentClassName="bg-[#181A20] flex flex-col items-center gap-4"
                headerClassName="bg-[#181A20] text-white border-b border-[#000000] text-sm text-center"
                draggable={false}
                closeOnEscape={true}
                dismissableMask={true}
                closable={false}
            >
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <path
                            d="M25.6667 5.13328C25.6667 5.31661 26.0334 5.68328 26.5834 6.59994C27.1334 7.51661 27.6834 8.43328 28.4167 9.89994C29.1501 11.3666 30.0667 12.6499 30.9834 14.2999C31.9001 15.9499 33.0001 17.5999 33.9167 19.2499C34.8334 20.8999 35.9334 22.7333 36.8501 24.3833C37.7667 26.0333 38.6834 27.6833 39.6001 28.9666C40.3334 30.4333 41.0667 31.5333 41.8001 32.6333C42.5334 33.7333 42.7167 34.2833 43.0834 34.6499C43.4501 35.3833 43.8167 36.1166 43.8167 36.8499C44.0001 37.5833 43.8167 38.1333 43.6334 38.8666C43.4501 39.5999 43.0834 39.9666 42.7167 40.3333C42.1667 40.6999 41.6167 40.8833 40.8834 40.8833H3.85006C2.75007 40.8833 1.8334 40.6999 1.2834 40.3333C0.733398 39.9666 0.366732 39.4166 0.183398 38.8666C6.51069e-05 38.3166 6.51069e-05 37.5833 0.183398 37.0333C0.366732 36.2999 0.550065 35.7499 1.10007 35.0166C1.2834 34.6499 1.65007 34.0999 2.20007 32.9999C2.75007 32.0833 3.4834 30.7999 4.40007 29.5166C5.31673 28.0499 6.2334 26.5833 7.15006 24.9333C8.06673 23.2833 9.16673 21.4499 10.2667 19.7999C11.3667 18.1499 12.2834 16.3166 13.2001 14.6666C14.1167 13.0166 15.0334 11.5499 15.7667 10.2666C16.5001 8.98328 17.2334 7.88328 17.7834 6.96661L18.7001 5.49994C19.0667 4.94994 19.6167 4.39994 20.3501 4.03328C21.0834 3.66661 21.6334 3.48328 22.3667 3.48328C23.1001 3.48328 23.6501 3.66661 24.3834 3.84994C24.7501 4.03328 25.3001 4.58328 25.6667 5.13328ZM24.5667 13.5666C24.5667 13.1999 24.5667 12.8333 24.3834 12.6499C24.2001 12.2833 24.0167 12.0999 23.8334 11.9166C23.6501 11.7333 23.2834 11.5499 22.9167 11.3666C22.5501 11.1833 22.1834 10.9999 21.8167 10.9999C21.0834 10.9999 20.5334 11.1833 19.9834 11.7333C19.4334 12.2833 19.0667 12.8333 19.0667 13.5666V24.9333C19.0667 25.6666 19.4334 26.2166 19.9834 26.7666C20.5334 27.3166 21.0834 27.4999 21.8167 27.4999C22.5501 27.4999 23.1001 27.3166 23.6501 26.7666C24.2001 26.2166 24.5667 25.6666 24.5667 24.9333V13.5666ZM21.8167 30.0666C21.0834 30.0666 20.3501 30.2499 19.9834 30.7999C19.6167 31.3499 19.2501 31.8999 19.2501 32.6333C19.2501 33.3666 19.4334 34.0999 19.9834 34.4666C20.5334 35.0166 21.0834 35.1999 21.8167 35.1999C22.5501 35.1999 23.2834 35.0166 23.6501 34.4666C24.2001 33.9166 24.3834 33.3666 24.3834 32.6333C24.3834 31.8999 24.2001 31.1666 23.6501 30.7999C23.2834 30.2499 22.5501 30.0666 21.8167 30.0666Z"
                            fill="#FFD41A"
                        />
                    </svg>
                </div>
                <p className="text-sm leading-[1.3125rem]">
                    The amount you entered exceeds <span className="text-white">50%</span> of the liquidity pool.Please
                    reduce the input to no more than <span className="text-white">{amount}</span> {currencyName}.
                </p>

                <Button
                    label="I understand "
                    onClick={() => closeModal()}
                    className="w-full border-none bg-yellow px-4 py-2.5 font-helvetica text-sm font-bold text-[#333]"
                />
            </Dialog>
        </div>
    );
}
