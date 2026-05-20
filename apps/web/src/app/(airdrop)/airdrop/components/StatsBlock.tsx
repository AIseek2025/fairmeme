import { CheckCircleFilled } from '@ant-design/icons';

export default function StatsBlock({
    title1,
    value1,
    title2,
    value2,
}: {
    title1: string;
    value1: number;
    title2?: string;
    value2?: number;
}) {
    return (
        <div className="flex h-full min-h-fit w-full min-w-fit flex-col items-start justify-between space-y-4 rounded-[10px] bg-[#303843] p-6">
            <div className="flex flex-col">
                <div className="text-2xl font-bold text-white">{value1}</div>
                <div>{title1}</div>
            </div>

            {title2 && value2 ? (
                <div className="flex flex-col">
                    <div className="text-2xl font-bold text-white">{value2}</div>
                    <div>{title2}</div>
                </div>
            ) : (
                <div className="flex h-full flex-col items-center pt-1">
                    <CheckCircleFilled className="text-2xl text-[#0ECB81]" />
                </div>
            )}
        </div>
    );
}
