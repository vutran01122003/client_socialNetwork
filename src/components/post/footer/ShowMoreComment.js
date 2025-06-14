import { getComments, getReplies } from '../../../redux/actions/commentAction';
import { useDispatch } from 'react-redux';

function ShowMoreComment({ postId, commentQuantity, replyQuantity, commentId, isReply }) {
    const dispatch = useDispatch();

    const getMoreComments = () => {
        dispatch(getComments({ postId, commentQuantity }));
    };

    const getMoreReplies = () => {
        dispatch(getReplies({ postId, commentId, replyQuantity, limit: 10 }));
    };

    return (
        <div
            className='show_more_btn'
            onClick={() => {
                isReply ? getMoreReplies() : getMoreComments();
            }}
        >
            <span>{isReply ? 'See more replies' : 'See more comment'}</span>
        </div>
    );
}

export default ShowMoreComment;
