declare namespace FairMemeHome {
    interface Item {
        id: number;
        memberName: string;
        tokenName: string;
        chainID: ChainsType;
        tokenLogo: string;
        tokenTicker: string;
        tokenDescribe: string;
        auctionTime: string;
        webSite: string;
        twitterUrl: string;
        telegramUrl: string;
        tokenAddress: string;
        farcaster: string;
        totalSupply: string;
        startBlock: number;
        endBlock: number;
        devPurchase: number;
        initialLiquidity: number;
        tokenPrice: number;
        tokenLiquidity: number;
        viewCount: number;
        tokenReleased: number;
        pairAddress: string;
        creatorAddress: string;
        fee: number;
        price: number;
        balance: number;
        createdAt: string;
        updatedAt: string;
        created: string;
        marketCap: string;
        fdmc: string;
        liquidity: string;
        vol1: string;
        vol6: string;
        vol12: string;
        vol24: string;
        change1: string;
        change6: string;
        change12: string;
        change24: string;
        turnover1: string;
        turnover6: string;
        turnover12: string;
        turnover24: string;
        txs1: string;
        txs6: string;
        txs12: string;
        txs24: string;
        holders: string;
        watchers: string;
        views: string;
        aucT: string;
        aucP: string;
        followed: boolean;
    }
    type ItemKeys = keyof Item;
    interface Params {
        columns: {
            type: 'swap' | 'home' | 'watch';
            keyword?: string;
            chainName: ChainsType | '';
            address?: string;
        };
        limit: number;
        page: number;
        sort?: string;
    }
    interface Response {
        items: Item[];
        total: number;
        limit: number;
        page: number;
    }

    interface FollowActionParams {
        creatorAddress: string;
        tokenAddress: string;
    }
}

interface HomeContentMethods {
    handleSearch: () => void;
}
