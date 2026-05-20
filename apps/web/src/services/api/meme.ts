import qs from 'qs';
import { get, post, http } from '../request';
import { ChainsType } from '@/types/common';

export const getCommentList = (params: GetCommentList.Params): Promise<GetCommentList.Response> =>
    post(`/api/v1/comment/list`, params);
export const getTradeList = (params: GetTradeList.Params): Promise<GetTradeList.Response> =>
    post(`/api/v1/trade/list`, params);
export const getHoldersList = (params: GetHoldersList.Params): Promise<GetHoldersList.Response> =>
    post(`/api/v1/holders/list`, params);
export const getTrendingList = (params: GetTrendingList.Params): Promise<GetTrendingList.Response> =>
    post(`/api/v1/token/trending`, params);
export const createComment = (params: CreateComment.Params): Promise<true> => post(`/api/v1/comment`, params);

export const getTokenDetailInfo = (params: GetTokenDetailInfo.Params): Promise<GetTokenDetailInfo.Response> =>
    get(`/api/v1/token/${params.address}`);
export const getTradeDetail = (params: GetTradeDetail.Params): Promise<GetTradeDetail.Response> => {
    const queryString = new URLSearchParams({
        tokenAddress: params.tokenAddress,
        hours: params.hours.toString(),
    }).toString();
    const url = `/api/v1/trade/detail?${queryString}`;
    return post(url, {});
};
export const postViewCount = (params: { tokenAddress: string }) => {
    const queryString = new URLSearchParams({
        tokenAddress: params.tokenAddress,
    }).toString();
    const url = `/api/v1/token/detailView?${queryString}`;
    return post(url, {});
};
export const getSwapDetails = (params: {
    tokenAddress: string;
    nativeTokenAmount?: string;
    tokenAmount?: string;
    chainName: ChainsType;
}): Promise<{
    tokenAddress: string;
    nativeTokenAmount: string;
    memeTokenAmount: string;
    memeTokenPrice: string;
    nativeTokenPrice: string;
    nativeTokenUSD: string;
    memeTokenUSD: string;
}> => get(`/api/v1/token/getSwapDetails?${qs.stringify(params)}`);

export const getTokenTrending = (params: GetTokenTrending.Params): Promise<GetTokenTrending.Response> =>
    post('/api/v1/token/trending', params);
