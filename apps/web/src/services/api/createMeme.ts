import { TokenCreate, UploadLogo } from '@/types/createMeme';
import { post, upload } from '../request';

export const uploadLogo = (params: UploadLogo.Params): Promise<UploadLogo.Response> =>
    upload('/api/v1/uploadFile/logo', params);

export const tokenCreate = (params: TokenCreate.Params) => post(`/api/v1/token`, params);
