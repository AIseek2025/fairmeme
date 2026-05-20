import React, { useState } from 'react';
import CommentsInput from './CommentsInput';
import { useRequest } from 'ahooks';
import { getCommentList } from '@/services/api/meme';
import { useParams } from 'next/navigation';
import CommentList from './CommentList';

type Props = {};

const Comments = (props: Props) => {
    const { token }: { token: string } = useParams();
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const { data: commentList, refresh: refetchCommentList } = useRequest(
        () =>
            getCommentList({
                columns: { tokenAddress: token ?? '' },
                limit: pageSize,
                page: current,
            }),
        {
            refreshDeps: [current, pageSize],
            pollingInterval: 30 * 1000,
        },
    );
    return (
        <div className="p-6 md:p-4">
            <CommentsInput refetchCommentList={refetchCommentList} token={token} />
            <CommentList commentList={commentList} current={current} pageSize={pageSize} setCurrent={setCurrent} />
        </div>
    );
};

export default Comments;
