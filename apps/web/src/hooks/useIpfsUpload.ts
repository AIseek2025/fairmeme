import { IS_TEST } from '@/constants/env';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { createPinataClient } from '@/utils/pinataClient';

interface UploadResult {
    jsonCid?: string;
    fileCid?: string;
    errorMessage?: string;
}

export interface Metadata extends Record<string, unknown> {
    name: string;
    symbol: string;
    description: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    farcaster?: string;
}

interface IpfsUploadHook {
    uploadMetadataToIpfs: (file: File, metadata: Metadata) => Promise<UploadResult>;
    uploadFileToIpfs: (file: File) => Promise<UploadResult>;
    isUploading: boolean;
    uploadResult: UploadResult | null;
    error: string | null;
    resetState: () => void;
}

export const useIpfsUpload = (): IpfsUploadHook => {
    const [isUploading, setIsUploading] = useSafeState<boolean>(false);
    const [uploadResult, setUploadResult] = useSafeState<UploadResult | null>(null);
    const [error, setError] = useSafeState<string | null>(null);
    const pinata = createPinataClient();

    const fetchUploadKey = async () => {
        const keyRequest = await fetch('/api/key', {
            method: 'POST',
        });

        if (!keyRequest.ok) {
            throw new Error('Unable to create temporary upload key');
        }

        const keyData = await keyRequest.json();
        if (!keyData?.JWT) {
            throw new Error('Temporary upload key response is missing JWT');
        }

        return keyData.JWT as string;
    };

    const uploadMetadataToIpfs = useMemoizedFn(async (file: File, metadata: Metadata): Promise<UploadResult> => {
        setIsUploading(true);
        setError(null);

        try {
            const uploadKey = await fetchUploadKey();
            const uploadImage = await pinata.upload.file(file).key(uploadKey);
            const image = await pinata.gateways.convert(uploadImage.IpfsHash);
            const jsonData: Record<string, unknown> = {
                ...metadata,
                createdOn: IS_TEST ? 'https://test.fairmeme.io' : 'https://fairmeme.io',
                image,
            };
            const upload = await pinata.upload.json(jsonData).key(uploadKey);
            const jsonCid = await pinata.gateways.convert(upload.IpfsHash);

            const result: UploadResult = {
                jsonCid,
            };

            setUploadResult(result);
            return result;
        } catch (err) {
            console.error('Error uploading metadata to IPFS:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            resetState();
            return { errorMessage };
        } finally {
            setIsUploading(false);
        }
    });

    const uploadFileToIpfs = useMemoizedFn(async (file: File): Promise<UploadResult> => {
        setIsUploading(true);
        setError(null);

        try {
            const uploadKey = await fetchUploadKey();
            const uploadFile = await pinata.upload.file(file).key(uploadKey);
            const fileCid = await pinata.gateways.convert(uploadFile.IpfsHash);

            const result: UploadResult = {
                fileCid,
            };

            setUploadResult(result);
            return result;
        } catch (err) {
            console.error('Error uploading file to IPFS:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            resetState();
            return { errorMessage };
        } finally {
            setIsUploading(false);
        }
    });

    const resetState = useMemoizedFn(() => {
        setIsUploading(false);
        setUploadResult(null);
        setError(null);
    });

    return {
        uploadMetadataToIpfs,
        uploadFileToIpfs,
        isUploading,
        uploadResult,
        error,
        resetState,
    };
};
