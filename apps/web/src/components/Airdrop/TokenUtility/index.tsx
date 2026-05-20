'use client';
import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnContext } from 'primereact/column';
import { safeMergeClassName } from '@/utils/common';
import { TOKEN_UTILITY } from '@/constants/airdrop';

const TokenUtility = () => {
    return (
        <div className="mt-[3rem]">
            <p className="text-[1.5rem] font-bold">FAIR Token Utility</p>
            <p className="mt-[.75rem] text-[.875rem] text-[#848E9C]">
                By holding FAIR tokens, users can enjoy trading fee discounts ranging from 20% to 50%, depending on the
                amount of $FAIR they hold.
            </p>
            <DataTable
                className="mt-[1.5rem]"
                stripedRows
                pt={{
                    column: {
                        headerCell: () => ({
                            className: safeMergeClassName(
                                'bg-[#1E2329] text-nowrap text-[#fff] border-[1px] border-solid border-[#2B3139] text-[1.25rem] font-bold h-[4.5rem] text-center',
                            ),
                        }),
                        bodyCell: () => {
                            return {
                                className: safeMergeClassName(
                                    'text-[#848E9C] text-[1.25rem] font-normal border-[1px] border-solid border-[#2B3139] text-center h-[4.5rem] ',
                                ),
                            };
                        },
                        headerTitle: () => ({
                            className: 'w-full',
                        }),
                    },
                    bodyRow: () => ({
                        className: safeMergeClassName('bg-[#181A20]'),
                    }),
                }}
                value={TOKEN_UTILITY}
                showGridlines
            >
                <Column
                    field="holdings"
                    header="FAIR Token Holdings"
                    className="text-base"
                    headerStyle={{ fontSize: 18 }}
                ></Column>
                <Column
                    field="discouns"
                    header="Trading Fee Discount"
                    className="text-base"
                    headerStyle={{ fontSize: 18 }}
                ></Column>
            </DataTable>
        </div>
    );
};
export default TokenUtility;
