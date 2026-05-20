import { SelectButton } from 'primereact/selectbutton';
import { CHAIN_LIST } from '@/constants';
import Image from 'next/image';
import { safeMergeClassName } from '@/utils/common';
import tableShowIcon from '@/assets/icon/table-show.png';
import cardShowIcon from '@/assets/icon/card-show.png';
import { ChainsType } from '@/types/common';
import { InputSwitch } from 'primereact/inputswitch';

interface Props {
    chainName: number | string;
    setChainName: (chainName: ChainsType | '') => void;
    listType: string;
    setListType: (listType: string) => void;
    tableShow: boolean;
    setTableShow: (tableShow: boolean) => void;
    switchCard: boolean;
    setSwitchCard: (switchCard: boolean) => void;
}
const Filter = ({
    chainName,
    setChainName,
    listType,
    setListType,
    tableShow,
    setTableShow,
    switchCard,
    setSwitchCard,
}: Props) => {
    const justifyTemplate = (option: any) => {
        const { icon, title } = option;
        return (
            <div className="flex">
                {icon && (
                    <Image
                        src={icon}
                        alt={title}
                        className="mr-[0.5rem] h-[1.25rem] w-[1.25rem] lg:mr-[8px] lg:h-[20px] lg:w-[20px]"
                    ></Image>
                )}
                <span className="text-[0.875rem] lg:text-[14px]">{title}</span>
            </div>
        );
    };
    return (
        <div>
            <SelectButton
                value={chainName}
                pt={{
                    root: {
                        className:
                            'inline-flex p-[0.5rem] lg:p-[6px] bg-[#1E2028] border-[1px] inline-block border-solid border-[#34363D] rounded-[3px]',
                    },
                    button: ({ context }: any) => ({
                        className: safeMergeClassName(
                            'border-0 focus:shadow-none h-[2.625rem] lg:h-[36px] bg-transparent text-[#fff] lg:text-[14px] text-[0.875rem] rounded-[3px] px-[0.75rem] lg:px-[12px] font-bold',
                            {
                                'bg-[#FFD41A] text-[#000]': context.selected,
                            },
                        ),
                    }),
                }}
                onChange={(e) => {
                    setChainName(e.value);
                }}
                allowEmpty={false}
                optionLabel="title"
                optionValue="key"
                itemTemplate={justifyTemplate}
                options={[{ title: 'All Chains', key: '', chainId: '', icon: null }, ...CHAIN_LIST]}
            />
            <div className="mt-[0.75rem] flex items-center lg:mt-[12px]">
                <SelectButton
                    allowEmpty={false}
                    value={listType}
                    pt={{
                        root: {
                            className:
                                'inline-flex p-0 bg-[#131418] border-[1px] inline-block border-solid border-[#34363D] rounded-[3px]',
                        },
                        button: ({ context }: any) => ({
                            className: safeMergeClassName(
                                'border-0 focus:shadow-none bg-transparent text-[#7A89A2] lg:text-[14px] text-[0.875rem] rounded-[3px] px-[0.75rem] lg:px-[12px]',
                                {
                                    'bg-[#34363D] text-[#FFD41A] font-bold': context.selected,
                                },
                            ),
                        }),
                    }}
                    onChange={(e) => {
                        setListType(e.value);
                    }}
                    optionLabel="label"
                    optionValue="key"
                    options={[
                        { key: 'watchlist', label: 'Watchlist' },
                        { key: 'terminal', label: 'Terminal' },
                    ]}
                />
                <div
                    onClick={() => setTableShow(!tableShow)}
                    className="ml-[1.5rem] inline-block cursor-pointer rounded-[3px] border-[1px] border-solid border-[#34363D] bg-[#1E2028] p-[6px] lg:ml-[24px]"
                >
                    <Image
                        alt="show"
                        src={tableShow ? tableShowIcon : cardShowIcon}
                        className="h-[1.5rem] w-[1.5rem] lg:h-[24px] lg:w-[24px]"
                    />
                </div>
                {!tableShow && (
                    <div className="ml-[1.5rem] flex items-center text-[14px] text-[#7A89A2]">
                        <InputSwitch
                            pt={{
                                slider: {
                                    className: switchCard ? 'bg-[#FFD41A]' : 'bg-[#34363D]',
                                },
                            }}
                            className="mr-[8px]"
                            checked={switchCard}
                            onChange={(e) => setSwitchCard(!switchCard)}
                        />
                        Flip
                    </div>
                )}
            </div>
        </div>
    );
};
export default Filter;
