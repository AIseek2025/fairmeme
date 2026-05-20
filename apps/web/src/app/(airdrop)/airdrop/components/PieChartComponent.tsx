'use client';
import React from 'react';
import { PieChart, Pie, Cell, Text, ResponsiveContainer } from 'recharts';

interface DataItem {
    name: string;
    value: number;
}

interface PieChartProps {
    data: DataItem[];
    colors?: string[];
    total: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize="20px" fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChartComponent: React.FC<PieChartProps> = ({
    data,
    colors = ['#FFFF00', '#00FF00', '#00FFFF', '#FF9999'],
    total,
}) => {
    return (
        <div className="h-[400px] w-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius="80%"
                        innerRadius="45%"
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        strokeWidth={0}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16px"
                        fontWeight="bold"
                        color="#FFD41A"
                    >
                        {`TOTAL: ${total.toLocaleString()}`}
                    </Text>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
