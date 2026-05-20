'use client';
import { GetCommentList } from '@/types/meme';
import { formatAddress, formattedTime, safeMergeClassName } from '@/utils/common';
import Image from 'next/image';
import {
    Paginator,
    PaginatorNextPageLinkOptions,
    PaginatorPageChangeEvent,
    PaginatorPageLinksOptions,
    PaginatorPrevPageLinkOptions,
} from 'primereact/paginator';
import React from 'react';

type CommentItemProps = {
    comment: GetCommentList.CommentItem;
};

const CommentItem = ({ comment }: CommentItemProps) => {
    return (
        <div className="flex flex-col gap-4 border-b border-[#010102] py-6 text-xl text-white md:text-sm">
            <div className="flex items-center gap-4">
                <div className="rounded-md border border-[#FFD41A] p-4 text-base md:text-sm">
                    {formatAddress(comment?.creatorAddress)}
                </div>
                <span className="text-xs text-[#7A89A2]">{formattedTime(comment?.createdAt)}</span>
            </div>
            {comment?.commentContent?.images?.length !== 0 && (
                <div className="max-h-60 max-w-60">
                    <Image
                        src={comment.commentContent.images![0]}
                        alt="comment Image not found"
                        width={200}
                        height={100}
                        className="h-full w-full object-cover object-center"
                    />
                </div>
            )}
            <p>{comment?.commentContent?.text}</p>
        </div>
    );
};
type Props = {
    commentList: GetCommentList.Response;
    current: any;
    pageSize: any;
    setCurrent: any;
};
const CommentList = ({ commentList, current, pageSize, setCurrent }: Props) => {
    const paginatorTemplate = {
        PrevPageLink: (options: PaginatorPrevPageLinkOptions) => (
            <button
                type="button"
                className={safeMergeClassName(
                    `p-paginator-prev p-paginator-element p-link mr-[12px] border-[1px] border-solid border-[#34363D] bg-[#24262E] text-white`,
                )}
                onClick={options.onClick}
                aria-label="Previous Page"
            >
                <span className="pi pi-angle-left"></span>
            </button>
        ),
        PageLinks: (options: PaginatorPageLinksOptions) => (
            <button
                type="button"
                className={safeMergeClassName(
                    `p-paginator-page p-paginator-element p-link mr-[12px] border-[1px] border-solid border-[#34363D] bg-[#24262E] text-[#fff]`,
                    {
                        'bg-[#FFD41A] text-[#333]': options.page === current - 1,
                    },
                )}
                onClick={options.onClick}
            >
                {options.page + 1}
            </button>
        ),
        NextPageLink: (options: PaginatorNextPageLinkOptions) => (
            <button
                type="button"
                className={safeMergeClassName(
                    `p-paginator-next p-paginator-element p-link border-[1px] border-solid border-[#34363D] bg-[#24262E] text-white`,
                )}
                onClick={options.onClick}
                aria-label="Next Page"
            >
                <span className="pi pi-angle-right"></span>
            </button>
        ),
    };
    return (
        <div>
            <div>{commentList?.items.map((comment) => <CommentItem key={comment.id} comment={comment} />)}</div>
            <div>
                <Paginator
                    pt={{
                        root: {
                            className: safeMergeClassName('bg-transparent mt-[48px] mb-[64px]'),
                        },
                    }}
                    first={(current - 1) * pageSize}
                    rows={pageSize}
                    totalRecords={commentList?.total}
                    template={paginatorTemplate}
                    onPageChange={(event: PaginatorPageChangeEvent) => {
                        setCurrent(event.page + 1);
                    }}
                    className="mt-4"
                />
            </div>
        </div>
    );
};

export default CommentList;
