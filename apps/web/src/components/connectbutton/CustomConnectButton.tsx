'use client';
import React, { ReactNode } from 'react';
import { getIsChainSupported } from '@/constants';
import useWalletAddress from '@/hooks/useWalletAddress';
import useStore from '@/store/zustand';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from 'primereact/button';
import { useAccount, useDisconnect } from 'wagmi';
import AddressMenu from '../MainLayout/AddressMenu';

type Props = {
    className?: string;
    mobileDom?: ReactNode;
};
const WButton = ({ handle, text, className }: { handle: () => any; text: string; className?: string }) => {
    return (
        <Button
            onClick={handle}
            className={
                className
                    ? className
                    : 'hidden border-none bg-yellow px-4 py-2.5 font-helvetica text-sm font-bold text-[#333] lg:block'
            }
        >
            {text}
        </Button>
    );
};
const CustomConnectButton = (props: Props) => {
    const setLoginId = useStore((state) => state.setLoginId);
    const { addressToken, publicKey, addressTokenDisplayName, addressTokenStr } = useWalletAddress();
    // currentChain
    const currentChain = useStore((state) => state.currentChain);
    // Solana  evm connect disconnect
    const { disconnect: solanaWalletDisconnect, wallet, connected } = useWallet();
    const { chainId: evmChainId } = useAccount();
    const { disconnect: evmDisconnect } = useDisconnect();
    // connect modal
    const { setVisible: setSolanaWalletModalVisible } = useWalletModal();
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    // isEvmSupportChain
    const isEvmSupportChain = currentChain !== 'sol' && evmChainId ? getIsChainSupported(evmChainId) : false;
    // connect modal
    const handleConnect = () => {
        if (currentChain === 'sol') {
            return setSolanaWalletModalVisible(true);
        }
        openConnectModal!();
    };

    const resetLoginStatus = () => {
        setLoginId();
        localStorage.removeItem('auth_expirationTime');
        localStorage.removeItem('access_token');
    };
    // disConnect
    const handleDisconnect = () => {
        if (currentChain === 'sol') {
            resetLoginStatus();
            solanaWalletDisconnect();
        } else {
            resetLoginStatus();
            evmDisconnect();
        }
    };

    ///////////////////////////////
    ///////////EVM DOM/////////////
    ///////////////////////////////
    if (currentChain !== 'sol') {
        return (
            <div>
                {openConnectModal && (
                    <div>
                        <WButton handle={handleConnect} text="Connect wallet" className={props.className} />
                        <div className="lg:hidden" onClick={handleConnect}>
                            {/* <div className="h-8 w-8 rounded-full bg-yellow flex-center" onClick={handleConnect}>
                                <Image src={walletIcon} width={24} height={24} alt="wallet" />
                            </div> */}
                            {props.mobileDom}
                        </div>
                    </div>
                )}
                {!isEvmSupportChain && openChainModal && (
                    <Button
                        onClick={openChainModal}
                        label="Wrong network"
                        icon="pi pi-angle-down"
                        severity="danger"
                        iconPos="right"
                        className="font-bold text-white"
                    />
                )}
                {/* TODO:DISConnect */}
                {addressToken && isEvmSupportChain && (
                    <WButton handle={handleDisconnect} text={addressTokenDisplayName} />
                )}
            </div>
        );
    }
    ///////////////////////////////
    ///////////Solana DOM//////////
    ///////////////////////////////
    return (
        <>
            {/* TODO:DISConnect */}
            {publicKey ? (
                <div>
                    <div className="hidden lg:block">
                        <AddressMenu handleDisconnect={handleDisconnect} />
                    </div>
                    <div className="lg:hidden">
                        <WButton handle={handleDisconnect} text="Disconnect" className={props.className} />
                    </div>
                </div>
            ) : (
                <div>
                    <WButton handle={handleConnect} text="Connect wallet" className={props.className} />
                    {/* <div className="h-8 w-8 rounded-full bg-yellow flex-center lg:hidden" onClick={handleConnect}>
                        <Image src={walletIcon} width={24} height={24} alt="wallet" />
                    </div> */}
                    <div className="lg:hidden" onClick={handleConnect}>
                        {/* <div className="h-8 w-8 rounded-full bg-yellow flex-center" onClick={handleConnect}>
                                <Image src={walletIcon} width={24} height={24} alt="wallet" />
                            </div> */}
                        {props.mobileDom}
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomConnectButton;
