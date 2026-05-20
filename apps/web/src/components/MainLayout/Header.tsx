'use client';
import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { paths } from '@/utils/paths';
import SelectChain from './SelectChain';
import { logo, navIcon, search, xSpace } from '@/assets/images';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';
import CustomConnectButton from '../connectbutton/CustomConnectButton';
import { getNonce, login } from '@/services/api/login';
import { useSafeState } from 'ahooks';
import useStore from '@/store/zustand';
import { useWallet } from '@solana/wallet-adapter-react';
import { InputText } from 'primereact/inputtext';
import { safeMergeClassName } from '@/utils/common';
import NavSidebar from './NavSidebar';
import NavSearch from './NavSearch';
import useAuthStatusStore from '@/store/authStore/authStore';
import useWalletAddress from '@/hooks/useWalletAddress';
// @ts-ignore
import bs58 from 'bs58';
import GuideModal from '../GuideModal/GuideModal';

const Header = () => {
    const pathname = usePathname();
    const isMemeRoute = pathname.startsWith('/meme/');
    const { authStatus, setAuthStatus } = useAuthStatusStore();
    const { addressTokenStr } = useWalletAddress();
    const setLoginId = useStore((state) => state.setLoginId);
    // useEvmEventListener();
    const navSearch = useStore((state) => state.navSearch);
    const setSearchVisibility = useStore((state) => state.setSearchVisibility);
    const setSearchKeyword = useStore((state) => state.setSearchKeyword);
    const {
        publicKey,
        wallet,
        signMessage: signSolanaMessage,
        disconnect: solanaDisconnect,
        disconnecting,
    } = useWallet();
    const links: { title: string; link: string | string[] }[] = [
        { title: 'Home', link: paths.home },
        { title: 'Create', link: paths.create },
        { title: 'Swap', link: paths.swap },
        // gtodo
        { title: 'Square', link: paths.square },
        { title: 'Airdrop', link: [paths.airdrop, paths.myAirdrop] },
    ];
    const [visible, setVisible] = useSafeState<boolean>(false);
    const [guideVisible, setGuideVisible] = useSafeState(false);

    useEffect(() => {
        if (!localStorage.getItem('isSecondEnter')) setGuideVisible(true);
    }, []);
    // const { runAsync: runGetProfileInfo } = useRequest(getProfileInfo, {
    //     manual: true,
    //     onSuccess: (res) => {
    //         setLoginId(res.members.id);
    //     },
    // });
    ///////////////////////////////
    ///////////Solana Login////////
    ///////////////////////////////
    const currentChain = useStore((state) => state.currentChain);
    const createSolanaMessage = (nonce: string): string => {
        return `Sign in to FairMeme:${nonce}`;
    };
    const handleDisconnect = useCallback(() => {
        solanaDisconnect();
        setLoginId(undefined);
        setAuthStatus('unauthenticated');
        localStorage.removeItem('auth_expirationTime');
        localStorage.removeItem('access_token');
    }, [solanaDisconnect, setLoginId, setAuthStatus]);
    useEffect(() => {
        const signIn = async () => {
            try {
                if (!addressTokenStr) {
                    throw new Error('Wallet address not found');
                }
                if (!currentChain) {
                    throw new Error('Current chain not set');
                }
                const expirationTime = localStorage.getItem(`auth_expirationTime`);
                const currentTime = Date.now() / 1000;

                if (expirationTime && Number(expirationTime) > currentTime) {
                    setAuthStatus('authenticated');
                    return;
                }

                setAuthStatus('loading');
                const { nonce } = await getNonce(addressTokenStr!, currentChain);

                if (!signSolanaMessage) {
                    throw new Error('Solana wallet not connected');
                }
                const message = createSolanaMessage(nonce);
                const encodedMessage = new TextEncoder().encode(message);
                const signatureUnitArray = await signSolanaMessage(encodedMessage);
                const signature = bs58.encode(signatureUnitArray);

                const res = await login({
                    creatorAddress: addressTokenStr,
                    chainID: currentChain,
                    sign: signature,
                    message: message,
                    nonce,
                });
                setLoginId(res.id);
                const accessToken = res.accessToken;
                const decodedToken = jwtDecode(accessToken);
                localStorage.setItem(`auth_expirationTime`, decodedToken.exp + '');
                localStorage.setItem(`access_token`, accessToken);
                setAuthStatus('authenticated');
            } catch (err) {
                handleDisconnect();
                console.error('Error during login:', err);
            }
        };

        if (publicKey && addressTokenStr && signSolanaMessage && authStatus !== 'loading' && !disconnecting) {
            signIn();
        }
    }, [publicKey]);
    useEffect(() => {
        const provider = (window as any)?.solana;
        if (provider?.on) {
            const handleAccountChange = () => {
                // console.log('Account changed');
                handleDisconnect();
            };
            provider.on('accountChanged', handleAccountChange);
            return () => {
                provider.off('accountChanged', handleAccountChange);
            };
        }
    }, [handleDisconnect]);
    return (
        <header className="flex min-h-16 bg-nav-bgc px-[1.5rem] text-white lg:px-8">
            <div className="mx-auto w-[34.875rem] justify-between flex-items-center md:w-[34.875rem] lg:w-full">
                {navSearch.isShow ? (
                    <div className="flex w-full flex-col py-[1.75rem]">
                        <div className="flex w-full items-center justify-between text-[1.75rem]">
                            <span>SEARCH</span>
                            <i
                                onClick={() => {
                                    setSearchVisibility(false);
                                    setSearchKeyword('');
                                }}
                                className="pi pi-times text-[1.75rem]"
                            ></i>
                        </div>
                        <div className="p-inputgroup mt-[1.75rem] rounded-[3px] border-[1px] border-solid border-[#34363D] bg-[#1E2028] lg:inline-flex">
                            <span className="p-inputgroup-addon border-0 bg-transparent">
                                <i className="pi pi-search text-[1.5rem] text-[#fff]"></i>
                            </span>
                            <InputText
                                pt={{
                                    root: () => ({
                                        className: safeMergeClassName('focus:shadow-none border-0 text-[#fff]'),
                                    }),
                                }}
                                className="bg-transparent"
                                value={navSearch.keyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Token name/ticker/address"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-full w-auto flex-items-center">
                            <Link href="/" className="flex h-full flex-shrink-0 cursor-pointer items-center">
                                <Image src={logo} alt="" className="h-[3rem] w-[10rem]" />
                            </Link>

                            {/* table links*/}
                            <nav className="hidden h-full gap-8 px-16 text-[14px] text-grey-blue lg:flex">
                                {links.map((linkItem) => {
                                    const _link = Array.isArray(linkItem.link) ? linkItem.link[0] : linkItem.link;
                                    const isActive = Array.isArray(linkItem.link)
                                        ? linkItem.link.includes(pathname)
                                        : pathname === _link;
                                    return (
                                        <Link
                                            key={linkItem.title}
                                            href={_link}
                                            className={`${isActive ? 'text-yellow' : ''} h-full flex-items-center hover:text-yellow`}
                                        >
                                            {linkItem.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        {isMemeRoute && <NavSearch />}
                        {/* table */}
                        <div className="hidden h-full justify-end gap-4 bg-[#181A20] font-helvetica text-sm lg:flex-items-center">
                            <i
                                // className="text-nowrap rounded-md border-2 border-[#29313F] bg-transparent px-4 py-2.5 flex-center hover:bg-yellow hover:text-[#333]"
                                className="pi pi-exclamation-circle h-6 w-6 cursor-pointer text-2xl text-[#848E9C] hover:text-yellow"
                                onClick={() => setGuideVisible(true)}
                            >
                                {/* How it works? */}
                            </i>
                            <i
                                className="pi pi-twitter cursor-pointer text-2xl text-[#848E9C] hover:text-[#FFD41A]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open('https://x.com/fairmemeofficial');
                                }}
                            ></i>
                            <i
                                className="cursor-pointer text-2xl text-[#848E9C] hover:text-[#FFD41A]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open('https://t.me/fairmemeofficial');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                                    <path
                                        d="M22.6724 2.45405C22.2597 2.02659 21.6962 1.7775 21.1023 1.76001C20.7972 1.7606 20.4954 1.8225 20.2148 1.94205L1.32767 10.1227C1.10492 10.2134 0.91666 10.3724 0.789919 10.5768C0.663177 10.7813 0.604479 11.0206 0.622252 11.2605V12C0.610042 12.2495 0.680302 12.4962 0.822188 12.7018C0.964074 12.9074 1.1697 13.0606 1.40732 13.1378L6.31114 14.7762L7.79025 19.771C7.88968 20.1212 8.08164 20.4381 8.34593 20.6883C8.61022 20.9386 8.93708 21.113 9.29212 21.1933C9.42814 21.21 9.5657 21.21 9.70172 21.1933C10.2064 21.1915 10.6911 20.996 11.0557 20.6471L12.8647 18.9405L16.3691 21.7053C16.7055 21.9679 17.109 22.1307 17.5335 22.1749C17.958 22.2192 18.3864 22.1432 18.7698 21.9556L19.1453 21.7621C19.4664 21.5971 19.7452 21.3604 19.9602 21.0704C20.1753 20.7804 20.3208 20.4448 20.3855 20.0896L23.3778 4.61583C23.4481 4.22527 23.4204 3.82338 23.2973 3.44612C23.1742 3.06887 22.9595 2.72801 22.6724 2.45405ZM18.7129 19.8165C18.6944 19.9148 18.6541 20.0077 18.595 20.0884C18.536 20.1691 18.4596 20.2356 18.3716 20.283L17.9961 20.4765C17.9221 20.5141 17.8402 20.5336 17.7572 20.5333C17.636 20.5311 17.5194 20.4868 17.4272 20.4082L13.1492 16.9949C13.0472 16.9045 12.9157 16.8546 12.7794 16.8546C12.6431 16.8546 12.5116 16.9045 12.4096 16.9949L9.88376 19.3728C9.83734 19.4069 9.78198 19.4266 9.72447 19.4297V15.4133C9.72462 15.3345 9.74084 15.2565 9.77214 15.1841C9.80344 15.1117 9.84916 15.0465 9.90652 14.9924C13.536 11.579 15.7092 9.66757 17.0063 8.5753C17.0475 8.53754 17.0809 8.49192 17.1043 8.44113C17.1277 8.39034 17.1408 8.33538 17.1428 8.27948C17.1473 8.22478 17.1395 8.16976 17.1198 8.11854C17.1001 8.06731 17.069 8.0212 17.029 7.98365C16.9735 7.91399 16.8963 7.86493 16.8097 7.84431C16.7231 7.82368 16.632 7.83268 16.5511 7.86988L7.94954 13.2971C7.87313 13.3335 7.78956 13.3524 7.70492 13.3524C7.62028 13.3524 7.53671 13.3335 7.4603 13.2971L2.32892 11.5449L20.8406 3.51219C20.9079 3.49622 20.978 3.49622 21.0454 3.51219C21.1277 3.51434 21.2087 3.53367 21.2832 3.56894C21.3576 3.6042 21.4239 3.65463 21.4777 3.71699C21.5554 3.79949 21.6123 3.89921 21.644 4.00799C21.6756 4.11677 21.681 4.23149 21.6598 4.34277L18.7129 19.8165Z"
                                        className="fill-current"
                                    />
                                </svg>
                            </i>
                            {/* <ConnectTwitter /> */}

                            <SelectChain />
                            <CustomConnectButton />
                        </div>
                        {/* mobile */}
                        <div className="gap-4 flex-items-center lg:hidden">
                            <Image
                                onClick={() => setSearchVisibility(true)}
                                src={search}
                                width={32}
                                height={32}
                                alt="search"
                                className="h-8 w-8"
                            />
                            {/* <CustomConnectButton
                                mobileDom={
                                    <div className="h-8 w-8 rounded-full bg-yellow flex-center">
                                        <Image src={walletIcon} width={24} height={24} alt="wallet" />
                                    </div>
                                }
                            /> */}
                            <Image
                                src={navIcon}
                                width={32}
                                height={32}
                                alt="navIcon"
                                className="h-8 w-8"
                                onClick={() => setVisible(true)}
                            />
                        </div>
                        <NavSidebar links={links} setVisible={setVisible} visible={visible} pathname={pathname} />
                        <GuideModal value={guideVisible} onChange={setGuideVisible} />
                    </>
                )}
            </div>
        </header>
    );
    // }
};

export default Header;
