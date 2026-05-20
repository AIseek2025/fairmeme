import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PrimeReactProvider } from 'primereact/api';
import MainLayout from '@/components/MainLayout';
import 'primeicons/primeicons.css';
import '@/themes/index.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import '@rainbow-me/rainbowkit/styles.css';
require('@solana/wallet-adapter-react-ui/styles.css');
import '../themes/cus-pr.css';
import localFont from 'next/font/local';
import { IS_TEST } from '@/constants/env';
import { SessionClientProvider } from '@/providers/index';

const helvetica = localFont({ src: '../../public/fonts/Helvetica.ttf' });
type Props = {
    children: ReactNode;
};
export async function generateMetadata(): Promise<Metadata> {
    return {
        metadataBase: new URL(IS_TEST ? 'https://test.fairmeme.io' : 'https://fairmeme.io'),
        title: 'FairMeme | The fairest meme launch platform',
        description: 'The fairest meme launch platform',
        keywords: 'FairMeme',
        openGraph: {
            title: 'FairMeme',
            description: 'The fairest meme launch platform',
            locale: 'en-US',
            images: [
                {
                    url: '/images/common/FairMeme.png',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'FairMeme',
            description: 'The fairest meme launch platform',
            images: ['/images/common/FairMeme.png'],
            creator: '@fairmeme',
        },
    };
}
export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body className={`${helvetica.className} bg-[#181A20]`}>
                <SessionClientProvider>
                    <PrimeReactProvider>
                        <MainLayout>{children}</MainLayout>
                    </PrimeReactProvider>
                </SessionClientProvider>
            </body>
        </html>
    );
}
