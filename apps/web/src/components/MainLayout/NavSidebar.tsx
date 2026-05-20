import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import Link from 'next/link';
import { logo } from '../../../public/images/common';
import Image from 'next/image';
import { safeMergeClassName } from '@/utils/common';
import CustomConnectButton from '../connectbutton/CustomConnectButton';
type Props = {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    links: { title: string; link: string | string[] }[];
    pathname: string;
};

const NavSidebar = ({ visible, setVisible, links, pathname }: Props) => {
    return (
        <Sidebar
            visible={visible}
            position="right"
            showCloseIcon={false}
            onHide={() => setVisible(false)}
            className="relative h-screen w-full bg-[#181A20] text-lg text-[#7A89A2] lg:hidden"
            pt={{ content: () => ({ className: 'p-0' }) }}
            modal={true}
            blockScroll={true}
        >
            <header className="h-[5.5rem] justify-between px-6 flex-items-center">
                <Link href="/" className="flex cursor-pointer items-center">
                    <Image src={logo} alt="" className="h-[3.5rem] w-[10rem]" />
                </Link>
                <i className="pi pi-times text-4xl text-white" onClick={() => setVisible(false)}></i>
            </header>
            <nav className="flex flex-col">
                {links.map((linkItem) => {
                    const _link = Array.isArray(linkItem.link) ? linkItem.link[0] : linkItem.link;
                    const isActive = Array.isArray(linkItem.link)
                        ? linkItem.link.includes(pathname)
                        : pathname === _link;
                    return (
                        <Link
                            href={_link}
                            key={linkItem.title}
                            className={safeMergeClassName(
                                'border-b border-black px-[1.5rem] py-[1.56rem] text-lg hover:text-yellow',
                                {
                                    'text-white': isActive,
                                },
                            )}
                            onClick={() => setVisible(false)}
                        >
                            {linkItem.title}
                        </Link>
                    );
                })}
                <div
                    className={safeMergeClassName(
                        'border-b border-black px-[1.5rem] py-[1.56rem] text-lg hover:text-yellow',
                    )}
                    onClick={() => {
                        window.open('https://t.me/fairmemeofficial');
                    }}
                >
                    Telegram
                </div>
                <div
                    onClick={() => {
                        window.open('https://x.com/fairmemeofficial');
                    }}
                    className={safeMergeClassName(
                        'border-b border-black px-[1.5rem] py-[1.56rem] text-lg hover:text-yellow',
                    )}
                >
                    Twitter
                </div>
            </nav>

            <div className="px-[1.5rem]" onClick={() => setVisible(false)}>
                <CustomConnectButton className="flex w-full justify-center border-none bg-yellow py-[1.3rem] font-helvetica text-[1.25rem] font-bold text-[#333] lg:block" />
            </div>
        </Sidebar>
    );
};

export default NavSidebar;
