'use client';
import useWalletAddress from '@/hooks/useWalletAddress';
import { postViewCount } from '@/services/api/meme';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

type Props = {};

const ViewCounts = (props: Props) => {
    const { token }: { token: string } = useParams();
    useEffect(() => {
        if (token) {
            postViewCount({ tokenAddress: token });
        }
    }, [token]);
    return null;
};

export default ViewCounts;
