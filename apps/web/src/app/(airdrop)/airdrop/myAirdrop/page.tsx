import { SegmentedTabs } from '@/components/Airdrop/SegmentedTabs';
import { TableProps, Button, Input, Table } from 'antd';
import StatsBlock from '../components/StatsBlock';

export default function MyAirdropPage() {
    const mockStats = [
        {
            type: 'trading',
            data: [
                {
                    title: 'Trading Rewards',
                    value: 1079.4,
                },
                {
                    title: 'Trading Volume(SOL)',
                    value: 15.42,
                },
            ],
        },
        {
            type: 'creation',
            data: [
                {
                    title: 'Creation Rewards',
                    value: 1000000,
                },
                {
                    title: 'Creation',
                    value: 100,
                },
            ],
        },
        {
            type: 'invitation',
            data: [
                {
                    title: 'Invitation Rewards',
                    value: 5000,
                },
                {
                    title: 'Invitees',
                    value: 25,
                },
            ],
        },
        {
            type: 'address',
            data: [
                {
                    title: 'Address Rewards',
                    value: 1000,
                },
            ],
        },
    ];

    const tradingRewardsColumns: TableProps<FairMemeHome.Item>['columns'] = [
        {
            title: 'Trading Volume',
            dataIndex: 'tradingVolume',
        },
        {
            title: 'Trading Rewards',
            dataIndex: 'tradingRewards',
        },
        {
            title: 'Time',
            dataIndex: 'time',
        },
    ];

    return (
        <div className="mx-auto flex h-full w-full flex-col space-y-8">
            <div className="flex h-40 w-full items-center space-x-4">
                {mockStats.map((stat, index) => (
                    <StatsBlock
                        key={index}
                        title1={stat.data[0].title}
                        value1={stat.data[0].value}
                        title2={stat.data[1]?.title}
                        value2={stat.data[1]?.value}
                    />
                ))}
            </div>

            <div className="relative flex h-40 w-full flex-col items-center justify-center rounded-[10px] bg-[#303843] p-6">
                <div className="absolute left-6 top-6 w-full items-start justify-start text-lg">My Total Airdrop</div>
                <div className="flex h-full w-full items-center justify-center space-x-4">
                    <p className="text-5xl font-bold text-white">1000000</p>
                    <Button type="primary" disabled>
                        Claim
                    </Button>
                </div>
            </div>

            <div className="flex h-12 w-[80%] items-center justify-center space-x-4">
                <Input placeholder="Search" className="h-full bg-[#303843]" />
                <Button type="primary" className="h-full bg-[#0ECB81]">
                    Copy
                </Button>
            </div>

            <SegmentedTabs
                type="card"
                items={[
                    {
                        key: 'tradingRewards',
                        label: <span>Trading Rewards</span>,
                        children: <Table columns={tradingRewardsColumns} />,
                    },
                    {
                        key: 'invitationRewards',
                        label: <span>Invitation Rewards</span>,
                        children: <></>,
                    },
                ]}
            />
        </div>
    );
}
