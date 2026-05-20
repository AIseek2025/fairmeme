import { useRequest } from 'ahooks';
import { getTokenDetailInfo } from '../api/meme';
import { GetTokenDetailInfo } from '@/types/meme';
import { useMemeInfoStore } from '@/store/memeInfoStore';

export const useTokenInfo = (token: string, userAddress?: string, onSuccessCallback?: () => void) => {
    const { memeItem } = useMemeInfoStore();
    return useRequest<GetTokenDetailInfo.Response, [string]>(() => getTokenDetailInfo({ address: token ?? '' }), {
        refreshDeps: [token, userAddress, memeItem?.id],
        cacheKey: `tokenInfo-${token}`,
        staleTime: 10 * 1000,
        onSuccess: onSuccessCallback,
        retryCount: 3,
    });
};
