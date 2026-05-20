import React from 'react';

type Props = {
    currentLength: number;
    maxLength: number;
};

const LengthCounter = ({ currentLength, maxLength }: Props) => {
    return (
        <div className="text-[#7A89A2]">
            {currentLength}/{maxLength}
        </div>
    );
};

export default LengthCounter;
