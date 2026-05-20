import { ChianListType } from '@/types/common';
import { IS_TEST } from './env';
import { baseIcon, bnbIcon, ethIcon, solanaIcon } from '@/assets/images';
import { StaticImageData } from 'next/image';
import { memoize } from 'lodash-es';

export const WALLET_LIST = [
    {
        key: 'metaMask',
        label: 'MetaMask',
        imgSrc: '/src/assets/icon/MetaMask.png',
    },
    {
        key: 'bitgetWallet',
        label: 'Bitget Wallet',
        imgSrc: '/src/assets/icon/Bitget.png',
    },
    {
        key: 'uniswapWallet',
        label: 'Uniswap Wallet',
        imgSrc: '/src/assets/icon/Uniswap.png',
    },
    {
        key: 'coinbaseWallet',
        label: 'Coinbase Wallet',
        imgSrc: '/src/assets/icon/Coinbase.png',
    },
    {
        key: 'walletConnect',
        label: 'WalletConnect',
        imgSrc: '/src/assets/icon/WalletConnect.png',
    },
];

export enum ESTIMATE_BLOCK_TIME {
    'sol' = 0.4,
    'eth' = 12,
    'base' = 2,
    'bnb' = 3,
}
export interface ChainMapProps {
    title: string;
    key: string;
    icon: StaticImageData;
    chainId: number;
    nativeCoin: string;
}
export const CHAIN_ICON_MAP: Record<string, ChainMapProps> = {
    eth: {
        title: 'ETH',
        key: 'eth',
        icon: ethIcon,
        chainId: IS_TEST ? 11155111 : 1,
        nativeCoin: 'ETH',
    },
    base: {
        title: 'Base',
        key: 'base',
        icon: baseIcon,
        chainId: IS_TEST ? 84532 : 8453,
        nativeCoin: 'ETH',
    },
    sol: {
        title: 'Sol',
        key: 'sol',
        icon: solanaIcon,
        chainId: 101,
        nativeCoin: 'SOL',
    },
    bnb: {
        title: 'Bnb',
        key: 'bnb',
        icon: bnbIcon,
        chainId: 56,
        nativeCoin: 'BNB',
    },
};
export const CHAIN_LIST: ChianListType[] = [
    {
        title: 'Sol',
        key: 'sol',
        chainId: 101,
        icon: solanaIcon,
        nativeCoin: 'SOL',
    },
    {
        title: 'ETH',
        key: 'eth',
        chainId: IS_TEST ? 11155111 : 1,
        icon: ethIcon,
        nativeCoin: 'ETH',
        disabled: true,
    },
    {
        title: 'Base',
        key: 'base',
        chainId: IS_TEST ? 84532 : 8453,
        icon: baseIcon,
        nativeCoin: 'SOL',
        disabled: true,
    },

    {
        title: 'Bnb',
        key: 'bnb',
        icon: bnbIcon,
        chainId: IS_TEST ? 97 : 56,
        nativeCoin: 'BNB',
        disabled: true,
    },
];
export const getIsChainSupported = memoize((chainId: number) => {
    return !!CHAIN_LIST.find((item) => item.chainId === chainId);
});
export const DEFAULT_IMG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

export const BALANCE_RATIO_CONFIG = [
    {
        name: '25%',
        value: 25,
        id: 0,
    },
    {
        name: '50%',
        value: 50,
        id: 1,
    },
    {
        name: '75%',
        value: 75,
        id: 2,
    },
    {
        name: 'MAX',
        value: 100,
        id: 3,
    },
];

export const DEMO_BAR_DATA = [
    {
        time: '1723296240',
        open: 0.0000267665872756,
        close: 0.0000267665872756,
        high: 0.000026763655782300002,
        low: 0.000026763655782300002,
        volume: 0,
    },
    {
        time: '1723296300',

        open: 0.000026763460372300002,
        close: 0.000026763460372300002,
        high: 0.0000267609203012,
        low: 0.0000267609203012,
        volume: 0,
    },
    {
        time: '1723296360',

        open: 0.0000267607249311,
        close: 0.0000267607249311,
        high: 0.000026757990049000002,
        low: 0.000026757990049000002,
        volume: 0,
    },
    {
        time: '1723296420',

        open: 0.0000267577947217,
        close: 0.0000267577947217,
        high: 0.000026755060438500003,
        low: 0.000026755060438500003,
        volume: 0,
    },
    {
        time: '1723296480',

        open: 0.000026754669872200002,
        close: 0.000026754865153900006,
        high: 0.000026752131469400003,
        low: 0.000026752131469400003,
        volume: 0,
    },
    {
        time: '1723296540',

        open: 0.000026751936227600005,
        close: 0.000026751936227600005,
        high: 0.000026749007942400004,
        low: 0.000026749007942400004,
        volume: 0,
    },
    {
        time: '1723296600',

        open: 0.000026748812746200004,
        close: 0.000026748812746200004,
        high: 0.0000267462754546,
        low: 0.0000267462754546,
        volume: 0,
    },
    {
        time: '1723296660',

        open: 0.0000267460802983,
        close: 0.0000267460802983,
        high: 0.0000267431532949,
        low: 0.0000267431532949,
        volume: 0,
    },
    {
        time: '1723296720',

        open: 0.000026742958184100002,
        close: 0.000026742958184100002,
        high: 0.0000267404220031,
        low: 0.0000267404220031,
        volume: 0,
    },
    {
        time: '1723296780',

        open: 0.0000267402269321,
        close: 0.0000267402269321,
        high: 0.000026737301209700003,
        low: 0.000026737301209700003,
        volume: 0,
    },
    {
        time: '1723296840',

        open: 0.000026737106184300002,
        close: 0.000026737106184300002,
        high: 0.000026734571113000006,
        low: 0.000026734571113000006,
        volume: 0,
    },
    {
        time: '1723296900',

        open: 0.0000267343761274,
        close: 0.0000267343761274,
        high: 0.000026731646628000004,
        low: 0.000026731646628000004,
        volume: 0,
    },
    {
        time: '1723296960',

        open: 0.000026731451685100003,
        close: 0.000026731451685100003,
        high: 0.0000267287227827,
        low: 0.0000267287227827,
        volume: 0,
    },
    {
        time: '1723297020',

        open: 0.000026728527882500003,
        close: 0.000026728527882500003,
        high: 0.000026725799577000004,
        low: 0.000026725799577000004,
        volume: 0,
    },
    {
        time: '1723297080',

        open: 0.0000267256047194,
        close: 0.0000267256047194,
        high: 0.000026722682195600004,
        low: 0.000026722682195600004,
        volume: 0,
    },
    {
        time: '1723297140',

        open: 0.000026722487383400002,
        close: 0.000026722487383400002,
        high: 0.000026719955083400004,
        low: 0.000026719955083400004,
        volume: 0,
    },
    {
        time: '1723297200',

        open: 0.0000267197603109,
        close: 0.0000267197603109,
        high: 0.000026716839065200003,
        low: 0.000026716839065200003,
        volume: 0,
    },
    {
        time: '1723297260',

        open: 0.000026716644338200003,
        close: 0.000026716644338200003,
        high: 0.000026714113145400003,
        low: 0.000026714113145400003,
        volume: 0,
    },
    {
        time: '1723297320',

        open: 0.000026713918458100003,
        close: 0.000026713918458100003,
        high: 0.000026711193134200004,
        low: 0.000026711193134200004,
        volume: 0,
    },
    {
        time: '1723297380',

        open: 0.0000267109984895,
        close: 0.0000267109984895,
        high: 0.000026708273761300002,
        low: 0.000026708273761300002,
        volume: 0,
    },
    {
        time: '1723297440',

        open: 0.000026708079159100003,
        close: 0.000026708079159100003,
        high: 0.000026705160466800003,
        low: 0.000026705160466800003,
        volume: 0,
    },
    {
        time: '1723297500',

        open: 0.00002670496591,
        close: 0.00002670496591,
        high: 0.0000267024369295,
        low: 0.0000267024369295,
        volume: 0,
    },
    {
        time: '1723297560',

        open: 0.000026702242412400005,
        close: 0.000026702242412400005,
        high: 0.000026699519470200003,
        low: 0.000026699519470200003,
        volume: 0,
    },
    {
        time: '1723297620',

        open: 0.0000266993249956,
        close: 0.0000266993249956,
        high: 0.0000266964082162,
        low: 0.0000266964082162,
        volume: 0,
    },
    {
        time: '1723297680',

        open: 0.000026696213786900004,
        close: 0.000026696213786900004,
        high: 0.000026693492074,
        low: 0.000026693492074,
        volume: 0,
    },
    {
        time: '1723297740',

        open: 0.0000266932976872,
        close: 0.0000266932976872,
        high: 0.000026690965266099998,
        low: 0.000026690965266099998,
        volume: 0,
    },
    {
        time: '1723297800',

        open: 0.0000266905765689,
        close: 0.0000266905765689,
        high: 0.000026687856005300002,
        low: 0.000026687856005300002,
        volume: 0,
    },
    {
        time: '1723297860',

        open: 0.000026687661700500003,
        close: 0.000026687661700500003,
        high: 0.000026685330264200004,
        low: 0.000026685330264200004,
        volume: 0,
    },
    {
        time: '1723297920',

        open: 0.0000266851359962,
        close: 0.0000266851359962,
        high: 0.0000266820280933,
        low: 0.0000266820280933,
        volume: 0,
    },
    {
        time: '1723297980',

        open: 0.0000266818338734,
        close: 0.0000266818338734,
        high: 0.000026678920914199998,
        low: 0.000026678920914199998,
        volume: 0,
    },
    {
        time: '1723298040',

        open: 0.0000266787267396,
        close: 0.0000266787267396,
        high: 0.000026676008591000005,
        low: 0.000026676008591000005,
        volume: 0,
    },
    {
        time: '1723298100',

        open: 0.0000266758144587,
        close: 0.0000266758144587,
        high: 0.0000266732909963,
        low: 0.0000266732909963,
        volume: 0,
    },
    {
        time: '1723298160',

        open: 0.0000266730969036,
        close: 0.0000266730969036,
        high: 0.000026670185851600003,
        low: 0.000026670185851600003,
        volume: 0,
    },
    {
        time: '1723298220',

        open: 0.0000266699918041,
        close: 0.0000266699918041,
        high: 0.0000266674694431,
        low: 0.0000266674694431,
        volume: 0,
    },
    {
        time: '1723298280',

        open: 0.0000266672754351,
        close: 0.0000266672754351,
        high: 0.000026664559619300004,
        low: 0.000026664559619300004,
        volume: 0,
    },
    {
        time: '1723298340',

        open: 0.0000266643656537,
        close: 0.0000266643656537,
        high: 0.000026661650430500002,
        low: 0.000026661650430500002,
        volume: 0,
    },
    {
        time: '1723298400',

        open: 0.0000266614565072,
        close: 0.0000266614565072,
        high: 0.0000266585479954,
        low: 0.0000266585479954,
        volume: 0,
    },
    {
        time: '1723298460',

        open: 0.0000266583541172,
        close: 0.0000266583541172,
        high: 0.000026655833956900002,
        low: 0.000026655833956900002,
        volume: 0,
    },
    {
        time: '1723298520',

        open: 0.0000266556401181,
        close: 0.0000266556401181,
        high: 0.000026652926671600004,
        low: 0.000026652926671600004,
        volume: 0,
    },
    {
        time: '1723298580',

        open: 0.000026652539081500002,
        close: 0.000026652732875200002,
        high: 0.000026650020020500002,
        low: 0.000026650020020500002,
        volume: 0,
    },
    {
        time: '1723298640',

        open: 0.000026649826266300004,
        close: 0.000026649826266300004,
        high: 0.000026646920291300006,
        low: 0.000026646920291300006,
        volume: 0,
    },
    {
        time: '1723298700',

        open: 0.0000266467265822,
        close: 0.0000266467265822,
        high: 0.000026644208619700004,
        low: 0.000026644208619700004,
        volume: 0,
    },
    {
        time: '1723298760',

        open: 0.00002664401495,
        close: 0.00002664401495,
        high: 0.000026641303869700003,
        low: 0.000026641303869700003,
        volume: 0,
    },
    {
        time: '1723298820',

        open: 0.0000266411102422,
        close: 0.0000266411102422,
        high: 0.0000266382061677,
        low: 0.0000266382061677,
        volume: 0,
    },
    {
        time: '1723298880',

        open: 0.0000266380125852,
        close: 0.0000266380125852,
        high: 0.000026635302726200002,
        low: 0.000026635302726200002,
        volume: 0,
    },
    {
        time: '1723298940',

        open: 0.000026635109185900005,
        close: 0.000026635109185900005,
        high: 0.0000266325934185,
        low: 0.0000266325934185,
        volume: 0,
    },
    {
        time: '1723299000',

        open: 0.000026632399917600004,
        close: 0.000026632399917600004,
        high: 0.000026629691200300004,
        low: 0.000026629691200300004,
        volume: 0,
    },
    {
        time: '1723299060',

        open: 0.0000266294977416,
        close: 0.0000266294977416,
        high: 0.000026626596198000002,
        low: 0.000026626596198000002,
        volume: 0,
    },
    {
        time: '1723299120',

        open: 0.000026626402784300002,
        close: 0.000026626402784300002,
        high: 0.000026623695286700006,
        low: 0.000026623695286700006,
        volume: 0,
    },
    {
        time: '1723299180',

        open: 0.0000266235019151,
        close: 0.0000266235019151,
        high: 0.000026620795007500003,
        low: 0.000026620795007500003,
        volume: 0,
    },
    {
        time: '1723299240',

        open: 0.000026620601678,
        close: 0.000026620601678,
        high: 0.000026617895360000005,
        low: 0.000026617895360000005,
        volume: 0,
    },
    {
        time: '1723299300',

        open: 0.000026617702072600003,
        close: 0.000026617702072600003,
        high: 0.000026614996344100004,
        low: 0.000026614996344100004,
        volume: 0,
    },
    {
        time: '1723299360',

        open: 0.0000266148030989,
        close: 0.0000266148030989,
        high: 0.0000266124843745,
        low: 0.0000266124843745,
        volume: 0,
    },
    {
        time: '1723299420',

        open: 0.000026612291165700002,
        close: 0.000026612291165700002,
        high: 0.0000266093933704,
        low: 0.0000266093933704,
        volume: 0,
    },
    {
        time: '1723299480',

        open: 0.0000266092002065,
        close: 0.0000266092002065,
        high: 0.0000266064962061,
        low: 0.0000266064962061,
        volume: 0,
    },
    {
        time: '1723299540',

        open: 0.000026606303084200003,
        close: 0.000026606303084200003,
        high: 0.0000266035996726,
        low: 0.0000266035996726,
        volume: 0,
    },
    {
        time: '1723299600',

        open: 0.000026603406592800003,
        close: 0.000026603406592800003,
        high: 0.000026600510731900002,
        low: 0.000026600510731900002,
        volume: 0,
    },
    {
        time: '1723299660',

        open: 0.000026600317697,
        close: 0.000026600317697,
        high: 0.0000265976155014,
        low: 0.0000265976155014,
        volume: 0,
    },
    {
        time: '1723299720',

        open: 0.0000265974225085,
        close: 0.0000265974225085,
        high: 0.0000265949138549,
        low: 0.0000265949138549,
        volume: 0,
    },
    {
        time: '1723299780',

        open: 0.0000265947209011,
        close: 0.0000265947209011,
        high: 0.000026592019842500004,
        low: 0.000026592019842500004,
        volume: 0,
    },
    {
        time: '1723299840',

        open: 0.000026591826930800002,
        close: 0.000026591826930800002,
        high: 0.0000265893193326,
        low: 0.0000265893193326,
        volume: 0,
    },
    {
        time: '1723299900',

        open: 0.000026589126460000002,
        close: 0.000026589126460000002,
        high: 0.000026586233707000003,
        low: 0.000026586233707000003,
        volume: 0,
    },
    {
        time: '1723299960',

        open: 0.000026586040879200005,
        close: 0.000026586040879200005,
        high: 0.0000265833415833,
        low: 0.0000265833415833,
        volume: 0,
    },
    {
        time: '1723300020',

        open: 0.0000265831487975,
        close: 0.0000265831487975,
        high: 0.0000265804500889,
        low: 0.0000265804500889,
        volume: 0,
    },
    {
        time: '1723300080',

        open: 0.0000265802573449,
        close: 0.0000265802573449,
        high: 0.000026577366521300005,
        low: 0.000026577366521300005,
        volume: 0,
    },
    {
        time: '1723300140',

        open: 0.000026577173822100004,
        close: 0.000026577173822100004,
        high: 0.000026574668986600003,
        low: 0.000026574668986600003,
        volume: 0,
    },
    {
        time: '1723300200',

        open: 0.000026574476326500002,
        close: 0.000026574476326500002,
        high: 0.000026571779378300003,
        low: 0.000026572742511200002,
        volume: 0,
    },
    {
        time: '1723300260',

        open: 0.0000265715867601,
        close: 0.0000265715867601,
        high: 0.000026568890398400004,
        low: 0.000026568890398400004,
        volume: 0,
    },
    {
        time: '1723300320',

        open: 0.000026568697822100004,
        close: 0.000026568697822100004,
        high: 0.000026565809512200004,
        low: 0.000026565809512200004,
        volume: 0,
    },
    {
        time: '1723300380',

        open: 0.000026565616980500002,
        close: 0.000026565616980500002,
        high: 0.000026563114322800002,
        low: 0.000026563114322800002,
        volume: 0,
    },
    {
        time: '1723300440',

        open: 0.000026562921830200004,
        close: 0.000026562921830200004,
        high: 0.0000265602272267,
        low: 0.0000265602272267,
        volume: 0,
    },
    {
        time: '1723300500',

        open: 0.000026560034776000005,
        close: 0.000026560034776000005,
        high: 0.0000265571483492,
        low: 0.0000265571483492,
        volume: 0,
    },
    {
        time: '1723300560',

        open: 0.000026556955943,
        close: 0.000026556955943,
        high: 0.000026554262549700002,
        low: 0.000026554262549700002,
        volume: 0,
    },
    {
        time: '1723300620',

        open: 0.000026554070185400003,
        close: 0.000026554070185400003,
        high: 0.000026551569702700004,
        low: 0.000026551569702700004,
        volume: 0,
    },
    {
        time: '1723300680',

        open: 0.000026551377377300003,
        close: 0.000026551377377300003,
        high: 0.000026548685115400004,
        low: 0.000026548685115400004,
        volume: 0,
    },
    {
        time: '1723300740',

        open: 0.000026548492831900002,
        close: 0.000026548492831900002,
        high: 0.000026545801154800003,
        low: 0.000026545801154800003,
        volume: 0,
    },
    {
        time: '1723300800',

        open: 0.000026545608913100003,
        close: 0.000026545608913100003,
        high: 0.000026542917820800004,
        low: 0.000026542917820800004,
        volume: 0,
    },
    {
        time: '1723300860',

        open: 0.000026542725620800002,
        close: 0.000026542725620800002,
        high: 0.000026540035113,
        low: 0.000026540035113,
        volume: 0,
    },
    {
        time: '1723300920',

        open: 0.0000265398429547,
        close: 0.0000265398429547,
        high: 0.000026536960914800002,
        low: 0.000026536960914800002,
        volume: 0,
    },
    {
        time: '1723300980',

        open: 0.000026536768801000002,
        close: 0.000026536768801000002,
        high: 0.000026534079500700003,
        low: 0.000026534079500700003,
        volume: 0,
    },
    {
        time: '1723301040',

        open: 0.0000265338874286,
        close: 0.0000265338874286,
        high: 0.0000265313907453,
        low: 0.0000265313907453,
        volume: 0,
    },
    {
        time: '1723301100',

        open: 0.000026531006681900002,
        close: 0.000026531006681900002,
        high: 0.000026530814654400005,
        low: 0.000026530814654400005,
        volume: 0,
    },
    {
        time: '1723301160',

        open: 0.0000265265907517,
        close: 0.0000265265907517,
        high: 0.0000265256309613,
        low: 0.0000265256309613,
        volume: 0,
    },
    {
        time: '1723301220',

        open: 0.0000265256309613,
        close: 0.0000265256309613,
        high: 0.000026522752007000004,
        low: 0.000026522752007000004,
        volume: 0,
    },
    {
        time: '1723301280',

        open: 0,
        close: 0.000026522368193700004,
        high: 0.0000265198736776,
        low: 0,
        volume: 0,
    },
    {
        time: '1723301340',

        open: 0,
        close: 0.000026519681811200002,
        high: 0.000026516804148,
        low: 0,
        volume: 0,
    },
    {
        time: '1723301400',

        open: 0.000026515461452300006,
        close: 0.000026516804148,
        high: 0.000026514310678400002,
        low: 0.000026514118892500006,
        volume: 0,
    },
    {
        time: '1723301460',

        open: 0.0000265139271093,
        close: 0.000026514118892500006,
        high: 0.000026511434180700003,
        low: 0.0000265110506949,
        volume: 0,
    },
    {
        time: '1723301520',

        open: 0.000026511242436400003,
        close: 0.000026511242436400003,
        high: 0.000026508558307100002,
        low: 0.000026508558307100002,
        volume: 0,
    },
    {
        time: '1723301580',

        open: 0.000026508366604400003,
        close: 0.000026508366604400003,
        high: 0.000026505683057400004,
        low: 0.000026505683057400004,
        volume: 0,
    },
    {
        time: '1723301640',

        open: 0.0000265054913962,
        close: 0.0000265054913962,
        high: 0.000026502808431300003,
        low: 0.000026502808431300003,
        volume: 0,
    },
    {
        time: '1723301700',

        open: 0.0000265026168117,
        close: 0.0000265026168117,
        high: 0.000026499934428600003,
        low: 0.000026499934428600003,
        volume: 0,
    },
    {
        time: '1723301760',

        open: 0.0000264997428506,
        close: 0.0000264997428506,
        high: 0.000026497252588500003,
        low: 0.000026497252588500003,
        volume: 0,
    },
    {
        time: '1723301820',

        open: 0.000026497061049300002,
        close: 0.000026497061049300002,
        high: 0.000026494188292900004,
        low: 0.000026494188292900004,
        volume: 0,
    },
    {
        time: '1723301880',

        open: 0.000026493996798000002,
        close: 0.000026493996798000002,
        high: 0.000026491316159500003,
        low: 0.000026491316159500003,
        volume: 0,
    },
    {
        time: '1723301940',

        open: 0.000026491124706000003,
        close: 0.000026491124706000003,
        high: 0.0000264884446486,
        low: 0.0000264884446486,
        volume: 0,
    },
    {
        time: '1723302000',

        open: 0.000026488253236700003,
        close: 0.000026488253236700003,
        high: 0.0000264855737602,
        low: 0.0000264855737602,
        volume: 0,
    },
    {
        time: '1723302060',

        open: 0.0000264853823898,
        close: 0.0000264853823898,
        high: 0.000026482703494099998,
        low: 0.000026482703494099998,
        volume: 0,
    },
    {
        time: '1723302120',

        open: 0.0000264825121651,
        close: 0.0000264825121651,
        high: 0.00002647983385,
        low: 0.00002647983385,
        volume: 0,
    },
    {
        time: '1723302180',

        open: 0.000026479642562500002,
        close: 0.000026479642562500002,
        high: 0.0000264769648277,
        low: 0.0000264769648277,
        volume: 0,
    },
    {
        time: '1723302240',

        open: 0.000026476773581700005,
        close: 0.000026476773581700005,
        high: 0.000026474096427100003,
        low: 0.000026474096427100003,
        volume: 0,
    },
    {
        time: '1723302300',

        open: 0.000026473905222500005,
        close: 0.000026473905222500005,
        high: 0.000026471228647900002,
        low: 0.000026471228647900002,
        volume: 0,
    },
    {
        time: '1723302360',

        open: 0.000026471037484700004,
        close: 0.000026471037484700004,
        high: 0.0000264683614899,
        low: 0.0000264683614899,
        volume: 0,
    },
    {
        time: '1723302420',

        open: 0.0000264681703682,
        close: 0.0000264681703682,
        high: 0.000026465494953,
        low: 0.000026465494953,
        volume: 0,
    },
    {
        time: '1723302480',

        open: 0.0000264653038726,
        close: 0.0000264653038726,
        high: 0.0000264626290369,
        low: 0.0000264626290369,
        volume: 0,
    },
    {
        time: '1723302540',

        open: 0.000026462437997900002,
        close: 0.000026462437997900002,
        high: 0.000026459763741400003,
        low: 0.000026459763741400003,
        volume: 0,
    },
    {
        time: '1723302600',

        open: 0.0000264595727438,
        close: 0.0000264595727438,
        high: 0.0000264568990663,
        low: 0.0000264568990663,
        volume: 0,
    },
    {
        time: '1723302660',

        open: 0.0000264567081101,
        close: 0.0000264567081101,
        high: 0.000026454035011500004,
        low: 0.000026454035011500004,
        volume: 0,
    },
    {
        time: '1723302720',

        open: 0.000026453844096600002,
        close: 0.000026453844096600002,
        high: 0.000026451171576700003,
        low: 0.000026451171576700003,
        volume: 0,
    },
    {
        time: '1723302780',

        open: 0.000026450980703100003,
        close: 0.000026450980703100003,
        high: 0.0000264483087617,
        low: 0.0000264483087617,
        volume: 0,
    },
    {
        time: '1723302840',

        open: 0.000026448117929400005,
        close: 0.000026448117929400005,
        high: 0.000026445446566300003,
        low: 0.000026445446566300003,
        volume: 0,
    },
    {
        time: '1723302900',

        open: 0.000026445255775300003,
        close: 0.000026445255775300003,
        high: 0.000026442584990400005,
        low: 0.000026442584990400005,
        volume: 0,
    },
    {
        time: '1723302960',

        open: 0.000026442394240600003,
        close: 0.000026442394240600003,
        high: 0.0000264397240336,
        low: 0.0000264397240336,
        volume: 0,
    },
    {
        time: '1723303020',

        open: 0.0000264395333252,
        close: 0.0000264395333252,
        high: 0.000026436863695900002,
        low: 0.000026436863695900002,
        volume: 0,
    },
    {
        time: '1723303080',

        open: 0.0000264366730287,
        close: 0.0000264366730287,
        high: 0.000026434003977000002,
        low: 0.000026434003977000002,
        volume: 0,
    },
    {
        time: '1723303140',

        open: 0.000026433813351,
        close: 0.000026433813351,
        high: 0.000026431144876700004,
        low: 0.000026431144876700004,
        volume: 0,
    },
    {
        time: '1723303200',

        open: 0.000026430954292000005,
        close: 0.000026430954292000005,
        high: 0.000026428286394800004,
        low: 0.000026428286394800004,
        volume: 0,
    },
    {
        time: '1723303260',

        open: 0.000026428095851300003,
        close: 0.000026428095851300003,
        high: 0.000026425428531100005,
        low: 0.000026425428531100005,
        volume: 0,
    },
    {
        time: '1723303320',

        open: 0.0000264252380288,
        close: 0.0000264252380288,
        high: 0.0000264225712855,
        low: 0.0000264225712855,
        volume: 0,
    },
    {
        time: '1723303380',

        open: 0.0000264223808244,
        close: 0.0000264223808244,
        high: 0.000026419714657600004,
        low: 0.000026419714657600004,
        volume: 0,
    },
    {
        time: '1723303440',

        open: 0.000026419524237700002,
        close: 0.000026419524237700002,
        high: 0.0000264168586474,
        low: 0.0000264168586474,
        volume: 0,
    },
    {
        time: '1723303500',

        open: 0.000026416668268600002,
        close: 0.000026416668268600002,
        high: 0.000026414003254500004,
        low: 0.000026414003254500004,
        volume: 0,
    },
    {
        time: '1723303560',

        open: 0.000026413812917000004,
        close: 0.000026413812917000004,
        high: 0.0000264111484789,
        low: 0.0000264111484789,
        volume: 0,
    },
    {
        time: '1723303620',

        open: 0.000026410958182500005,
        close: 0.000026410958182500005,
        high: 0.0000264082943203,
        low: 0.0000264082943203,
        volume: 0,
    },
    {
        time: '1723303680',

        open: 0.000026408104065000004,
        close: 0.000026408104065000004,
        high: 0.000026405440778500002,
        low: 0.000026405440778500002,
        volume: 0,
    },
    {
        time: '1723303740',

        open: 0.000026405250564300003,
        close: 0.000026405250564300003,
        high: 0.0000264025878534,
        low: 0.0000264025878534,
        volume: 0,
    },
    {
        time: '1723303800',

        open: 0.000026402397680300002,
        close: 0.000026402397680300002,
        high: 0.000026399735544600003,
        low: 0.000026399735544600003,
        volume: 0,
    },
    {
        time: '1723303860',

        open: 0.0000263995454126,
        close: 0.0000263995454126,
        high: 0.000026396883852,
        low: 0.000026396883852,
        volume: 0,
    },
    {
        time: '1723303920',

        open: 0.000026396693761100003,
        close: 0.000026396693761100003,
        high: 0.0000263940327755,
        low: 0.0000263940327755,
        volume: 0,
    },
    {
        time: '1723303980',

        open: 0.000026393842725600003,
        close: 0.000026393842725600003,
        high: 0.0000263911823147,
        low: 0.0000263911823147,
        volume: 0,
    },
    {
        time: '1723304040',

        open: 0.0000263909923059,
        close: 0.0000263909923059,
        high: 0.000026388332469600003,
        low: 0.000026388332469600003,
        volume: 0,
    },
    {
        time: '1723304100',

        open: 0.000026388142501800005,
        close: 0.000026388142501800005,
        high: 0.000026385483239900005,
        low: 0.000026385483239900005,
        volume: 0,
    },
    {
        time: '1723304160',

        open: 0.000026385293313100003,
        close: 0.000026385293313100003,
        high: 0.0000263826346254,
        low: 0.0000263826346254,
        volume: 0,
    },
    {
        time: '1723304220',

        open: 0.0000263824447396,
        close: 0.0000263824447396,
        high: 0.000026379976473399998,
        low: 0.000026379976473399998,
        volume: 0,
    },
    {
        time: '1723304280',

        open: 0.000026379786625900003,
        close: 0.000026379786625900003,
        high: 0.000026376939241300003,
        low: 0.000026376939241300003,
        volume: 0,
    },
    {
        time: '1723304340',

        open: 0.000026376749437500003,
        close: 0.000026376749437500003,
        high: 0.0000263740924712,
        low: 0.0000263740924712,
        volume: 0,
    },
    {
        time: '1723304400',

        open: 0.000026373902708400004,
        close: 0.000026373902708400004,
        high: 0.000026371246315600002,
        low: 0.000026371246315600002,
        volume: 0,
    },
    {
        time: '1723304460',

        open: 0.0000263710565937,
        close: 0.0000263710565937,
        high: 0.000026368590457800003,
        low: 0.000026368590457800003,
        volume: 0,
    },
    {
        time: '1723304520',

        open: 0.000026368400774200003,
        close: 0.000026368400774200003,
        high: 0.0000263655558468,
        low: 0.0000263655558468,
        volume: 0,
    },
    {
        time: '1723304580',

        open: 0.000026365366206800004,
        close: 0.000026365366206800004,
        high: 0.000026362711533200004,
        low: 0.000026362711533200004,
        volume: 0,
    },
    {
        time: '1723304640',

        open: 0.0000263625219341,
        close: 0.0000263625219341,
        high: 0.000026359867833200003,
        low: 0.000026359867833200003,
        volume: 0,
    },
    {
        time: '1723304700',

        open: 0.000026359678275100002,
        close: 0.000026359678275100002,
        high: 0.0000263570247467,
        low: 0.0000263570247467,
        volume: 0,
    },
    {
        time: '1723304760',

        open: 0.000026356835229400002,
        close: 0.000026356835229400002,
        high: 0.0000263541822734,
        low: 0.0000263541822734,
        volume: 0,
    },
    {
        time: '1723304820',

        open: 0.000026353992797000002,
        close: 0.000026353992797000002,
        high: 0.0000263513404131,
        low: 0.0000263513404131,
        volume: 0,
    },
    {
        time: '1723304880',

        open: 0.000026351150977600002,
        close: 0.000026351150977600002,
        high: 0.0000263484991657,
        low: 0.0000263484991657,
        volume: 0,
    },
    {
        time: '1723304940',

        open: 0.000026348309771,
        close: 0.000026348309771,
        high: 0.0000263456585309,
        low: 0.0000263456585309,
        volume: 0,
    },
    {
        time: '1723305000',

        open: 0.000026345469177,
        close: 0.000026345469177,
        high: 0.0000263428185085,
        low: 0.0000263428185085,
        volume: 0,
    },
    {
        time: '1723305060',

        open: 0.000026342629195400005,
        close: 0.000026342629195400005,
        high: 0.000026339979098300004,
        low: 0.000026339979098300004,
        volume: 0,
    },
    {
        time: '1723305120',

        open: 0.000026339789826100003,
        close: 0.000026339789826100003,
        high: 0.000026337140300200005,
        low: 0.000026337140300200005,
        volume: 0,
    },
    {
        time: '1723305180',

        open: 0.000026336951068800002,
        close: 0.000026336951068800002,
        high: 0.000026334302114,
        low: 0.000026334302114,
        volume: 0,
    },
    {
        time: '1723305240',

        open: 0.000026334112923300003,
        close: 0.000026334112923300003,
        high: 0.000026331464539300004,
        low: 0.000026331464539300004,
        volume: 0,
    },
    {
        time: '1723305300',

        open: 0.000026331275389400004,
        close: 0.000026331275389400004,
        high: 0.0000263286275761,
        low: 0.0000263286275761,
        volume: 0,
    },
    {
        time: '1723305360',

        open: 0.000026328438467000005,
        close: 0.000026328438467000005,
        high: 0.000026325791224200002,
        low: 0.000026325791224200002,
        volume: 0,
    },
    {
        time: '1723305420',

        open: 0.0000263256021558,
        close: 0.0000263256021558,
        high: 0.000026322955483300004,
        low: 0.000026322955483300004,
        volume: 0,
    },
    {
        time: '1723305480',

        open: 0.000026322766455600003,
        close: 0.000026322766455600003,
        high: 0.0000263201203532,
        low: 0.0000263201203532,
        volume: 0,
    },
    {
        time: '1723305540',

        open: 0.000026319931366300005,
        close: 0.000026319931366300005,
        high: 0.000026317285833800004,
        low: 0.000026317285833800004,
        volume: 0,
    },
    {
        time: '1723305600',

        open: 0.000026317096887600003,
        close: 0.000026317096887600003,
        high: 0.000026314451924900005,
        low: 0.000026314451924900005,
        volume: 0,
    },
    {
        time: '1723305660',

        open: 0.0000263142630193,
        close: 0.0000263142630193,
        high: 0.000026311618626200002,
        low: 0.000026311618626200002,
        volume: 0,
    },
    {
        time: '1723305720',

        open: 0.000026311429761300002,
        close: 0.000026311429761300002,
        high: 0.0000263087859376,
        low: 0.0000263087859376,
        volume: 0,
    },
    {
        time: '1723305780',

        open: 0.0000263085971134,
        close: 0.0000263085971134,
        high: 0.0000263059538589,
        low: 0.0000263059538589,
        volume: 0,
    },
    {
        time: '1723305840',

        open: 0.0000263057650753,
        close: 0.0000263057650753,
        high: 0.000026303122389800004,
        low: 0.000026303122389800004,
        volume: 0,
    },
    {
        time: '1723305900',

        open: 0.000026302933646800002,
        close: 0.000026302933646800002,
        high: 0.0000263002915302,
        low: 0.0000263002915302,
        volume: 0,
    },
    {
        time: '1723305960',

        open: 0.0000263001028278,
        close: 0.0000263001028278,
        high: 0.0000262974612798,
        low: 0.0000262974612798,
        volume: 0,
    },
    {
        time: '1723306020',

        open: 0.000026297272618100006,
        close: 0.000026297272618100006,
        high: 0.000026294631638500004,
        low: 0.000026294631638500004,
        volume: 0,
    },
    {
        time: '1723306080',

        open: 0.000026294443017400003,
        close: 0.000026294443017400003,
        high: 0.000026291802606200003,
        low: 0.000026291802606200003,
        volume: 0,
    },
    {
        time: '1723306140',

        open: 0.0000262916140256,
        close: 0.0000262916140256,
        high: 0.000026288974182500005,
        low: 0.000026288974182500005,
        volume: 0,
    },
    {
        time: '1723306200',

        open: 0.0000262887856425,
        close: 0.0000262887856425,
        high: 0.000026286146367300003,
        low: 0.000026286146367300003,
        volume: 0,
    },
    {
        time: '1723306260',

        open: 0.0000262859578679,
        close: 0.0000262859578679,
        high: 0.000026283319160300004,
        low: 0.000026283319160300004,
        volume: 0,
    },
    {
        time: '1723306320',

        open: 0.000026283130701500003,
        close: 0.000026283130701500003,
        high: 0.0000262804925615,
        low: 0.0000262804925615,
        volume: 0,
    },
    {
        time: '1723306380',

        open: 0.0000262803041432,
        close: 0.0000262803041432,
        high: 0.000026277666570600002,
        low: 0.000026277666570600002,
        volume: 0,
    },
    {
        time: '1723306440',

        open: 0.000026277478192800003,
        close: 0.000026277478192800003,
        high: 0.000026274841187400002,
        low: 0.000026274841187400002,
        volume: 0,
    },
    {
        time: '1723306500',

        open: 0.000026274652850100002,
        close: 0.000026274652850100002,
        high: 0.000026272016411600003,
        low: 0.000026272016411600003,
        volume: 0,
    },
    {
        time: '1723306560',

        open: 0.000026271828114900004,
        close: 0.000026271828114900004,
        high: 0.000026269192243200002,
        low: 0.000026269192243200002,
        volume: 0,
    },
    {
        time: '1723306620',

        open: 0.000026269003986900005,
        close: 0.000026269003986900005,
        high: 0.0000262663686819,
        low: 0.0000262663686819,
        volume: 0,
    },
    {
        time: '1723306680',

        open: 0.000026266180466100003,
        close: 0.000026266180466100003,
        high: 0.0000262635457276,
        low: 0.0000262635457276,
        volume: 0,
    },
    {
        time: '1723306740',

        open: 0.0000262633575522,
        close: 0.0000262633575522,
        high: 0.000026260723379900003,
        low: 0.000026260723379900003,
        volume: 0,
    },
    {
        time: '1723306800',

        open: 0.000026260535245000004,
        close: 0.000026260535245000004,
        high: 0.0000262579016388,
        low: 0.0000262579016388,
        volume: 0,
    },
    {
        time: '1723306860',

        open: 0.0000262577135443,
        close: 0.0000262577135443,
        high: 0.000026255080504000003,
        low: 0.000026255080504000003,
        volume: 0,
    },
    {
        time: '1723306920',

        open: 0.0000262548924499,
        close: 0.0000262548924499,
        high: 0.0000262522599754,
        low: 0.0000262522599754,
        volume: 0,
    },
    {
        time: '1723306980',

        open: 0.0000262520719617,
        close: 0.0000262520719617,
        high: 0.000026249440052700004,
        low: 0.000026249440052700004,
        volume: 0,
    },
    {
        time: '1723307040',

        open: 0.000026249252079400003,
        close: 0.000026249252079400003,
        high: 0.000026246620735700002,
        low: 0.000026246620735700002,
        volume: 0,
    },
    {
        time: '1723307100',

        open: 0.0000262464328028,
        close: 0.0000262464328028,
        high: 0.000026243802024300006,
        low: 0.000026243802024300006,
        volume: 0,
    },
    {
        time: '1723307160',

        open: 0.000026243614131700002,
        close: 0.000026243614131700002,
        high: 0.000026240983918200003,
        low: 0.000026240983918200003,
        volume: 0,
    },
    {
        time: '1723307220',

        open: 0.000026240796066,
        close: 0.000026240796066,
        high: 0.0000262381664174,
        low: 0.0000262381664174,
        volume: 0,
    },
    {
        time: '1723307280',

        open: 0.0000262379786055,
        close: 0.0000262379786055,
        high: 0.0000262353495214,
        low: 0.0000262353495214,
        volume: 0,
    },
    {
        time: '1723307340',

        open: 0.0000262351617499,
        close: 0.0000262351617499,
        high: 0.000026232533230300005,
        low: 0.000026232533230300005,
        volume: 0,
    },
    {
        time: '1723307400',

        open: 0.000026232345499000004,
        close: 0.000026232345499000004,
        high: 0.0000262297175437,
        low: 0.0000262297175437,
        volume: 0,
    },
    {
        time: '1723307460',

        open: 0.0000262295298528,
        close: 0.0000262295298528,
        high: 0.000026226902461500003,
        low: 0.000026226902461500003,
        volume: 0,
    },
    {
        time: '1723307520',

        open: 0.000026226714810900005,
        close: 0.000026226714810900005,
        high: 0.0000262246508308,
        low: 0.0000262246508308,
        volume: 0,
    },
    {
        time: '1723307580',

        open: 0.0000262244632123,
        close: 0.0000262244632123,
        high: 0.000026221274109500003,
        low: 0.000026221274109500003,
        volume: 0,
    },
    {
        time: '1723307640',

        open: 0.0000262210865394,
        close: 0.0000262210865394,
        high: 0.0000262184608393,
        low: 0.0000262184608393,
        volume: 0,
    },
    {
        time: '1723307700',

        open: 0.000026218273309400003,
        close: 0.000026218273309400003,
        high: 0.0000262156481727,
        low: 0.0000262156481727,
        volume: 0,
    },
    {
        time: '1723307760',

        open: 0.000026215460683,
        close: 0.000026215460683,
        high: 0.0000262128361095,
        low: 0.0000262128361095,
        volume: 0,
    },
    {
        time: '1723307820',

        open: 0.00002621264866,
        close: 0.00002621264866,
        high: 0.000026210024649500002,
        low: 0.000026210024649500002,
        volume: 0,
    },
    {
        time: '1723307880',

        open: 0.000026209837240300004,
        close: 0.000026209837240300004,
        high: 0.0000262072137925,
        low: 0.0000262072137925,
        volume: 0,
    },
    {
        time: '1723307940',

        open: 0.0000262070264235,
        close: 0.0000262070264235,
        high: 0.0000262044035384,
        low: 0.0000262044035384,
        volume: 0,
    },
    {
        time: '1723308000',

        open: 0.000026204216209600003,
        close: 0.000026204216209600003,
        high: 0.0000262015938869,
        low: 0.0000262015938869,
        volume: 0,
    },
    {
        time: '1723308060',

        open: 0.000026201406598200003,
        close: 0.000026201406598200003,
        high: 0.0000261987848379,
        low: 0.0000261987848379,
        volume: 0,
    },
    {
        time: '1723308120',

        open: 0.000026198597589300004,
        close: 0.000026198597589300004,
        high: 0.000026195976391000003,
        low: 0.000026195976391000003,
        volume: 0,
    },
    {
        time: '1723308180',

        open: 0.000026195789182700003,
        close: 0.000026195789182700003,
        high: 0.000026193168546300002,
        low: 0.000026193168546300002,
        volume: 0,
    },
    {
        time: '1723308240',

        open: 0.000026192981378000002,
        close: 0.000026192981378000002,
        high: 0.0000261903613034,
        low: 0.0000261903613034,
        volume: 0,
    },
    {
        time: '1723308300',

        open: 0.000026190174175300002,
        close: 0.000026190174175300002,
        high: 0.000026187554662200005,
        low: 0.000026187554662200005,
        volume: 0,
    },
    {
        time: '1723308360',

        open: 0.0000261873675741,
        close: 0.0000261873675741,
        high: 0.000026184748622400004,
        low: 0.000026184748622400004,
        volume: 0,
    },
    {
        time: '1723308420',

        open: 0.0000261845615745,
        close: 0.0000261845615745,
        high: 0.000026181943183900003,
        low: 0.000026181943183900003,
        volume: 0,
    },
    {
        time: '1723308480',

        open: 0.000026181756176100003,
        close: 0.000026181756176100003,
        high: 0.0000261791383465,
        low: 0.0000261791383465,
        volume: 0,
    },
    {
        time: '1723308540',

        open: 0.000026178951378700005,
        close: 0.000026178951378700005,
        high: 0.00002617633411,
        low: 0.00002617633411,
        volume: 0,
    },
    {
        time: '1723308600',

        open: 0.000026176147182300003,
        close: 0.000026176147182300003,
        high: 0.000026173530474200003,
        low: 0.000026173530474200003,
        volume: 0,
    },
    {
        time: '1723308660',

        open: 0.000026173343586500002,
        close: 0.000026173343586500002,
        high: 0.000026170727438900002,
        low: 0.000026170727438900002,
        volume: 0,
    },
    {
        time: '1723308720',

        open: 0.0000261705405912,
        close: 0.0000261705405912,
        high: 0.0000261679250039,
        low: 0.0000261679250039,
        volume: 0,
    },
    {
        time: '1723308780',

        open: 0.0000261677381963,
        close: 0.0000261677381963,
        high: 0.000026165123169099998,
        low: 0.000026165123169099998,
        volume: 0,
    },
    {
        time: '1723308840',

        open: 0.000026164936401400002,
        close: 0.000026164936401400002,
        high: 0.000026162321934100002,
        low: 0.000026162321934100002,
        volume: 0,
    },
    {
        time: '1723308900',

        open: 0.000026162135206500002,
        close: 0.000026162135206500002,
        high: 0.000026159521298900004,
        low: 0.000026159521298900004,
        volume: 0,
    },
    {
        time: '1723308960',

        open: 0.000026159334611300004,
        close: 0.000026159334611300004,
        high: 0.000026156907913700003,
        low: 0.000026156907913700003,
        volume: 0,
    },
    {
        time: '1723309020',

        open: 0.0000261567212633,
        close: 0.0000261567212633,
        high: 0.000026153921827000003,
        low: 0.000026153921827000003,
        volume: 0,
    },
    {
        time: '1723309080',

        open: 0.000026153735219200003,
        close: 0.000026153735219200003,
        high: 0.0000261511229898,
        low: 0.0000261511229898,
        volume: 0,
    },
    {
        time: '1723309140',

        open: 0.000026150936422000003,
        close: 0.000026150936422000003,
        high: 0.000026148324751700003,
        low: 0.000026148324751700003,
        volume: 0,
    },
    {
        time: '1723309200',

        open: 0.0000261481382237,
        close: 0.0000261481382237,
        high: 0.000026145527112300004,
        low: 0.000026145527112300004,
        volume: 0,
    },
    {
        time: '1723309260',

        open: 0.000026145527112300004,
        close: 0.000026145527112300004,
        high: 0.000026142730071400004,
        low: 0.000026142730071400004,
        volume: 0,
    },
    {
        time: '1723309320',

        open: 0.000026142543623300003,
        close: 0.000026142543623300003,
        high: 0.000026139933629000003,
        low: 0.000026139933629000003,
        volume: 0,
    },
    {
        time: '1723309380',

        open: 0.000026139747220800004,
        close: 0.000026139747220800004,
        high: 0.000026137137784800006,
        low: 0.000026137137784800006,
        volume: 0,
    },
    {
        time: '1723309440',

        open: 0.000026136951416400004,
        close: 0.000026136951416400004,
        high: 0.0000261343425385,
        low: 0.0000261343425385,
        volume: 0,
    },
    {
        time: '1723309500',

        open: 0.000026134156210000004,
        close: 0.000026134156210000004,
        high: 0.000026131547890100003,
        low: 0.000026131547890100003,
        volume: 0,
    },
    {
        time: '1723309560',

        open: 0.000026131361601500002,
        close: 0.000026131361601500002,
        high: 0.0000261287538393,
        low: 0.0000261287538393,
        volume: 0,
    },
    {
        time: '1723309620',

        open: 0.000026128567590500002,
        close: 0.000026128567590500002,
        high: 0.000026125960385900002,
        low: 0.000026125960385900002,
        volume: 0,
    },
    {
        time: '1723309680',

        open: 0.0000261257741769,
        close: 0.0000261257741769,
        high: 0.000026123167529800003,
        low: 0.000026123167529800003,
        volume: 0,
    },
    {
        time: '1723309740',

        open: 0.000026122981360600003,
        close: 0.000026122981360600003,
        high: 0.000026120375270700003,
        low: 0.000026120375270700003,
        volume: 0,
    },
    {
        time: '1723309800',

        open: 0.000026120189141300004,
        close: 0.000026120189141300004,
        high: 0.000026117583608500005,
        low: 0.000026117583608500005,
        volume: 0,
    },
    {
        time: '1723309860',

        open: 0.000026117397518900004,
        close: 0.000026117397518900004,
        high: 0.000026114792542900002,
        low: 0.000026114792542900002,
        volume: 0,
    },
    {
        time: '1723309920',

        open: 0.000026114606493100002,
        close: 0.000026114606493100002,
        high: 0.0000261120020738,
        low: 0.0000261120020738,
        volume: 0,
    },
    {
        time: '1723309980',

        open: 0.0000261118160638,
        close: 0.0000261118160638,
        high: 0.000026109212201,
        low: 0.000026109212201,
        volume: 0,
    },
    {
        time: '1723310040',

        open: 0.000026109026230700002,
        close: 0.000026109026230700002,
        high: 0.000026106422924300002,
        low: 0.000026106422924300002,
        volume: 0,
    },
    {
        time: '1723310100',

        open: 0.0000261062369937,
        close: 0.0000261062369937,
        high: 0.000026103634243500002,
        low: 0.000026103634243500002,
        volume: 0,
    },
    {
        time: '1723310160',

        open: 0.000026103448352600005,
        close: 0.000026103448352600005,
        high: 0.0000261008461584,
        low: 0.0000261008461584,
        volume: 0,
    },
    {
        time: '1723310220',

        open: 0.000026100660307200005,
        close: 0.000026100660307200005,
        high: 0.000026098058668800002,
        low: 0.000026098058668800002,
        volume: 0,
    },
    {
        time: '1723310280',

        open: 0.000026097872857300003,
        close: 0.000026097872857300003,
        high: 0.000026095271774500003,
        low: 0.000026095271774500003,
        volume: 0,
    },
    {
        time: '1723310340',

        open: 0.0000260950860027,
        close: 0.0000260950860027,
        high: 0.000026092485475400003,
        low: 0.000026092485475400003,
        volume: 0,
    },
    {
        time: '1723310400',

        open: 0.000026092299743300002,
        close: 0.000026092299743300002,
        high: 0.000026089699771200004,
        low: 0.000026089699771200004,
        volume: 0,
    },
    {
        time: '1723310460',

        open: 0.000026089514078700006,
        close: 0.000026089514078700006,
        high: 0.0000260869146618,
        low: 0.0000260869146618,
        volume: 0,
    },
    {
        time: '1723310520',

        open: 0.000026086729009000004,
        close: 0.000026086729009000004,
        high: 0.0000260841301469,
        low: 0.0000260841301469,
        volume: 0,
    },
    {
        time: '1723310580',

        open: 0.0000260839445337,
        close: 0.0000260839445337,
        high: 0.0000260813462264,
        low: 0.0000260813462264,
        volume: 0,
    },
    {
        time: '1723310640',

        open: 0.000026081160652900003,
        close: 0.000026081160652900003,
        high: 0.000026078562900100003,
        low: 0.000026078562900100003,
        volume: 0,
    },
    {
        time: '1723310700',

        open: 0.000026078377366200002,
        close: 0.000026078377366200002,
        high: 0.0000260757801678,
        low: 0.0000260757801678,
        volume: 0,
    },
    {
        time: '1723310760',

        open: 0.0000260755946734,
        close: 0.0000260755946734,
        high: 0.000026072998029300002,
        low: 0.000026072998029300002,
        volume: 0,
    },
    {
        time: '1723310820',

        open: 0.000026072812574500003,
        close: 0.000026072812574500003,
        high: 0.000026070216484400003,
        low: 0.000026070216484400003,
        volume: 0,
    },
    {
        time: '1723310880',

        open: 0.000026070031069200004,
        close: 0.000026070031069200004,
        high: 0.0000260674355329,
        low: 0.0000260674355329,
        volume: 0,
    },
    {
        time: '1723310940',

        open: 0.000026067250157300002,
        close: 0.000026067250157300002,
        high: 0.000026064655174700005,
        low: 0.000026064655174700005,
        volume: 0,
    },
    {
        time: '1723311000',

        open: 0.0000260644698386,
        close: 0.0000260644698386,
        high: 0.000026061875409500003,
        low: 0.000026061875409500003,
        volume: 0,
    },
    {
        time: '1723311060',

        open: 0.000026061690112900003,
        close: 0.000026061690112900003,
        high: 0.000026059096237200005,
        low: 0.000026059096237200005,
        volume: 0,
    },
    {
        time: '1723311120',

        open: 0.0000260589109801,
        close: 0.0000260589109801,
        high: 0.000026056317657500004,
        low: 0.000026056317657500004,
        volume: 0,
    },
    {
        time: '1723311180',

        open: 0.000026056132439900002,
        close: 0.000026056132439900002,
        high: 0.000026053539670300004,
        low: 0.000026053539670300004,
        volume: 0,
    },
    {
        time: '1723311240',

        open: 0.0000260533544922,
        close: 0.0000260533544922,
        high: 0.000026050762275400004,
        low: 0.000026050762275400004,
        volume: 0,
    },
    {
        time: '1723311300',

        open: 0.0000260505771368,
        close: 0.0000260505771368,
        high: 0.000026047985472600004,
        low: 0.000026047985472600004,
        volume: 0,
    },
    {
        time: '1723311360',

        open: 0.000026047800373400002,
        close: 0.000026047800373400002,
        high: 0.000026045209261600004,
        low: 0.000026045209261600004,
        volume: 0,
    },
    {
        time: '1723311420',

        open: 0.000026045024202000005,
        close: 0.000026045024202000005,
        high: 0.000026042433642500003,
        low: 0.000026042433642500003,
        volume: 0,
    },
    {
        time: '1723311480',

        open: 0.000026042248622200002,
        close: 0.000026042248622200002,
        high: 0.000026039658614800002,
        low: 0.000026039658614800002,
        volume: 0,
    },
    {
        time: '1723311540',

        open: 0.000026039473634000004,
        close: 0.000026039473634000004,
        high: 0.0000260368841785,
        low: 0.0000260368841785,
        volume: 0,
    },
    {
        time: '1723311600',

        open: 0.000026036699237100004,
        close: 0.000026036699237100004,
        high: 0.000026034110333300003,
        low: 0.000026034110333300003,
        volume: 0,
    },
    {
        time: '1723311660',

        open: 0.0000260339254313,
        close: 0.0000260339254313,
        high: 0.000026031337079100003,
        low: 0.000026031337079100003,
        volume: 0,
    },
    {
        time: '1723311720',

        open: 0.000026031152216500003,
        close: 0.000026031152216500003,
        high: 0.000026028564415600004,
        low: 0.000026028564415600004,
        volume: 0,
    },
    {
        time: '1723311780',

        open: 0.000026028379592400002,
        close: 0.000026028379592400002,
        high: 0.000026025792342800006,
        low: 0.000026025792342800006,
        volume: 0,
    },
    {
        time: '1723311840',

        open: 0.000026025607558900002,
        close: 0.000026025607558900002,
        high: 0.0000260230208603,
        low: 0.0000260230208603,
        volume: 0,
    },
    {
        time: '1723311900',

        open: 0.0000260228361158,
        close: 0.0000260228361158,
        high: 0.000026020249968100003,
        low: 0.000026020249968100003,
        volume: 0,
    },
    {
        time: '1723311960',

        open: 0.000026020065262900002,
        close: 0.000026020065262900002,
        high: 0.0000260174796658,
        low: 0.0000260174796658,
        volume: 0,
    },
    {
        time: '1723312020',

        open: 0.000026017295000000005,
        close: 0.000026017295000000005,
        high: 0.000026014709953400002,
        low: 0.000026014709953400002,
        volume: 0,
    },
    {
        time: '1723312080',

        open: 0.0000260145253269,
        close: 0.0000260145253269,
        high: 0.000026011940830600003,
        low: 0.000026011940830600003,
        volume: 0,
    },
    {
        time: '1723312140',

        open: 0.000026011756243400003,
        close: 0.000026011756243400003,
        high: 0.0000260091722973,
        low: 0.0000260091722973,
        volume: 0,
    },
    {
        time: '1723312200',

        open: 0.000026008987749400002,
        close: 0.000026008987749400002,
        high: 0.0000260064043533,
        low: 0.0000260064043533,
        volume: 0,
    },
    {
        time: '1723312260',

        open: 0.0000260062198446,
        close: 0.0000260062198446,
        high: 0.000026003636998300002,
        low: 0.000026003636998300002,
        volume: 0,
    },
    {
        time: '1723312320',

        open: 0.0000260034525289,
        close: 0.0000260034525289,
        high: 0.000026000870232200003,
        low: 0.000026000870232200003,
        volume: 0,
    },
    {
        time: '1723312380',

        open: 0.0000260006858021,
        close: 0.0000260006858021,
        high: 0.0000259981040548,
        low: 0.0000259981040548,
        volume: 0,
    },
    {
        time: '1723312440',
        open: 0.0000259979196639,
        close: 0.0000259979196639,
        high: 0.000025995338466000003,
        low: 0.000025995338466000003,
        volume: 0,
    },
    {
        time: '1723312500',
        open: 0.000025995154114300004,
        close: 0.000025995154114300004,
        high: 0.000025992573465400002,
        low: 0.000025992573465400002,
        volume: 0,
    },
    {
        time: '1723312560',

        open: 0.000025992389153,
        close: 0.000025992389153,
        high: 0.000025989809053,
        low: 0.000025989809053,
        volume: 0,
    },
    {
        time: '1723312620',

        open: 0.0000259896247798,
        close: 0.0000259896247798,
        high: 0.0000259870452286,
        low: 0.0000259870452286,
        volume: 0,
    },
    {
        time: '1723312680',

        open: 0.000025986860994500002,
        close: 0.000025986860994500002,
        high: 0.0000259842819919,
        low: 0.0000259842819919,
        volume: 0,
    },
    {
        time: '1723312740',

        open: 0.000025984097797,
        close: 0.000025984097797,
        high: 0.000025981519342800004,
        low: 0.000025981519342800004,
        volume: 0,
    },
    {
        time: '1723312800',

        open: 0.000025981335187000003,
        close: 0.000025981335187000003,
        high: 0.000025978757281,
        low: 0.000025978757281,
        volume: 0,
    },
    {
        time: '1723312860',

        open: 0.0000259785731644,
        close: 0.0000259785731644,
        high: 0.0000259759958065,
        low: 0.0000259759958065,
        volume: 0,
    },
    {
        time: '1723312920',

        open: 0.0000259758117291,
        close: 0.0000259758117291,
        high: 0.000025973418959900003,
        low: 0.000025973418959900003,
        volume: 0,
    },
    {
        time: '1723312980',

        open: 0.000025973050880700003,
        close: 0.000025973050880700003,
        high: 0.0000259704746183,
        low: 0.0000259704746183,
        volume: 0,
    },
    {
        time: '1723313040',

        open: 0.0000259702906191,
        close: 0.0000259702906191,
        high: 0.000025967714904200004,
        low: 0.000025967714904200004,
        volume: 0,
    },
    {
        time: '1723313100',

        open: 0.000025967530944100003,
        close: 0.000025967530944100003,
        high: 0.0000259649557766,
        low: 0.0000259649557766,
        volume: 0,
    },
    {
        time: '1723313160',

        open: 0.0000259647718556,
        close: 0.0000259647718556,
        high: 0.000025962197235300002,
        low: 0.000025962197235300002,
        volume: 0,
    },
    {
        time: '1723313220',

        open: 0.000025962013353400003,
        close: 0.000025962013353400003,
        high: 0.000025959439280000003,
        low: 0.000025959439280000003,
        volume: 0,
    },
    {
        time: '1723313280',

        open: 0.0000259592554372,
        close: 0.0000259592554372,
        high: 0.000025956681910600005,
        low: 0.000025956681910600005,
        volume: 0,
    },
    {
        time: '1723313340',

        open: 0.0000259564981068,
        close: 0.0000259564981068,
        high: 0.000025953925127000004,
        low: 0.000025953925127000004,
        volume: 0,
    },
    {
        time: '1723313400',

        open: 0.000025953741362200003,
        close: 0.000025953741362200003,
        high: 0.000025951168928800005,
        low: 0.000025951168928800005,
        volume: 0,
    },
    {
        time: '1723313460',

        open: 0.000025950985203100003,
        close: 0.000025950985203100003,
        high: 0.000025948413316000003,
        low: 0.000025948413316000003,
        volume: 0,
    },
    {
        time: '1723313520',

        open: 0.0000259482296293,
        close: 0.0000259482296293,
        high: 0.000025945658288300003,
        low: 0.000025945658288300003,
        volume: 0,
    },
    {
        time: '1723313580',

        open: 0.000025945474640600003,
        close: 0.000025945474640600003,
        high: 0.0000259429038456,
        low: 0.0000259429038456,
        volume: 0,
    },
    {
        time: '1723313640',

        open: 0.0000259427202369,
        close: 0.0000259427202369,
        high: 0.000025940149987700003,
        low: 0.000025940149987700003,
        volume: 0,
    },
    {
        time: '1723313700',

        open: 0.0000259399664179,
        close: 0.0000259399664179,
        high: 0.000025937580247700002,
        low: 0.000025937580247700002,
        volume: 0,
    },
    {
        time: '1723313760',

        open: 0.0000259373967143,
        close: 0.0000259373967143,
        high: 0.000025934644025400002,
        low: 0.000025934644025400002,
        volume: 0,
    },
    {
        time: '1723313820',

        open: 0.000025934460533500003,
        close: 0.000025934460533500003,
        high: 0.000025931891920600002,
        low: 0.000025931891920600002,
        volume: 0,
    },
    {
        time: '1723313880',

        open: 0.000025931708467700002,
        close: 0.000025931708467700002,
        high: 0.000025929140399900004,
        low: 0.000025929140399900004,
        volume: 0,
    },
    {
        time: '1723313940',

        open: 0.000025928956985900003,
        close: 0.000025928956985900003,
        high: 0.000025926389463000003,
        low: 0.000025926389463000003,
        volume: 0,
    },
    {
        time: '1723314000',

        open: 0.000025926206088,
        close: 0.000025926206088,
        high: 0.000025923639109800004,
        low: 0.000025923639109800004,
        volume: 0,
    },
    {
        time: '1723314060',

        open: 0.000025923455773700003,
        close: 0.000025923455773700003,
        high: 0.000025920889340100003,
        low: 0.000025920889340100003,
        volume: 0,
    },
    {
        time: '1723314120',

        open: 0.000025920706042800003,
        close: 0.000025920706042800003,
        high: 0.0000259181401536,
        low: 0.0000259181401536,
        volume: 0,
    },
    {
        time: '1723314180',

        open: 0.000025917956895200002,
        close: 0.000025917956895200002,
        high: 0.000025915391550200003,
        low: 0.000025915391550200003,
        volume: 0,
    },
    {
        time: '1723314240',

        open: 0.000025915208330700003,
        close: 0.000025915208330700003,
        high: 0.000025912643529800004,
        low: 0.000025912643529800004,
        volume: 0,
    },
    {
        time: '1723314300',

        open: 0.000025912460349100005,
        close: 0.000025912460349100005,
        high: 0.000025909896092100003,
        low: 0.000025909896092100003,
        volume: 0,
    },
    {
        time: '1723314360',

        open: 0.000025909712950300002,
        close: 0.000025909712950300002,
        high: 0.000025907149236900003,
        low: 0.000025907149236900003,
        volume: 0,
    },
    {
        time: '1723314420',

        open: 0.000025906966133900003,
        close: 0.000025906966133900003,
        high: 0.0000259044029641,
        low: 0.0000259044029641,
        volume: 0,
    },
    {
        time: '1723314480',

        open: 0.0000259042198999,
        close: 0.0000259042198999,
        high: 0.0000259016572734,
        low: 0.0000259016572734,
        volume: 0,
    },
    {
        time: '1723314540',

        open: 0.000025901474248100004,
        close: 0.000025901474248100004,
        high: 0.0000258989121648,
        low: 0.0000258989121648,
        volume: 0,
    },
    {
        time: '1723314600',

        open: 0.000025898729178200004,
        close: 0.000025898729178200004,
        high: 0.000025896167637900002,
        low: 0.000025896167637900002,
        volume: 0,
    },
    {
        time: '1723314660',

        open: 0.000025895984690100006,
        close: 0.000025895984690100006,
        high: 0.000025893606604300005,
        low: 0.000025893606604300005,
        volume: 0,
    },
    {
        time: '1723314720',

        open: 0.000025893423692700005,
        close: 0.000025893423692700005,
        high: 0.000025890680328900005,
        low: 0.000025890680328900005,
        volume: 0,
    },
    {
        time: '1723314780',

        open: 0.000025890497458600003,
        close: 0.000025890497458600003,
        high: 0.000025887937546300003,
        low: 0.000025887937546300003,
        volume: 0,
    },
    {
        time: '1723314840',

        open: 0.000025887754714800002,
        close: 0.000025887754714800002,
        high: 0.0000258851953448,
        low: 0.0000258851953448,
        volume: 0,
    },
    {
        time: '1723314900',

        open: 0.000025885012552000004,
        close: 0.000025885012552000004,
        high: 0.0000258824537242,
        low: 0.0000258824537242,
        volume: 0,
    },
    {
        time: '1723314960',

        open: 0.0000258822709701,
        close: 0.0000258822709701,
        high: 0.000025879712684200003,
        low: 0.000025879712684200003,
        volume: 0,
    },
    {
        time: '1723315020',

        open: 0.0000258795299689,
        close: 0.0000258795299689,
        high: 0.000025876972224800003,
        low: 0.000025876972224800003,
        volume: 0,
    },
    {
        time: '1723315080',

        open: 0.0000258767895482,
        close: 0.0000258767895482,
        high: 0.000025874232345700002,
        low: 0.000025874232345700002,
        volume: 0,
    },
    {
        time: '1723315140',

        open: 0.0000258740497078,
        close: 0.0000258740497078,
        high: 0.000025871493046800002,
        low: 0.000025871493046800002,
        volume: 0,
    },
    {
        time: '1723315200',

        open: 0.000025871310447500003,
        close: 0.000025871310447500003,
        high: 0.000025868754327800002,
        low: 0.000025868754327800002,
        volume: 0,
    },
    {
        time: '1723315260',

        open: 0.000025868571767200003,
        close: 0.000025868571767200003,
        high: 0.000025866016188600003,
        low: 0.000025866016188600003,
        volume: 0,
    },
    {
        time: '1723315320',

        open: 0.000025865833666600004,
        close: 0.000025865833666600004,
        high: 0.000025863278628900005,
        low: 0.000025863278628900005,
        volume: 0,
    },
    {
        time: '1723315380',

        open: 0.000025863096145600006,
        close: 0.000025863096145600006,
        high: 0.000025860541648700003,
        low: 0.000025860541648700003,
        volume: 0,
    },
    {
        time: '1723315440',

        open: 0.000025860359204000003,
        close: 0.000025860359204000003,
        high: 0.0000258578052477,
        low: 0.0000258578052477,
        volume: 0,
    },
    {
        time: '1723315500',

        open: 0.0000258576228416,
        close: 0.0000258576228416,
        high: 0.0000258550694257,
        low: 0.0000258550694257,
        volume: 0,
    },
    {
        time: '1723315560',

        open: 0.0000258550694257,
        close: 0.0000258550694257,
        high: 0.000025852334182600005,
        low: 0.000025852334182600005,
        volume: 0,
    },
    {
        time: '1723315620',

        open: 0.000025852151853700003,
        close: 0.000025852151853700003,
        high: 0.000025849599518200003,
        low: 0.000025849599518200003,
        volume: 0,
    },
    {
        time: '1723315680',

        open: 0.0000258494172278,
        close: 0.0000258494172278,
        high: 0.000025846865432200004,
        low: 0.000025846865432200004,
        volume: 0,
    },
    {
        time: '1723315740',

        open: 0.0000258466831804,
        close: 0.0000258466831804,
        high: 0.000025844131924500002,
        low: 0.000025844131924500002,
        volume: 0,
    },
    {
        time: '1723315800',

        open: 0.000025843949711300003,
        close: 0.000025843949711300003,
        high: 0.000025841398995000005,
        low: 0.000025841398995000005,
        volume: 0,
    },
    {
        time: '1723315860',

        open: 0.000025841216820200004,
        close: 0.000025841216820200004,
        high: 0.0000258386666434,
        low: 0.0000258386666434,
        volume: 0,
    },
    {
        time: '1723315920',

        open: 0.000025838484507200005,
        close: 0.000025838484507200005,
        high: 0.000025835934869500002,
        low: 0.000025835934869500002,
        volume: 0,
    },
    {
        time: '1723315980',

        open: 0.000025835752771800002,
        close: 0.000025835752771800002,
        high: 0.0000258332036732,
        low: 0.0000258332036732,
        volume: 0,
    },
    {
        time: '1723316040',

        open: 0.000025833021614,
        close: 0.000025833021614,
        high: 0.0000258304730543,
        low: 0.0000258304730543,
        volume: 0,
    },
    {
        time: '1723316100',

        open: 0.000025830291033600002,
        close: 0.000025830291033600002,
        high: 0.0000258277430126,
        low: 0.0000258277430126,
        volume: 0,
    },
    {
        time: '1723316160',

        open: 0.000025827561030400002,
        close: 0.000025827561030400002,
        high: 0.000025825013548,
        low: 0.000025825013548,
        volume: 0,
    },
    {
        time: '1723316220',

        open: 0.0000258248316042,
        close: 0.0000258248316042,
        high: 0.000025822284660100004,
        low: 0.000025822284660100004,
        volume: 0,
    },
    {
        time: '1723316280',

        open: 0.000025822102754800004,
        close: 0.000025822102754800004,
        high: 0.000025819556348900002,
        low: 0.000025819556348900002,
        volume: 0,
    },
    {
        time: '1723316340',

        open: 0.000025819374482000003,
        close: 0.000025819374482000003,
        high: 0.000025816828614200002,
        low: 0.000025816828614200002,
        volume: 0,
    },
    {
        time: '1723316400',

        open: 0.000025816646785700005,
        close: 0.000025816646785700005,
        high: 0.000025814101455800003,
        low: 0.000025814101455800003,
        volume: 0,
    },
    {
        time: '1723316460',

        open: 0.000025813919665700004,
        close: 0.000025813919665700004,
        high: 0.000025811374873400003,
        low: 0.000025811374873400003,
        volume: 0,
    },
    {
        time: '1723316520',

        open: 0.000025811193121800006,
        close: 0.000025811193121800006,
        high: 0.000025808648867000004,
        low: 0.000025808648867000004,
        volume: 0,
    },
    {
        time: '1723316580',

        open: 0.0000258084671537,
        close: 0.0000258084671537,
        high: 0.000025805923436400003,
        low: 0.000025805923436400003,
        volume: 0,
    },
    {
        time: '1723316640',

        open: 0.000025805741761500002,
        close: 0.000025805741761500002,
        high: 0.000025803198581300004,
        low: 0.000025803198581300004,
        volume: 0,
    },
    {
        time: '1723316700',

        open: 0.000025803016944700004,
        close: 0.000025803016944700004,
        high: 0.000025800474301500002,
        low: 0.000025800474301500002,
        volume: 0,
    },
    {
        time: '1723316760',

        open: 0.0000258002927033,
        close: 0.0000258002927033,
        high: 0.000025797750597000004,
        low: 0.000025797750597000004,
        volume: 0,
    },
    {
        time: '1723316820',

        open: 0.0000257975690371,
        close: 0.0000257975690371,
        high: 0.000025795027467500005,
        low: 0.000025795027467500005,
        volume: 0,
    },
    {
        time: '1723316880',

        open: 0.000025794845945900004,
        close: 0.000025794845945900004,
        high: 0.000025792304912800005,
        low: 0.000025792304912800005,
        volume: 0,
    },
    {
        time: '1723316940',

        open: 0.000025792123429600003,
        close: 0.000025792123429600003,
        high: 0.0000257895829327,
        low: 0.0000257895829327,
        volume: 0,
    },
    {
        time: '1723317000',

        open: 0.000025789401487800003,
        close: 0.000025789401487800003,
        high: 0.000025786861527100003,
        low: 0.000025786861527100003,
        volume: 0,
    },
    {
        time: '1723317060',

        open: 0.0000257866801205,
        close: 0.0000257866801205,
        high: 0.0000257841406958,
        low: 0.0000257841406958,
        volume: 0,
    },
    {
        time: '1723317120',

        open: 0.0000257839593275,
        close: 0.0000257839593275,
        high: 0.0000257814204386,
        low: 0.0000257814204386,
        volume: 0,
    },
    {
        time: '1723317180',

        open: 0.0000257812391086,
        close: 0.0000257812391086,
        high: 0.000025778700755400002,
        low: 0.000025778700755400002,
        volume: 0,
    },
    {
        time: '1723317240',

        open: 0.000025778519463500002,
        close: 0.000025778519463500002,
        high: 0.000025775981645800003,
        low: 0.000025775981645800003,
        volume: 0,
    },
    {
        time: '1723317300',

        open: 0.0000257758003922,
        close: 0.0000257758003922,
        high: 0.000025773263109800005,
        low: 0.000025773263109800005,
        volume: 0,
    },
    {
        time: '1723317360',

        open: 0.000025773081894500003,
        close: 0.000025773081894500003,
        high: 0.0000257705451472,
        low: 0.0000257705451472,
        volume: 0,
    },
    {
        time: '1723317420',

        open: 0.000025770363970100003,
        close: 0.000025770363970100003,
        high: 0.000025767827757800003,
        low: 0.000025767827757800003,
        volume: 0,
    },
    {
        time: '1723317480',

        open: 0.0000257676466189,
        close: 0.0000257676466189,
        high: 0.0000257651109414,
        low: 0.0000257651109414,
        volume: 0,
    },
    {
        time: '1723317540',

        open: 0.000025764929840700004,
        close: 0.000025764929840700004,
        high: 0.000025762394697800002,
        low: 0.000025762394697800002,
        volume: 0,
    },
    {
        time: '1723317600',

        open: 0.000025762213635300004,
        close: 0.000025762213635300004,
        high: 0.0000257596790269,
        low: 0.0000257596790269,
        volume: 0,
    },
    {
        time: '1723317660',

        open: 0.000025759498002600002,
        close: 0.000025759498002600002,
        high: 0.0000257569639285,
        low: 0.0000257569639285,
        volume: 0,
    },
    {
        time: '1723317720',

        open: 0.000025756782942300004,
        close: 0.000025756782942300004,
        high: 0.0000257542494023,
        low: 0.0000257542494023,
        volume: 0,
    },
    {
        time: '1723317780',

        open: 0.000025754068454200002,
        close: 0.000025754068454200002,
        high: 0.000025751535448300002,
        low: 0.000025751535448300002,
        volume: 0,
    },
    {
        time: '1723317840',

        open: 0.0000257513545383,
        close: 0.0000257513545383,
        high: 0.0000257488220661,
        low: 0.0000257488220661,
        volume: 0,
    },
    {
        time: '1723317900',

        open: 0.0000257486411943,
        close: 0.0000257486411943,
        high: 0.0000257461092558,
        low: 0.0000257461092558,
        volume: 0,
    },
    {
        time: '1723317960',

        open: 0.0000257459284221,
        close: 0.0000257459284221,
        high: 0.0000257433970169,
        low: 0.0000257433970169,
        volume: 0,
    },
    {
        time: '1723318020',

        open: 0.000025743216221300004,
        close: 0.000025743216221300004,
        high: 0.000025740685349500002,
        low: 0.000025740685349500002,
        volume: 0,
    },
    {
        time: '1723318080',

        open: 0.000025740504592000003,
        close: 0.000025740504592000003,
        high: 0.0000257379742533,
        low: 0.0000257379742533,
        volume: 0,
    },
    {
        time: '1723318140',

        open: 0.0000257377935338,
        close: 0.0000257377935338,
        high: 0.0000257352637281,
        low: 0.0000257352637281,
        volume: 0,
    },
    {
        time: '1723318200',

        open: 0.0000257350830467,
        close: 0.0000257350830467,
        high: 0.0000257325537737,
        low: 0.0000257325537737,
        volume: 0,
    },
    {
        time: '1723318260',

        open: 0.0000257323731304,
        close: 0.0000257323731304,
        high: 0.00002572984439,
        low: 0.00002572984439,
        volume: 0,
    },
    {
        time: '1723318320',

        open: 0.0000257296637847,
        close: 0.0000257296637847,
        high: 0.000025727135576800003,
        low: 0.000025727135576800003,
        volume: 0,
    },
    {
        time: '1723318380',

        open: 0.000025726955009500003,
        close: 0.000025726955009500003,
        high: 0.000025724427333900003,
        low: 0.000025724427333900003,
        volume: 0,
    },
    {
        time: '1723318440',

        open: 0.000025724246804600004,
        close: 0.000025724246804600004,
        high: 0.000025721719661100003,
        low: 0.000025721719661100003,
        volume: 0,
    },
    {
        time: '1723318500',

        open: 0.000025721539169900004,
        close: 0.000025721539169900004,
        high: 0.0000257190125583,
        low: 0.0000257190125583,
        volume: 0,
    },
    {
        time: '1723318560',

        open: 0.000025718832105000006,
        close: 0.000025718832105000006,
        high: 0.000025716306025200002,
        low: 0.000025716306025200002,
        volume: 0,
    },
    {
        time: '1723318620',

        open: 0.000025716125609900003,
        close: 0.000025716125609900003,
        high: 0.0000257136000617,
        low: 0.0000257136000617,
        volume: 0,
    },
    {
        time: '1723318680',

        open: 0.000025713419684300004,
        close: 0.000025713419684300004,
        high: 0.000025710894667600003,
        low: 0.000025710894667600003,
        volume: 0,
    },
    {
        time: '1723318740',

        open: 0.000025710714328200004,
        close: 0.000025710714328200004,
        high: 0.0000257081898427,
        low: 0.0000257081898427,
        volume: 0,
    },
    {
        time: '1723318800',

        open: 0.000025708009541300003,
        close: 0.000025708009541300003,
        high: 0.000025705485586900004,
        low: 0.000025705485586900004,
        volume: 0,
    },
    {
        time: '1723318860',

        open: 0.0000257053053234,
        close: 0.0000257053053234,
        high: 0.0000257027818999,
        low: 0.0000257027818999,
        volume: 0,
    },
    {
        time: '1723318920',

        open: 0.0000257026016743,
        close: 0.0000257026016743,
        high: 0.000025700078781600006,
        low: 0.000025700078781600006,
        volume: 0,
    },
    {
        time: '1723318980',

        open: 0.000025699898593900003,
        close: 0.000025699898593900003,
        high: 0.000025697376231800002,
        low: 0.000025697376231800002,
        volume: 0,
    },
    {
        time: '1723319040',

        open: 0.000025697196082,
        close: 0.000025697196082,
        high: 0.000025694674250400004,
        low: 0.000025694674250400004,
        volume: 0,
    },
    {
        time: '1723319100',

        open: 0.000025694494138500003,
        close: 0.000025694494138500003,
        high: 0.000025691972837100003,
        low: 0.000025691972837100003,
        volume: 0,
    },
    {
        time: '1723319160',

        open: 0.000025691792763,
        close: 0.000025691792763,
        high: 0.000025689271991700004,
        low: 0.000025689271991700004,
        volume: 0,
    },
    {
        time: '1723319220',

        open: 0.0000256890919556,
        close: 0.0000256890919556,
        high: 0.0000256865717142,
        low: 0.0000256865717142,
        volume: 0,
    },
    {
        time: '1723319280',

        open: 0.000025686391715800002,
        close: 0.000025686391715800002,
        high: 0.000025683872004200003,
        low: 0.000025683872004200003,
        volume: 0,
    },
    {
        time: '1723319340',

        open: 0.000025683692043700003,
        close: 0.000025683692043700003,
        high: 0.000025681172861700005,
        low: 0.000025681172861700005,
        volume: 0,
    },
    {
        time: '1723319400',

        open: 0.000025680992939000002,
        close: 0.000025680992939000002,
        high: 0.0000256784742864,
        low: 0.0000256784742864,
        volume: 0,
    },
    {
        time: '1723319460',

        open: 0.000025678294401600002,
        close: 0.000025678294401600002,
        high: 0.000025675776278300003,
        low: 0.000025675776278300003,
        volume: 0,
    },
    {
        time: '1723319520',

        open: 0.000025675596431200002,
        close: 0.000025675596431200002,
        high: 0.000025673078837,
        low: 0.000025673078837,
        volume: 0,
    },
    {
        time: '1723319580',

        open: 0.0000256728990277,
        close: 0.0000256728990277,
        high: 0.000025670381962400002,
        low: 0.000025670381962400002,
        volume: 0,
    },
    {
        time: '1723319640',

        open: 0.0000256702021909,
        close: 0.0000256702021909,
        high: 0.0000256676856543,
        low: 0.0000256676856543,
        volume: 0,
    },
    {
        time: '1723319700',

        open: 0.000025667505920600003,
        close: 0.000025667505920600003,
        high: 0.000025664989912700002,
        low: 0.000025664989912700002,
        volume: 0,
    },
    {
        time: '1723319760',

        open: 0.000025664810216700003,
        close: 0.000025664810216700003,
        high: 0.0000256622947371,
        low: 0.0000256622947371,
        volume: 0,
    },
    {
        time: '1723319820',

        open: 0.0000256621150789,
        close: 0.0000256621150789,
        high: 0.0000256596001276,
        low: 0.0000256596001276,
        volume: 0,
    },
    {
        time: '1723319880',

        open: 0.000025659420507100003,
        close: 0.000025659420507100003,
        high: 0.000025656906084000005,
        low: 0.000025656906084000005,
        volume: 0,
    },
    {
        time: '1723319940',

        open: 0.0000256567265012,
        close: 0.0000256567265012,
        high: 0.000025654212605900003,
        low: 0.000025654212605900003,
        volume: 0,
    },
    {
        time: '1723320000',

        open: 0.0000256540330608,
        close: 0.0000256540330608,
        high: 0.000025651519693300003,
        low: 0.000025651519693300003,
        volume: 0,
    },
    {
        time: '1723320060',

        open: 0.000025651340185900004,
        close: 0.000025651340185900004,
        high: 0.000025648827346100005,
        low: 0.000025648827346100005,
        volume: 0,
    },
    {
        time: '1723320120',

        open: 0.0000256486478763,
        close: 0.0000256486478763,
        high: 0.0000256461355639,
        low: 0.0000256461355639,
        volume: 0,
    },
    {
        time: '1723320180',

        open: 0.0000256459561318,
        close: 0.0000256459561318,
        high: 0.0000256434443467,
        low: 0.0000256434443467,
        volume: 0,
    },
    {
        time: '1723320240',

        open: 0.000025643264952300004,
        close: 0.000025643264952300004,
        high: 0.000025640753694200006,
        low: 0.000025640753694200006,
        volume: 0,
    },
    {
        time: '1723320300',

        open: 0.0000256405743374,
        close: 0.0000256405743374,
        high: 0.000025638063606300004,
        low: 0.000025638063606300004,
        volume: 0,
    },
    {
        time: '1723320360',

        open: 0.000025637884287100005,
        close: 0.000025637884287100005,
        high: 0.000025635374082800006,
        low: 0.000025635374082800006,
        volume: 0,
    },
    {
        time: '1723320420',

        open: 0.000025635374082800006,
        close: 0.000025635374082800006,
        high: 0.000025632685123500004,
        low: 0.000025632685123500004,
        volume: 0,
    },
    {
        time: '1723320480',

        open: 0.0000256325058796,
        close: 0.0000256325058796,
        high: 0.000025629996728200004,
        low: 0.000025629996728200004,
        volume: 0,
    },
    {
        time: '1723320540',

        open: 0.0000256298175219,
        close: 0.0000256298175219,
        high: 0.000025627308896900002,
        low: 0.000025627308896900002,
        volume: 0,
    },
    {
        time: '1723320600',

        open: 0.0000256271297281,
        close: 0.0000256271297281,
        high: 0.000025624621629200003,
        low: 0.000025624621629200003,
        volume: 0,
    },
    {
        time: '1723320660',

        open: 0.000025624442498,
        close: 0.000025624442498,
        high: 0.000025621934925,
        low: 0.000025621934925,
        volume: 0,
    },
    {
        time: '1723320720',

        open: 0.000025621755831400005,
        close: 0.000025621755831400005,
        high: 0.000025619248784200004,
        low: 0.000025619248784200004,
        volume: 0,
    },
    {
        time: '1723320780',

        open: 0.000025619069728100003,
        close: 0.000025619069728100003,
        high: 0.000025616563206500002,
        low: 0.000025616563206500002,
        volume: 0,
    },
    {
        time: '1723320840',

        open: 0.000025616384188,
        close: 0.000025616384188,
        high: 0.000025613878191800005,
        low: 0.000025613878191800005,
        volume: 0,
    },
    {
        time: '1723320900',

        open: 0.0000256136992108,
        close: 0.0000256136992108,
        high: 0.000025611193739900004,
        low: 0.000025611193739900004,
        volume: 0,
    },
    {
        time: '1723320960',

        open: 0.000025611014796400002,
        close: 0.000025611014796400002,
        high: 0.0000256085098506,
        low: 0.0000256085098506,
        volume: 0,
    },
    {
        time: '1723321020',

        open: 0.000025608330944700002,
        close: 0.000025608330944700002,
        high: 0.0000256058265238,
        low: 0.0000256058265238,
        volume: 0,
    },
    {
        time: '1723321080',

        open: 0.000025605647655300002,
        close: 0.000025605647655300002,
        high: 0.000025603143759300002,
        low: 0.000025603143759300002,
        volume: 0,
    },
    {
        time: '1723321140',

        open: 0.000025602964928300002,
        close: 0.000025602964928300002,
        high: 0.000025600461556800005,
        low: 0.000025600461556800005,
        volume: 0,
    },
    {
        time: '1723321200',

        open: 0.0000256002827633,
        close: 0.0000256002827633,
        high: 0.0000255977799163,
        low: 0.0000255977799163,
        volume: 0,
    },
    {
        time: '1723321260',

        open: 0.000025597601160200002,
        close: 0.000025597601160200002,
        high: 0.000025595098837500004,
        low: 0.000025595098837500004,
        volume: 0,
    },
    {
        time: '1723321320',

        open: 0.0000255949201189,
        close: 0.0000255949201189,
        high: 0.0000255924183203,
        low: 0.0000255924183203,
        volume: 0,
    },
    {
        time: '1723321380',

        open: 0.0000255922396391,
        close: 0.0000255922396391,
        high: 0.000025589738364400002,
        low: 0.000025589738364400002,
        volume: 0,
    },
    {
        time: '1723321440',

        open: 0.000025589559720700003,
        close: 0.000025589559720700003,
        high: 0.0000255870589698,
        low: 0.0000255870589698,
        volume: 0,
    },
    {
        time: '1723321500',

        open: 0.0000255868803635,
        close: 0.0000255868803635,
        high: 0.0000255843801362,
        low: 0.0000255843801362,
        volume: 0,
    },
    {
        time: '1723321560',

        open: 0.000025584201567300002,
        close: 0.000025584201567300002,
        high: 0.000025581701863500002,
        low: 0.000025581701863500002,
        volume: 0,
    },
    {
        time: '1723321620',

        open: 0.000025581523332,
        close: 0.000025581523332,
        high: 0.000025579024151500004,
        low: 0.000025579024151500004,
        volume: 0,
    },
    {
        time: '1723321680',

        open: 0.000025578845657300003,
        close: 0.000025578845657300003,
        high: 0.000025576347000000003,
        low: 0.000025576347000000003,
        volume: 0,
    },
    {
        time: '1723321740',

        open: 0.000025576168543100002,
        close: 0.000025576168543100002,
        high: 0.0000255736704088,
        low: 0.0000255736704088,
        volume: 0,
    },
    {
        time: '1723321800',

        open: 0.000025573491989300002,
        close: 0.000025573491989300002,
        high: 0.0000255709943778,
        low: 0.0000255709943778,
        volume: 0,
    },
    {
        time: '1723321860',

        open: 0.000025570815995600002,
        close: 0.000025570815995600002,
        high: 0.0000255683189067,
        low: 0.0000255683189067,
        volume: 0,
    },
    {
        time: '1723321920',

        open: 0.0000255681405619,
        close: 0.0000255681405619,
        high: 0.000025565643995500004,
        low: 0.000025565643995500004,
        volume: 0,
    },
    {
        time: '1723321980',

        open: 0.000025565465688000003,
        close: 0.000025565465688000003,
        high: 0.0000255629696439,
        low: 0.0000255629696439,
        volume: 0,
    },
    {
        time: '1723322040',

        open: 0.0000255627913736,
        close: 0.0000255627913736,
        high: 0.000025560295851700003,
        low: 0.000025560295851700003,
        volume: 0,
    },
    {
        time: '1723322100',

        open: 0.0000255601176188,
        close: 0.0000255601176188,
        high: 0.000025557622618800002,
        low: 0.000025557622618800002,
        volume: 0,
    },
    {
        time: '1723322160',

        open: 0.000025557444423200002,
        close: 0.000025557444423200002,
        high: 0.000025554949945000004,
        low: 0.000025554949945000004,
        volume: 0,
    },
    {
        time: '1723322220',

        open: 0.000025554771786700002,
        close: 0.000025554771786700002,
        high: 0.0000255522778302,
        low: 0.0000255522778302,
        volume: 0,
    },
    {
        time: '1723322280',

        open: 0.0000255520997091,
        close: 0.0000255520997091,
        high: 0.0000255496062741,
        low: 0.0000255496062741,
        volume: 0,
    },
    {
        time: '1723322340',

        open: 0.0000255494281902,
        close: 0.0000255494281902,
        high: 0.0000255469352766,
        low: 0.0000255469352766,
        volume: 0,
    },
    {
        time: '1723322400',

        open: 0.000025546757229900002,
        close: 0.000025546757229900002,
        high: 0.0000255442648375,
        low: 0.0000255442648375,
        volume: 0,
    },
    {
        time: '1723322460',

        open: 0.000025544086828000002,
        close: 0.000025544086828000002,
        high: 0.000025541594956600003,
        low: 0.000025541594956600003,
        volume: 0,
    },
    {
        time: '1723322520',

        open: 0.000025541416984400003,
        close: 0.000025541416984400003,
        high: 0.0000255389256338,
        low: 0.0000255389256338,
        volume: 0,
    },
    {
        time: '1723322580',

        open: 0.000025538747698700004,
        close: 0.000025538747698700004,
        high: 0.000025536256868800004,
        low: 0.000025536256868800004,
        volume: 0,
    },
    {
        time: '1723322640',

        open: 0.000025536078971,
        close: 0.000025536078971,
        high: 0.000025533588661500002,
        low: 0.000025533588661500002,
        volume: 0,
    },
    {
        time: '1723322700',

        open: 0.000025533410800900002,
        close: 0.000025533410800900002,
        high: 0.0000255309210118,
        low: 0.0000255309210118,
        volume: 0,
    },
    {
        time: '1723322760',

        open: 0.000025530743188300005,
        close: 0.000025530743188300005,
        high: 0.000025528253919400002,
        low: 0.000025528253919400002,
        volume: 0,
    },
    {
        time: '1723322820',

        open: 0.0000255280761331,
        close: 0.0000255280761331,
        high: 0.000025525587384200002,
        low: 0.000025525587384200002,
        volume: 0,
    },
    {
        time: '1723322880',

        open: 0.000025525409635000003,
        close: 0.000025525409635000003,
        high: 0.000025522921406100002,
        low: 0.000025522921406100002,
        volume: 0,
    },
    {
        time: '1723322940',

        open: 0.000025522743694000002,
        close: 0.000025522743694000002,
        high: 0.000025520255984700003,
        low: 0.000025520255984700003,
        volume: 0,
    },
    {
        time: '1723323000',

        open: 0.000025520078309700002,
        close: 0.000025520078309700002,
        high: 0.00002551759112,
        low: 0.00002551759112,
        volume: 0,
    },
    {
        time: '1723323060',

        open: 0.000025517413482100003,
        close: 0.000025517413482100003,
        high: 0.0000255149268118,
        low: 0.0000255149268118,
        volume: 0,
    },
    {
        time: '1723323120',

        open: 0.000025514749211000002,
        close: 0.000025514749211000002,
        high: 0.000025512263059800003,
        low: 0.000025512263059800003,
        volume: 0,
    },
    {
        time: '1723323180',

        open: 0.000025512085496100002,
        close: 0.000025512085496100002,
        high: 0.000025509599864000004,
        low: 0.000025509599864000004,
        volume: 0,
    },
    {
        time: '1723323240',

        open: 0.0000255094223374,
        close: 0.0000255094223374,
        high: 0.000025506937224200005,
        low: 0.000025506937224200005,
        volume: 0,
    },
    {
        time: '1723323300',

        open: 0.0000255067597347,
        close: 0.0000255067597347,
        high: 0.0000255042751402,
        low: 0.0000255042751402,
        volume: 0,
    },
    {
        time: '1723323360',

        open: 0.0000255040976877,
        close: 0.0000255040976877,
        high: 0.0000255016136117,
        low: 0.0000255016136117,
        volume: 0,
    },
    {
        time: '1723323420',

        open: 0.000025501436196300002,
        close: 0.000025501436196300002,
        high: 0.0000254989526387,
        low: 0.0000254989526387,
        volume: 0,
    },
    {
        time: '1723323480',

        open: 0.000025498775260300003,
        close: 0.000025498775260300003,
        high: 0.000025496292221000003,
        low: 0.000025496292221000003,
        volume: 0,
    },
    {
        time: '1723323540',

        open: 0.0000254961148795,
        close: 0.0000254961148795,
        high: 0.000025493632358300002,
        low: 0.000025493632358300002,
        volume: 0,
    },
    {
        time: '1723323600',

        open: 0.0000254934550539,
        close: 0.0000254934550539,
        high: 0.000025490973050600003,
        low: 0.000025490973050600003,
        volume: 0,
    },
    {
        time: '1723323660',

        open: 0.0000254907957831,
        close: 0.0000254907957831,
        high: 0.0000254883142976,
        low: 0.0000254883142976,
        volume: 0,
    },
    {
        time: '1723323720',

        open: 0.0000254881370671,
        close: 0.0000254881370671,
        high: 0.0000254856560992,
        low: 0.0000254856560992,
        volume: 0,
    },
    {
        time: '1723323780',

        open: 0.000025485478905700003,
        close: 0.000025485478905700003,
        high: 0.000025482998455100002,
        low: 0.000025482998455100002,
        volume: 0,
    },
    {
        time: '1723323840',

        open: 0.000025482821298600002,
        close: 0.000025482821298600002,
        high: 0.000025480341365300004,
        low: 0.000025480341365300004,
        volume: 0,
    },
    {
        time: '1723323900',

        open: 0.000025480164245700004,
        close: 0.000025480164245700004,
        high: 0.0000254776848296,
        low: 0.0000254776848296,
        volume: 0,
    },
    {
        time: '1723323960',

        open: 0.000025477507746900003,
        close: 0.000025477507746900003,
        high: 0.000025475028847700002,
        low: 0.000025475028847700002,
        volume: 0,
    },
    {
        time: '1723324020',

        open: 0.0000254748518019,
        close: 0.0000254748518019,
        high: 0.0000254723734195,
        low: 0.0000254723734195,
        volume: 0,
    },
    {
        time: '1723324080',

        open: 0.0000254721964106,
        close: 0.0000254721964106,
        high: 0.000025469718544799998,
        low: 0.000025469718544799998,
        volume: 0,
    },
    {
        time: '1723324140',

        open: 0.000025469541572800003,
        close: 0.000025469541572800003,
        high: 0.0000254670642235,
        low: 0.0000254670642235,
        volume: 0,
    },
    {
        time: '1723324200',

        open: 0.000025466887288400003,
        close: 0.000025466887288400003,
        high: 0.0000254644104554,
        low: 0.0000254644104554,
        volume: 0,
    },
    {
        time: '1723324260',

        open: 0.000025464233557200004,
        close: 0.000025464233557200004,
        high: 0.000025461757240300004,
        low: 0.000025461757240300004,
        volume: 0,
    },
    {
        time: '1723324320',

        open: 0.000025461580378899998,
        close: 0.000025461580378899998,
        high: 0.000025459104578,
        low: 0.000025459104578,
        volume: 0,
    },
    {
        time: '1723324380',

        open: 0.000025458927753500003,
        close: 0.000025458927753500003,
        high: 0.0000254564524683,
        low: 0.0000254564524683,
        volume: 0,
    },
    {
        time: '1723324440',

        open: 0.000025456275680700004,
        close: 0.000025456275680700004,
        high: 0.000025453800911200003,
        low: 0.000025453800911200003,
        volume: 0,
    },
    {
        time: '1723324500',

        open: 0.000025453624160400002,
        close: 0.000025453624160400002,
        high: 0.000025451149906400004,
        low: 0.000025451149906400004,
        volume: 0,
    },
    {
        time: '1723324560',

        open: 0.0000254509731924,
        close: 0.0000254509731924,
        high: 0.000025448499453700004,
        low: 0.000025448499453700004,
        volume: 0,
    },
    {
        time: '1723324620',

        open: 0.0000254483227765,
        close: 0.0000254483227765,
        high: 0.000025445849553000002,
        low: 0.000025445849553000002,
        volume: 0,
    },
    {
        time: '1723324680',

        open: 0.000025445672912600002,
        close: 0.000025445672912600002,
        high: 0.0000254432002041,
        low: 0.0000254432002041,
        volume: 0,
    },
    {
        time: '1723324740',

        open: 0.000025443023600500003,
        close: 0.000025443023600500003,
        high: 0.000025440551406900006,
        low: 0.000025440551406900006,
        volume: 0,
    },
    {
        time: '1723324800',

        open: 0.000025440374840000002,
        close: 0.000025440374840000002,
        high: 0.000025437903161100002,
        low: 0.000025437903161100002,
        volume: 0,
    },
    {
        time: '1723324860',

        open: 0.000025437726630900002,
        close: 0.000025437726630900002,
        high: 0.000025435255466499998,
        low: 0.000025435255466499998,
        volume: 0,
    },
    {
        time: '1723324920',

        open: 0.0000254350789731,
        close: 0.0000254350789731,
        high: 0.000025432608323100002,
        low: 0.000025432608323100002,
        volume: 0,
    },
    {
        time: '1723324980',

        open: 0.0000254324318665,
        close: 0.0000254324318665,
        high: 0.000025429961730600004,
        low: 0.000025429961730600004,
        volume: 0,
    },
    {
        time: '1723325040',

        open: 0.000025429785310700004,
        close: 0.000025429785310700004,
        high: 0.0000254273156889,
        low: 0.0000254273156889,
        volume: 0,
    },
    {
        time: '1723325100',

        open: 0.0000254271393057,
        close: 0.0000254271393057,
        high: 0.000025424670197800003,
        low: 0.000025424670197800003,
        volume: 0,
    },
    {
        time: '1723325160',

        open: 0.000025424493851300002,
        close: 0.000025424493851300002,
        high: 0.000025422025257100002,
        low: 0.000025422025257100002,
        volume: 0,
    },
    {
        time: '1723325220',

        open: 0.000025421848947300004,
        close: 0.000025421848947300004,
        high: 0.000025419380866700003,
        low: 0.000025419380866700003,
        volume: 0,
    },
    {
        time: '1723325280',

        open: 0.0000254192045935,
        close: 0.0000254192045935,
        high: 0.0000254167370263,
        low: 0.0000254167370263,
        volume: 0,
    },
    {
        time: '1723325340',

        open: 0.000025416560789800002,
        close: 0.000025416560789800002,
        high: 0.000025414093735800003,
        low: 0.000025414093735800003,
        volume: 0,
    },
    {
        time: '1723325400',

        open: 0.000025413917536000003,
        close: 0.000025413917536000003,
        high: 0.0000254114509951,
        low: 0.0000254114509951,
        volume: 0,
    },
    {
        time: '1723325460',

        open: 0.000025411274831900003,
        close: 0.000025411274831900003,
        high: 0.000025408808804000002,
        low: 0.000025408808804000002,
        volume: 0,
    },
    {
        time: '1723325520',

        open: 0.0000254086326774,
        close: 0.0000254086326774,
        high: 0.0000254061671622,
        low: 0.0000254061671622,
        volume: 0,
    },
    {
        time: '1723325580',

        open: 0.000025405991072300004,
        close: 0.000025405991072300004,
        high: 0.000025403526069700003,
        low: 0.000025403526069700003,
        volume: 0,
    },
    {
        time: '1723325640',

        open: 0.000025403350016400003,
        close: 0.000025403350016400003,
        high: 0.0000254008855262,
        low: 0.0000254008855262,
        volume: 0,
    },
    {
        time: '1723325700',

        open: 0.000025400709509500005,
        close: 0.000025400709509500005,
        high: 0.000025398245531600002,
        low: 0.000025398245531600002,
        volume: 0,
    },
    {
        time: '1723325760',

        open: 0.000025398069551500003,
        close: 0.000025398069551500003,
        high: 0.000025395606085700003,
        low: 0.000025395606085700003,
        volume: 0,
    },
    {
        time: '1723325820',

        open: 0.000025395430142100002,
        close: 0.000025395430142100002,
        high: 0.000025392967188300004,
        low: 0.000025392967188300004,
        volume: 0,
    },
    {
        time: '1723325880',

        open: 0.0000253927912813,
        close: 0.0000253927912813,
        high: 0.000025390328839300004,
        low: 0.000025390328839300004,
        volume: 0,
    },
    {
        time: '1723325940',

        open: 0.000025390152968900004,
        close: 0.000025390152968900004,
        high: 0.000025387691038600002,
        low: 0.000025387691038600002,
        volume: 0,
    },
    {
        time: '1723326000',

        open: 0.0000253875152047,
        close: 0.0000253875152047,
        high: 0.0000253852295856,
        low: 0.0000253852295856,
        volume: 0,
    },
    {
        time: '1723326060',

        open: 0.000025385053785800004,
        close: 0.000025385053785800004,
        high: 0.000025382417080900004,
        low: 0.000025382417080900004,
        volume: 0,
    },
    {
        time: '1723326120',

        open: 0.00002538224132,
        close: 0.00002538224132,
        high: 0.000025379780923600002,
        low: 0.000025379780923600002,
        volume: 0,
    },
    {
        time: '1723326180',

        open: 0.000025379605199300002,
        close: 0.000025379605199300002,
        high: 0.0000253771453139,
        low: 0.0000253771453139,
        volume: 0,
    },
    {
        time: '1723326240',

        open: 0.0000253769696261,
        close: 0.0000253769696261,
        high: 0.000025374510251500003,
        low: 0.000025374510251500003,
        volume: 0,
    },
    {
        time: '1723326300',

        open: 0.000025374334600200003,
        close: 0.000025374334600200003,
        high: 0.0000253718757363,
        low: 0.0000253718757363,
        volume: 0,
    },
    {
        time: '1723326360',

        open: 0.0000253717001214,
        close: 0.0000253717001214,
        high: 0.0000253692417681,
        low: 0.0000253692417681,
        volume: 0,
    },
    {
        time: '1723326420',

        open: 0.0000253690661897,
        close: 0.0000253690661897,
        high: 0.000025366608346800002,
        low: 0.000025366608346800002,
        volume: 0,
    },
    {
        time: '1723326480',

        open: 0.000025366432804800002,
        close: 0.000025366432804800002,
        high: 0.0000253639754721,
        low: 0.0000253639754721,
        volume: 0,
    },
    {
        time: '1723326540',

        open: 0.000025363799966500002,
        close: 0.000025363799966500002,
        high: 0.000025361343143800002,
        low: 0.000025361343143800002,
        volume: 0,
    },
    {
        time: '1723326600',

        open: 0.000025361167674700005,
        close: 0.000025361167674700005,
        high: 0.000025358711361900002,
        low: 0.000025358711361900002,
        volume: 0,
    },
    {
        time: '1723326660',

        open: 0.000025358535929200002,
        close: 0.000025358535929200002,
        high: 0.000025356080126200003,
        low: 0.000025356080126200003,
        volume: 0,
    },
    {
        time: '1723326720',

        open: 0.000025355904729900003,
        close: 0.000025355904729900003,
        high: 0.000025353449436400005,
        low: 0.000025353449436400005,
        volume: 0,
    },
    {
        time: '1723326780',

        open: 0.000025353274076500003,
        close: 0.000025353274076500003,
        high: 0.000025350819292500002,
        low: 0.000025350819292500002,
        volume: 0,
    },
    {
        time: '1723326840',

        open: 0.000025350643969000005,
        close: 0.000025350643969000005,
        high: 0.0000253481896942,
        low: 0.0000253481896942,
        volume: 0,
    },
    {
        time: '1723326900',

        open: 0.000025348014407000002,
        close: 0.000025348014407000002,
        high: 0.000025345560641300005,
        low: 0.000025345560641300005,
        volume: 0,
    },
    {
        time: '1723326960',

        open: 0.000025345385390500002,
        close: 0.000025345385390500002,
        high: 0.0000253429321338,
        low: 0.0000253429321338,
        volume: 0,
    },
    {
        time: '1723327020',

        open: 0.000025342756919300003,
        close: 0.000025342756919300003,
        high: 0.0000253403041714,
        low: 0.0000253403041714,
        volume: 0,
    },
    {
        time: '1723327080',

        open: 0.0000253401289933,
        close: 0.0000253401289933,
        high: 0.0000253376767539,
        low: 0.0000253376767539,
        volume: 0,
    },
    {
        time: '1723327140',

        open: 0.000025337501612100003,
        close: 0.000025337501612100003,
        high: 0.0000253350498813,
        low: 0.0000253350498813,
        volume: 0,
    },
    {
        time: '1723327200',

        open: 0.000025334874775800003,
        close: 0.000025334874775800003,
        high: 0.000025332423553200004,
        low: 0.000025332423553200004,
        volume: 0,
    },
    {
        time: '1723327260',

        open: 0.0000253322484841,
        close: 0.0000253322484841,
        high: 0.000025329797769700002,
        low: 0.000025329797769700002,
        volume: 0,
    },
    {
        time: '1723327320',

        open: 0.0000253296227368,
        close: 0.0000253296227368,
        high: 0.0000253271725304,
        low: 0.0000253271725304,
        volume: 0,
    },
    {
        time: '1723327380',

        open: 0.000025326997533800002,
        close: 0.000025326997533800002,
        high: 0.000025324547835200002,
        low: 0.000025324547835200002,
        volume: 0,
    },
    {
        time: '1723327440',

        open: 0.000025324372874900004,
        close: 0.000025324372874900004,
        high: 0.000025321923684,
        low: 0.000025321923684,
        volume: 0,
    },
    {
        time: '1723327500',

        open: 0.000025321748759900003,
        close: 0.000025321748759900003,
        high: 0.0000253193000765,
        low: 0.0000253193000765,
        volume: 0,
    },
    {
        time: '1723327560',

        open: 0.000025319125188700002,
        close: 0.000025319125188700002,
        high: 0.0000253166770127,
        low: 0.0000253166770127,
        volume: 0,
    },
    {
        time: '1723327620',

        open: 0.000025316502161100004,
        close: 0.000025316502161100004,
        high: 0.000025314054492300004,
        low: 0.000025314054492300004,
        volume: 0,
    },
    {
        time: '1723327680',

        open: 0.0000253138796769,
        close: 0.0000253138796769,
        high: 0.000025311432515100004,
        low: 0.000025311432515100004,
        volume: 0,
    },
    {
        time: '1723327740',

        open: 0.000025311257736,
        close: 0.000025311257736,
        high: 0.0000253088110811,
        low: 0.0000253088110811,
        volume: 0,
    },
    {
        time: '1723327800',

        open: 0.000025308636338100003,
        close: 0.000025308636338100003,
        high: 0.00002530619019,
        low: 0.00002530619019,
        volume: 0,
    },
    {
        time: '1723327860',

        open: 0.000025306015483200003,
        close: 0.000025306015483200003,
        high: 0.0000253035698416,
        low: 0.0000253035698416,
        volume: 0,
    },
    {
        time: '1723327920',

        open: 0.000025303395171,
        close: 0.000025303395171,
        high: 0.0000253009500359,
        low: 0.0000253009500359,
        volume: 0,
    },
    {
        time: '1723327980',

        open: 0.0000253007754015,
        close: 0.0000253007754015,
        high: 0.000025298330772600005,
        low: 0.000025298330772600005,
        volume: 0,
    },
    {
        time: '1723328040',

        open: 0.000025298156174300005,
        close: 0.000025298156174300005,
        high: 0.0000252957120515,
        low: 0.0000252957120515,
        volume: 0,
    },
    {
        time: '1723328100',

        open: 0.0000252955374894,
        close: 0.0000252955374894,
        high: 0.000025293093872600004,
        low: 0.000025293093872600004,
        volume: 0,
    },
    {
        time: '1723328160',

        open: 0.0000252929193466,
        close: 0.0000252929193466,
        high: 0.0000252904762355,
        low: 0.0000252904762355,
        volume: 0,
    },
    {
        time: '1723328220',

        open: 0.0000252903017456,
        close: 0.0000252903017456,
        high: 0.000025287859140200002,
        low: 0.000025287859140200002,
        volume: 0,
    },
    {
        time: '1723328280',

        open: 0.000025287684686500002,
        close: 0.000025287684686500002,
        high: 0.000025285242586500003,
        low: 0.000025285242586500003,
        volume: 0,
    },
    {
        time: '1723328340',

        open: 0.000025285068168900005,
        close: 0.000025285068168900005,
        high: 0.0000252826265742,
        low: 0.0000252826265742,
        volume: 0,
    },
    {
        time: '1723328400',

        open: 0.0000252824521927,
        close: 0.0000252824521927,
        high: 0.000025280011103200003,
        low: 0.000025280011103200003,
        volume: 0,
    },
    {
        time: '1723328460',

        open: 0.0000252798367577,
        close: 0.0000252798367577,
        high: 0.0000252773961732,
        low: 0.0000252773961732,
        volume: 0,
    },
    {
        time: '1723328520',

        open: 0.0000252772218638,
        close: 0.0000252772218638,
        high: 0.0000252747817842,
        low: 0.0000252747817842,
        volume: 0,
    },
    {
        time: '1723328580',

        open: 0.000025274607510800003,
        close: 0.000025274607510800003,
        high: 0.000025272167935900003,
        low: 0.000025272167935900003,
        volume: 0,
    },
    {
        time: '1723328640',

        open: 0.0000252719936986,
        close: 0.0000252719936986,
        high: 0.000025269554628200004,
        low: 0.000025269554628200004,
        volume: 0,
    },
    {
        time: '1723328700',

        open: 0.000025269380426900002,
        close: 0.000025269380426900002,
        high: 0.0000252669418609,
        low: 0.0000252669418609,
        volume: 0,
    },
    {
        time: '1723328760',

        open: 0.0000252667676956,
        close: 0.0000252667676956,
        high: 0.000025264329633800003,
        low: 0.000025264329633800003,
        volume: 0,
    },
    {
        time: '1723328820',

        open: 0.0000252641555046,
        close: 0.0000252641555046,
        high: 0.0000252617179468,
        low: 0.0000252617179468,
        volume: 0,
    },
    {
        time: '1723328880',

        open: 0.0000252615438536,
        close: 0.0000252615438536,
        high: 0.0000252591067997,
        low: 0.0000252591067997,
        volume: 0,
    },
    {
        time: '1723328940',

        open: 0.000025258932742500002,
        close: 0.000025258932742500002,
        high: 0.000025256496192400004,
        low: 0.000025256496192400004,
        volume: 0,
    },
    {
        time: '1723329000',

        open: 0.000025256322171100002,
        close: 0.000025256322171100002,
        high: 0.0000252538861246,
        low: 0.0000252538861246,
        volume: 0,
    },
    {
        time: '1723329060',

        open: 0.0000252537121393,
        close: 0.0000252537121393,
        high: 0.0000252512765963,
        low: 0.0000252512765963,
        volume: 0,
    },
    {
        time: '1723329120',

        open: 0.000025251102646900002,
        close: 0.000025251102646900002,
        high: 0.000025248667607200004,
        low: 0.000025248667607200004,
        volume: 0,
    },
    {
        time: '1723329180',

        open: 0.000025248493693700002,
        close: 0.000025248493693700002,
        high: 0.000025246059157100004,
        low: 0.000025246059157100004,
        volume: 0,
    },
    {
        time: '1723329240',

        open: 0.0000252458852796,
        close: 0.0000252458852796,
        high: 0.000025243451246,
        low: 0.000025243451246,
        volume: 0,
    },
    {
        time: '1723329300',

        open: 0.0000252432774044,
        close: 0.0000252432774044,
        high: 0.0000252408438735,
        low: 0.0000252408438735,
        volume: 0,
    },
    {
        time: '1723329360',

        open: 0.000025240670067900003,
        close: 0.000025240670067900003,
        high: 0.0000252382370397,
        low: 0.0000252382370397,
        volume: 0,
    },
    {
        time: '1723329420',

        open: 0.0000252380632699,
        close: 0.0000252380632699,
        high: 0.000025235630744300002,
        low: 0.000025235630744300002,
        volume: 0,
    },
    {
        time: '1723329480',

        open: 0.0000252354570104,
        close: 0.0000252354570104,
        high: 0.000025233024987100002,
        low: 0.000025233024987100002,
        volume: 0,
    },
    {
        time: '1723329540',

        open: 0.0000252328512891,
        close: 0.0000252328512891,
        high: 0.000025230419767900002,
        low: 0.000025230419767900002,
        volume: 0,
    },
    {
        time: '1723329600',

        open: 0.000025230246105800006,
        close: 0.000025230246105800006,
        high: 0.000025227815086700002,
        low: 0.000025227815086700002,
        volume: 0,
    },
    {
        time: '1723329660',

        open: 0.000025227641460400003,
        close: 0.000025227641460400003,
        high: 0.000025225210943200004,
        low: 0.000025225210943200004,
        volume: 0,
    },
    {
        time: '1723329720',

        open: 0.0000252250373528,
        close: 0.0000252250373528,
        high: 0.000025222607337300003,
        low: 0.000025222607337300003,
        volume: 0,
    },
    {
        time: '1723329780',

        open: 0.0000252224337827,
        close: 0.0000252224337827,
        high: 0.000025220004268800004,
        low: 0.000025220004268800004,
        volume: 0,
    },
    {
        time: '1723329840',

        open: 0.00002521983075,
        close: 0.00002521983075,
        high: 0.000025217401737500003,
        low: 0.000025217401737500003,
        volume: 0,
    },
    {
        time: '1723329900',

        open: 0.0000252172282545,
        close: 0.0000252172282545,
        high: 0.000025214799743300002,
        low: 0.000025214799743300002,
        volume: 0,
    },
    {
        time: '1723329960',

        open: 0.000025214626296100003,
        close: 0.000025214626296100003,
        high: 0.000025212198286000004,
        low: 0.000025212198286000004,
        volume: 0,
    },
    {
        time: '1723330020',

        open: 0.0000252120248746,
        close: 0.0000252120248746,
        high: 0.000025209597365400003,
        low: 0.000025209597365400003,
        volume: 0,
    },
    {
        time: '1723330080',

        open: 0.0000252094239898,
        close: 0.0000252094239898,
        high: 0.000025206996981400003,
        low: 0.000025206996981400003,
        volume: 0,
    },
    {
        time: '1723330140',

        open: 0.0000252068236416,
        close: 0.0000252068236416,
        high: 0.000025204397133900002,
        low: 0.000025204397133900002,
        volume: 0,
    },
    {
        time: '1723330200',

        open: 0.000025204223829800002,
        close: 0.000025204223829800002,
        high: 0.0000252017978225,
        low: 0.0000252017978225,
        volume: 0,
    },
    {
        time: '1723330260',

        open: 0.0000252016245542,
        close: 0.0000252016245542,
        high: 0.000025199199047300002,
        low: 0.000025199199047300002,
        volume: 0,
    },
    {
        time: '1723330320',

        open: 0.000025199025814600004,
        close: 0.000025199025814600004,
        high: 0.000025196600807900003,
        low: 0.000025196600807900003,
        volume: 0,
    },
    {
        time: '1723330380',

        open: 0.000025196427611000002,
        close: 0.000025196427611000002,
        high: 0.000025194003104300003,
        low: 0.000025194003104300003,
        volume: 0,
    },
    {
        time: '1723330440',

        open: 0.0000251938299431,
        close: 0.0000251938299431,
        high: 0.0000251914059362,
        low: 0.0000251914059362,
        volume: 0,
    },
    {
        time: '1723330500',

        open: 0.000025191232810800003,
        close: 0.000025191232810800003,
        high: 0.000025188809303600003,
        low: 0.000025188809303600003,
        volume: 0,
    },
    {
        time: '1723330560',

        open: 0.000025188636213800003,
        close: 0.000025188636213800003,
        high: 0.0000251862132062,
        low: 0.0000251862132062,
        volume: 0,
    },
    {
        time: '1723330620',

        open: 0.000025186040152100004,
        close: 0.000025186040152100004,
        high: 0.0000251836176439,
        low: 0.0000251836176439,
        volume: 0,
    },
    {
        time: '1723330680',

        open: 0.000025002672861500003,
        close: 0.000025002672861500003,
        high: 0.0000250002682383,
        low: 0.0000250002682383,
        volume: 0,
    },
    {
        time: '1723330740',

        open: 0.000025000096497200002,
        close: 0.000025000096497200002,
        high: 0.0000249976923694,
        low: 0.0000249976923694,
        volume: 0,
    },
    {
        time: '1723330800',

        open: 0.000024997520663700005,
        close: 0.000024997520663700005,
        high: 0.000024995117031300002,
        low: 0.000024995117031300002,
        volume: 0,
    },
    {
        time: '1723330860',

        open: 0.000024994945361,
        close: 0.000024994945361,
        high: 0.0000249925422238,
        low: 0.0000249925422238,
        volume: 0,
    },
    {
        time: '1723330920',

        open: 0.0000249923705889,
        close: 0.0000249923705889,
        high: 0.000024989967946700003,
        low: 0.000024989967946700003,
        volume: 0,
    },
    {
        time: '1723330980',

        open: 0.000024989796347100002,
        close: 0.000024989796347100002,
        high: 0.000024987394199900003,
        low: 0.000024987394199900003,
        volume: 0,
    },
    {
        time: '1723331040',

        open: 0.000024987222635600002,
        close: 0.000024987222635600002,
        high: 0.000024984820983100005,
        low: 0.000024984820983100005,
        volume: 0,
    },
    {
        time: '1723331100',

        open: 0.0000249846494542,
        close: 0.0000249846494542,
        high: 0.0000249822482963,
        low: 0.0000249822482963,
        volume: 0,
    },
    {
        time: '1723331160',

        open: 0.000024982076802700005,
        close: 0.000024982076802700005,
        high: 0.000024979676139300005,
        low: 0.000024979676139300005,
        volume: 0,
    },
    {
        time: '1723331220',

        open: 0.000024979504681000003,
        close: 0.000024979504681000003,
        high: 0.000024977104511800003,
        low: 0.000024977104511800003,
        volume: 0,
    },
    {
        time: '1723331280',

        open: 0.000024977104511800003,
        close: 0.000024977104511800003,
        high: 0.000024974533413800003,
        low: 0.000024974533413800003,
        volume: 0,
    },
    {
        time: '1723331340',

        open: 0.0000249743620261,
        close: 0.0000249743620261,
        high: 0.000024971962845000004,
        low: 0.000024971962845000004,
        volume: 0,
    },
    {
        time: '1723331400',

        open: 0.000024971791492600002,
        close: 0.000024971791492600002,
        high: 0.0000249693928054,
        low: 0.0000249693928054,
        volume: 0,
    },
    {
        time: '1723331460',

        open: 0.0000249692214882,
        close: 0.0000249692214882,
        high: 0.000024966994579000003,
        low: 0.000024966994579000003,
        volume: 0,
    },
    {
        time: '1723331520',

        open: 0.0000249666520128,
        close: 0.0000249666520128,
        high: 0.000024964254312800003,
        low: 0.000024964254312800003,
        volume: 0,
    },
    {
        time: '1723331580',

        open: 0.000024964083066200003,
        close: 0.000024964083066200003,
        high: 0.000024961685859500003,
        low: 0.000024961685859500003,
        volume: 0,
    },
    {
        time: '1723331640',

        open: 0.000024961514648100002,
        close: 0.000024961514648100002,
        high: 0.0000249591179347,
        low: 0.0000249591179347,
        volume: 0,
    },
    {
        time: '1723331700',

        open: 0.0000249589467585,
        close: 0.0000249589467585,
        high: 0.000024956550538200002,
        low: 0.000024956550538200002,
        volume: 0,
    },
    {
        time: '1723331760',

        open: 0.0000249563793972,
        close: 0.0000249563793972,
        high: 0.000024953983669800003,
        low: 0.000024953983669800003,
        volume: 0,
    },
    {
        time: '1723331820',

        open: 0.000024953812564000003,
        close: 0.000024953812564000003,
        high: 0.000024951417329300002,
        low: 0.000024951417329300002,
        volume: 0,
    },
    {
        time: '1723331880',

        open: 0.000024951246258800002,
        close: 0.000024951246258800002,
        high: 0.000024948851516700005,
        low: 0.000024948851516700005,
        volume: 0,
    },
    {
        time: '1723331940',

        open: 0.0000249486804813,
        close: 0.0000249486804813,
        high: 0.0000249462862317,
        low: 0.0000249462862317,
        volume: 0,
    },
    {
        time: '1723332000',

        open: 0.000024946115231500002,
        close: 0.000024946115231500002,
        high: 0.000024943721474200002,
        low: 0.000024943721474200002,
        volume: 0,
    },
    {
        time: '1723332060',

        open: 0.000024943550509200002,
        close: 0.000024943550509200002,
        high: 0.0000249411572441,
        low: 0.0000249411572441,
        volume: 0,
    },
    {
        time: '1723332120',

        open: 0.000024940986314100002,
        close: 0.000024940986314100002,
        high: 0.000024938593541000004,
        low: 0.000024938593541000004,
        volume: 0,
    },
    {
        time: '1723332180',

        open: 0.0000249384226462,
        close: 0.0000249384226462,
        high: 0.000024936030365000004,
        low: 0.000024936030365000004,
        volume: 0,
    },
    {
        time: '1723332240',

        open: 0.000024935859505300002,
        close: 0.000024935859505300002,
        high: 0.000024933467715800002,
        low: 0.000024933467715800002,
        volume: 0,
    },
    {
        time: '1723332300',

        open: 0.0000249332968912,
        close: 0.0000249332968912,
        high: 0.000024930905593200005,
        low: 0.000024930905593200005,
        volume: 0,
    },
    {
        time: '1723332360',

        open: 0.000024930734803800004,
        close: 0.000024930734803800004,
        high: 0.0000249283439972,
        low: 0.0000249283439972,
        volume: 0,
    },
    {
        time: '1723332420',

        open: 0.0000249281732428,
        close: 0.0000249281732428,
        high: 0.000024925782927500005,
        low: 0.000024925782927500005,
        volume: 0,
    },
    {
        time: '1723332480',

        open: 0.0000249256122082,
        close: 0.0000249256122082,
        high: 0.000024923222384,
        low: 0.000024923222384,
        volume: 0,
    },
    {
        time: '1723332540',

        open: 0.0000249230516998,
        close: 0.0000249230516998,
        high: 0.000024920662366500002,
        low: 0.000024920662366500002,
        volume: 0,
    },
    {
        time: '1723332600',

        open: 0.000024920491717400005,
        close: 0.000024920491717400005,
        high: 0.000024918102874900003,
        low: 0.000024918102874900003,
        volume: 0,
    },
    {
        time: '1723332660',

        open: 0.000024917932260800003,
        close: 0.000024917932260800003,
        high: 0.000024915543908900003,
        low: 0.000024915543908900003,
        volume: 0,
    },
    {
        time: '1723332720',

        open: 0.000024915373329900002,
        close: 0.000024915373329900002,
        high: 0.0000249129854685,
        low: 0.0000249129854685,
        volume: 0,
    },
    {
        time: '1723332780',

        open: 0.000024912814924500004,
        close: 0.000024912814924500004,
        high: 0.000024910427553500003,
        low: 0.000024910427553500003,
        volume: 0,
    },
    {
        time: '1723332840',

        open: 0.000024910257044500004,
        close: 0.000024910257044500004,
        high: 0.000024907870163600003,
        low: 0.000024907870163600003,
        volume: 0,
    },
    {
        time: '1723332900',

        open: 0.0000249076996896,
        close: 0.0000249076996896,
        high: 0.000024905313298800002,
        low: 0.000024905313298800002,
        volume: 0,
    },
    {
        time: '1723332960',

        open: 0.0000249051428599,
        close: 0.0000249051428599,
        high: 0.0000249027569589,
        low: 0.0000249027569589,
        volume: 0,
    },
    {
        time: '1723333020',

        open: 0.0000249025865549,
        close: 0.0000249025865549,
        high: 0.000024900201143800003,
        low: 0.000024900201143800003,
        volume: 0,
    },
    {
        time: '1723333080',

        open: 0.0000249000307747,
        close: 0.0000249000307747,
        high: 0.000024897645853200004,
        low: 0.000024897645853200004,
        volume: 0,
    },
    {
        time: '1723333140',

        open: 0.0000248974755191,
        close: 0.0000248974755191,
        high: 0.000024895091086900004,
        low: 0.000024895091086900004,
        volume: 0,
    },
    {
        time: '1723333200',

        open: 0.000024894920787800004,
        close: 0.000024894920787800004,
        high: 0.000024892536845,
        low: 0.000024892536845,
        volume: 0,
    },
    {
        time: '1723333260',

        open: 0.0000248923665808,
        close: 0.0000248923665808,
        high: 0.000024889983127100005,
        low: 0.000024889983127100005,
        volume: 0,
    },
    {
        time: '1723333320',

        open: 0.000024889812897800002,
        close: 0.000024889812897800002,
        high: 0.0000248874299331,
        low: 0.0000248874299331,
        volume: 0,
    },
    {
        time: '1723333380',

        open: 0.0000248872597388,
        close: 0.0000248872597388,
        high: 0.0000248848772629,
        low: 0.0000248848772629,
        volume: 0,
    },
    {
        time: '1723333440',

        open: 0.000024884707103500004,
        close: 0.000024884707103500004,
        high: 0.000024882325116200004,
        low: 0.000024882325116200004,
        volume: 0,
    },
    {
        time: '1723333500',

        open: 0.0000248821549917,
        close: 0.0000248821549917,
        high: 0.000024879773493,
        low: 0.000024879773493,
        volume: 0,
    },
    {
        time: '1723333560',

        open: 0.0000248796034034,
        close: 0.0000248796034034,
        high: 0.0000248772223931,
        low: 0.0000248772223931,
        volume: 0,
    },
    {
        time: '1723333620',

        open: 0.0000248770523384,
        close: 0.0000248770523384,
        high: 0.0000248746718163,
        low: 0.0000248746718163,
        volume: 0,
    },
    {
        time: '1723333680',

        open: 0.000024874501796400004,
        close: 0.000024874501796400004,
        high: 0.0000248721217624,
        low: 0.0000248721217624,
        volume: 0,
    },
    {
        time: '1723333740',

        open: 0.0000248719517774,
        close: 0.0000248719517774,
        high: 0.000024869572231400002,
        low: 0.000024869572231400002,
        volume: 0,
    },
    {
        time: '1723333800',

        open: 0.000024869402281200002,
        close: 0.000024869402281200002,
        high: 0.000024867023222900004,
        low: 0.000024867023222900004,
        volume: 0,
    },
    {
        time: '1723333860',

        open: 0.0000248668533076,
        close: 0.0000248668533076,
        high: 0.000024864474736900003,
        low: 0.000024864474736900003,
        volume: 0,
    },
    {
        time: '1723333920',

        open: 0.000024864304856400003,
        close: 0.000024864304856400003,
        high: 0.0000248619267733,
        low: 0.0000248619267733,
        volume: 0,
    },
    {
        time: '1723333980',

        open: 0.0000248617569276,
        close: 0.0000248617569276,
        high: 0.0000248593793317,
        low: 0.0000248593793317,
        volume: 0,
    },
    {
        time: '1723334040',

        open: 0.0000248592095209,
        close: 0.0000248592095209,
        high: 0.0000248568324122,
        low: 0.0000248568324122,
        volume: 0,
    },
    {
        time: '1723334100',

        open: 0.0000248566626361,
        close: 0.0000248566626361,
        high: 0.0000248542860145,
        low: 0.0000248542860145,
        volume: 0,
    },
    {
        time: '1723334160',

        open: 0.0000248541162732,
        close: 0.0000248541162732,
        high: 0.000024851740138400004,
        low: 0.000024851740138400004,
        volume: 0,
    },
    {
        time: '1723334220',

        open: 0.0000248515704319,
        close: 0.0000248515704319,
        high: 0.000024849194783900003,
        low: 0.000024849194783900003,
        volume: 0,
    },
    {
        time: '1723334280',

        open: 0.000024849025112100003,
        close: 0.000024849025112100003,
        high: 0.000024846649950700003,
        low: 0.000024846649950700003,
        volume: 0,
    },
    {
        time: '1723334340',

        open: 0.000024846480313700003,
        close: 0.000024846480313700003,
        high: 0.000024844105638700002,
        low: 0.000024844105638700002,
        volume: 0,
    },
    {
        time: '1723334400',

        open: 0.000024843936036400004,
        close: 0.000024843936036400004,
        high: 0.0000248415618477,
        low: 0.0000248415618477,
        volume: 0,
    },
    {
        time: '1723334460',

        open: 0.000024841392280200004,
        close: 0.000024841392280200004,
        high: 0.0000248390185776,
        low: 0.0000248390185776,
        volume: 0,
    },
    {
        time: '1723334520',

        open: 0.0000248388490448,
        close: 0.0000248388490448,
        high: 0.0000248364758282,
        low: 0.0000248364758282,
        volume: 0,
    },
    {
        time: '1723334580',

        open: 0.0000248363063301,
        close: 0.0000248363063301,
        high: 0.000024834103065000002,
        low: 0.000024834103065000002,
        volume: 0,
    },
    {
        time: '1723334640',

        open: 0.0000248339335993,
        close: 0.0000248339335993,
        high: 0.000024831391890800003,
        low: 0.000024831391890800003,
        volume: 0,
    },
    {
        time: '1723334700',

        open: 0.0000248312224621,
        close: 0.0000248312224621,
        high: 0.0000248288507026,
        low: 0.0000248288507026,
        volume: 0,
    },
    {
        time: '1723334760',

        open: 0.000024828681308500004,
        close: 0.000024828681308500004,
        high: 0.0000248263100344,
        low: 0.0000248263100344,
        volume: 0,
    },
    {
        time: '1723334820',

        open: 0.000024826140675000002,
        close: 0.000024826140675000002,
        high: 0.000024823769886100004,
        low: 0.000024823769886100004,
        volume: 0,
    },
    {
        time: '1723334880',

        open: 0.000024823600561300003,
        close: 0.000024823600561300003,
        high: 0.000024821230257500002,
        low: 0.000024821230257500002,
        volume: 0,
    },
    {
        time: '1723334940',

        open: 0.0000248210609674,
        close: 0.0000248210609674,
        high: 0.0000248186911486,
        low: 0.0000248186911486,
        volume: 0,
    },
    {
        time: '1723335000',

        open: 0.000024818521893100003,
        close: 0.000024818521893100003,
        high: 0.000024816152559000003,
        low: 0.000024816152559000003,
        volume: 0,
    },
    {
        time: '1723335060',

        open: 0.000024815983338200003,
        close: 0.000024815983338200003,
        high: 0.0000248136144888,
        low: 0.0000248136144888,
        volume: 0,
    },
    {
        time: '1723335120',

        open: 0.0000248134453026,
        close: 0.0000248134453026,
        high: 0.000024811076937600002,
        low: 0.000024811076937600002,
        volume: 0,
    },
    {
        time: '1723335180',

        open: 0.000024810907786,
        close: 0.000024810907786,
        high: 0.000024808539905400004,
        low: 0.000024808539905400004,
        volume: 0,
    },
    {
        time: '1723335240',

        open: 0.0000248083707884,
        close: 0.0000248083707884,
        high: 0.000024806003392,
        low: 0.000024806003392,
        volume: 0,
    },
    {
        time: '1723335300',

        open: 0.0000248058343096,
        close: 0.0000248058343096,
        high: 0.0000248034673972,
        low: 0.0000248034673972,
        volume: 0,
    },
    {
        time: '1723335360',

        open: 0.0000248032983494,
        close: 0.0000248032983494,
        high: 0.000024800931920900004,
        low: 0.000024800931920900004,
        volume: 0,
    },
    {
        time: '1723335420',

        open: 0.000024800762907600002,
        close: 0.000024800762907600002,
        high: 0.000024798396962900002,
        low: 0.000024798396962900002,
        volume: 0,
    },
    {
        time: '1723335480',

        open: 0.000024798227984200002,
        close: 0.000024798227984200002,
        high: 0.0000247958625231,
        low: 0.0000247958625231,
        volume: 0,
    },
    {
        time: '1723335540',

        open: 0.0000247956935789,
        close: 0.0000247956935789,
        high: 0.0000247933286013,
        low: 0.0000247933286013,
        volume: 0,
    },
    {
        time: '1723335600',

        open: 0.000024793159691600002,
        close: 0.000024793159691600002,
        high: 0.0000247907951973,
        low: 0.0000247907951973,
        volume: 0,
    },
    {
        time: '1723335660',

        open: 0.0000247906263221,
        close: 0.0000247906263221,
        high: 0.000024788262310900005,
        low: 0.000024788262310900005,
        volume: 0,
    },
    {
        time: '1723335720',

        open: 0.0000247880934702,
        close: 0.0000247880934702,
        high: 0.0000247857299421,
        low: 0.0000247857299421,
        volume: 0,
    },
    {
        time: '1723335780',

        open: 0.0000247855611359,
        close: 0.0000247855611359,
        high: 0.0000247831980907,
        low: 0.0000247831980907,
        volume: 0,
    },
    {
        time: '1723335840',

        open: 0.000024783029319000003,
        close: 0.000024783029319000003,
        high: 0.000024780666756400004,
        low: 0.000024780666756400004,
        volume: 0,
    },
    {
        time: '1723335900',

        open: 0.000024780498019200003,
        close: 0.000024780498019200003,
        high: 0.000024778135939200003,
        low: 0.000024778135939200003,
        volume: 0,
    },
    {
        time: '1723335960',

        open: 0.000024777967236400003,
        close: 0.000024777967236400003,
        high: 0.000024775605638900002,
        low: 0.000024775605638900002,
        volume: 0,
    },
    {
        time: '1723336020',

        open: 0.0000247754369706,
        close: 0.0000247754369706,
        high: 0.000024773075855300002,
        low: 0.000024773075855300002,
        volume: 0,
    },
    {
        time: '1723336080',

        open: 0.000024772907221400003,
        close: 0.000024772907221400003,
        high: 0.000024770546588300003,
        low: 0.000024770546588300003,
        volume: 0,
    },
    {
        time: '1723336140',

        open: 0.000024770377988800004,
        close: 0.000024770377988800004,
        high: 0.000024768017837700003,
        low: 0.000024768017837700003,
        volume: 0,
    },
    {
        time: '1723336200',

        open: 0.0000247678492726,
        close: 0.0000247678492726,
        high: 0.000024765489603300005,
        low: 0.000024765489603300005,
        volume: 0,
    },
    {
        time: '1723336260',

        open: 0.000024765321072700003,
        close: 0.000024765321072700003,
        high: 0.000024762961885000003,
        low: 0.000024762961885000003,
        volume: 0,
    },
    {
        time: '1723336320',

        open: 0.000024762793388800002,
        close: 0.000024762793388800002,
        high: 0.0000247604346827,
        low: 0.0000247604346827,
        volume: 0,
    },
    {
        time: '1723336380',

        open: 0.000024760266220900004,
        close: 0.000024760266220900004,
        high: 0.0000247579079962,
        low: 0.0000247579079962,
        volume: 0,
    },
    {
        time: '1723336440',

        open: 0.0000247577395687,
        close: 0.0000247577395687,
        high: 0.000024755381825200004,
        low: 0.000024755381825200004,
        volume: 0,
    },
    {
        time: '1723336500',

        open: 0.000024755213432200003,
        close: 0.000024755213432200003,
        high: 0.0000247528561698,
        low: 0.0000247528561698,
        volume: 0,
    },
    {
        time: '1723336560',

        open: 0.000024752687811100003,
        close: 0.000024752687811100003,
        high: 0.0000247503310296,
        low: 0.0000247503310296,
        volume: 0,
    },
    {
        time: '1723336620',

        open: 0.0000247501627052,
        close: 0.0000247501627052,
        high: 0.000024747806404600002,
        low: 0.000024747806404600002,
        volume: 0,
    },
    {
        time: '1723336680',

        open: 0.0000247476381146,
        close: 0.0000247476381146,
        high: 0.000024745282294600003,
        low: 0.000024745282294600003,
        volume: 0,
    },
    {
        time: '1723336740',

        open: 0.000024745114038900005,
        close: 0.000024745114038900005,
        high: 0.000024742758699400002,
        low: 0.000024742758699400002,
        volume: 0,
    },
    {
        time: '1723336800',

        open: 0.000024742590478000003,
        close: 0.000024742590478000003,
        high: 0.000024740235618800004,
        low: 0.000024740235618800004,
        volume: 0,
    },
    {
        time: '1723336860',

        open: 0.000024740067431800002,
        close: 0.000024740067431800002,
        high: 0.000024737713052800003,
        low: 0.000024737713052800003,
        volume: 0,
    },
    {
        time: '1723336920',

        open: 0.000024737544900100004,
        close: 0.000024737544900100004,
        high: 0.0000247351910012,
        low: 0.0000247351910012,
        volume: 0,
    },
    {
        time: '1723336980',

        open: 0.000024735022882700003,
        close: 0.000024735022882700003,
        high: 0.000024732669463800002,
        low: 0.000024732669463800002,
        volume: 0,
    },
    {
        time: '1723337040',

        open: 0.000024732501379500004,
        close: 0.000024732501379500004,
        high: 0.000024730148440400002,
        low: 0.000024730148440400002,
        volume: 0,
    },
    {
        time: '1723337100',

        open: 0.000024729980390400003,
        close: 0.000024729980390400003,
        high: 0.000024727627930900004,
        low: 0.000024727627930900004,
        volume: 0,
    },
    {
        time: '1723337160',

        open: 0.000024727459915200002,
        close: 0.000024727459915200002,
        high: 0.000024725107935100004,
        low: 0.000024725107935100004,
        volume: 0,
    },
    {
        time: '1723337220',

        open: 0.0000247249399536,
        close: 0.0000247249399536,
        high: 0.0000247225884529,
        low: 0.0000247225884529,
        volume: 0,
    },
    {
        time: '1723337280',

        open: 0.000024722420505700005,
        close: 0.000024722420505700005,
        high: 0.0000247200694841,
        low: 0.0000247200694841,
        volume: 0,
    },
    {
        time: '1723337340',

        open: 0.0000247199015711,
        close: 0.0000247199015711,
        high: 0.0000247175510286,
        low: 0.0000247175510286,
        volume: 0,
    },
    {
        time: '1723337400',

        open: 0.0000247173831498,
        close: 0.0000247173831498,
        high: 0.0000247150330861,
        low: 0.0000247150330861,
        volume: 0,
    },
    {
        time: '1723337460',

        open: 0.0000247148652416,
        close: 0.0000247148652416,
        high: 0.0000247125156567,
        low: 0.0000247125156567,
        volume: 0,
    },
    {
        time: '1723337520',

        open: 0.000024712347846300002,
        close: 0.000024712347846300002,
        high: 0.00002470999874,
        low: 0.00002470999874,
        volume: 0,
    },
    {
        time: '1723337580',

        open: 0.0000247098309638,
        close: 0.0000247098309638,
        high: 0.000024707482335900003,
        low: 0.000024707482335900003,
        volume: 0,
    },
    {
        time: '1723337640',

        open: 0.000024707314593900002,
        close: 0.000024707314593900002,
        high: 0.0000247049664444,
        low: 0.0000247049664444,
        volume: 0,
    },
    {
        time: '1723337700',

        open: 0.000024704798736500002,
        close: 0.000024704798736500002,
        high: 0.000024702451065100003,
        low: 0.000024702451065100003,
        volume: 0,
    },
    {
        time: '1723337760',

        open: 0.000024702283391400002,
        close: 0.000024702283391400002,
        high: 0.000024699936198,
        low: 0.000024699936198,
        volume: 0,
    },
    {
        time: '1723337820',

        open: 0.000024699768558400002,
        close: 0.000024699768558400002,
        high: 0.0000246974218429,
        low: 0.0000246974218429,
        volume: 0,
    },
    {
        time: '1723337880',

        open: 0.0000246972542374,
        close: 0.0000246972542374,
        high: 0.000024694907999700003,
        low: 0.000024694907999700003,
        volume: 0,
    },
    {
        time: '1723337940',

        open: 0.000024694740428300003,
        close: 0.000024694740428300003,
        high: 0.000024692394668100003,
        low: 0.000024692394668100003,
        volume: 0,
    },
    {
        time: '1723338000',

        open: 0.000024692227130900005,
        close: 0.000024692227130900005,
        high: 0.000024689881848100002,
        low: 0.000024689881848100002,
        volume: 0,
    },
    {
        time: '1723338060',

        open: 0.000024689714345000006,
        close: 0.000024689714345000006,
        high: 0.000024687369539500003,
        low: 0.000024687369539500003,
        volume: 0,
    },
    {
        time: '1723338120',

        open: 0.000024687202070400004,
        close: 0.000024687202070400004,
        high: 0.000024684857742100002,
        low: 0.000024684857742100002,
        volume: 0,
    },
    {
        time: '1723338180',

        open: 0.000024684690307100005,
        close: 0.000024684690307100005,
        high: 0.0000246823464558,
        low: 0.0000246823464558,
        volume: 0,
    },
    {
        time: '1723338240',

        open: 0.0000246821790549,
        close: 0.0000246821790549,
        high: 0.000024679835680400004,
        low: 0.000024679835680400004,
        volume: 0,
    },
    {
        time: '1723338300',

        open: 0.000024679668313500002,
        close: 0.000024679668313500002,
        high: 0.000024677325415700003,
        low: 0.000024677325415700003,
        volume: 0,
    },
    {
        time: '1723338360',

        open: 0.000024677158082900002,
        close: 0.000024677158082900002,
        high: 0.0000246748156617,
        low: 0.0000246748156617,
        volume: 0,
    },
    {
        time: '1723338420',

        open: 0.0000246746483629,
        close: 0.0000246746483629,
        high: 0.000024672306418100004,
        low: 0.000024672306418100004,
        volume: 0,
    },
    {
        time: '1723338480',

        open: 0.0000246721391533,
        close: 0.0000246721391533,
        high: 0.000024669797684700002,
        low: 0.000024669797684700002,
        volume: 0,
    },
    {
        time: '1723338540',

        open: 0.000024669630454,
        close: 0.000024669630454,
        high: 0.0000246672894616,
        low: 0.0000246672894616,
        volume: 0,
    },
    {
        time: '1723338600',

        open: 0.000024667122264800002,
        close: 0.000024667122264800002,
        high: 0.0000246647817484,
        low: 0.0000246647817484,
        volume: 0,
    },
    {
        time: '1723338660',

        open: 0.000024664614585600002,
        close: 0.000024664614585600002,
        high: 0.000024662274545000004,
        low: 0.000024662274545000004,
        volume: 0,
    },
    {
        time: '1723338720',

        open: 0.0000246621074162,
        close: 0.0000246621074162,
        high: 0.0000246597678513,
        low: 0.0000246597678513,
        volume: 0,
    },
    {
        time: '1723338780',

        open: 0.000024659600756500003,
        close: 0.000024659600756500003,
        high: 0.000024657261667100003,
        low: 0.000024657261667100003,
        volume: 0,
    },
    {
        time: '1723338840',

        open: 0.0000246570946062,
        close: 0.0000246570946062,
        high: 0.000024654755992200002,
        low: 0.000024654755992200002,
        volume: 0,
    },
    {
        time: '1723338900',

        open: 0.0000246545889654,
        close: 0.0000246545889654,
        high: 0.000024652250826600003,
        low: 0.000024652250826600003,
        volume: 0,
    },
    {
        time: '1723338960',

        open: 0.0000246520838337,
        close: 0.0000246520838337,
        high: 0.000024649746170000005,
        low: 0.000024649746170000005,
        volume: 0,
    },
    {
        time: '1723339020',

        open: 0.000024649579211,
        close: 0.000024649579211,
        high: 0.000024647242022300004,
        low: 0.000024647242022300004,
        volume: 0,
    },
    {
        time: '1723339080',

        open: 0.000024647075097200004,
        close: 0.000024647075097200004,
        high: 0.000024644738383400003,
        low: 0.000024644738383400003,
        volume: 0,
    },
    {
        time: '1723339140',

        open: 0.0000246445714922,
        close: 0.0000246445714922,
        high: 0.000024642235253000002,
        low: 0.000024642235253000002,
        volume: 0,
    },
    {
        time: '1723339200',

        open: 0.0000246420683957,
        close: 0.0000246420683957,
        high: 0.000024639732631000004,
        low: 0.000024639732631000004,
        volume: 0,
    },
    {
        time: '1723339260',

        open: 0.000024639565807600004,
        close: 0.000024639565807600004,
        high: 0.000024637230517300003,
        low: 0.000024637230517300003,
        volume: 0,
    },
    {
        time: '1723339320',

        open: 0.000024637063727800003,
        close: 0.000024637063727800003,
        high: 0.0000246347289118,
        low: 0.0000246347289118,
        volume: 0,
    },
    {
        time: '1723339380',

        open: 0.000024634562156100002,
        close: 0.000024634562156100002,
        high: 0.0000246322278142,
        low: 0.0000246322278142,
        volume: 0,
    },
    {
        time: '1723339440',

        open: 0.000024632061092400003,
        close: 0.000024632061092400003,
        high: 0.000024629727224400003,
        low: 0.000024629727224400003,
        volume: 0,
    },
    {
        time: '1723339500',

        open: 0.000024629560536500002,
        close: 0.000024629560536500002,
        high: 0.0000246272271423,
        low: 0.0000246272271423,
        volume: 0,
    },
    {
        time: '1723339560',

        open: 0.0000246270604882,
        close: 0.0000246270604882,
        high: 0.000024624727567600002,
        low: 0.000024624727567600002,
        volume: 0,
    },
    {
        time: '1723339620',

        open: 0.0000246245609473,
        close: 0.0000246245609473,
        high: 0.0000246222285003,
        low: 0.0000246222285003,
        volume: 0,
    },
    {
        time: '1723339680',

        open: 0.0000246220619139,
        close: 0.0000246220619139,
        high: 0.000024619729940200002,
        low: 0.000024619729940200002,
        volume: 0,
    },
    {
        time: '1723339740',

        open: 0.0000246195633876,
        close: 0.0000246195633876,
        high: 0.000024617231887100005,
        low: 0.000024617231887100005,
        volume: 0,
    },
    {
        time: '1723339800',

        open: 0.0000246170653683,
        close: 0.0000246170653683,
        high: 0.000024614734341000004,
        low: 0.000024614734341000004,
        volume: 0,
    },
    {
        time: '1723339860',

        open: 0.0000246145678559,
        close: 0.0000246145678559,
        high: 0.0000246122373015,
        low: 0.0000246122373015,
        volume: 0,
    },
    {
        time: '1723339920',

        open: 0.0000246120708502,
        close: 0.0000246120708502,
        high: 0.000024609740768600002,
        low: 0.000024609740768600002,
        volume: 0,
    },
    {
        time: '1723339980',

        open: 0.000024609574351100003,
        close: 0.000024609574351100003,
        high: 0.000024607244742100003,
        low: 0.000024607244742100003,
        volume: 0,
    },
    {
        time: '1723340040',

        open: 0.000024607078358400003,
        close: 0.000024607078358400003,
        high: 0.000024604749221900002,
        low: 0.000024604749221900002,
        volume: 0,
    },
    {
        time: '1723340100',

        open: 0.0000246045828719,
        close: 0.0000246045828719,
        high: 0.000024602254207800002,
        low: 0.000024602254207800002,
        volume: 0,
    },
    {
        time: '1723340160',

        open: 0.000024602087891500002,
        close: 0.000024602087891500002,
        high: 0.0000245997596997,
        low: 0.0000245997596997,
        volume: 0,
    },
    {
        time: '1723340220',

        open: 0.0000245995934171,
        close: 0.0000245995934171,
        high: 0.000024597265697300002,
        low: 0.000024597265697300002,
        volume: 0,
    },
    {
        time: '1723340280',

        open: 0.000024597099448500004,
        close: 0.000024597099448500004,
        high: 0.000024594772200700002,
        low: 0.000024594772200700002,
        volume: 0,
    },
    {
        time: '1723340340',

        open: 0.0000245946059855,
        close: 0.0000245946059855,
        high: 0.000024592279209500004,
        low: 0.000024592279209500004,
        volume: 0,
    },
    {
        time: '1723340400',

        open: 0.000024592113028000002,
        close: 0.000024592113028000002,
        high: 0.0000245897867236,
        low: 0.0000245897867236,
        volume: 0,
    },
    {
        time: '1723340460',

        open: 0.0000245896205758,
        close: 0.0000245896205758,
        high: 0.000024587294742900002,
        low: 0.000024587294742900002,
        volume: 0,
    },
    {
        time: '1723340520',

        open: 0.000024587128628800005,
        close: 0.000024587128628800005,
        high: 0.000024584803267300004,
        low: 0.000024584803267300004,
        volume: 0,
    },
    {
        time: '1723340580',

        open: 0.0000245846371869,
        close: 0.0000245846371869,
        high: 0.0000245823122965,
        low: 0.0000245823122965,
        volume: 0,
    },
    {
        time: '1723340640',

        open: 0.000024582146249800003,
        close: 0.000024582146249800003,
        high: 0.0000245798218305,
        low: 0.0000245798218305,
        volume: 0,
    },
    {
        time: '1723340700',

        open: 0.000024579655817400002,
        close: 0.000024579655817400002,
        high: 0.000024577331869100003,
        low: 0.000024577331869100003,
        volume: 0,
    },
    {
        time: '1723340760',

        open: 0.000024577165889600002,
        close: 0.000024577165889600002,
        high: 0.000024574842412000002,
        low: 0.000024574842412000002,
        volume: 0,
    },
    {
        time: '1723340820',

        open: 0.000024574676466200003,
        close: 0.000024574676466200003,
        high: 0.0000245723534593,
        low: 0.0000245723534593,
        volume: 0,
    },
    {
        time: '1723340880',

        open: 0.000024572187547000002,
        close: 0.000024572187547000002,
        high: 0.0000245698650106,
        low: 0.0000245698650106,
        volume: 0,
    },
    {
        time: '1723340940',

        open: 0.000024569699132000002,
        close: 0.000024569699132000002,
        high: 0.000024567377065900005,
        low: 0.000024567377065900005,
        volume: 0,
    },
    {
        time: '1723341000',

        open: 0.0000245672112209,
        close: 0.0000245672112209,
        high: 0.000024565055438800004,
        low: 0.000024565055438800004,
        volume: 0,
    },
    {
        time: '1723341060',

        open: 0.0000245648896251,
        close: 0.0000245648896251,
        high: 0.000024562402687800005,
        low: 0.000024562402687800005,
        volume: 0,
    },
    {
        time: '1723341120',

        open: 0.000024562236909900002,
        close: 0.000024562236909900002,
        high: 0.0000245599162541,
        low: 0.0000245599162541,
        volume: 0,
    },
    {
        time: '1723341180',

        open: 0.000024559750509700004,
        close: 0.000024559750509700004,
        high: 0.000024557430323700002,
        low: 0.000024557430323700002,
        volume: 0,
    },
    {
        time: '1723341240',

        open: 0.0000245572646129,
        close: 0.0000245572646129,
        high: 0.0000245549448965,
        low: 0.0000245549448965,
        volume: 0,
    },
    {
        time: '1723341300',

        open: 0.0000245547792193,
        close: 0.0000245547792193,
        high: 0.000024552459972400004,
        low: 0.000024552459972400004,
        volume: 0,
    },
    {
        time: '1723341360',

        open: 0.0000245522943287,
        close: 0.0000245522943287,
        high: 0.0000245499755512,
        low: 0.0000245499755512,
        volume: 0,
    },
    {
        time: '1723341420',

        open: 0.0000245498099409,
        close: 0.0000245498099409,
        high: 0.0000245474916326,
        low: 0.0000245474916326,
        volume: 0,
    },
    {
        time: '1723341480',

        open: 0.0000245473260559,
        close: 0.0000245473260559,
        high: 0.0000245450082167,
        low: 0.0000245450082167,
        volume: 0,
    },
    {
        time: '1723341540',

        open: 0.0000245448426735,
        close: 0.0000245448426735,
        high: 0.0000245425253032,
        low: 0.0000245425253032,
        volume: 0,
    },
    {
        time: '1723341600',

        open: 0.000024542359793500003,
        close: 0.000024542359793500003,
        high: 0.000024540042892000006,
        low: 0.000024540042892000006,
        volume: 0,
    },
    {
        time: '1723341660',

        open: 0.0000245398774158,
        close: 0.0000245398774158,
        high: 0.0000245375609829,
        low: 0.0000245375609829,
        volume: 0,
    },
    {
        time: '1723341720',

        open: 0.000024537395540200005,
        close: 0.000024537395540200005,
        high: 0.0000245350795758,
        low: 0.0000245350795758,
        volume: 0,
    },
    {
        time: '1723341780',

        open: 0.000024534914166500002,
        close: 0.000024534914166500002,
        high: 0.0000245325986705,
        low: 0.0000245325986705,
        volume: 0,
    },
    {
        time: '1723341840',

        open: 0.000024532433294700004,
        close: 0.000024532433294700004,
        high: 0.000024530118266900004,
        low: 0.000024530118266900004,
        volume: 0,
    },
    {
        time: '1723341900',

        open: 0.0000245299529245,
        close: 0.0000245299529245,
        high: 0.0000245276383648,
        low: 0.0000245276383648,
        volume: 0,
    },
    {
        time: '1723341960',

        open: 0.0000245274730558,
        close: 0.0000245274730558,
        high: 0.0000245251589641,
        low: 0.0000245251589641,
        volume: 0,
    },
    {
        time: '1723342020',

        open: 0.0000245249936885,
        close: 0.0000245249936885,
        high: 0.0000245226800646,
        low: 0.0000245226800646,
        volume: 0,
    },
    {
        time: '1723342080',

        open: 0.000024522514822400002,
        close: 0.000024522514822400002,
        high: 0.000024520201666100003,
        low: 0.000024520201666100003,
        volume: 0,
    },
    {
        time: '1723342140',

        open: 0.0000245200364574,
        close: 0.0000245200364574,
        high: 0.000024517723768600004,
        low: 0.000024517723768600004,
        volume: 0,
    },
    {
        time: '1723342200',

        open: 0.0000245175585932,
        close: 0.0000245175585932,
        high: 0.0000245152463718,
        low: 0.0000245152463718,
        volume: 0,
    },
    {
        time: '1723342260',

        open: 0.0000245150812298,
        close: 0.0000245150812298,
        high: 0.0000245127694756,
        low: 0.0000245127694756,
        volume: 0,
    },
    {
        time: '1723342320',

        open: 0.000024512604367000003,
        close: 0.000024512604367000003,
        high: 0.0000245102930799,
        low: 0.0000245102930799,
        volume: 0,
    },
    {
        time: '1723342380',

        open: 0.000024510128004600003,
        close: 0.000024510128004600003,
        high: 0.0000245078171845,
        low: 0.0000245078171845,
        volume: 0,
    },
    {
        time: '1723342440',

        open: 0.000024507652142600004,
        close: 0.000024507652142600004,
        high: 0.0000245053417892,
        low: 0.0000245053417892,
        volume: 0,
    },
    {
        time: '1723342500',

        open: 0.0000245051767807,
        close: 0.0000245051767807,
        high: 0.000024502866894000002,
        low: 0.000024502866894000002,
        volume: 0,
    },
    {
        time: '1723342560',

        open: 0.000024502701918700003,
        close: 0.000024502701918700003,
        high: 0.000024500392498600003,
        low: 0.000024500392498600003,
        volume: 0,
    },
    {
        time: '1723342620',

        open: 0.000024500227556600003,
        close: 0.000024500227556600003,
        high: 0.000024497918602800003,
        low: 0.000024497918602800003,
        volume: 0,
    },
    {
        time: '1723342680',

        open: 0.000024497753694200003,
        close: 0.000024497753694200003,
        high: 0.000024495445206700002,
        low: 0.000024495445206700002,
        volume: 0,
    },
    {
        time: '1723342740',

        open: 0.0000244952803313,
        close: 0.0000244952803313,
        high: 0.0000244929723099,
        low: 0.0000244929723099,
        volume: 0,
    },
    {
        time: '1723342800',

        open: 0.0000244928074679,
        close: 0.0000244928074679,
        high: 0.0000244904999124,
        low: 0.0000244904999124,
        volume: 0,
    },
    {
        time: '1723342860',

        open: 0.000024490335103600004,
        close: 0.000024490335103600004,
        high: 0.0000244880280139,
        low: 0.0000244880280139,
        volume: 0,
    },
    {
        time: '1723342920',

        open: 0.0000244878632384,
        close: 0.0000244878632384,
        high: 0.0000244855566144,
        low: 0.0000244855566144,
        volume: 0,
    },
    {
        time: '1723342980',

        open: 0.000024485391872200004,
        close: 0.000024485391872200004,
        high: 0.000024483085713700002,
        low: 0.000024483085713700002,
        volume: 0,
    },
    {
        time: '1723343040',

        open: 0.0000244829210047,
        close: 0.0000244829210047,
        high: 0.0000244806153117,
        low: 0.0000244806153117,
        volume: 0,
    },
    {
        time: '1723343100',

        open: 0.0000244804506359,
        close: 0.0000244804506359,
        high: 0.0000244781454081,
        low: 0.0000244781454081,
        volume: 0,
    },
    {
        time: '1723343160',

        open: 0.0000244779807656,
        close: 0.0000244779807656,
        high: 0.000024475676002800004,
        low: 0.000024475676002800004,
        volume: 0,
    },
    {
        time: '1723343220',

        open: 0.0000244755113935,
        close: 0.0000244755113935,
        high: 0.000024473207095800003,
        low: 0.000024473207095800003,
        volume: 0,
    },
    {
        time: '1723343280',

        open: 0.0000244730425197,
        close: 0.0000244730425197,
        high: 0.000024470738686800002,
        low: 0.000024470738686800002,
        volume: 0,
    },
    {
        time: '1723343340',

        open: 0.000024470574143900003,
        close: 0.000024470574143900003,
        high: 0.0000244682707756,
        low: 0.0000244682707756,
        volume: 0,
    },
    {
        time: '1723343400',

        open: 0.000024468106265900004,
        close: 0.000024468106265900004,
        high: 0.0000244658033623,
        low: 0.0000244658033623,
        volume: 0,
    },
    {
        time: '1723343460',

        open: 0.000024465638885700004,
        close: 0.000024465638885700004,
        high: 0.000024463336446400002,
        low: 0.000024463336446400002,
        volume: 0,
    },
    {
        time: '1723343520',

        open: 0.000024463172003100005,
        close: 0.000024463172003100005,
        high: 0.000024460870028100002,
        low: 0.000024460870028100002,
        volume: 0,
    },
    {
        time: '1723343580',

        open: 0.000024460705617900003,
        close: 0.000024460705617900003,
        high: 0.000024458404107,
        low: 0.000024458404107,
        volume: 0,
    },
    {
        time: '1723343640',

        open: 0.000024458239729900002,
        close: 0.000024458239729900002,
        high: 0.000024455938683000004,
        low: 0.000024455938683000004,
        volume: 0,
    },
    {
        time: '1723343700',

        open: 0.000024455774339100004,
        close: 0.000024455774339100004,
        high: 0.000024453473756,
        low: 0.000024453473756,
        volume: 0,
    },
    {
        time: '1723343760',

        open: 0.000024453309445200005,
        close: 0.000024453309445200005,
        high: 0.0000244510093259,
        low: 0.0000244510093259,
        volume: 0,
    },
    {
        time: '1723343820',

        open: 0.000024450845048200003,
        close: 0.000024450845048200003,
        high: 0.0000244485453924,
        low: 0.0000244485453924,
        volume: 0,
    },
    {
        time: '1723343880',

        open: 0.000024448381147900002,
        close: 0.000024448381147900002,
        high: 0.0000244460819555,
        low: 0.0000244460819555,
        volume: 0,
    },
    {
        time: '1723343940',

        open: 0.000024445917744000004,
        close: 0.000024445917744000004,
        high: 0.0000244436190149,
        low: 0.0000244436190149,
        volume: 0,
    },
    {
        time: '1723344000',

        open: 0.0000244434548366,
        close: 0.0000244434548366,
        high: 0.000024441156570600003,
        low: 0.000024441156570600003,
        volume: 0,
    },
    {
        time: '1723344060',

        open: 0.000024440992425300003,
        close: 0.000024440992425300003,
        high: 0.0000244386946224,
        low: 0.0000244386946224,
        volume: 0,
    },
    {
        time: '1723344120',

        open: 0.000024438530510100004,
        close: 0.000024438530510100004,
        high: 0.000024436233170100003,
        low: 0.000024436233170100003,
        volume: 0,
    },
    {
        time: '1723344180',

        open: 0.000024436069090900005,
        close: 0.000024436069090900005,
        high: 0.0000244337722136,
        low: 0.0000244337722136,
        volume: 0,
    },
    {
        time: '1723344240',

        open: 0.0000244336081674,
        close: 0.0000244336081674,
        high: 0.000024431311752700004,
        low: 0.000024431311752700004,
        volume: 0,
    },
    {
        time: '1723344300',

        open: 0.000024431147739600004,
        close: 0.000024431147739600004,
        high: 0.000024428851787300003,
        low: 0.000024428851787300003,
        volume: 0,
    },
    {
        time: '1723344360',

        open: 0.000024428687807200003,
        close: 0.000024428687807200003,
        high: 0.0000244263923172,
        low: 0.0000244263923172,
        volume: 0,
    },
    {
        time: '1723344420',

        open: 0.0000244262283702,
        close: 0.0000244262283702,
        high: 0.000024423933342300002,
        low: 0.000024423933342300002,
        volume: 0,
    },
    {
        time: '1723344480',

        open: 0.000024423769428300004,
        close: 0.000024423769428300004,
        high: 0.000024421474862500005,
        low: 0.000024421474862500005,
        volume: 0,
    },
    {
        time: '1723344540',

        open: 0.000024421310981400003,
        close: 0.000024421310981400003,
        high: 0.000024419016877500002,
        low: 0.000024419016877500002,
        volume: 0,
    },
    {
        time: '1723344600',

        open: 0.0000244188530294,
        close: 0.0000244188530294,
        high: 0.0000244165593873,
        low: 0.0000244165593873,
        volume: 0,
    },
    {
        time: '1723344660',

        open: 0.0000244163955722,
        close: 0.0000244163955722,
        high: 0.000024414102391600004,
        low: 0.000024414102391600004,
        volume: 0,
    },
    {
        time: '1723344720',

        open: 0.0000244139386095,
        close: 0.0000244139386095,
        high: 0.000024411645890400002,
        low: 0.000024411645890400002,
        volume: 0,
    },
    {
        time: '1723344780',

        open: 0.000024411482141200002,
        close: 0.000024411482141200002,
        high: 0.000024409189883500003,
        low: 0.000024409189883500003,
        volume: 0,
    },
    {
        time: '1723344840',

        open: 0.000024409026167300002,
        close: 0.000024409026167300002,
        high: 0.000024406734370700003,
        low: 0.000024406734370700003,
        volume: 0,
    },
    {
        time: '1723344900',

        open: 0.000024406570687400006,
        close: 0.000024406570687400006,
        high: 0.0000244042793519,
        low: 0.0000244042793519,
        volume: 0,
    },
    {
        time: '1723344960',

        open: 0.000024404115701600003,
        close: 0.000024404115701600003,
        high: 0.000024401824827,
        low: 0.000024401824827,
        volume: 0,
    },
    {
        time: '1723345020',

        open: 0.0000244016612095,
        close: 0.0000244016612095,
        high: 0.000024399370795700003,
        low: 0.000024399370795700003,
        volume: 0,
    },
    {
        time: '1723345080',

        open: 0.000024399207211200002,
        close: 0.000024399207211200002,
        high: 0.000024396917258,
        low: 0.000024396917258,
        volume: 0,
    },
    {
        time: '1723345140',

        open: 0.0000243967537063,
        close: 0.0000243967537063,
        high: 0.0000243944642136,
        low: 0.0000243944642136,
        volume: 0,
    },
    {
        time: '1723345200',

        open: 0.000024394300694900004,
        close: 0.000024394300694900004,
        high: 0.000024392011662600003,
        low: 0.000024392011662600003,
        volume: 0,
    },
    {
        time: '1723345260',

        open: 0.000024391848176700004,
        close: 0.000024391848176700004,
        high: 0.0000243895596046,
        low: 0.0000243895596046,
        volume: 0,
    },
    {
        time: '1723345320',

        open: 0.0000243893961516,
        close: 0.0000243893961516,
        high: 0.0000243871080395,
        low: 0.0000243871080395,
        volume: 0,
    },
    {
        time: '1723345380',

        open: 0.0000243869446194,
        close: 0.0000243869446194,
        high: 0.0000243846569673,
        low: 0.0000243846569673,
        volume: 0,
    },
    {
        time: '1723345440',

        open: 0.000024384493580000004,
        close: 0.000024384493580000004,
        high: 0.0000243822063877,
        low: 0.0000243822063877,
        volume: 0,
    },
    {
        time: '1723345500',

        open: 0.0000243820430332,
        close: 0.0000243820430332,
        high: 0.000024379756300600002,
        low: 0.000024379756300600002,
        volume: 0,
    },
    {
        time: '1723345560',

        open: 0.000024379592979,
        close: 0.000024379592979,
        high: 0.000024377306705800003,
        low: 0.000024377306705800003,
        volume: 0,
    },
    {
        time: '1723345620',

        open: 0.000024377143417000004,
        close: 0.000024377143417000004,
        high: 0.0000243748576033,
        low: 0.0000243748576033,
        volume: 0,
    },
    {
        time: '1723345680',

        open: 0.000024374694347300004,
        close: 0.000024374694347300004,
        high: 0.0000243724089928,
        low: 0.0000243724089928,
        volume: 0,
    },
    {
        time: '1723345740',

        open: 0.0000243722457696,
        close: 0.0000243722457696,
        high: 0.0000243699608743,
        low: 0.0000243699608743,
        volume: 0,
    },
    {
        time: '1723345800',

        open: 0.0000243697976838,
        close: 0.0000243697976838,
        high: 0.0000243675132474,
        low: 0.0000243675132474,
        volume: 0,
    },
    {
        time: '1723345860',

        open: 0.0000243673500898,
        close: 0.0000243673500898,
        high: 0.000024365066112200002,
        low: 0.000024365066112200002,
        volume: 0,
    },
    {
        time: '1723345920',

        open: 0.0000243649029874,
        close: 0.0000243649029874,
        high: 0.000024362619468500003,
        low: 0.000024362619468500003,
        volume: 0,
    },
    {
        time: '1723345980',

        open: 0.0000243624563764,
        close: 0.0000243624563764,
        high: 0.0000243601733161,
        low: 0.0000243601733161,
        volume: 0,
    },
    {
        time: '1723346040',

        open: 0.0000243600102567,
        close: 0.0000243600102567,
        high: 0.000024357727654800002,
        low: 0.000024357727654800002,
        volume: 0,
    },
    {
        time: '1723346100',

        open: 0.000024357564628200003,
        close: 0.000024357564628200003,
        high: 0.0000243552824846,
        low: 0.0000243552824846,
        volume: 0,
    },
    {
        time: '1723346160',

        open: 0.000024355119490700002,
        close: 0.000024355119490700002,
        high: 0.0000243528378052,
        low: 0.0000243528378052,
        volume: 0,
    },
    {
        time: '1723346220',

        open: 0.000024352674844100005,
        close: 0.000024352674844100005,
        high: 0.0000243503936166,
        low: 0.0000243503936166,
        volume: 0,
    },
    {
        time: '1723346280',

        open: 0.000024350230688100003,
        close: 0.000024350230688100003,
        high: 0.000024347949918500002,
        low: 0.000024347949918500002,
        volume: 0,
    },
    {
        time: '1723346340',

        open: 0.0000243477870228,
        close: 0.0000243477870228,
        high: 0.000024345506710900003,
        low: 0.000024345506710900003,
        volume: 0,
    },
    {
        time: '1723346400',

        open: 0.000024345343847800003,
        close: 0.000024345343847800003,
        high: 0.000024343063993500004,
        low: 0.000024343063993500004,
        volume: 0,
    },
    {
        time: '1723346460',

        open: 0.000024342901163100002,
        close: 0.000024342901163100002,
        high: 0.0000243406217663,
        low: 0.0000243406217663,
        volume: 0,
    },
    {
        time: '1723346520',

        open: 0.0000243404589686,
        close: 0.0000243404589686,
        high: 0.0000243381800291,
        low: 0.0000243381800291,
        volume: 0,
    },
    {
        time: '1723346580',

        open: 0.000024338017264000003,
        close: 0.000024338017264000003,
        high: 0.0000243357387817,
        low: 0.0000243357387817,
        volume: 0,
    },
    {
        time: '1723346640',

        open: 0.0000243355760493,
        close: 0.0000243355760493,
        high: 0.000024333298024000002,
        low: 0.000024333298024000002,
        volume: 0,
    },
    {
        time: '1723346700',

        open: 0.000024333135324200002,
        close: 0.000024333135324200002,
        high: 0.0000243308577558,
        low: 0.0000243308577558,
        volume: 0,
    },
    {
        time: '1723346760',

        open: 0.000024330695088700003,
        close: 0.000024330695088700003,
        high: 0.000024328417977000004,
        low: 0.000024328417977000004,
        volume: 0,
    },
    {
        time: '1723346820',

        open: 0.0000243282553425,
        close: 0.0000243282553425,
        high: 0.0000243259786875,
        low: 0.0000243259786875,
        volume: 0,
    },
    {
        time: '1723346880',

        open: 0.0000243258160856,
        close: 0.0000243258160856,
        high: 0.000024323539887100003,
        low: 0.000024323539887100003,
        volume: 0,
    },
    {
        time: '1723346940',

        open: 0.000024323377317800005,
        close: 0.000024323377317800005,
        high: 0.000024321101575600002,
        low: 0.000024321101575600002,
        volume: 0,
    },
    {
        time: '1723347000',

        open: 0.000024320776504400002,
        close: 0.000024320939038900005,
        high: 0.000024318663753,
        low: 0.000024318663753,
        volume: 0,
    },
    {
        time: '1723347060',

        open: 0.0000243185012488,
        close: 0.0000243185012488,
        high: 0.000024316226419,
        low: 0.000024316226419,
        volume: 0,
    },
    {
        time: '1723347120',

        open: 0.000024316063947400003,
        close: 0.000024316063947400003,
        high: 0.0000243137895735,
        low: 0.0000243137895735,
        volume: 0,
    },
    {
        time: '1723347180',

        open: 0.000024313627134500004,
        close: 0.000024313627134500004,
        high: 0.000024311353216400005,
        low: 0.000024311353216400005,
        volume: 0,
    },
    {
        time: '1723347240',

        open: 0.0000243111908099,
        close: 0.0000243111908099,
        high: 0.0000243089173475,
        low: 0.0000243089173475,
        volume: 0,
    },
    {
        time: '1723347300',

        open: 0.000024308754973600003,
        close: 0.000024308754973600003,
        high: 0.000024306481966700003,
        low: 0.000024306481966700003,
        volume: 0,
    },
    {
        time: '1723347360',

        open: 0.000024306319625300003,
        close: 0.000024306319625300003,
        high: 0.000024304047073800004,
        low: 0.000024304047073800004,
        volume: 0,
    },
    {
        time: '1723347420',

        open: 0.000024303884764900004,
        close: 0.000024303884764900004,
        high: 0.0000243016126687,
        low: 0.0000243016126687,
        volume: 0,
    },
    {
        time: '1723347480',

        open: 0.000024301450392300004,
        close: 0.000024301450392300004,
        high: 0.000024299178751200005,
        low: 0.000024299178751200005,
        volume: 0,
    },
    {
        time: '1723347540',

        open: 0.0000242990165074,
        close: 0.0000242990165074,
        high: 0.0000242967453212,
        low: 0.0000242967453212,
        volume: 0,
    },
    {
        time: '1723347600',

        open: 0.0000242965831099,
        close: 0.0000242965831099,
        high: 0.0000242943123785,
        low: 0.0000242943123785,
        volume: 0,
    },
    {
        time: '1723347660',

        open: 0.000024294150199700003,
        close: 0.000024294150199700003,
        high: 0.000024291879923100002,
        low: 0.000024291879923100002,
        volume: 0,
    },
    {
        time: '1723347720',

        open: 0.000024291717776700003,
        close: 0.000024291717776700003,
        high: 0.000024289447954700003,
        low: 0.000024289447954700003,
        volume: 0,
    },
    {
        time: '1723347780',

        open: 0.0000242892858408,
        close: 0.0000242892858408,
        high: 0.0000242870164732,
        low: 0.0000242870164732,
        volume: 0,
    },
    {
        time: '1723347840',

        open: 0.000024286854391700002,
        close: 0.000024286854391700002,
        high: 0.0000242845854784,
        low: 0.0000242845854784,
        volume: 0,
    },
    {
        time: '1723347900',

        open: 0.000024284423429400002,
        close: 0.000024284423429400002,
        high: 0.000024282154970300002,
        low: 0.000024282154970300002,
        volume: 0,
    },
    {
        time: '1723347960',

        open: 0.0000242819929537,
        close: 0.0000242819929537,
        high: 0.000024279724948600004,
        low: 0.000024279724948600004,
        volume: 0,
    },
    {
        time: '1723348020',

        open: 0.000024279562964400004,
        close: 0.000024279562964400004,
        high: 0.000024277295413200004,
        low: 0.000024277295413200004,
        volume: 0,
    },
    {
        time: '1723348080',

        open: 0.0000242771334615,
        close: 0.0000242771334615,
        high: 0.000024274866364,
        low: 0.000024274866364,
        volume: 0,
    },
    {
        time: '1723348140',

        open: 0.000024274704444700003,
        close: 0.000024274704444700003,
        high: 0.000024272437800900002,
        low: 0.000024272437800900002,
        volume: 0,
    },
    {
        time: '1723348200',

        open: 0.0000242722759139,
        close: 0.0000242722759139,
        high: 0.000024270009723600004,
        low: 0.000024270009723600004,
        volume: 0,
    },
    {
        time: '1723348260',

        open: 0.000024269847869,
        close: 0.000024269847869,
        high: 0.000024267582132,
        low: 0.000024267582132,
        volume: 0,
    },
    {
        time: '1723348320',

        open: 0.0000242674203099,
        close: 0.0000242674203099,
        high: 0.000024265155026100002,
        low: 0.000024265155026100002,
        volume: 0,
    },
    {
        time: '1723348380',

        open: 0.0000242649932363,
        close: 0.0000242649932363,
        high: 0.0000242627284055,
        low: 0.0000242627284055,
        volume: 0,
    },
    {
        time: '1723348440',

        open: 0.0000242625666481,
        close: 0.0000242625666481,
        high: 0.000024260302270300002,
        low: 0.000024260302270300002,
        volume: 0,
    },
    {
        time: '1723348500',

        open: 0.0000242601405452,
        close: 0.0000242601405452,
        high: 0.000024257876620200002,
        low: 0.000024257876620200002,
        volume: 0,
    },
    {
        time: '1723348560',

        open: 0.0000242577149275,
        close: 0.0000242577149275,
        high: 0.000024255451455200003,
        low: 0.000024255451455200003,
        volume: 0,
    },
    {
        time: '1723348620',

        open: 0.000024255289794700004,
        close: 0.000024255289794700004,
        high: 0.000024253026775000002,
        low: 0.000024253026775000002,
        volume: 0,
    },
    {
        time: '1723348680',

        open: 0.0000242528651468,
        close: 0.0000242528651468,
        high: 0.000024250602579500003,
        low: 0.000024250602579500003,
        volume: 0,
    },
    {
        time: '1723348740',

        open: 0.000024250440983700002,
        close: 0.000024250440983700002,
        high: 0.000024248178868500004,
        low: 0.000024248178868500004,
        volume: 0,
    },
    {
        time: '1723348800',

        open: 0.000024248017305000002,
        close: 0.000024248017305000002,
        high: 0.000024245755642,
        low: 0.000024245755642,
        volume: 0,
    },
    {
        time: '1723348860',

        open: 0.000024245594110800004,
        close: 0.000024245594110800004,
        high: 0.0000242433328998,
        low: 0.0000242433328998,
        volume: 0,
    },
    {
        time: '1723348920',

        open: 0.000024243171400900002,
        close: 0.000024243171400900002,
        high: 0.0000242409106417,
        low: 0.0000242409106417,
        volume: 0,
    },
    {
        time: '1723348980',

        open: 0.000024240749175100003,
        close: 0.000024240749175100003,
        high: 0.000024238488867600004,
        low: 0.000024238488867600004,
        volume: 0,
    },
    {
        time: '1723349040',

        open: 0.000024238327433200004,
        close: 0.000024238327433200004,
        high: 0.0000242360675774,
        low: 0.0000242360675774,
        volume: 0,
    },
    {
        time: '1723349100',

        open: 0.000024235906175200003,
        close: 0.000024235906175200003,
        high: 0.000024233646770800003,
        low: 0.000024233646770800003,
        volume: 0,
    },
    {
        time: '1723349160',

        open: 0.000024233485400900003,
        close: 0.000024233485400900003,
        high: 0.0000242312264478,
        low: 0.0000242312264478,
        volume: 0,
    },
    {
        time: '1723349220',

        open: 0.0000242310651101,
        close: 0.0000242310651101,
        high: 0.0000242288066082,
        low: 0.0000242288066082,
        volume: 0,
    },
    {
        time: '1723349280',

        open: 0.000024228645302700004,
        close: 0.000024228645302700004,
        high: 0.000024226387251900002,
        low: 0.000024226387251900002,
        volume: 0,
    },
    {
        time: '1723349340',

        open: 0.000024226225978600004,
        close: 0.000024226225978600004,
        high: 0.000024223968378600003,
        low: 0.000024223968378600003,
        volume: 0,
    },
    {
        time: '1723349400',

        open: 0.0000242238071376,
        close: 0.0000242238071376,
        high: 0.0000242215499884,
        low: 0.0000242215499884,
        volume: 0,
    },
    {
        time: '1723349460',

        open: 0.000024221388779600003,
        close: 0.000024221388779600003,
        high: 0.000024219132081,
        low: 0.000024219132081,
        volume: 0,
    },
    {
        time: '1723349520',

        open: 0.000024218970904300002,
        close: 0.000024218970904300002,
        high: 0.000024216714656300006,
        low: 0.000024216714656300006,
        volume: 0,
    },
    {
        time: '1723349580',

        open: 0.000024216553511800003,
        close: 0.000024216553511800003,
        high: 0.000024214297714100004,
        low: 0.000024214297714100004,
        volume: 0,
    },
    {
        time: '1723349640',

        open: 0.0000242141366018,
        close: 0.0000242141366018,
        high: 0.0000242118812543,
        low: 0.0000242118812543,
        volume: 0,
    },
    {
        time: '1723349700',

        open: 0.0000242117201741,
        close: 0.0000242117201741,
        high: 0.000024209465276800003,
        low: 0.000024209465276800003,
        volume: 0,
    },
    {
        time: '1723349760',

        open: 0.000024209304228700003,
        close: 0.000024209304228700003,
        high: 0.0000242070497813,
        low: 0.0000242070497813,
        volume: 0,
    },
    {
        time: '1723349820',

        open: 0.0000242068887655,
        close: 0.0000242068887655,
        high: 0.000024204634767900004,
        low: 0.000024204634767900004,
        volume: 0,
    },
    {
        time: '1723349880',

        open: 0.000024204473784100003,
        close: 0.000024204473784100003,
        high: 0.0000242022202362,
        low: 0.0000242022202362,
        volume: 0,
    },
    {
        time: '1723349940',

        open: 0.000024202059284600005,
        close: 0.000024202059284600005,
        high: 0.000024199806186300002,
        low: 0.000024199806186300002,
        volume: 0,
    },
    {
        time: '1723350000',

        open: 0.0000241996452667,
        close: 0.0000241996452667,
        high: 0.000024197392617800005,
        low: 0.000024197392617800005,
        volume: 0,
    },
    {
        time: '1723350060',

        open: 0.0000241972317304,
        close: 0.0000241972317304,
        high: 0.000024194979530800004,
        low: 0.000024194979530800004,
        volume: 0,
    },
    {
        time: '1723350120',

        open: 0.000024194818675400003,
        close: 0.000024194818675400003,
        high: 0.000024192566925000002,
        low: 0.000024192566925000002,
        volume: 0,
    },
    {
        time: '1723350180',

        open: 0.000024192406101700002,
        close: 0.000024192406101700002,
        high: 0.000024190154800200003,
        low: 0.000024190154800200003,
        volume: 0,
    },
    {
        time: '1723350240',

        open: 0.000024189994009000004,
        close: 0.000024189994009000004,
        high: 0.0000241877431565,
        low: 0.0000241877431565,
        volume: 0,
    },
    {
        time: '1723350300',

        open: 0.0000241875823973,
        close: 0.0000241875823973,
        high: 0.000024185331993500003,
        low: 0.000024185331993500003,
        volume: 0,
    },
    {
        time: '1723350360',

        open: 0.0000241851712664,
        close: 0.0000241851712664,
        high: 0.0000241829213113,
        low: 0.0000241829213113,
        volume: 0,
    },
    {
        time: '1723350420',

        open: 0.0000241827606162,
        close: 0.0000241827606162,
        high: 0.0000241805111095,
        low: 0.0000241805111095,
        volume: 0,
    },
    {
        time: '1723350480',

        open: 0.0000241803504465,
        close: 0.0000241803504465,
        high: 0.000024178101388100004,
        low: 0.000024178101388100004,
        volume: 0,
    },
    {
        time: '1723350540',

        open: 0.0000241779407571,
        close: 0.0000241779407571,
        high: 0.000024175692147,
        low: 0.000024175692147,
        volume: 0,
    },
    {
        time: '1723350600',

        open: 0.000024175531548000004,
        close: 0.000024175531548000004,
        high: 0.000024173283385900003,
        low: 0.000024173283385900003,
        volume: 0,
    },
    {
        time: '1723350660',

        open: 0.000024173122818900002,
        close: 0.000024173122818900002,
        high: 0.000024170875104900003,
        low: 0.000024170875104900003,
        volume: 0,
    },
    {
        time: '1723350720',

        open: 0.000024170714569800003,
        close: 0.000024170714569800003,
        high: 0.000024168467303600004,
        low: 0.000024168467303600004,
        volume: 0,
    },
    {
        time: '1723350780',

        open: 0.0000241683068005,
        close: 0.0000241683068005,
        high: 0.000024166059981900003,
        low: 0.000024166059981900003,
        volume: 0,
    },
    {
        time: '1723350840',

        open: 0.000024165899510900003,
        close: 0.000024165899510900003,
        high: 0.0000241636531398,
        low: 0.0000241636531398,
        volume: 0,
    },
    {
        time: '1723350900',

        open: 0.0000241634927007,
        close: 0.0000241634927007,
        high: 0.000024161246777100004,
        low: 0.000024161246777100004,
        volume: 0,
    },
    {
        time: '1723350960',

        open: 0.0000241610863699,
        close: 0.0000241610863699,
        high: 0.000024158840893600002,
        low: 0.000024158840893600002,
        volume: 0,
    },
    {
        time: '1723351020',

        open: 0.0000241586805184,
        close: 0.0000241586805184,
        high: 0.0000241564354892,
        low: 0.0000241564354892,
        volume: 0,
    },
    {
        time: '1723351080',

        open: 0.000024156275145900005,
        close: 0.000024156275145900005,
        high: 0.000024154030563700004,
        low: 0.000024154030563700004,
        volume: 0,
    },
    {
        time: '1723351140',

        open: 0.0000241538702524,
        close: 0.0000241538702524,
        high: 0.000024151626117000002,
        low: 0.000024151626117000002,
        volume: 0,
    },
    {
        time: '1723351200',

        open: 0.0000241514658376,
        close: 0.0000241514658376,
        high: 0.000024149222149,
        low: 0.000024149222149,
        volume: 0,
    },
    {
        time: '1723351260',

        open: 0.0000241490619015,
        close: 0.0000241490619015,
        high: 0.000024146818659600002,
        low: 0.000024146818659600002,
        volume: 0,
    },
    {
        time: '1723351320',

        open: 0.000024146658443900002,
        close: 0.000024146658443900002,
        high: 0.000024144415648400004,
        low: 0.000024144415648400004,
        volume: 0,
    },
    {
        time: '1723351380',

        open: 0.0000241442554647,
        close: 0.0000241442554647,
        high: 0.0000241420131156,
        low: 0.0000241420131156,
        volume: 0,
    },
    {
        time: '1723351440',

        open: 0.0000241418529637,
        close: 0.0000241418529637,
        high: 0.0000241396110608,
        low: 0.0000241396110608,
        volume: 0,
    },
    {
        time: '1723351500',

        open: 0.0000241394509408,
        close: 0.0000241394509408,
        high: 0.0000241372094839,
        low: 0.0000241372094839,
        volume: 0,
    },
    {
        time: '1723351560',

        open: 0.000024137049395800004,
        close: 0.000024137049395800004,
        high: 0.0000241348083849,
        low: 0.0000241348083849,
        volume: 0,
    },
    {
        time: '1723351620',

        open: 0.0000241346483286,
        close: 0.0000241346483286,
        high: 0.0000241324077635,
        low: 0.0000241324077635,
        volume: 0,
    },
    {
        time: '1723351680',

        open: 0.000024132247739100002,
        close: 0.000024132247739100002,
        high: 0.000024130007619700004,
        low: 0.000024130007619700004,
        volume: 0,
    },
    {
        time: '1723351740',

        open: 0.000024129847627,
        close: 0.000024129847627,
        high: 0.000024127607953200004,
        low: 0.000024127607953200004,
        volume: 0,
    },
    {
        time: '1723351800',

        open: 0.0000241274479924,
        close: 0.0000241274479924,
        high: 0.0000241252087639,
        low: 0.0000241252087639,
        volume: 0,
    },
    {
        time: '1723351860',

        open: 0.0000241250488349,
        close: 0.0000241250488349,
        high: 0.000024122810051800005,
        low: 0.000024122810051800005,
        volume: 0,
    },
    {
        time: '1723351920',

        open: 0.0000241226501546,
        close: 0.0000241226501546,
        high: 0.0000241204118166,
        low: 0.0000241204118166,
        volume: 0,
    },
    {
        time: '1723351980',

        open: 0.0000241202519512,
        close: 0.0000241202519512,
        high: 0.000024118014058100003,
        low: 0.000024118014058100003,
        volume: 0,
    },
    {
        time: '1723352040',

        open: 0.0000241178542245,
        close: 0.0000241178542245,
        high: 0.000024115616776400002,
        low: 0.000024115616776400002,
        volume: 0,
    },
    {
        time: '1723352100',

        open: 0.000024115456974600005,
        close: 0.000024115456974600005,
        high: 0.000024113219971200002,
        low: 0.000024113219971200002,
        volume: 0,
    },
    {
        time: '1723352160',

        open: 0.000024113060201100003,
        close: 0.000024113060201100003,
        high: 0.0000241108236424,
        low: 0.0000241108236424,
        volume: 0,
    },
    {
        time: '1723352220',

        open: 0.000024110663904000004,
        close: 0.000024110663904000004,
        high: 0.000024108427789800003,
        low: 0.000024108427789800003,
        volume: 0,
    },
    {
        time: '1723352280',

        open: 0.0000241082680832,
        close: 0.0000241082680832,
        high: 0.000024106032413300003,
        low: 0.000024106032413300003,
        volume: 0,
    },
    {
        time: '1723352340',

        open: 0.000024105872738400002,
        close: 0.000024105872738400002,
        high: 0.000024103637512700005,
        low: 0.000024103637512700005,
        volume: 0,
    },
    {
        time: '1723352400',

        open: 0.000024103477869600003,
        close: 0.000024103477869600003,
        high: 0.000024101243088,
        low: 0.000024101243088,
        volume: 0,
    },
    {
        time: '1723352460',

        open: 0.000024101083476600004,
        close: 0.000024101083476600004,
        high: 0.0000240988491389,
        low: 0.0000240988491389,
        volume: 0,
    },
    {
        time: '1723352520',

        open: 0.0000240986895592,
        close: 0.0000240986895592,
        high: 0.000024096455665400002,
        low: 0.000024096455665400002,
        volume: 0,
    },
    {
        time: '1723352580',

        open: 0.0000240962961174,
        close: 0.0000240962961174,
        high: 0.000024094062667200002,
        low: 0.000024094062667200002,
        volume: 0,
    },
    {
        time: '1723352640',

        open: 0.000024093903150900002,
        close: 0.000024093903150900002,
        high: 0.0000240916701443,
        low: 0.0000240916701443,
        volume: 0,
    },
    {
        time: '1723352700',

        open: 0.000024091510659700005,
        close: 0.000024091510659700005,
        high: 0.0000240892780965,
        low: 0.0000240892780965,
        volume: 0,
    },
    {
        time: '1723352760',

        open: 0.0000240891186436,
        close: 0.0000240891186436,
        high: 0.0000240868865237,
        low: 0.0000240868865237,
        volume: 0,
    },
    {
        time: '1723352820',

        open: 0.0000240867271024,
        close: 0.0000240867271024,
        high: 0.000024084495425700002,
        low: 0.000024084495425700002,
        volume: 0,
    },
    {
        time: '1723352880',

        open: 0.0000240843360361,
        close: 0.0000240843360361,
        high: 0.000024082104802400005,
        low: 0.000024082104802400005,
        volume: 0,
    },
    {
        time: '1723352940',

        open: 0.000024081945444400004,
        close: 0.000024081945444400004,
        high: 0.000024079714653600005,
        low: 0.000024079714653600005,
        volume: 0,
    },
    {
        time: '1723353000',

        open: 0.0000240795553272,
        close: 0.0000240795553272,
        high: 0.000024077324979200004,
        low: 0.000024077324979200004,
        volume: 0,
    },
    {
        time: '1723353060',

        open: 0.000024077165684400004,
        close: 0.000024077165684400004,
        high: 0.0000240749357791,
        low: 0.0000240749357791,
        volume: 0,
    },
    {
        time: '1723353120',

        open: 0.0000240747765159,
        close: 0.0000240747765159,
        high: 0.000024072547053000002,
        low: 0.000024072547053000002,
        volume: 0,
    },
    {
        time: '1723353180',

        open: 0.0000240723878215,
        close: 0.0000240723878215,
        high: 0.000024070158801,
        low: 0.000024070158801,
        volume: 0,
    },
    {
        time: '1723353240',

        open: 0.000024069999601,
        close: 0.000024069999601,
        high: 0.000024067930193200005,
        low: 0.000024067930193200005,
        volume: 0,
    },
    {
        time: '1723353300',

        open: 0.0000240677710228,
        close: 0.0000240677710228,
        high: 0.0000240653837182,
        low: 0.0000240653837182,
        volume: 0,
    },
    {
        time: '1723353360',

        open: 0.000024065224581400003,
        close: 0.000024065224581400003,
        high: 0.0000240629968873,
        low: 0.0000240629968873,
        volume: 0,
    },
    {
        time: '1723353420',

        open: 0.000024062837782000005,
        close: 0.000024062837782000005,
        high: 0.000024060610529700004,
        low: 0.000024060610529700004,
        volume: 0,
    },
    {
        time: '1723353480',

        open: 0.000024060451456,
        close: 0.000024060451456,
        high: 0.000024058224645400002,
        low: 0.000024058224645400002,
        volume: 0,
    },
    {
        time: '1723353540',

        open: 0.0000240580656033,
        close: 0.0000240580656033,
        high: 0.000024055839234200003,
        low: 0.000024055839234200003,
        volume: 0,
    },
    {
        time: '1723353600',

        open: 0.0000240556802236,
        close: 0.0000240556802236,
        high: 0.000024053454296100005,
        low: 0.000024053454296100005,
        volume: 0,
    },
    {
        time: '1723353660',

        open: 0.000024053295317000002,
        close: 0.000024053295317000002,
        high: 0.000024051069830700003,
        low: 0.000024051069830700003,
        volume: 0,
    },
    {
        time: '1723353720',

        open: 0.0000240509108832,
        close: 0.0000240509108832,
        high: 0.0000240486858381,
        low: 0.0000240486858381,
        volume: 0,
    },
    {
        time: '1723353780',

        open: 0.000024048526922100002,
        close: 0.000024048526922100002,
        high: 0.000024046302318000003,
        low: 0.000024046302318000003,
        volume: 0,
    },
    {
        time: '1723353840',

        open: 0.0000240461434335,
        close: 0.0000240461434335,
        high: 0.0000240439192704,
        low: 0.0000240439192704,
        volume: 0,
    },
    {
        time: '1723353900',

        open: 0.0000240437604174,
        close: 0.0000240437604174,
        high: 0.000024041536695100002,
        low: 0.000024041536695100002,
        volume: 0,
    },
    {
        time: '1723353960',

        open: 0.0000240413778735,
        close: 0.0000240413778735,
        high: 0.0000240391545919,
        low: 0.0000240391545919,
        volume: 0,
    },
    {
        time: '1723354020',

        open: 0.000024038995801800003,
        close: 0.000024038995801800003,
        high: 0.000024036772960700002,
        low: 0.000024036772960700002,
        volume: 0,
    },
    {
        time: '1723354080',

        open: 0.000024036614202000005,
        close: 0.000024036614202000005,
        high: 0.000024034391801300002,
        low: 0.000024034391801300002,
        volume: 0,
    },
    {
        time: '1723354140',

        open: 0.0000240342330741,
        close: 0.0000240342330741,
        high: 0.000024032011113700004,
        low: 0.000024032011113700004,
        volume: 0,
    },
    {
        time: '1723354200',

        open: 0.000024031852418000004,
        close: 0.000024031852418000004,
        high: 0.0000240296308977,
        low: 0.0000240296308977,
        volume: 0,
    },
    {
        time: '1723354260',

        open: 0.0000240294722334,
        close: 0.0000240294722334,
        high: 0.000024027568425100004,
        low: 0.000024027568425100004,
        volume: 0,
    },
    {
        time: '1723354320',

        open: 0.000024027092520200003,
        close: 0.000024027092520200003,
        high: 0.000024024871879800002,
        low: 0.000024024871879800002,
        volume: 0,
    },
    {
        time: '1723354380',

        open: 0.0000240247132784,
        close: 0.0000240247132784,
        high: 0.000024022493077700003,
        low: 0.000024022493077700003,
        volume: 0,
    },
    {
        time: '1723354440',

        open: 0.0000240223345076,
        close: 0.0000240223345076,
        high: 0.000024020114746600002,
        low: 0.000024020114746600002,
        volume: 0,
    },
    {
        time: '1723354500',

        open: 0.000024019956207900005,
        close: 0.000024019956207900005,
        high: 0.000024017736886400003,
        low: 0.000024017736886400003,
        volume: 0,
    },
    {
        time: '1723354560',

        open: 0.000024017578379100002,
        close: 0.000024017578379100002,
        high: 0.0000240153594969,
        low: 0.0000240153594969,
        volume: 0,
    },
    {
        time: '1723354620',

        open: 0.000024015201021000003,
        close: 0.000024015201021000003,
        high: 0.000024012982578100003,
        low: 0.000024012982578100003,
        volume: 0,
    },
    {
        time: '1723354680',

        open: 0.000024012824133500003,
        close: 0.000024012824133500003,
        high: 0.0000240106061297,
        low: 0.0000240106061297,
        volume: 0,
    },
    {
        time: '1723354740',

        open: 0.0000240104477165,
        close: 0.0000240104477165,
        high: 0.0000240082301516,
        low: 0.0000240082301516,
        volume: 0,
    },
    {
        time: '1723354800',

        open: 0.0000240080717698,
        close: 0.0000240080717698,
        high: 0.0000240058546437,
        low: 0.0000240058546437,
        volume: 0,
    },
    {
        time: '1723354860',

        open: 0.000024005696293200003,
        close: 0.000024005696293200003,
        high: 0.0000240034796059,
        low: 0.0000240034796059,
        volume: 0,
    },
    {
        time: '1723354920',

        open: 0.000024003321286700004,
        close: 0.000024003321286700004,
        high: 0.000024001105037900005,
        low: 0.000024001105037900005,
        volume: 0,
    },
    {
        time: '1723354980',

        open: 0.000024000946750100003,
        close: 0.000024000946750100003,
        high: 0.000023998730939700005,
        low: 0.000023998730939700005,
        volume: 0,
    },
    {
        time: '1723355040',

        open: 0.0000239985726832,
        close: 0.0000239985726832,
        high: 0.0000239963573112,
        low: 0.0000239963573112,
        volume: 0,
    },
    {
        time: '1723355100',

        open: 0.000023996199086000004,
        close: 0.000023996199086000004,
        high: 0.0000239939841521,
        low: 0.0000239939841521,
        volume: 0,
    },
    {
        time: '1723355160',

        open: 0.000023993825958200003,
        close: 0.000023993825958200003,
        high: 0.0000239916114624,
        low: 0.0000239916114624,
        volume: 0,
    },
    {
        time: '1723355220',

        open: 0.000023991453299800004,
        close: 0.000023991453299800004,
        high: 0.000023989239241900003,
        low: 0.000023989239241900003,
        volume: 0,
    },
    {
        time: '1723355280',

        open: 0.0000239890811106,
        close: 0.0000239890811106,
        high: 0.0000239868674905,
        low: 0.0000239868674905,
        volume: 0,
    },
    {
        time: '1723355340',

        open: 0.000023986709390400003,
        close: 0.000023986709390400003,
        high: 0.000023984496208000002,
        low: 0.000023984496208000002,
        volume: 0,
    },
    {
        time: '1723355400',

        open: 0.000023984338139200003,
        close: 0.000023984338139200003,
        high: 0.000023982125394300004,
        low: 0.000023982125394300004,
        volume: 0,
    },
    {
        time: '1723355460',

        open: 0.000023981967356700002,
        close: 0.000023981967356700002,
        high: 0.000023979755049299998,
        low: 0.000023979755049299998,
        volume: 0,
    },
    {
        time: '1723355520',

        open: 0.0000239795970429,
        close: 0.0000239795970429,
        high: 0.000023977385172700003,
        low: 0.000023977385172700003,
        volume: 0,
    },
    {
        time: '1723355580',

        open: 0.000023977227197600002,
        close: 0.000023977227197600002,
        high: 0.0000239750157645,
        low: 0.0000239750157645,
        volume: 0,
    },
    {
        time: '1723355640',

        open: 0.000023974857820700003,
        close: 0.000023974857820700003,
        high: 0.000023972646824600002,
        low: 0.000023972646824600002,
        volume: 0,
    },
    {
        time: '1723355700',

        open: 0.0000239724889119,
        close: 0.0000239724889119,
        high: 0.0000239702783528,
        low: 0.0000239702783528,
        volume: 0,
    },
    {
        time: '1723355760',

        open: 0.000023970120471300002,
        close: 0.000023970120471300002,
        high: 0.0000239679103489,
        low: 0.0000239679103489,
        volume: 0,
    },
    {
        time: '1723355820',

        open: 0.000023967752498600005,
        close: 0.000023967752498600005,
        high: 0.0000239655428129,
        low: 0.0000239655428129,
        volume: 0,
    },
    {
        time: '1723355880',
        open: 0.0000239653849938,
        close: 0.0000239653849938,
        high: 0.0000239631757445,
        low: 0.0000239631757445,
        volume: 0,
    },
].map((e) => {
    const time = Number(e.time) * 1000;
    return {
        ...e,
        time,
    };
});

export const DEMO_BAR_DATA_ND = [
    {
        time: 1480464000000,
        close: 110.52,
        open: 111.56,
        high: 112.2,
        low: 110.27,
        volume: 36162258,
    },
    {
        time: 1480550400000,
        close: 109.49,
        open: 110.365,
        high: 110.94,
        low: 109.03,
        volume: 37086862,
    },
    {
        time: 1480636800000,
        close: 109.9,
        open: 109.17,
        high: 110.09,
        low: 108.85,
        volume: 26527997,
    },
    {
        time: 1480896000000,
        close: 109.11,
        open: 110,
        high: 110.03,
        low: 108.25,
        volume: 34324540,
    },
    {
        time: 1480982400000,
        close: 109.95,
        open: 109.5,
        high: 110.36,
        low: 109.19,
        volume: 26195462,
    },
    {
        time: 1481068800000,
        close: 111.03,
        open: 109.26,
        high: 111.19,
        low: 109.16,
        volume: 29998719,
    },
    {
        time: 1481155200000,
        close: 112.12,
        open: 110.86,
        high: 112.43,
        low: 110.6,
        volume: 27068316,
    },
    {
        time: 1481241600000,
        close: 113.95,
        open: 112.31,
        high: 114.7,
        low: 112.31,
        volume: 34402627,
    },
    {
        time: 1481500800000,
        close: 113.3,
        open: 113.29,
        high: 115,
        low: 112.49,
        volume: 26374377,
    },
    {
        time: 1481587200000,
        close: 115.19,
        open: 113.84,
        high: 115.92,
        low: 113.75,
        volume: 43733811,
    },
    {
        time: 1481673600000,
        close: 115.19,
        open: 115.04,
        high: 116.2,
        low: 114.98,
        volume: 34031834,
    },
    {
        time: 1481760000000,
        close: 115.82,
        open: 115.38,
        high: 116.73,
        low: 115.23,
        volume: 46524544,
    },
    {
        time: 1481846400000,
        close: 115.97,
        open: 116.47,
        high: 116.5,
        low: 115.645,
        volume: 44351134,
    },
    {
        time: 1482105600000,
        close: 116.64,
        open: 115.8,
        high: 117.38,
        low: 115.75,
        volume: 27779423,
    },
    {
        time: 1482192000000,
        close: 116.95,
        open: 116.74,
        high: 117.5,
        low: 116.68,
        volume: 21424965,
    },
    {
        time: 1482278400000,
        close: 117.06,
        open: 116.8,
        high: 117.4,
        low: 116.78,
        volume: 23783165,
    },
    {
        time: 1482364800000,
        close: 116.29,
        open: 116.35,
        high: 116.51,
        low: 115.64,
        volume: 26085854,
    },
    {
        time: 1482451200000,
        close: 116.52,
        open: 115.59,
        high: 116.52,
        low: 115.59,
        volume: 14249484,
    },
    {
        time: 1482796800000,
        close: 117.26,
        open: 116.52,
        high: 117.8,
        low: 116.49,
        volume: 18296855,
    },
    {
        time: 1482883200000,
        close: 116.76,
        open: 117.52,
        high: 118.0166,
        low: 116.2,
        volume: 20905892,
    },
    {
        time: 1482969600000,
        close: 116.73,
        open: 116.45,
        high: 117.1095,
        low: 116.4,
        volume: 15039519,
    },
    {
        time: 1483056000000,
        close: 115.82,
        open: 116.65,
        high: 117.2,
        low: 115.43,
        volume: 30586265,
    },
    {
        time: 1483401600000,
        close: 116.15,
        open: 115.8,
        high: 116.33,
        low: 114.76,
        volume: 28781865,
    },
    {
        time: 1483488000000,
        close: 116.02,
        open: 115.85,
        high: 116.51,
        low: 115.75,
        volume: 21118116,
    },
    {
        time: 1483574400000,
        close: 116.61,
        open: 115.92,
        high: 116.8642,
        low: 115.81,
        volume: 22193587,
    },
    {
        time: 1483660800000,
        close: 117.91,
        open: 116.78,
        high: 118.16,
        low: 116.47,
        volume: 31751900,
    },
    {
        time: 1483920000000,
        close: 118.99,
        open: 117.95,
        high: 119.43,
        low: 117.94,
        volume: 33561948,
    },
    {
        time: 1484006400000,
        close: 119.11,
        open: 118.77,
        high: 119.38,
        low: 118.3,
        volume: 24462051,
    },
    {
        time: 1484092800000,
        close: 119.75,
        open: 118.74,
        high: 119.93,
        low: 118.6,
        volume: 27588593,
    },
    {
        time: 1484179200000,
        close: 119.25,
        open: 118.895,
        high: 119.3,
        low: 118.21,
        volume: 27086220,
    },
    {
        time: 1484265600000,
        close: 119.04,
        open: 119.11,
        high: 119.62,
        low: 118.81,
        volume: 26111948,
    },
    {
        time: 1484611200000,
        close: 120,
        open: 118.34,
        high: 120.24,
        low: 118.22,
        volume: 34439843,
    },
    {
        time: 1484697600000,
        close: 119.99,
        open: 120,
        high: 120.5,
        low: 119.71,
        volume: 23712961,
    },
    {
        time: 1484784000000,
        close: 119.78,
        open: 119.4,
        high: 120.09,
        low: 119.37,
        volume: 25597291,
    },
    {
        time: 1484870400000,
        close: 120,
        open: 120.45,
        high: 120.45,
        low: 119.7346,
        volume: 32597892,
    },
    {
        time: 1485129600000,
        close: 120.08,
        open: 120,
        high: 120.81,
        low: 119.77,
        volume: 22050218,
    },
    {
        time: 1485216000000,
        close: 119.97,
        open: 119.55,
        high: 120.1,
        low: 119.5,
        volume: 23211038,
    },
    {
        time: 1485302400000,
        close: 121.88,
        open: 120.42,
        high: 122.1,
        low: 120.28,
        volume: 32586673,
    },
    {
        time: 1485388800000,
        close: 121.94,
        open: 121.67,
        high: 122.44,
        low: 121.6,
        volume: 26337576,
    },
    {
        time: 1485475200000,
        close: 121.95,
        open: 122.14,
        high: 122.35,
        low: 121.6,
        volume: 20562944,
    },
    {
        time: 1485734400000,
        close: 121.63,
        open: 120.93,
        high: 121.63,
        low: 120.66,
        volume: 30377503,
    },
    {
        time: 1485820800000,
        close: 121.35,
        open: 121.15,
        high: 121.39,
        low: 120.62,
        volume: 49200993,
    },
    {
        time: 1485907200000,
        close: 128.75,
        open: 127.03,
        high: 130.49,
        low: 127.01,
        volume: 111985040,
    },
    {
        time: 1485993600000,
        close: 128.53,
        open: 127.975,
        high: 129.39,
        low: 127.78,
        volume: 33710411,
    },
    {
        time: 1486080000000,
        close: 129.08,
        open: 128.31,
        high: 129.19,
        low: 128.16,
        volume: 24507301,
    },
    {
        time: 1486339200000,
        close: 130.29,
        open: 129.13,
        high: 130.5,
        low: 128.9,
        volume: 26845924,
    },
    {
        time: 1486425600000,
        close: 131.53,
        open: 130.54,
        high: 132.09,
        low: 130.45,
        volume: 38183841,
    },
    {
        time: 1486512000000,
        close: 132.04,
        open: 131.35,
        high: 132.22,
        low: 131.22,
        volume: 23004072,
    },
    {
        time: 1486598400000,
        close: 132.42,
        open: 131.65,
        high: 132.445,
        low: 131.12,
        volume: 28349859,
    },
    {
        time: 1486684800000,
        close: 132.12,
        open: 132.46,
        high: 132.94,
        low: 132.05,
        volume: 20065458,
    },
    {
        time: 1486944000000,
        close: 133.29,
        open: 133.08,
        high: 133.82,
        low: 132.75,
        volume: 23035421,
    },
    {
        time: 1487030400000,
        close: 135.02,
        open: 133.47,
        high: 135.09,
        low: 133.25,
        volume: 33226223,
    },
    {
        time: 1487116800000,
        close: 135.51,
        open: 135.52,
        high: 136.27,
        low: 134.62,
        volume: 35623100,
    },
    {
        time: 1487203200000,
        close: 135.345,
        open: 135.67,
        high: 135.9,
        low: 134.8398,
        volume: 22584555,
    },
    {
        time: 1487289600000,
        close: 135.72,
        open: 135.1,
        high: 135.83,
        low: 135.1,
        volume: 22198197,
    },
    {
        time: 1487635200000,
        close: 136.7,
        open: 136.23,
        high: 136.75,
        low: 135.98,
        volume: 24507156,
    },
    {
        time: 1487721600000,
        close: 137.11,
        open: 136.43,
        high: 137.12,
        low: 136.11,
        volume: 20836932,
    },
    {
        time: 1487808000000,
        close: 136.53,
        open: 137.38,
        high: 137.48,
        low: 136.3,
        volume: 20788186,
    },
    {
        time: 1487894400000,
        close: 136.66,
        open: 135.91,
        high: 136.66,
        low: 135.28,
        volume: 21776585,
    },
    {
        time: 1488153600000,
        close: 136.93,
        open: 137.14,
        high: 137.435,
        low: 136.28,
        volume: 20257426,
    },
    {
        time: 1488240000000,
        close: 136.99,
        open: 137.08,
        high: 137.435,
        low: 136.7,
        volume: 23482860,
    },
    {
        time: 1488326400000,
        close: 139.79,
        open: 137.89,
        high: 140.15,
        low: 137.595,
        volume: 36414585,
    },
    {
        time: 1488412800000,
        close: 138.96,
        open: 140,
        high: 140.2786,
        low: 138.76,
        volume: 26210984,
    },
    {
        time: 1488499200000,
        close: 139.78,
        open: 138.78,
        high: 139.83,
        low: 138.59,
        volume: 21571121,
    },
    {
        time: 1488758400000,
        close: 139.34,
        open: 139.365,
        high: 139.77,
        low: 138.5959,
        volume: 21750044,
    },
    {
        time: 1488844800000,
        close: 139.52,
        open: 139.06,
        high: 139.98,
        low: 138.79,
        volume: 17446297,
    },
    {
        time: 1488931200000,
        close: 139,
        open: 138.95,
        high: 139.8,
        low: 138.82,
        volume: 18707236,
    },
    {
        time: 1489017600000,
        close: 138.68,
        open: 138.74,
        high: 138.79,
        low: 137.05,
        volume: 22155904,
    },
    {
        time: 1489104000000,
        close: 139.14,
        open: 139.25,
        high: 139.3571,
        low: 138.64,
        volume: 19612801,
    },
    {
        time: 1489363200000,
        close: 139.2,
        open: 138.85,
        high: 139.43,
        low: 138.82,
        volume: 17421717,
    },
    {
        time: 1489449600000,
        close: 138.99,
        open: 139.3,
        high: 139.65,
        low: 138.84,
        volume: 15309065,
    },
    {
        time: 1489536000000,
        close: 140.46,
        open: 139.41,
        high: 140.7501,
        low: 139.025,
        volume: 25691774,
    },
    {
        time: 1489622400000,
        close: 140.69,
        open: 140.72,
        high: 141.02,
        low: 140.26,
        volume: 19231998,
    },
    {
        time: 1489708800000,
        close: 139.99,
        open: 141,
        high: 141,
        low: 139.89,
        volume: 43884952,
    },
    {
        time: 1489968000000,
        close: 141.46,
        open: 140.4,
        high: 141.5,
        low: 140.23,
        volume: 21542038,
    },
    {
        time: 1490054400000,
        close: 139.84,
        open: 142.11,
        high: 142.8,
        low: 139.73,
        volume: 39529912,
    },
    {
        time: 1490140800000,
        close: 141.42,
        open: 139.845,
        high: 141.6,
        low: 139.76,
        volume: 25860165,
    },
    {
        time: 1490227200000,
        close: 140.92,
        open: 141.26,
        high: 141.5844,
        low: 140.61,
        volume: 20346301,
    },
    {
        time: 1490313600000,
        close: 140.64,
        open: 141.5,
        high: 141.74,
        low: 140.35,
        volume: 22395563,
    },
    {
        time: 1490572800000,
        close: 140.88,
        open: 139.39,
        high: 141.22,
        low: 138.62,
        volume: 23575094,
    },
    {
        time: 1490659200000,
        close: 143.8,
        open: 140.91,
        high: 144.04,
        low: 140.62,
        volume: 33374805,
    },
    {
        time: 1490745600000,
        close: 144.12,
        open: 143.68,
        high: 144.49,
        low: 143.19,
        volume: 29189955,
    },
    {
        time: 1490832000000,
        close: 143.93,
        open: 144.19,
        high: 144.5,
        low: 143.5,
        volume: 21207252,
    },
    {
        time: 1490918400000,
        close: 143.66,
        open: 143.72,
        high: 144.27,
        low: 143.01,
        volume: 19661651,
    },
    {
        time: 1491177600000,
        close: 143.7,
        open: 143.71,
        high: 144.12,
        low: 143.05,
        volume: 19985714,
    },
    {
        time: 1491264000000,
        close: 144.77,
        open: 143.25,
        high: 144.89,
        low: 143.17,
        volume: 19891354,
    },
    {
        time: 1491350400000,
        close: 144.02,
        open: 144.22,
        high: 145.46,
        low: 143.81,
        volume: 27717854,
    },
    {
        time: 1491436800000,
        close: 143.66,
        open: 144.29,
        high: 144.52,
        low: 143.45,
        volume: 21149034,
    },
    {
        time: 1491523200000,
        close: 143.34,
        open: 143.73,
        high: 144.18,
        low: 143.27,
        volume: 16658543,
    },
    {
        time: 1491782400000,
        close: 143.17,
        open: 143.6,
        high: 143.8792,
        low: 142.9,
        volume: 18933397,
    },
    {
        time: 1491868800000,
        close: 141.63,
        open: 142.94,
        high: 143.35,
        low: 140.06,
        volume: 30379376,
    },
    {
        time: 1491955200000,
        close: 141.8,
        open: 141.6,
        high: 142.15,
        low: 141.01,
        volume: 20350000,
    },
    {
        time: 1492041600000,
        close: 141.05,
        open: 141.91,
        high: 142.38,
        low: 141.05,
        volume: 17822880,
    },
    {
        time: 1492387200000,
        close: 141.83,
        open: 141.48,
        high: 141.88,
        low: 140.87,
        volume: 16582094,
    },
    {
        time: 1492473600000,
        close: 141.2,
        open: 141.41,
        high: 142.04,
        low: 141.11,
        volume: 14697544,
    },
    {
        time: 1492560000000,
        close: 140.68,
        open: 141.88,
        high: 142,
        low: 140.45,
        volume: 17328375,
    },
    {
        time: 1492646400000,
        close: 142.44,
        open: 141.22,
        high: 142.92,
        low: 141.16,
        volume: 23319562,
    },
    {
        time: 1492732800000,
        close: 142.27,
        open: 142.44,
        high: 142.68,
        low: 141.85,
        volume: 17320928,
    },
    {
        time: 1492992000000,
        close: 143.64,
        open: 143.5,
        high: 143.95,
        low: 143.18,
        volume: 17116599,
    },
    {
        time: 1493078400000,
        close: 144.54,
        open: 143.91,
        high: 144.9,
        low: 143.87,
        volume: 18216472,
    },
    {
        time: 1493164800000,
        close: 143.6508,
        open: 144.47,
        high: 144.6,
        low: 143.3762,
        volume: 19614287,
    },
    {
        time: 1493251200000,
        close: 143.79,
        open: 143.9225,
        high: 144.16,
        low: 143.31,
        volume: 13948980,
    },
    {
        time: 1493337600000,
        close: 143.65,
        open: 144.09,
        high: 144.3,
        low: 143.27,
        volume: 20247187,
    },
    {
        time: 1493596800000,
        close: 146.6,
        open: 145.1,
        high: 147.2,
        low: 144.96,
        volume: 32818760,
    },
    {
        time: 1493683200000,
        close: 147.51,
        open: 147.54,
        high: 148.09,
        low: 146.84,
        volume: 39752670,
    },
    {
        time: 1493769600000,
        close: 147.06,
        open: 145.59,
        high: 147.49,
        low: 144.27,
        volume: 45142806,
    },
    {
        time: 1493856000000,
        close: 146.53,
        open: 146.52,
        high: 147.14,
        low: 145.81,
        volume: 23275690,
    },
    {
        time: 1493942400000,
        close: 148.96,
        open: 146.76,
        high: 148.98,
        low: 146.76,
        volume: 26787359,
    },
    {
        time: 1494201600000,
        close: 153,
        open: 149.03,
        high: 153.7,
        low: 149.03,
        volume: 48339210,
    },
    {
        time: 1494288000000,
        close: 153.96,
        open: 153.87,
        high: 154.88,
        low: 153.45,
        volume: 35942435,
    },
    {
        time: 1494374400000,
        close: 153.26,
        open: 153.63,
        high: 153.94,
        low: 152.11,
        volume: 25670456,
    },
    {
        time: 1494460800000,
        close: 153.95,
        open: 152.45,
        high: 154.07,
        low: 152.31,
        volume: 25596687,
    },
    {
        time: 1494547200000,
        close: 156.1,
        open: 154.7,
        high: 156.42,
        low: 154.67,
        volume: 32221756,
    },
    {
        time: 1494806400000,
        close: 155.7,
        open: 156.01,
        high: 156.65,
        low: 155.05,
        volume: 25700983,
    },
    {
        time: 1494892800000,
        close: 155.47,
        open: 155.94,
        high: 156.06,
        low: 154.72,
        volume: 19904679,
    },
    {
        time: 1494979200000,
        close: 150.25,
        open: 153.6,
        high: 154.57,
        low: 149.71,
        volume: 49482818,
    },
    {
        time: 1495065600000,
        close: 152.54,
        open: 151.27,
        high: 153.34,
        low: 151.13,
        volume: 33159664,
    },
    {
        time: 1495152000000,
        close: 152.96,
        open: 153.38,
        high: 153.98,
        low: 152.63,
        volume: 26733798,
    },
    {
        time: 1495411200000,
        close: 153.99,
        open: 154,
        high: 154.58,
        low: 152.91,
        volume: 22340069,
    },
    {
        time: 1495497600000,
        close: 153.8,
        open: 154.9,
        high: 154.9,
        low: 153.31,
        volume: 19430358,
    },
    {
        time: 1495584000000,
        close: 153.34,
        open: 153.84,
        high: 154.17,
        low: 152.67,
        volume: 19118319,
    },
    {
        time: 1495670400000,
        close: 153.87,
        open: 153.73,
        high: 154.35,
        low: 153.03,
        volume: 19044463,
    },
    {
        time: 1495756800000,
        close: 153.61,
        open: 154,
        high: 154.24,
        low: 153.31,
        volume: 21632202,
    },
    {
        time: 1496102400000,
        close: 153.67,
        open: 153.42,
        high: 154.43,
        low: 153.33,
        volume: 20034934,
    },
    {
        time: 1496188800000,
        close: 152.76,
        open: 153.97,
        high: 154.17,
        low: 152.38,
        volume: 23162873,
    },
    {
        time: 1496275200000,
        close: 153.18,
        open: 153.17,
        high: 153.33,
        low: 152.22,
        volume: 16180143,
    },
    {
        time: 1496361600000,
        close: 155.45,
        open: 153.58,
        high: 155.45,
        low: 152.89,
        volume: 27285861,
    },
    {
        time: 1496620800000,
        close: 153.93,
        open: 154.34,
        high: 154.45,
        low: 153.46,
        volume: 24803858,
    },
    {
        time: 1496707200000,
        close: 154.45,
        open: 153.9,
        high: 155.81,
        low: 153.78,
        volume: 26249630,
    },
    {
        time: 1496793600000,
        close: 155.37,
        open: 155.02,
        high: 155.98,
        low: 154.48,
        volume: 20678772,
    },
    {
        time: 1496880000000,
        close: 154.99,
        open: 155.25,
        high: 155.54,
        low: 154.4,
        volume: 20771367,
    },
    {
        time: 1496966400000,
        close: 148.98,
        open: 155.19,
        high: 155.19,
        low: 146.02,
        volume: 64176149,
    },
    {
        time: 1497225600000,
        close: 145.32,
        open: 145.74,
        high: 146.09,
        low: 142.51,
        volume: 71563614,
    },
    {
        time: 1497312000000,
        close: 146.59,
        open: 147.16,
        high: 147.45,
        low: 145.15,
        volume: 33749154,
    },
    {
        time: 1497398400000,
        close: 145.16,
        open: 147.5,
        high: 147.5,
        low: 143.84,
        volume: 31224203,
    },
    {
        time: 1497484800000,
        close: 144.29,
        open: 143.32,
        high: 144.4798,
        low: 142.21,
        volume: 31348832,
    },
    {
        time: 1497571200000,
        close: 142.27,
        open: 143.78,
        high: 144.5,
        low: 142.2,
        volume: 49180748,
    },
    {
        time: 1497830400000,
        close: 146.34,
        open: 143.66,
        high: 146.74,
        low: 143.66,
        volume: 31449132,
    },
    {
        time: 1497916800000,
        close: 145.01,
        open: 146.87,
        high: 146.87,
        low: 144.94,
        volume: 24572170,
    },
    {
        time: 1498003200000,
        close: 145.87,
        open: 145.52,
        high: 146.0693,
        low: 144.61,
        volume: 21064679,
    },
    {
        time: 1498089600000,
        close: 145.63,
        open: 145.77,
        high: 146.7,
        low: 145.1199,
        volume: 18673365,
    },
    {
        time: 1498176000000,
        close: 146.35,
        open: 145.13,
        high: 147.16,
        low: 145.11,
        volume: 25997976,
    },
    {
        time: 1498435200000,
        close: 145.82,
        open: 147.17,
        high: 148.28,
        low: 145.38,
        volume: 25524661,
    },
    {
        time: 1498521600000,
        close: 143.74,
        open: 145.01,
        high: 146.16,
        low: 143.62,
        volume: 24423643,
    },
    {
        time: 1498608000000,
        close: 145.83,
        open: 144.49,
        high: 146.11,
        low: 143.1601,
        volume: 21915939,
    },
    {
        time: 1498694400000,
        close: 143.68,
        open: 144.71,
        high: 145.13,
        low: 142.28,
        volume: 31116980,
    },
    {
        time: 1498780800000,
        close: 144.02,
        open: 144.45,
        high: 144.96,
        low: 143.78,
        volume: 22328979,
    },
    {
        time: 1499040000000,
        close: 143.5,
        open: 144.88,
        high: 145.3001,
        low: 143.1,
        volume: 14276812,
    },
    {
        time: 1499212800000,
        close: 144.09,
        open: 143.69,
        high: 144.79,
        low: 142.7237,
        volume: 20758795,
    },
    {
        time: 1499299200000,
        close: 142.73,
        open: 143.02,
        high: 143.5,
        low: 142.41,
        volume: 23374374,
    },
    {
        time: 1499385600000,
        close: 144.18,
        open: 142.9,
        high: 144.75,
        low: 142.9,
        volume: 18505351,
    },
    {
        time: 1499644800000,
        close: 145.06,
        open: 144.11,
        high: 145.95,
        low: 143.37,
        volume: 21030466,
    },
    {
        time: 1499731200000,
        close: 145.53,
        open: 144.73,
        high: 145.85,
        low: 144.38,
        volume: 18311156,
    },
    {
        time: 1499817600000,
        close: 145.74,
        open: 145.87,
        high: 146.18,
        low: 144.82,
        volume: 23617964,
    },
    {
        time: 1499904000000,
        close: 147.77,
        open: 145.5,
        high: 148.49,
        low: 145.44,
        volume: 24922788,
    },
    {
        time: 1499990400000,
        close: 149.04,
        open: 147.97,
        high: 149.33,
        low: 147.33,
        volume: 19961788,
    },
    {
        time: 1500249600000,
        close: 149.56,
        open: 148.82,
        high: 150.9,
        low: 148.57,
        volume: 23243713,
    },
    {
        time: 1500336000000,
        close: 150.08,
        open: 149.2,
        high: 150.13,
        low: 148.67,
        volume: 17713795,
    },
    {
        time: 1500422400000,
        close: 151.02,
        open: 150.48,
        high: 151.42,
        low: 149.95,
        volume: 20615419,
    },
    {
        time: 1500508800000,
        close: 150.34,
        open: 151.5,
        high: 151.74,
        low: 150.19,
        volume: 17053326,
    },
    {
        time: 1500595200000,
        close: 150.27,
        open: 149.99,
        high: 150.44,
        low: 148.88,
        volume: 24671002,
    },
    {
        time: 1500854400000,
        close: 152.09,
        open: 150.58,
        high: 152.44,
        low: 149.9,
        volume: 21122730,
    },
    {
        time: 1500940800000,
        close: 152.74,
        open: 151.8,
        high: 153.84,
        low: 151.8,
        volume: 18612649,
    },
    {
        time: 1501027200000,
        close: 153.46,
        open: 153.35,
        high: 153.93,
        low: 153.06,
        volume: 15172136,
    },
    {
        time: 1501113600000,
        close: 150.56,
        open: 153.75,
        high: 153.99,
        low: 147.3,
        volume: 32175875,
    },
    {
        time: 1501200000000,
        close: 149.5,
        open: 149.89,
        high: 150.23,
        low: 149.19,
        volume: 16832947,
    },
    {
        time: 1501459200000,
        close: 148.85,
        open: 149.9,
        high: 150.33,
        low: 148.13,
        volume: 19422655,
    },
    {
        time: 1501545600000,
        close: 150.05,
        open: 149.1,
        high: 150.22,
        low: 148.41,
        volume: 24725526,
    },
    {
        time: 1501632000000,
        close: 157.14,
        open: 159.28,
        high: 159.75,
        low: 156.16,
        volume: 69222793,
    },
    {
        time: 1501718400000,
        close: 155.57,
        open: 157.05,
        high: 157.21,
        low: 155.02,
        volume: 26000738,
    },
    {
        time: 1501804800000,
        close: 156.39,
        open: 156.07,
        high: 157.4,
        low: 155.69,
        volume: 20349532,
    },
    {
        time: 1502150400000,
        close: 160.08,
        open: 158.6,
        high: 161.83,
        low: 158.27,
        volume: 35775675,
    },
    {
        time: 1502236800000,
        close: 161.06,
        open: 159.26,
        high: 161.27,
        low: 159.11,
        volume: 25640394,
    },
    {
        time: 1502323200000,
        close: 155.27,
        open: 159.9,
        high: 160,
        low: 154.63,
        volume: 39081017,
    },
    {
        time: 1502409600000,
        close: 157.48,
        open: 156.6,
        high: 158.5728,
        low: 156.07,
        volume: 25943187,
    },
    {
        time: 1502668800000,
        close: 159.85,
        open: 159.32,
        high: 160.21,
        low: 158.75,
        volume: 21754810,
    },
    {
        time: 1502755200000,
        close: 161.6,
        open: 160.66,
        high: 162.195,
        low: 160.14,
        volume: 27936774,
    },
    {
        time: 1502841600000,
        close: 160.95,
        open: 161.94,
        high: 162.51,
        low: 160.15,
        volume: 27321761,
    },
    {
        time: 1502928000000,
        close: 157.87,
        open: 160.52,
        high: 160.71,
        low: 157.84,
        volume: 26925694,
    },
    {
        time: 1503014400000,
        close: 157.5,
        open: 157.86,
        high: 159.5,
        low: 156.72,
        volume: 27012525,
    },
    {
        time: 1503273600000,
        close: 157.21,
        open: 157.5,
        high: 157.89,
        low: 155.1101,
        volume: 26145653,
    },
    {
        time: 1503360000000,
        close: 159.78,
        open: 158.23,
        high: 160,
        low: 158.02,
        volume: 21297812,
    },
    {
        time: 1503446400000,
        close: 159.98,
        open: 159.07,
        high: 160.47,
        low: 158.88,
        volume: 19198189,
    },
    {
        time: 1503532800000,
        close: 159.27,
        open: 160.43,
        high: 160.74,
        low: 158.55,
        volume: 19029621,
    },
    {
        time: 1503619200000,
        close: 159.86,
        open: 159.65,
        high: 160.56,
        low: 159.27,
        volume: 25015218,
    },
    {
        time: 1503878400000,
        close: 161.47,
        open: 160.14,
        high: 162,
        low: 159.93,
        volume: 25279674,
    },
    {
        time: 1503964800000,
        close: 162.91,
        open: 160.1,
        high: 163.12,
        low: 160,
        volume: 29307862,
    },
    {
        time: 1504051200000,
        close: 163.35,
        open: 163.8,
        high: 163.89,
        low: 162.61,
        volume: 26973946,
    },
    {
        time: 1504137600000,
        close: 164,
        open: 163.64,
        high: 164.52,
        low: 163.48,
        volume: 26412439,
    },
    {
        time: 1504224000000,
        close: 164.05,
        open: 164.8,
        high: 164.94,
        low: 163.63,
        volume: 16508568,
    },
    {
        time: 1504569600000,
        close: 162.08,
        open: 163.75,
        high: 164.25,
        low: 160.56,
        volume: 29317054,
    },
    {
        time: 1504656000000,
        close: 161.91,
        open: 162.71,
        high: 162.99,
        low: 160.52,
        volume: 21179047,
    },
    {
        time: 1504742400000,
        close: 161.26,
        open: 162.09,
        high: 162.24,
        low: 160.36,
        volume: 21722995,
    },
    {
        time: 1504828800000,
        close: 158.63,
        open: 160.86,
        high: 161.15,
        low: 158.53,
        volume: 28183159,
    },
    {
        time: 1505088000000,
        close: 161.5,
        open: 160.5,
        high: 162.05,
        low: 159.89,
        volume: 31028926,
    },
    {
        time: 1505174400000,
        close: 160.82,
        open: 162.61,
        high: 163.96,
        low: 158.77,
        volume: 71139119,
    },
    {
        time: 1505260800000,
        close: 159.65,
        open: 159.87,
        high: 159.96,
        low: 157.91,
        volume: 44393752,
    },
    {
        time: 1505347200000,
        close: 158.28,
        open: 158.99,
        high: 159.4,
        low: 158.09,
        volume: 23073646,
    },
    {
        time: 1505433600000,
        close: 159.88,
        open: 158.47,
        high: 160.97,
        low: 158,
        volume: 48203642,
    },
    {
        time: 1505692800000,
        close: 158.67,
        open: 160.11,
        high: 160.5,
        low: 157.995,
        volume: 27939718,
    },
    {
        time: 1505779200000,
        close: 158.73,
        open: 159.51,
        high: 159.77,
        low: 158.44,
        volume: 20347352,
    },
    {
        time: 1505865600000,
        close: 156.07,
        open: 157.9,
        high: 158.26,
        low: 153.83,
        volume: 51693239,
    },
    {
        time: 1505952000000,
        close: 153.39,
        open: 155.8,
        high: 155.8,
        low: 152.75,
        volume: 36643382,
    },
    {
        time: 1506038400000,
        close: 151.89,
        open: 152.02,
        high: 152.27,
        low: 150.56,
        volume: 46114424,
    },
    {
        time: 1506297600000,
        close: 150.55,
        open: 149.99,
        high: 151.83,
        low: 149.16,
        volume: 43922334,
    },
    {
        time: 1506384000000,
        close: 153.14,
        open: 151.78,
        high: 153.92,
        low: 151.69,
        volume: 35470985,
    },
    {
        time: 1506470400000,
        close: 154.23,
        open: 153.8,
        high: 154.7189,
        low: 153.54,
        volume: 24959552,
    },
    {
        time: 1506556800000,
        close: 153.28,
        open: 153.89,
        high: 154.28,
        low: 152.7,
        volume: 21896592,
    },
    {
        time: 1506643200000,
        close: 154.12,
        open: 153.21,
        high: 154.13,
        low: 152,
        volume: 25856530,
    },
    {
        time: 1506902400000,
        close: 153.81,
        open: 154.26,
        high: 154.45,
        low: 152.72,
        volume: 18524860,
    },
    {
        time: 1506988800000,
        close: 154.48,
        open: 154.01,
        high: 155.09,
        low: 153.91,
        volume: 16146388,
    },
    {
        time: 1507075200000,
        close: 153.4508,
        open: 153.63,
        high: 153.86,
        low: 152.46,
        volume: 19844177,
    },
    {
        time: 1507161600000,
        close: 155.39,
        open: 154.18,
        high: 155.44,
        low: 154.05,
        volume: 21032800,
    },
    {
        time: 1507248000000,
        close: 155.3,
        open: 154.97,
        high: 155.49,
        low: 154.56,
        volume: 16423749,
    },
    {
        time: 1507507200000,
        close: 155.84,
        open: 155.81,
        high: 156.73,
        low: 155.485,
        volume: 16200129,
    },
    {
        time: 1507593600000,
        close: 155.9,
        open: 156.055,
        high: 158,
        low: 155.1,
        volume: 15456331,
    },
    {
        time: 1507680000000,
        close: 156.55,
        open: 155.97,
        high: 156.98,
        low: 155.75,
        volume: 16607693,
    },
    {
        time: 1507766400000,
        close: 156,
        open: 156.35,
        high: 157.37,
        low: 155.7299,
        volume: 16045720,
    },
    {
        time: 1507852800000,
        close: 156.99,
        open: 156.73,
        high: 157.28,
        low: 156.41,
        volume: 16287608,
    },
    {
        time: 1508112000000,
        close: 159.88,
        open: 157.9,
        high: 160,
        low: 157.65,
        volume: 23894630,
    },
    {
        time: 1508198400000,
        close: 160.47,
        open: 159.78,
        high: 160.87,
        low: 159.23,
        volume: 18816438,
    },
    {
        time: 1508284800000,
        close: 159.76,
        open: 160.42,
        high: 160.71,
        low: 159.6,
        volume: 16158659,
    },
    {
        time: 1508371200000,
        close: 155.98,
        open: 156.75,
        high: 157.08,
        low: 155.02,
        volume: 42111326,
    },
    {
        time: 1508457600000,
        close: 156.16,
        open: 156.61,
        high: 157.75,
        low: 155.96,
        volume: 23612246,
    },
    {
        time: 1508716800000,
        close: 156.17,
        open: 156.89,
        high: 157.69,
        low: 155.5,
        volume: 21654461,
    },
    {
        time: 1508803200000,
        close: 157.1,
        open: 156.29,
        high: 157.42,
        low: 156.2,
        volume: 17137731,
    },
    {
        time: 1508889600000,
        close: 156.405,
        open: 156.91,
        high: 157.55,
        low: 155.27,
        volume: 20126554,
    },
    {
        time: 1508976000000,
        close: 157.41,
        open: 157.23,
        high: 157.8295,
        low: 156.78,
        volume: 16751691,
    },
    {
        time: 1509062400000,
        close: 163.05,
        open: 159.29,
        high: 163.6,
        low: 158.7,
        volume: 43904150,
    },
    {
        time: 1509321600000,
        close: 166.72,
        open: 163.89,
        high: 168.07,
        low: 163.72,
        volume: 43923292,
    },
    {
        time: 1509408000000,
        close: 169.04,
        open: 167.9,
        high: 169.6499,
        low: 166.94,
        volume: 35474672,
    },
    {
        time: 1509494400000,
        close: 166.89,
        open: 169.87,
        high: 169.94,
        low: 165.61,
        volume: 33100847,
    },
    {
        time: 1509580800000,
        close: 168.11,
        open: 167.64,
        high: 168.5,
        low: 165.28,
        volume: 32710040,
    },
    {
        time: 1509667200000,
        close: 172.5,
        open: 174,
        high: 174.26,
        low: 171.12,
        volume: 58683826,
    },
    {
        time: 1509926400000,
        close: 174.25,
        open: 172.365,
        high: 174.99,
        low: 171.72,
        volume: 34242566,
    },
    {
        time: 1510012800000,
        close: 174.81,
        open: 173.91,
        high: 175.25,
        low: 173.6,
        volume: 23910914,
    },
    {
        time: 1510185600000,
        close: 175.88,
        open: 175.11,
        high: 176.095,
        low: 173.14,
        volume: 28636531,
    },
    {
        time: 1510272000000,
        close: 174.67,
        open: 175.11,
        high: 175.38,
        low: 174.27,
        volume: 25061183,
    },
    {
        time: 1510531200000,
        close: 173.97,
        open: 173.5,
        high: 174.5,
        low: 173.4,
        volume: 16828025,
    },
    {
        time: 1510617600000,
        close: 171.34,
        open: 173.04,
        high: 173.48,
        low: 171.18,
        volume: 23588451,
    },
    {
        time: 1510704000000,
        close: 169.08,
        open: 169.97,
        high: 170.3197,
        low: 168.38,
        volume: 28702351,
    },
    {
        time: 1510790400000,
        close: 171.1,
        open: 171.18,
        high: 171.87,
        low: 170.3,
        volume: 23497326,
    },
    {
        time: 1510876800000,
        close: 170.15,
        open: 171.04,
        high: 171.39,
        low: 169.64,
        volume: 21665811,
    },
    {
        time: 1511136000000,
        close: 169.98,
        open: 170.29,
        high: 170.56,
        low: 169.56,
        volume: 15974387,
    },
    {
        time: 1511222400000,
        close: 173.14,
        open: 170.78,
        high: 173.7,
        low: 170.78,
        volume: 24875471,
    },
    {
        time: 1511308800000,
        close: 174.96,
        open: 173.36,
        high: 175,
        low: 173.05,
        volume: 24997274,
    },
    {
        time: 1511481600000,
        close: 174.97,
        open: 175.1,
        high: 175.5,
        low: 174.6459,
        volume: 14026519,
    },
    {
        time: 1511740800000,
        close: 174.09,
        open: 175.05,
        high: 175.08,
        low: 173.34,
        volume: 20536313,
    },
    {
        time: 1511827200000,
        close: 173.07,
        open: 174.3,
        high: 174.87,
        low: 171.86,
        volume: 25468442,
    },
    {
        time: 1511913600000,
        close: 169.48,
        open: 172.63,
        high: 172.92,
        low: 167.16,
        volume: 40788324,
    },
    {
        time: 1512000000000,
        close: 171.85,
        open: 170.43,
        high: 172.14,
        low: 168.44,
        volume: 40172368,
    },
    {
        time: 1512086400000,
        close: 171.05,
        open: 169.95,
        high: 171.67,
        low: 168.5,
        volume: 39590080,
    },
    {
        time: 1512345600000,
        close: 169.8,
        open: 172.48,
        high: 172.62,
        low: 169.63,
        volume: 32115052,
    },
    {
        time: 1512432000000,
        close: 169.64,
        open: 169.06,
        high: 171.52,
        low: 168.4,
        volume: 27008428,
    },
    {
        time: 1512518400000,
        close: 169.01,
        open: 167.5,
        high: 170.2047,
        low: 166.46,
        volume: 28224357,
    },
    {
        time: 1512604800000,
        close: 169.452,
        open: 169.03,
        high: 170.44,
        low: 168.91,
        volume: 24469613,
    },
    {
        time: 1512691200000,
        close: 169.37,
        open: 170.49,
        high: 171,
        low: 168.82,
        volume: 23096872,
    },
    {
        time: 1512950400000,
        close: 172.67,
        open: 169.2,
        high: 172.89,
        low: 168.79,
        volume: 33092051,
    },
    {
        time: 1513036800000,
        close: 171.7,
        open: 172.15,
        high: 172.39,
        low: 171.461,
        volume: 18945457,
    },
    {
        time: 1513123200000,
        close: 172.27,
        open: 172.5,
        high: 173.54,
        low: 172,
        volume: 23142242,
    },
    {
        time: 1513209600000,
        close: 172.22,
        open: 172.4,
        high: 173.13,
        low: 171.65,
        volume: 20219307,
    },
    {
        time: 1513296000000,
        close: 173.87,
        open: 173.63,
        high: 174.17,
        low: 172.46,
        volume: 37054632,
    },
    {
        time: 1513555200000,
        close: 176.42,
        open: 174.88,
        high: 177.2,
        low: 174.86,
        volume: 28831533,
    },
    {
        time: 1513641600000,
        close: 174.54,
        open: 175.03,
        high: 175.39,
        low: 174.09,
        volume: 27078872,
    },
    {
        time: 1513728000000,
        close: 174.35,
        open: 174.87,
        high: 175.42,
        low: 173.25,
        volume: 23000392,
    },
    {
        time: 1513814400000,
        close: 175.01,
        open: 174.17,
        high: 176.02,
        low: 174.1,
        volume: 20356826,
    },
    {
        time: 1513900800000,
        close: 175.01,
        open: 174.68,
        high: 175.424,
        low: 174.5,
        volume: 16052615,
    },
    {
        time: 1514246400000,
        close: 170.57,
        open: 170.8,
        high: 171.47,
        low: 169.679,
        volume: 32968167,
    },
    {
        time: 1514332800000,
        close: 170.6,
        open: 170.1,
        high: 170.78,
        low: 169.71,
        volume: 21672062,
    },
    {
        time: 1514419200000,
        close: 171.08,
        open: 171,
        high: 171.85,
        low: 170.48,
        volume: 15997739,
    },
    {
        time: 1514505600000,
        close: 169.23,
        open: 170.52,
        high: 170.59,
        low: 169.22,
        volume: 25643711,
    },
    {
        time: 1514851200000,
        close: 172.26,
        open: 170.16,
        high: 172.3,
        low: 169.26,
        volume: 25048048,
    },
    {
        time: 1514937600000,
        close: 172.23,
        open: 172.53,
        high: 174.55,
        low: 171.96,
        volume: 28819653,
    },
    {
        time: 1515024000000,
        close: 173.03,
        open: 172.54,
        high: 173.47,
        low: 172.08,
        volume: 22211345,
    },
    {
        time: 1515110400000,
        close: 175,
        open: 173.44,
        high: 175.37,
        low: 173.05,
        volume: 23016177,
    },
    {
        time: 1515369600000,
        close: 174.35,
        open: 174.35,
        high: 175.61,
        low: 173.93,
        volume: 20134092,
    },
    {
        time: 1515456000000,
        close: 174.33,
        open: 174.55,
        high: 175.06,
        low: 173.41,
        volume: 21262614,
    },
    {
        time: 1515542400000,
        close: 174.29,
        open: 173.16,
        high: 174.3,
        low: 173,
        volume: 23589129,
    },
    {
        time: 1515628800000,
        close: 175.28,
        open: 174.59,
        high: 175.4886,
        low: 174.49,
        volume: 17523256,
    },
    {
        time: 1515715200000,
        close: 177.09,
        open: 176.18,
        high: 177.36,
        low: 175.65,
        volume: 25039531,
    },
    {
        time: 1516060800000,
        close: 176.19,
        open: 177.9,
        high: 179.39,
        low: 176.14,
        volume: 29159005,
    },
    {
        time: 1516147200000,
        close: 179.1,
        open: 176.15,
        high: 179.25,
        low: 175.07,
        volume: 32752734,
    },
    {
        time: 1516233600000,
        close: 179.26,
        open: 179.37,
        high: 180.1,
        low: 178.25,
        volume: 30234512,
    },
    {
        time: 1516320000000,
        close: 178.46,
        open: 178.61,
        high: 179.58,
        low: 177.41,
        volume: 30827809,
    },
    {
        time: 1516579200000,
        close: 177,
        open: 177.3,
        high: 177.78,
        low: 176.6016,
        volume: 26023683,
    },
    {
        time: 1516665600000,
        close: 177.04,
        open: 177.3,
        high: 179.44,
        low: 176.82,
        volume: 31702531,
    },
    {
        time: 1516752000000,
        close: 174.22,
        open: 177.25,
        high: 177.3,
        low: 173.2,
        volume: 50562257,
    },
    {
        time: 1516838400000,
        close: 171.11,
        open: 174.505,
        high: 174.95,
        low: 170.53,
        volume: 39661804,
    },
    {
        time: 1516924800000,
        close: 171.51,
        open: 172,
        high: 172,
        low: 170.06,
        volume: 37121805,
    },
    {
        time: 1517184000000,
        close: 167.96,
        open: 170.16,
        high: 170.16,
        low: 167.07,
        volume: 48434424,
    },
    {
        time: 1517270400000,
        close: 166.97,
        open: 165.525,
        high: 167.37,
        low: 164.7,
        volume: 45137026,
    },
    {
        time: 1517356800000,
        close: 167.43,
        open: 166.87,
        high: 168.4417,
        low: 166.5,
        volume: 30984099,
    },
    {
        time: 1517443200000,
        close: 167.78,
        open: 167.165,
        high: 168.62,
        low: 166.76,
        volume: 38099665,
    },
    {
        time: 1517529600000,
        close: 160.37,
        open: 166,
        high: 166.8,
        low: 160.1,
        volume: 85436075,
    },
    {
        time: 1517788800000,
        close: 157.49,
        open: 159.1,
        high: 163.88,
        low: 156,
        volume: 66090446,
    },
    {
        time: 1517875200000,
        close: 163.03,
        open: 154.83,
        high: 163.72,
        low: 154,
        volume: 66625484,
    },
    {
        time: 1517961600000,
        close: 159.54,
        open: 163.085,
        high: 163.4,
        low: 159.0685,
        volume: 50852130,
    },
    {
        time: 1518048000000,
        close: 155.32,
        open: 160.29,
        high: 161,
        low: 155.03,
        volume: 49594129,
    },
    {
        time: 1518134400000,
        close: 155.97,
        open: 157.07,
        high: 157.89,
        low: 150.24,
        volume: 66723743,
    },
    {
        time: 1518393600000,
        close: 162.71,
        open: 158.5,
        high: 163.89,
        low: 157.51,
        volume: 60560145,
    },
    {
        time: 1518480000000,
        close: 164.34,
        open: 161.95,
        high: 164.75,
        low: 161.65,
        volume: 32104756,
    },
    {
        time: 1518566400000,
        close: 167.37,
        open: 163.045,
        high: 167.54,
        low: 162.88,
        volume: 39669178,
    },
    {
        time: 1518652800000,
        close: 172.99,
        open: 169.79,
        high: 173.09,
        low: 169,
        volume: 50609595,
    },
    {
        time: 1518739200000,
        close: 172.43,
        open: 172.36,
        high: 174.82,
        low: 171.77,
        volume: 39638793,
    },
    {
        time: 1519084800000,
        close: 171.85,
        open: 172.05,
        high: 174.26,
        low: 171.42,
        volume: 33531012,
    },
    {
        time: 1519171200000,
        close: 171.07,
        open: 172.83,
        high: 174.12,
        low: 171.01,
        volume: 35833514,
    },
    {
        time: 1519257600000,
        close: 172.6,
        open: 171.8,
        high: 173.95,
        low: 171.71,
        volume: 30504116,
    },
    {
        time: 1519344000000,
        close: 175.555,
        open: 173.67,
        high: 175.65,
        low: 173.54,
        volume: 33329232,
    },
    {
        time: 1519603200000,
        close: 178.97,
        open: 176.35,
        high: 179.39,
        low: 176.21,
        volume: 36886432,
    },
    {
        time: 1519689600000,
        close: 178.39,
        open: 179.1,
        high: 180.48,
        low: 178.16,
        volume: 38685165,
    },
    {
        time: 1519776000000,
        close: 178.12,
        open: 179.26,
        high: 180.615,
        low: 178.05,
        volume: 33604574,
    },
    {
        time: 1519862400000,
        close: 175,
        open: 178.54,
        high: 179.775,
        low: 172.66,
        volume: 48801970,
    },
    {
        time: 1519948800000,
        close: 176.21,
        open: 172.8,
        high: 176.3,
        low: 172.45,
        volume: 38453950,
    },
    {
        time: 1520208000000,
        close: 176.82,
        open: 175.21,
        high: 177.74,
        low: 174.52,
        volume: 28401366,
    },
    {
        time: 1520294400000,
        close: 176.67,
        open: 177.91,
        high: 178.25,
        low: 176.13,
        volume: 23788506,
    },
    {
        time: 1520380800000,
        close: 175.03,
        open: 174.94,
        high: 175.85,
        low: 174.27,
        volume: 31703462,
    },
    {
        time: 1520467200000,
        close: 176.94,
        open: 175.48,
        high: 177.12,
        low: 175.07,
        volume: 23163767,
    },
    {
        time: 1520553600000,
        close: 179.98,
        open: 177.96,
        high: 180,
        low: 177.39,
        volume: 31385134,
    },
    {
        time: 1520812800000,
        close: 181.72,
        open: 180.29,
        high: 182.39,
        low: 180.21,
        volume: 32055405,
    },
    {
        time: 1520899200000,
        close: 179.97,
        open: 182.59,
        high: 183.5,
        low: 179.24,
        volume: 31168404,
    },
    {
        time: 1520985600000,
        close: 178.44,
        open: 180.32,
        high: 180.52,
        low: 177.81,
        volume: 29075469,
    },
    {
        time: 1521072000000,
        close: 178.65,
        open: 178.5,
        high: 180.24,
        low: 178.0701,
        volume: 22584565,
    },
    {
        time: 1521158400000,
        close: 178.02,
        open: 178.65,
        high: 179.12,
        low: 177.62,
        volume: 36836456,
    },
    {
        time: 1521417600000,
        close: 175.3,
        open: 177.32,
        high: 177.47,
        low: 173.66,
        volume: 32804695,
    },
    {
        time: 1521504000000,
        close: 175.24,
        open: 175.24,
        high: 176.8,
        low: 174.94,
        volume: 19314039,
    },
    {
        time: 1521590400000,
        close: 171.27,
        open: 175.04,
        high: 175.09,
        low: 171.26,
        volume: 35247358,
    },
    {
        time: 1521676800000,
        close: 168.845,
        open: 170,
        high: 172.68,
        low: 168.6,
        volume: 41051076,
    },
    {
        time: 1521763200000,
        close: 164.94,
        open: 168.39,
        high: 169.92,
        low: 164.94,
        volume: 40248954,
    },
    {
        time: 1522022400000,
        close: 172.77,
        open: 168.07,
        high: 173.1,
        low: 166.44,
        volume: 36272617,
    },
    {
        time: 1522108800000,
        close: 168.34,
        open: 173.68,
        high: 175.15,
        low: 166.92,
        volume: 38962839,
    },
];
