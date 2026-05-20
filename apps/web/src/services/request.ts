import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
// import { IS_BROWSER } from '@/constants/env';

// interface LocalStore {
//     state?: {
//         loginToken?: string;
//     };
// }

interface ApiResponse<T> {
    code: number;
    data: T;
    msg: string;
}

interface CustomAxiosError extends AxiosError {
    response?: AxiosResponse<ApiResponse<any>>;
}

const STORAGE_KEY = 'fairmeme-storage';
const API_PREFIX = '/api';
const DEFAULT_TIMEOUT = 10000;

const http: AxiosInstance = axios.create({
    timeout: DEFAULT_TIMEOUT,
    withCredentials: false,
});

// const getLoginToken = (): string => {
//     if (!IS_BROWSER) return '';

//     try {
//         const storageData = localStorage.getItem(STORAGE_KEY);
//         if (!storageData) return '';

//         const parsedData: LocalStore = JSON.parse(storageData);
//         return parsedData.state?.loginToken ?? '';
//     } catch (error) {
//         console.error('Error parsing localStorage data:', error);
//         return '';
//     }
// };

// http.interceptors.request.use(
//     (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//         const loginToken = getLoginToken();
//         if (config.headers && loginToken) {
//             config.headers.Authorization = loginToken;
//         }
//         return config;
//     },
//     (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
// );

http.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>): any => {
        const { data } = response;
        if (data && 'code' in data && 'data' in data) {
            if (data.code === 0) {
                return data.data;
            }
            throw new Error(data.msg || 'API request failed');
        }
        return data;
    },
    (error: CustomAxiosError): Promise<never> => Promise.reject(error.response?.data ?? error),
);

type RequestParams = Record<string, any>;

type RequestFunction = <T>(url: string, params?: RequestParams) => Promise<T>;

const getFullUrl = (url: string): string => (url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`);

const get: RequestFunction = <T>(url: string, params: RequestParams = {}): Promise<T> =>
    http.get<ApiResponse<T>, T>(getFullUrl(url), { params });

const post: RequestFunction = <T>(url: string, params: RequestParams = {}): Promise<T> =>
    http.post<ApiResponse<T>, T>(getFullUrl(url), params);

const put: RequestFunction = <T>(url: string, params: RequestParams = {}): Promise<T> =>
    http.put<ApiResponse<T>, T>(getFullUrl(url), params);

const upload: RequestFunction = <T>(url: string, params: RequestParams = {}): Promise<T> =>
    http.postForm<ApiResponse<T>, T>(getFullUrl(url), params);

export { post, get, upload, http, put };
