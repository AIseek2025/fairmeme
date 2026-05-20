'use client';
import React from 'react';
import { PieChart, Pie, Cell, Text, ResponsiveContainer, Label, LabelList } from 'recharts';

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
        <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize="1rem" fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChartComponent: React.FC<PieChartProps> = ({
    data,
    colors = ['#FFD41A', '#367EFF', '#FF3665', '#00E8BA'],
    total,
}) => {
    return (
        <div className="h-[18.75rem] w-[18.75rem]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius="80%"
                        innerRadius="45%"
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={30}
                        endAngle={390}
                        strokeWidth={0}
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>

                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '1rem', fontWeight: 'bold', fill: '#FFFFFF' }}
                    >
                        {total.toLocaleString()}
                    </text>
                    <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '.875rem', fill: '#7A89A2' }}
                    >
                        TOTAL
                    </text>
                    {/* <Text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16px"
                        fontWeight="bold"
                        color="#FFD41A"
                    >
                        {`TOTAL: ${total.toLocaleString()}`}
                    </Text> */}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
