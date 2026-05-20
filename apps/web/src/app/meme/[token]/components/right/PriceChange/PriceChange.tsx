'use client';
import useMemeInfoStore from '@/store/memeInfoStore/memeInfoStore';
import { formatNumber } from '@/utils/common';

type Props = {};

const PriceChange = (props: Props) => {
    const { memeItem } = useMemeInfoStore();
    return (
        <div className="flex flex-col gap-4 rounded-md bg-[#171821] p-4 font-helvetica">
            <div>
                <h1 className="mb-2 text-sm text-[#7A89A2]">Price Change</h1>
                <div className="flex gap-3">
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">1h</div>
                        {/* <div className={`${item.profitRate < 0 ? 'text-red' : 'text-green'}`}>
                            {item.profitRate < 0
                                ? Number(item.profitRate).toFixed(2)
                                : '+' + Number(item.profitRate).toFixed(2)}
                            %
                        </div> */}
                        <div className={`${+memeItem?.change1! < 0 ? 'text-red' : 'text-green'}`}>
                            {memeItem?.change1 && +memeItem?.change1 < 0
                                ? Number(memeItem?.change1).toFixed(2)
                                : '+' + Number(memeItem?.change1).toFixed(2)}
                            %
                        </div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">6h</div>
                        <div className={`${+memeItem?.change6! < 0 ? 'text-red' : 'text-green'}`}>
                            {memeItem?.change6 && +memeItem?.change6 < 0
                                ? Number(memeItem?.change6).toFixed(2)
                                : '+' + Number(memeItem?.change6).toFixed(2)}
                            %
                        </div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">12h</div>
                        <div className={`${+memeItem?.change12! < 0 ? 'text-red' : 'text-green'}`}>
                            {memeItem?.change12 && +memeItem?.change12 < 0
                                ? Number(memeItem?.change12).toFixed(2)
                                : '+' + Number(memeItem?.change12).toFixed(2)}
                            %
                        </div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">24h</div>
                        <div className={`${+memeItem?.change24! < 0 ? 'text-red' : 'text-green'}`}>
                            {memeItem?.change24 && +memeItem?.change24 < 0
                                ? Number(memeItem?.change24).toFixed(2)
                                : '+' + Number(memeItem?.change24).toFixed(2)}
                            %
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="mb-2 text-sm text-[#7A89A2]">Volume</h1>
                <div className="flex gap-3">
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">1h</div>
                        <div className="text-white">${formatNumber(memeItem?.vol1)}</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">6h</div>
                        <div className="text-white">${formatNumber(memeItem?.vol6)}</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">12h</div>
                        <div className="text-white">${formatNumber(memeItem?.vol12)}</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">24h</div>
                        <div className="text-white">${formatNumber(memeItem?.vol24)}</div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="mb-2 text-sm text-[#7A89A2]">Turnover</h1>
                <div className="flex gap-3">
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">1h</div>
                        <div className="text-white">{memeItem?.turnover1}%</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">6h</div>
                        <div className="text-white">{memeItem?.turnover6}%</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">12h</div>
                        <div className="text-white">{memeItem?.turnover12}%</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">24h</div>
                        <div className="text-white">{memeItem?.turnover24}%</div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="mb-2 text-sm text-[#7A89A2]">TXs</h1>
                <div className="flex gap-3">
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">1h</div>
                        <div className="text-white">{memeItem?.txs1}</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">6h</div>
                        <div className="text-white">{memeItem?.txs6}</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">12h</div>
                        <div className="text-white">{memeItem?.txs12}</div>
                    </div>
                    <div className="group flex h-12 flex-1 flex-col items-center justify-center rounded-md border border-[#34363D] bg-[#1E2028] text-sm hover:bg-[#34363D]">
                        <div className="leading-none text-[#7A89A2] group-hover:text-white">24h</div>
                        <div className="text-white">{memeItem?.txs24}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceChange;
