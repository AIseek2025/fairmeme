import React from 'react';

type FormattedNumberProps = {
    value: number;
    prefix?: string;
};

const FormattedNumber: React.FC<FormattedNumberProps> = ({ value, prefix = '' }) => {
    const formatNumberWithSubscript = (num: number): React.ReactNode[] => {
        if (num === 0) return [prefix, '0'];

        const parts = Number(num).toFixed(8).toString().split('.');
        if (parts.length === 1) return [prefix, parts[0]];

        const integerPart = parts[0];
        const fractionalPart = parts[1];

        const leadingZeros = fractionalPart.match(/^0+/)?.[0].length ?? 0;
        const significantPart = fractionalPart.slice(leadingZeros);

        if (leadingZeros === 0) {
            return [prefix, `${integerPart}.${fractionalPart}`];
        }

        return [prefix, `${integerPart}.0`, <sub key="subscript">{leadingZeros}</sub>, significantPart];
    };

    return (
        <span className="font-mono price-column text-nowrap">{!!value ? formatNumberWithSubscript(value) : '0'}</span>
    );
};

export default FormattedNumber;
