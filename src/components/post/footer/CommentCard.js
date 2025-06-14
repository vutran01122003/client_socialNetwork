import { useDispatch } from 'react-redux';
import CommentItem from './CommentItem';
import { getComments } from '../../../redux/actions/commentAction';
import { useState } from 'react';
// import ShowMoreComment from '../ShowMoreComment';

function Comment({ post, auth, socket }) {
    const dispatch = useDispatch();
    const [activeCommentId, setActiveCommentId] = useState(null);

    const getMoreComments = ({ postId, commentQuantity }) => {
        dispatch(getComments({ postId, commentQuantity }));
    };
    return (
        <div className='comment_wrapper'>
            {Object.keys(post?.comments).length > 0 &&
                Object.values(post.comments).map((comment) => (
                    <div key={comment?._id} className='comment_item'>
                        <CommentItem
                            activeCommentId={activeCommentId}
                            setActiveCommentId={setActiveCommentId}
                            comment={comment}
                            auth={auth}
                            post={post}
                            socket={socket}
                        />
                    </div>
                ))}

            {post.numberOfComment > 0 && !post?.isMaxComment && (
                <div
                    className='show_more_btn'
                    onClick={() => {
                        getMoreComments({
                            postId: post._id,
                            commentQuantity: Object.keys(post.comments).length,
                            limit: 10
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
