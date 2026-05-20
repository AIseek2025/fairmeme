import { Images } from '@/utils/imagesMap';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import Image from 'next/image';
import { useControllableValue } from 'ahooks';
import useMediaQuery from '@/hooks/useMediaQuery';

const ITEMS = [
    { title: 'No pre-sale' },
    { title: 'No team allocation' },
    { title: 'No freeze or mint authorities' },
    { title: 'Ownership renounced' },
    { title: 'Full open source' },
    { title: 'Liquidity pool permanently locked' },
];
const ITEMS2 = [
    {
        title: 'Create a Meme Token',
        icon: Images.DOCS.ICON_1_SVG,
        description: (
            <p className="mb-8 text-[#848E9C]">
                Pay 1 SOL to receive 500k tokens (0.05% of the total supply) and create the token with no creation fee.
            </p>
        ),
    },
    {
        title: 'Add Liquidity on FairMemeSwap',
        icon: Images.DOCS.ICON_2_SVG,
        description: (
            <p className="mb-8 text-[#848E9C]">
                This 1 SOL will be used to add liquidity along with an additional 500k tokens (0.05%) on FairMemeSwap.All
                liquidity is locked permanently. 
                <br /> The deployer cannot withdraw or remove the liquidity. <br />
                To keep the contract simple and safe, FairMemeSwap does not allow users to add liquidity on their own.
            </p>
        ),
    },
    {
        title: 'Token Auction',
        icon: Images.DOCS.ICON_3_SVG,
        description: (
            <p className="mb-8 text-[#848E9C]">
                999M tokens(99.9%) will be linearly released into the liquidity per block over the selected auction
                period (1 hour, 6 hours, 12 hours, or 1–365 days).  <br /> If no one buys during the auction, the price
                will automatically drop linearly.
            </p>
        ),
    },
    {
        title: 'Trade on FairMemeSwap',
        icon: Images.DOCS.ICON_4_SVG,
        description: (
            <p className="mb-8 text-[#848E9C]">
                FairMemeSwap uses a standard AMM trading model, based on the equation z=x*y.  <br /> A 2% trading fee will
                be charged on each transaction. <br /> By holding FAIR tokens, users can enjoy discounts on trading
                fees, ranging from 20% to 50%, depending on the amount of $FAIR they hold. 
            </p>
        ),
    },
    {
        title: 'Trading Fee Allocation',
        icon: Images.DOCS.ICON_5_SVG,
        description: (
            <p className="mb-8 text-[#848E9C]">
                50% of the trading fees will go to the creator, with the other 50% allocated to the protocol.
            </p>
        ),
    },
];
const GuideModal = (props: { value: boolean; onChange: any }) => {
    const [visible, setVisible] = useControllableValue<boolean>(props);
    const needResponsive = useMediaQuery('(max-width: 970px)');
    return (
        <Dialog
            header="How it works?"
            headerStyle={{
                textAlign: 'center',
                backgroundColor: '#1E2329',
                color: '#fff',
                fontSize: '32px',
            }}
            draggable={false}
            contentStyle={{ backgroundColor: '#1E2329' }}
            visible={visible}
            dismissableMask={true}
            closable={false}
            style={{
                width: needResponsive ? '80vw' : '960px',
                backgroundColor: '#1E2329',
            }}
            contentClassName="guideModalCustomScrollbar"
            onHide={() => {
                if (!visible) return;
                setVisible(false);
                localStorage.setItem('isSecondEnter', 'true');
            }}
        >
            <div className="text-[#fff]">
                <p className="text-lg">
                    <span className="font-bold text-[#FFD41A]">FairMeme</span> has creatively designed a linear release
                    mechanism, creating an effect similar to token auctions, ensuring the fairest token distribution. 
                </p>
                <Image src={Images.COMMON.DOT_LINE_SVG} width={912} height={1} alt="line" className="my-6" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {ITEMS.map((i) => (
                        <div key={i.title} className="flex items-center text-sm font-bold">
                            <Image src={Images.DOCS.BOOK_ICON_SVG} width={24} height={24} alt="icon" className="mr-2" />
                            <p>{i.title}</p>
                        </div>
                    ))}
                </div>
                <Image src={Images.COMMON.DOT_LINE_SVG} width={912} height={1} alt="line" className="my-6" />
                <div>
                    {ITEMS2.map((i) => (
                        <div key={i.title}>
                            <h3 className="mb-3 flex items-center gap-2">
                                <Image src={i.icon} width={24} height={24} alt="icon" />
                                <div className="text-xl font-bold">{i.title}</div>
                            </h3>
                            {i.description}
                        </div>
                    ))}
                </div>
            </div>
            <div
                onClick={() => {
                    setVisible(false);
                    localStorage.setItem('isSecondEnter', 'true');
                }}
                className={`duration-800 mx-auto mt-3 flex h-12 ${needResponsive ? 'w-[70vw]' : 'w-[872px]'} cursor-pointer items-center justify-center rounded-[3px] bg-[#FFD41A] text-sm font-bold text-[#333] transition hover:scale-105 hover:bg-[#b8a552]`}
            >
                Let's go!
            </div>
        </Dialog>
    );
};

export default GuideModal;
