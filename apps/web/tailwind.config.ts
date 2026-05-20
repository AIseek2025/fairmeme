/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Helvetica-Regular', 'sans-serif'],
            helvetica: ['Helvetica', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
        extend: {
            colors: {
                yellow: '#FFD41A',
                green: '#0ECB81',
                blue: '#00E0FF',
                red: '#F6465D',
                'black-333': '#333333',
                'grey-blue': '#7A89A2',
                'yellow-60': 'rgba(255, 200, 0, 0.60)',
                'blue-60': 'rgba(23, 61, 255, 0.60)',
                'black-opcity': 'rgba(19, 20, 24, 0.90)',
            },
            screens: {
                sm: '640px',
                md: '750px',
                lg: '1280px',
                xl: '1440px',
                '2xl': '1920px',
            },

            borderColor: {
                memeInfoBorder: '#303843',
            },
            backgroundColor: {
                'nav-bgc': '#171821',
            },
        },
    },
    plugins: [
        plugin(({ addUtilities, addComponents, addBase }) => {
            addBase({
                '@media (max-width: 750px)': {
                    html: {
                        fontSize: 'calc(100vw / 46.875)',
                    },
                },
            });
            addComponents({});
            addUtilities({
                '.flex-col-items-center': {
                    display: 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                },

                '.flex-col-justify-center': {
                    display: 'flex',
                    'flex-direction': 'column',
                    'justify-content': 'center',
                },
                '.flex-col-center': {
                    display: 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    'justify-content': 'center',
                },
                '.flex-center': {
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                },
                '.flex-items-center': {
                    display: 'flex',
                    'align-items': 'center',
                },
                '.flex-justify-center': {
                    display: 'flex',
                    'justify-content': 'center',
                },
                '.content-ellipsis': {
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                },
            });
        }),
    ],
};

export default config;
