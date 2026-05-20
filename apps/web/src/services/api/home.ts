import { post } from '../request';
export const getTokenList = (params: FairMemeHome.Params): Promise<FairMemeHome.Response> =>
    post('/api/v1/token/list', params);
export const followActionReq = (params: FairMemeHome.FollowActionParams): Promise<FairMemeHome.Response> =>
    post('/api/v1/followAction', params);
