/// <reference types="vite-plugin-svgr/client" />
declare namespace User {
    interface Params {
        creatorAddress: string;
        chainID: ChainsType;
        message: string;
        sign: string;
        nonce: string;
    }
    type Respones = UserInfo;
}

interface UserInfo {
    id: number;
    accessToken: string;
    refreshToken: string;
}

interface ResponseTypes<T = unknown> {
    code: number;
    data: T;
    message?: string;
}

type EthAccountType = `0x${string}`;
interface ChainMapType {
    sol: string;
    base: EthAccountType | '';
}
type ChainsType = 'base' | 'sol' | 'eth' | 'bnb';
interface LocalStore {
    state: {
        currentChain: ChainsType;
        loginId?: number;
        currentSlippage: number;
    };
}

type TrendingTime = '1h' | '6h' | '12h' | '24h';
export type ChianListType = {
    title: string;
    key: ChainsType;
    chainId: number;
    icon: StaticImageData;
    nativeCoin: string;
    disabled?: boolean;
};
