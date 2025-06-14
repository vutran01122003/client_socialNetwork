import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment } from '../../../redux/actions/commentAction';
import SendIcon from '@mui/icons-material/Send';
import EmotionBtn from '../../button/EmotionBtn';

function InputComment({
    post,
    auth,
    comment,
    socket,
    inputCommentRef,
    setReplyComment,
    currentOwnerComment,
    scrollToLastComment
}) {
    const [commentValue, setCommentValue] = useState('');
    const dispatch = useDispatch();

    const handlecommentValue = (e) => {
        setCommentValue(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (commentValue) {
            dispatch(
                createComment({
                    post,
                    parentCommentId: comment?.parentCommentId || comment?._id,
                    user: auth?.user,
                    content: commentValue,
                    socket
                })
            );
            setCommentValue('');
            if (setReplyComment) setReplyComment(false);
            if (scrollToLastComment) scrollToLastComment();
        }
        return;
    };

    return (
        <div className='input_comment_wrapper p-2'>
            <form className='flex relative' onSubmit={handleSubmitComment}>
                <input
                    ref={inputCommentRef}
                    type='text'
                    className='input_comment outline-none bg-gray-100 pl-4 pr-16 py-2 w-full rounded-lg'
                    placeholder={
                        comment ? `Reply comment's ${currentOwnerComment.username}...` : 'Write your comment...'
                    }
                    value={commentValue}
                    onChange={handlecommentValue}
                />
                <div
                    className={`flex gap-2 absolute right-2 top-1/2 -translate-y-1/2 z-[1000] ${
                        commentValue ? 'text-gray-700' : 'text-gray-300'
                    }`}
                >
                    <div>
                        <EmotionBtn setContent={setCommentValue} />
                    </div>
                    <button type='submit'>
                        <SendIcon />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default InputComment;
