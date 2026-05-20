'use client';
import React, { useState, useRef, ChangeEvent, useLayoutEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import { useToast } from '@/context/ToastContext';
import { useRequest } from 'ahooks';
import { uploadLogo } from '@/services/api/createMeme';
import { createComment } from '@/services/api/meme';
import useWalletAddress from '@/hooks/useWalletAddress';
type Props = {
    refetchCommentList: () => void;
    token: string;
};
const CommentsInput = ({ refetchCommentList, token }: Props) => {
    const [comment, setComment] = useState('');
    const [mounted, setMounted] = useState(false);
    useLayoutEffect(() => {
        setMounted(true);
    }, []);
    const [image, setImage] = useState<File | null>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const { isConnected } = useGetIsConnected();
    const { showToast } = useToast();
    const { addressTokenStr } = useWalletAddress();
    const { runAsync: uploadImg, data } = useRequest(uploadLogo, {
        manual: true,
        onError: (e) => {
            showToast({
                severity: 'error',
                summary: 'File Upload Error',
                detail: 'File Upload Error',
                life: 3000,
            });
        },
    });

    const { runAsync: addComment } = useRequest(createComment, {
        manual: true,
        onSuccess: () => {
            showToast({
                severity: 'success',
                summary: 'Success',
                detail: 'Comment added successfully',
                life: 3000,
            });
            // Refresh comment list
            refetchCommentList();
        },
    });
    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        if (input.length <= 256) {
            setComment(input);
        }
    };

    const handleImageUpload = (e: FileUploadSelectEvent) => {
        if (e.files && e.files.length > 0) {
            setImage(e.files[0]);
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!isConnected) {
            showToast({
                severity: 'error',
                summary: 'Connect Wallet',
                detail: 'Place Connect Wallet',
                position: 'bottom-right',
                life: 3000,
            });
            return;
        }
        try {
            let imageUrl = '';
            if (image) {
                const res = await uploadImg({ file: image });
                imageUrl = res!.fileUrl;
            }
            // tokenAddress: string;
            // creatorAddress: string;
            // images: string[];
            // text: string;
            await addComment({
                tokenAddress: token,
                creatorAddress: addressTokenStr!,
                images: imageUrl ? [imageUrl] : [],
                text: comment,
            });

            // Reset form
            setComment('');
            setImage(null);
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        } catch (error) {
            console.log(error);
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add comment',
                position: 'bottom-right',
                life: 3000,
            });
        }
    };

    return (
        <form className="overflow-hidden rounded-lg border border-[#34363D] bg-[#1E2028] p-6">
            <InputTextarea
                value={comment}
                onChange={handleCommentChange}
                className="mb-3 w-full border-none bg-transparent text-white focus:border-none focus:shadow-none"
                placeholder="Write your comments"
            />
            <div className="w-full md:flex md:flex-col lg:flex-row lg:items-center lg:justify-between">
                <span className="font-helvetica text-sm">{comment?.length}/256</span>
                <div className="gap-6 flex-items-center">
                    {mounted && (
                        <FileUpload
                            ref={fileUploadRef}
                            mode="basic"
                            accept="image/*"
                            maxFileSize={1000000}
                            onSelect={handleImageUpload}
                            chooseOptions={{
                                icon: 'pi pi-image text-2xl mr-1',
                                iconOnly: true,
                                className: 'bg-transparent  border-2 border-[#34363D]',
                            }}
                        />
                    )}
                    <Button
                        label="Submit"
                        onClick={handleSubmit}
                        disabled={!Boolean(comment?.length !== 0 || image)}
                        className="border-none bg-yellow px-12 py-3 font-helvetica text-sm font-bold text-[#333]"
                    />
                </div>
            </div>
        </form>
    );
};

export default CommentsInput;
