import {
    CheckInviteCode,
    CheckAirdrop,
    GetSummary,
    GetAirdropRank,
    GetTwRank,
    InviteLogs,
    TradeLogs,
    GetProgress,
    Members,
    CheckTwBind,
} from '@/types/meme';
import { post, http } from '../request';
export const checkInviteCode = (params: CheckInviteCode.Params): Promise<CheckInviteCode.Response> =>
    post('/api/v2/checkInviteCode', params);
export const checkAirdrop = (params: CheckAirdrop.Params): Promise<CheckAirdrop.Response> =>
    http.post('/api/v2/checkAirdrop', null, {
        params: params,
    });

export const getSummary = (params: GetSummary.Params): Promise<GetSummary.Response> =>
    post('/api/v2/getSummary', params);
export const getAirdropRank = (params: GetAirdropRank.Params): Promise<GetAirdropRank.Response> =>
    post('/api/v2/getAirdropRank', params);
export const getTwRank = (params: GetAirdropRank.Params): Promise<GetTwRank.Response> =>
    post('/api/v2/getTwRank', params);
export const inviteLogs = (params: InviteLogs.Params): Promise<InviteLogs.Response> =>
    post('/api/v2/inviteLogs', params);
export const tradeLogs = (params: InviteLogs.Params): Promise<TradeLogs.Response> => post('/api/v2/tradeLogs', params);
export const getProgress = (): Promise<GetProgress.Response> => post('/api/v2/getProgress');
export const membersPut = (params: Members.Params): Promise<any> =>
    http.put(`/api/v1/members/${params.loginId}`, params);
export const checkTwBind = (params: CheckTwBind.Params): Promise<any> =>
    http.get(`/api/v1/members/checkTwBind`, { params });
