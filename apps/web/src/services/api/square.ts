// /api/v1/members/:id
import { post, http, get, put } from '../request';

export type MemberInfo = {
    members: {
        chainID: string;
        createdAt: number;
        creatorAddress: string;
        id: number;
        memberName: string;
        memberStatus: number;
        pictureUrl: string;
        updatedAt: number;
        followers: number;
        following: number;
        holding: number;
        created: number;
    };
};

export const getProfileInfoByMemberName = (memberName: string): Promise<MemberInfo> =>
    get(`/api/v1/members?memberName=${memberName}`);

export const getProfileInfoById = (id: string): Promise<MemberInfo> => get(`/api/v1/members/${id}`);

// gtodo intro
export const editProfileInfo = (body: { memberName: string; pictureUrl: string; id: number }) =>
    put(`/api/v1/members/${body.id}`, body);
