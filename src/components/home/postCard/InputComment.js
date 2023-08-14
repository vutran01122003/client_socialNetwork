import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment } from '../../../redux/actions/commentAction';
import SendIcon from '@mui/icons-material/Send';
import EmotionBtn from '../../EmotionBtn';

function InputComment({ inputCommentRef, post, auth, comment, socket }) {
    const [commentValue, setCommentValue] = useState('');
    const dispatch = useDispatch();

    const handlecommentValue = (e) => {
        e.preventDefault();
        setCommentValue(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (commentValue) {
            await dispatch(
                createComment({
                    post,
                    commentId: comment?._id,
                    user: auth?.user,
                    content: commentValue,
                    socket
                })
            );
            setCommentValue('');
        }
        return;
    };

    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         handleSubmitComment(e);
    //     }
    // };

    return (
        <div className='input_comment_wrapper p-2'>
            <form className='flex relative' onSubmit={handleSubmitComment}>
                <input
                    ref={inputCommentRef}
                    type='text'
                    className='input_comment outline-none bg-gray-100 pl-4 pr-16 py-2 w-full rounded-lg'
                    placeholder={comment ? 'write your reply...' : 'write your comment...'}
                    value={commentValue}
                    onChange={handlecommentValue}
                    // onKeyDown={handleKeyDown}
                />
                <div
                    className={`flex gap-2 absolute right-2 top-1/2 -translate-y-1/2 ${
                        commentValue ? 'text-gray-700' : 'text-gray-300'
                    }`}
                >
                    <div>
                        <EmotionBtn setContent={setCommentValue}/>
                    </div>
                    <button>
                        <SendIcon />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default InputComment;
