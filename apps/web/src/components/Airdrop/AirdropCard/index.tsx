'use client';
import twitterIcon from '@/assets/icon/twitter.svg';
import magic from '@/assets/icon/magic.svg';
import airdrop from '@/assets/icon/airdrop.svg';
import Image from 'next/image';
import { ProgressBar } from 'primereact/progressbar';
import { formatNumber, safeMergeClassName } from '@/utils/common';
import { useCreation, useRequest } from 'ahooks';
import { getProgress } from '@/services/api/airdrop';
const AirdropCard = () => {
    const { data } = useRequest(() => getProgress());
    const list = useCreation(() => {
        const _list = [
            {
                icon: twitterIcon,
                title: 'Twitter Airdrop',
                allocated: '--',
                available: '45B',
                process: '--',
                title2: '(-- X)',
                desc: <>Users will receive Twitter airdrops based on their overall Twitter score.</>,
            },
            {
                icon: airdrop,
                title: 'Address Airdrop',
                allocated: '--',
                available: '40B',
                title2: '(-- addresses)',
                process: '--',
                desc: (
                    <>
                        Addresses with a total balance exceeding <span className="text-[#fff]">$500</span> at the time
                        of the snapshot are eligible to receive <span className="text-[#fff]">10,000 $FAIR</span>{' '}
                        Tokens.
                    </>
                ),
            },
            {
                icon: magic,
                title: 'Creation&Trading rewards',

                allocated: '--',
                available: '5B',
                process: '--',
                desc: (
                    <>
                        Users will receive <span className="text-[#fff]">50,000 $FAIR</span> as a reward for each
                        creation and trading rewards based on their trading volume.
                    </>
                ),
            },
        ];
        if (!data) return _list;

        const { address, consume, twitter, twitterCount, addressCount } = data;
        const twitterProcess = ((Number(twitter) * 100) / 45000000000).toString();
        const addressProcess = ((Number(address) * 100) / 40000000000).toString();
        const consumeProcess = ((Number(consume) * 100) / 5000000000).toString();
        _list[0].allocated = twitter;
        _list[0].process = twitterProcess;
        _list[0].title2 = `(${formatNumber(twitterCount)} X)`;
        _list[1].allocated = address;
        _list[1].process = addressProcess;
        _list[1].title2 = `(${formatNumber(addressCount)} addresses)`;
        _list[2].allocated = consume;
        _list[2].process = consumeProcess;
        return _list;
    }, [data]);
    return (
        <div className="mt-[3rem]">
            <p className="w-screen px-[1.5rem] text-[1.5rem] font-bold lg:mx-auto lg:w-[73.75rem] lg:px-0">Airdrop</p>
            <div className="w-screen overflow-x-auto px-[1.5rem] lg:mx-auto lg:w-[73.75rem] lg:px-0">
                <div className="mt-[1.5rem] flex w-screen flex-nowrap lg:grid lg:w-auto lg:grid-cols-3 lg:gap-[1.5rem]">
                    {list.map((i, index) => {
                        return (
                            <div
                                key={index}
                                className="mr-[1.5rem] min-w-[320px] rounded-[3px] border-[1px] border-solid border-[#252831] p-[1.5rem] lg:mr-0 lg:w-auto"
                            >
                                <div className="flex items-center">
                                    <Image src={i.icon} alt="twitter" className="h-[2rem] w-[2rem]"></Image>
                                    <div className="ml-[.5rem]">{i.title}</div>
                                    {i.title2 && (
                                        <div className="ml-[.25rem] text-[.75rem] text-[#848E9C]">{i.title2} </div>
                                    )}
                                </div>
                                <div className="mb-[.75rem] mt-[1.5rem] flex items-center justify-between text-[.75rem] leading-[1.125rem] text-[#7A89A2]">
                                    <div>
                                        <span>Allocated</span>
                                        <span className="ml-[.25rem] text-[#FFD41A]">{i.allocated}</span>
                                    </div>
                                    <div>
                                        <span>Available</span>
                                        <span className="ml-[.25rem] text-[#FFD41A]">{i.available}</span>
                                    </div>
                                </div>
                                <ProgressBar
                                    color="#FFD41A"
                                    pt={{
                                        root: {
                                            className: safeMergeClassName('bg-[#2F3341] h-[0.75rem] w-full'),
                                        },
                                        label: {
                                            className: safeMergeClassName('text-[#141519] text-[.625rem]'),
                                        },
                                    }}
                                    value={i.process}
                                    showValue={false}
                                />
                                <div className="text-[.75rem] text-[#7A89A2]">{Number(i.process).toFixed(2)}%</div>
                                <p className="mt-[.625rem] text-[.75rem] leading-[1.125rem] text-[#7A89A2]">{i.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AirdropCard;
