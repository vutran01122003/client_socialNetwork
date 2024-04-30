import { useDispatch } from 'react-redux';
import CommentItem from '../CommentItem';
import { getComments } from '../../../redux/actions/commentAction';
// import ShowMoreComment from '../ShowMoreComment';

function Comment({ post, auth, socket }) {
    const dispatch = useDispatch();

    const getMoreComments = ({ postId, commentQuantity }) => {
        dispatch(getComments({ postId, commentQuantity }));
    };
    return (
        <div className='comment_wrapper'>
            {post.comments.map((comment) => (
                <div key={comment._id} className='comment_item'>
                    <CommentItem comment={comment} auth={auth} post={post} socket={socket} />
                </div>
            ))}

            {post.comments.length > 1 && !post.isMaxComments && (
                <div
                    className='show_more_btn'
                    onClick={() => {
                        getMoreComments({
                            postId: post._id,
                            commentQuantity: post.comments.length
                        });
                    }}
                >
                    <span>View more comments</span>
                </div>
            )}
        </div>
    );
}

export default Comment;
