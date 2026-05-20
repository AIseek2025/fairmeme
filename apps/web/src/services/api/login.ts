import { ChainsType, User, UserInfo } from '@/types/common';
import { get, post } from '../request';

export const login = (params: User.Params): Promise<UserInfo> => post('/api/v1/login', params);
export const getNonce = (publicKey: string, currentChain?: ChainsType): Promise<{ nonce: string }> =>
    get(`/api/v1/nonce?creatorAddress=${publicKey}`);
