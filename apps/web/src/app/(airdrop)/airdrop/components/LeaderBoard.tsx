import React from 'react';
import Image from 'next/image';
import AirdropTitle from './AirdropTitle';

interface LeaderBoardItem {
    ranking: number;
    user: string;
    airdrop: number;
}

interface LeaderBoardProps {
    items: LeaderBoardItem[];
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ items }) => {
    return (
        <div className="w-full max-w-[1080px] rounded-lg bg-[#303843] p-6">
            <AirdropTitle title="Leader Board" />
            <table className="w-full">
                <thead>
                    <tr className="w-[996px] bg-[#444a54] text-[#848E9C]">
                        <th className="py-2 text-center">Ranking</th>
                        <th className="py-2 text-center">User</th>
                        <th className="py-2 text-center">Airdrop</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.ranking} className="border-t border-gray-700">
                            <td className={`py-3 ${item.ranking <= 5 && 'text-[#FFD41A]'} text-center`}>
                                {item.ranking}
                            </td>
                            <td className="flex items-center justify-center py-3">
                                <div className="mr-2 h-6 w-6 rounded-full bg-gray-600"></div>
                                <span className="truncate text-white" style={{ maxWidth: '300px' }}>
                                    {item.user}
                                </span>
                            </td>
                            <td className={`py-3 text-center ${item.ranking <= 5 && 'text-[#FFD41A]'}`}>
                                {item.airdrop.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-center">
                <button className="mx-2 rounded bg-gray-700 px-3 py-1 text-white">&lt;</button>
                <span className="text-white">1</span>
                <button className="mx-2 rounded bg-gray-700 px-3 py-1 text-white">&gt;</button>
            </div>
        </div>
    );
};

export default LeaderBoard;
