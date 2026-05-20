import { ChainsType } from './common';

declare namespace GetCommentList {
    interface Response {
        items: CommentItem[];
        limit: number; // Page size
        page: number; // Page number
        total: number; // Total number of comments
    }

    interface Params {
        columns: { tokenAddress: string };
        limit: number; // Page size
        page: number; // Page number
        sort?: string;
    }

    interface CommentItem {
        id: number; // Comment ID, used for deletion
        tokenAddress: string; // Token address
        creatorAddress: string;
        commentContent: CommentContent;
        createdAt: string; // Comment creation time
    }

    interface CommentContent {
        images: string[] | null; // Comment images
        text: string; // Comment text
    }
}
declare namespace CreateComment {
    type Response = true;
    interface Params {
        tokenAddress: string;
        creatorAddress: string;
        images: string[];
        text: string;
    }
    interface FromType {
        content: string;
        url: UploadFile<string>[];
    }
}
declare namespace GetTradeList {
    interface Params {
        columns: {
            tokenAddress: string;
        };
        limit: number;
        page: number;
        sort?: string;
    }
    interface Response {
        items: TradeItem[];
        limit: number; // Page size
        page: number; // Page number
        total: number; // Total number of comments
    }
    interface TradeItem {
        id: number;
        act: number;
        tradeAmount: string;
        tokenAmount: number;
        txn: '';
        tokenAddress: string;
        creatorAddress: string;
        fee: number;
        createdAt: string;
        updatedAt: string;
    }
}
declare namespace GetHoldersList {
    interface Params {
        columns: {
            tokenAddress: string;
        };
        limit: number;
        page: number;
        sort?: string;
    }
    interface Response {
        items: HolderItem[];
        limit: number; // Page size
        page: number; // Page number
        total: number; // Total number of comments
    }
    interface HolderItem {
        id: number;
        memberName: string;
        creatorAddress: string;
        tokenAddress: string;
        balanceRate: string;
        balance: string;
        cost: string;
        sold: string;
        createdAt: string;
        updatedAt: string;
        profit: number;
        profitRate: number;
        balanceAmount: string;
    }
}
declare namespace GetTrendingList {
    interface Params {
        chainName: string;
        duration: number;
        limit: number;
        creatorToken: string;
        sort?: string;
    }
    type Response = TrendItem[];
    interface TrendItem {
        tokenName: string;
        tokenLogo: string;
        tokenTicker: string;
        tokenAddress: string;
        tokenPrice: string;
        tokenChange: string;
        tokenVolume: string;
        followed: boolean;
    }
}
declare namespace GetTradeDetail {
    interface Params {
        tokenAddress: string;
        hours: number;
    }
    interface Response {
        data: TrendItem[];
    }
    interface TrendItem {
        start_time: string;
        end_time: string;
        trade_cnt: number;
        buy_cnt: number;
        sell_cnt: number;
        trade_amt: number;
        buy_amt: number;
        sell_amt: number;
        token_amt: number;
        buy_token_amt: number;
        sell_token_amt: number;
        buyers: number;
        sellers: number;
        total_users: number;
    }
}
declare namespace GetTokenDetailInfo {
    interface Response {
        token: {
            id: number;
            followed: boolean;
            nativeAmount: string;
            nativeUsd: string;
            tokenUsd: string;
            auctionTime: string;
            chainID: string;
            createdAt: string;
            creatorAddress: string;
            devPurchase: number;
            endBlock: number;
            farcaster: string;
            fee: number;
            id: number;
            initialLiquidity: number;
            pairAddress: string;
            startBlock: number;
            telegramUrl: string;
            tokenAddress: string;
            tokenDescribe: string;
            tokenLiquidity: number;
            tokenLogo: string;
            tokenName: string;
            tokenPrice: number;
            tokenReleased: number;
            tokenTicker: string;
            totalSupply: string;
            twitterUrl: string;
            updatedAt: string;
            viewCount: number;
            webSite: string;
            aucT: number;
            aucP: number;
            createdAt: number;
            tokenAmount: number;
        };
    }
    interface Params {
        address: string;
    }
}

declare namespace GetTokenTrending {
    interface Params {
        chainName: ChainsType;
        duration: number;
        trending: number;
        sort: string;
    }
    interface TokenInfo {
        tokenName: string;
        tokenLogo: string;
        tokenTicker: string;
        tokenAddress: string;
        tokenPrice: string;
        tokenChange: string;
        tokenVolume: string;
    }
    type Response = {
        TokenInfo;
    }[];
}
declare namespace Members {
    interface Params {
        twName: string;
        twUserName: string;
        twAvatarUrl: string;
        loginId: number;
    }
}
declare namespace CheckInviteCode {
    interface Params {
        id: string;
        address: string;
    }
    interface Response {
        checkResult: boolean;
    }
}
declare namespace CheckAirdrop {
    interface Params {
        user_address: string;
        chain: string;
    }
    interface Response {
        chain: string;
        userAddress: string;
        eligible: string;
    }
}
declare namespace GetSummary {
    interface Params {
        creatorAddress: string;
    }
    interface Response {
        total: number;
        tradeTotal: number;
        twTotal: number;
        createTotal: number;
        addressTotal: number;
        inviteTotal: number;
        creatorCount: number;
        tradeVol: number;
        inviteCount: number;
        id: number;
        creatorAddress: string;
        memberName: string;
        pictureUrl: string;
        memberStatus: number;
        chainId: string;
        twName: string;
        twUserName: string;
        twAvatarUrl: string;
        twScore: string;
        inviteCode: string;
        invitedCode: string;
        eligible: '1' | '0' | '';
    }
}
declare namespace GetAirdropRank {
    interface item {
        creatorAddress: string;
    }
    interface Params {
        page: number;
        pageSize: number;
    }
    type Response = { item: item[]; total: number };
}
declare namespace GetTwRank {
    interface item {
        id: number;
        memberName: string;
        creatorAddress: string;
        totatwScorel: string;
    }
    type Response = { item: item[]; total: number };
}
declare namespace InviteLogs {
    interface Params {
        page: number;
        pageSize: number;
        creatorAddress: string;
    }
    interface item {
        id: number;
        rewards: number;
        creatorAddress: string;
        invitedAddress: string;
        createdTime: string;
    }
    type Response = item[];
}
declare namespace TradeLogs {
    interface item {
        id: number;
        rewards: number;
        creatorAddress: string;
        tradeVolume: number;
        createdTime: string;
        txHash: string;
    }
    type Response = { item: item[]; total: number };
}
declare namespace GetProgress {
    interface Response {
        consume: string;
        twitter: string;
        address: string;
        addressCount: string;
        twitterCount: string;
    }
}
declare namespace CheckTwBind {
    interface Params {
        twUserName: string;
    }
}
