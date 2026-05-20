import AirdropItem from './AirdropItem';
import AirdropTitle from './AirdropTitle';
import PieChartComponent from './PieChartComponent';

const chartData = [
    { name: 'Yellow', value: 70 },
    { name: 'Green', value: 10 },
    { name: 'Blue', value: 10 },
    { name: 'Red', value: 10 },
];

const totalValue = 10000000000;

export default async function Allocation() {
    return (
        <div className="mt-[12px] h-[475px] w-full max-w-[1080px]">
            <AirdropTitle title="FAIR Allocation" />
            <div className="flex items-center gap-14">
                <div>
                    <PieChartComponent data={chartData} total={totalValue} />
                </div>
                <div className="grid grid-flow-col grid-rows-2 gap-3">
                    <div>
                        <AirdropItem
                            title="abc"
                            percent={10}
                            amount={1000000000}
                            sub="Addresses with a total value of more than 300U 
on Solana, ETH, BASE, BSC, ARB, AVAX, Polygon, 
and Blast chains can receive 1,000 FAIR Tokens."
                            color="#FFD41A"
                        />
                    </div>
                    <div>
                        <AirdropItem
                            title="abc"
                            percent={10}
                            amount={1000000000}
                            sub="Addresses with a total value of more than 300U 
on Solana, ETH, BASE, BSC, ARB, AVAX, Polygon, 
and Blast chains can receive 1,000 FAIR Tokens."
                            color="#0ECB81"
                        />
                    </div>
                    <div>
                        <AirdropItem
                            title="abc"
                            percent={10}
                            amount={1000000000}
                            sub="Addresses with a total value of more than 300U 
on Solana, ETH, BASE, BSC, ARB, AVAX, Polygon, 
and Blast chains can receive 1,000 FAIR Tokens."
                            color="#00E0FF"
                        />
                    </div>
                    <div>
                        <AirdropItem
                            title="abc"
                            percent={10}
                            amount={1000000000}
                            sub="Addresses with a total value of more than 300U 
on Solana, ETH, BASE, BSC, ARB, AVAX, Polygon, 
and Blast chains can receive 1,000 FAIR Tokens."
                            color="#F6465D"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
