import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment } from '../../../redux/actions/postAction';
import SendIcon from '@mui/icons-material/Send';

function InputComment({ post, auth }) {
    const [commentValue, setCommentValue] = useState('');
    const dispatch = useDispatch();

    const handlecommentValue = (e) => {
        setCommentValue(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (commentValue) {
            await dispatch(
                createComment({
                    postId: post._id,
                    user: auth.user,
                    content: commentValue
                })
            );
            setCommentValue('');
        }
        return;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmitComment(e);
        }
    };

    return (
        <div className='p-2'>
            <form className='flex relative' onSubmit={handleSubmitComment}>
                <input
                    type='text'
                    className='outline-none bg-gray-100 pl-4 pr-10 py-2 w-full rounded-lg'
                    placeholder='write your comment...'
                    value={commentValue}
                    onChange={handlecommentValue}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        commentValue ? 'text-gray-700' : 'text-gray-300'
                    }`}
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
}

export default InputComment;