import { ChainsType, User, UserInfo } from '@/types/common';
import { get, post } from '../request';

export const login = (params: User.Params): Promise<UserInfo> => post('/api/v1/login', params);
export const getNonce = (publicKey: string, currentChain?: ChainsType): Promise<{ nonce: string }> =>
    get(`/api/v1/nonce?creatorAddress=${publicKey}`);

export type MemberSession = {
    id: number;
};

export type MemberListResponse = {
    items?: Array<{
        id: number;
        creatorAddress: string;
        chainID: string;
    }>;
    total?: number;
};

export const getMemberSessionByAddress = (creatorAddress: string): Promise<MemberListResponse> =>
    post('/api/v1/members/list', {
        page: 1,
        limit: 1,
        columns: {
            creatorAddress,
        },
    });

export const createMemberSession = (params: { creatorAddress: string; chainID: ChainsType }): Promise<MemberSession> =>
    post('/api/v1/login', {
        creatorAddress: params.creatorAddress,
        chainID: params.chainID,
        memberName: '',
        pictureUrl: '',
        memberStatus: 0,
    });
