import AirdropTitle from './AirdropTitle';

async function getAirdropProgress() {
    const res = [
        {
            type: 'address Airdrop',
            allocated: 12.11,
            percent: 17.29,
            available: 70,
        },
        {
            type: 'creation Rewards',
            allocated: 4.67,
            percent: 46.7,
            available: 10,
        },
        {
            type: 'Trading Rewards',
            allocated: 7.35,
            percent: 73.5,
            available: 10,
        },
    ];
    const resWithTips = res.map((item) => {
        let tips;
        switch (item.type) {
            case 'addressAirdrop':
                tips =
                    'Addresses with a total value of more than 300U on Solana, ETH, BASE, BSC, ARB, AVAX, Polygon, and Blast chains can receive 10,000 FAIR Tokens.';
                break;
            case 'creationRewards':
                tips = '100,000 $FAIR will be awarded for each meme token once created.';
                break;
            case 'TradingRewards':
                tips = 'You can get the transaction reward according to the SOL transaction volume';
                break;
            default:
                tips = '';
        }
        return { ...item, tips };
    });

    return resWithTips;
}

type ProgressItem = { type: string; allocated: number; percent: number; available: number; tips?: string };

async function AirdropProgress() {
    const progresses = await getAirdropProgress();

    const renderProgressItem = ({ type, allocated, percent, available, tips }: ProgressItem) => (
        <div
            key={type}
            className="my-[6px] h-[129px] w-full max-w-[1008px] rounded-[20px] bg-[#303843] p-3 text-[#EAECEF]"
        >
            <h3 className="text-lg">{type}</h3>
            <div className="mb-[3px] mt-[6px]">
                <span className="mr-[6px] text-[#FFD41A]">{allocated}B</span>
                <span>Allocated</span>
            </div>
            <div className="relative h-6 w-full overflow-hidden rounded-[80px] bg-[#5E6673]">
                <div
                    className="absolute left-0 top-0 flex h-full items-center justify-end rounded-[80px] bg-[#FFD41A] pr-[7px] font-bold text-[#181A20]"
                    style={{
                        width: `min(${percent}%, 100%)`,
                        transition: 'width 0.5s ease-in-out',
                    }}
                >
                    {percent}%
                </div>
            </div>
            <div className="mb-[6px] mt-[3px] text-right">
                <span className="mr-[6px] text-[#FFD41A]">{available}B</span>
                <span className="text-[#848E9C]">Available</span>
            </div>
            <p className="mb-[30px] text-end text-xs">{tips}</p>
        </div>
    );

    return (
        <div className="mx-auto w-full">
            <AirdropTitle title="Airdrop Progress" />
            <div className="mb-[66px]">{progresses.map((i) => renderProgressItem(i))}</div>
        </div>
    );
}

export default AirdropProgress;
