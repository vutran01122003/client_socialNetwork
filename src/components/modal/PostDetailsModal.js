import { useEffect, useRef } from 'react';
import PostCard from '../home/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getComments } from '../../redux/actions/commentAction';
import { postSelector, socketSelector } from '../../redux/selector';
import CloseIcon from '@mui/icons-material/Close';
import InputComment from '../post/footer/InputComment';

function PostDetailsModal({ post, auth, handleTogglePostDetailsModal }) {
    const dispatch = useDispatch();
    const postsData = useSelector(postSelector);
    const socket = useSelector(socketSelector);
    const postRef = useRef();

    const scrollToLastComment = () => {
        setTimeout(() => {
            const postElement = postRef?.current;
            postElement.scrollTop = postElement.scrollHeight - postElement.offsetHeight;
        }, 100);
    };

    useEffect(() => {
        if (!postsData.posts[post._id]?.comments || postsData.posts[post._id]?.isMaxComment) return;
        const numOfComments = Object.keys(postsData.posts[post._id].comments).length;
        if (numOfComments === 0) {
            dispatch(
                getComments({
                    postId: post._id,
                    commentQuantity: numOfComments,
                    limit: 10
                })
            );
        }
    }, [dispatch, postsData.posts, post._id]);

    return (
        <div
            className='post_details_modal'
            onMouseDown={(e) => {
                if (e.currentTarget === e.target) handleTogglePostDetailsModal();
            }}
        >
            <div className='post_details_header'>
                <h2>{`${auth.user.fullname}'s Post`}</h2>
                <button className='closeBtn' onClick={handleTogglePostDetailsModal}>
                    <CloseIcon />
                </button>
            </div>
            <div ref={postRef} className='post_details_wrapper'>
                <div className='post_details_body'>
                    <PostCard post={post} auth={auth} detailPost={true} />
                </div>
            </div>
            <div className='post_details_comment'>
                <InputComment post={post} auth={auth} socket={socket} scrollToLastComment={scrollToLastComment} />
            </div>
        </div>
    );
}

export default PostDetailsModal;
