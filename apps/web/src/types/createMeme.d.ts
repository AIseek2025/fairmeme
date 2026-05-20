import { PublicKey } from '@solana/web3.js';

declare namespace UploadLogo {
    interface Params {
        file: File;
    }
    interface Response {
        fileUrl: string;
    }
}
declare namespace TokenCreate {
    interface Params {
        tokenName: string;
        chainID: ChainsType;
        tokenLogo: string;
        tokenTicker: string;
        tokenDescribe: string;
        auctionCycle: string;
        creatorAddress: PublicKey | null;
        webSite?: string;
        twitterUrl?: string;
        telegramUrl?: string;
        farcaster?: string;
        tokenAddress: string;
        // telegramUrl?: string;
        // tokenAddress: string;
        // tokenDesc: string;
        // twitterUrl?: string;
        // txHash: string;
        // websiteUrl?: string;
    }
    type Response = string;
}

interface CreateMemeFormType {
    tokenName: string;
    chainID: ChainsType;
    tokenLogo: string;
    tokenTicker: string;
    tokenDescribe: string;
    auctionCycle: string;
    creatorAddress: PublicKey | null;
    webSite?: string;
    twitterUrl?: string;
    telegramUrl?: string;
    farcaster?: string;
    tokenLogo: UploadFile<string>[];
    more?: boolean;
}
