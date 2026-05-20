'use client';
import React, { useEffect, useState } from 'react';
import './MemeInfo.css';
import ViewCounts from './components/ViewCounts';
import MemeInfoInitData from './components/MemeInfoInitData';
import Mobile from './components/Mobile';
import Desktop from './components/Desktop';
import useMediaQuery from '@/hooks/useMediaQuery';

const Meme = () => {
    const isMobile = useMediaQuery('(max-width: 750px)');
    return (
        <section>
            <MemeInfoInitData />
            <ViewCounts />
            {isMobile ? <Mobile /> : <Desktop />}
        </section>
    );
};

export default Meme;
