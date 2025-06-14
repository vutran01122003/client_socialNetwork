import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import millify from 'millify';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { likePost, savedPost, unSavedPost, unlikePost } from '../../../redux/actions/postAction';
import CommentCard from '../footer/CommentCard';
import UserModal from '../../modal/UserModal';
import PostDetailsModal from '../../modal/PostDetailsModal';

function FooterCard({ post, auth, socket, detailPost }) {
    const [postDetailsModal, setPostDetailsModal] = useState(false);
    const [likesPopup, setLikesPopup] = useState(false);
    const dispatch = useDispatch();

    const handleLike = () => {
        dispatch(likePost(post, auth.user, socket));
    };

    const handleUnlike = () => {
        dispatch(unlikePost(post, auth.user, socket));
    };

    const handleSavedPost = () => {
        dispatch(savedPost({ post: post, auth, socket }));
    };

    const handleUnSavedPost = () => {
        dispatch(unSavedPost({ post: post, auth }));
    };

    const handleTogglePostDetailsModal = () => {
        setPostDetailsModal((prev) => !prev);
    };

    return (
        <>
            {likesPopup && (
                <UserModal
                    modalInfo={{
                        title: 'Likes',
                        users: post.likes
                    }}
                    setPopup={setLikesPopup}
                    auth={auth}
                />
            )}
            <div className='footer_card select-none'>
                <div className='interactive_details flex justify-between text-gray-600'>
                    <div
                        onClick={() => {
                            setLikesPopup(true);
                        }}
                        className='likes_details cursor-pointer font-light hover:underline decoration-1'
                    >
                        {post.likes.length > 1 ? `${millify(post?.likes.length)} likes` : `${post?.likes.length} like`}
                    </div>
                    <div className='flex gap-3'>
                        <div className='cursor-pointer font-light hover:underline decoration-1'>
                            {post.numberOfComment > 1
                                ? `${millify(post.numberOfComment)} comments`
                                : `${post.numberOfComment} comment`}
                        </div>
                    </div>
                </div>
                <div className='interactive_icons_wrapper flex items-center text-gray-600 font-medium'>
                    {post.likes.find((user) => {
                        return user._id === auth.user?._id;
                    }) ? (
                        <div
                            onClick={handleUnlike}
                            className='active flex-1 text-center hover:bg-gray-100 rounded-md cursor-pointer transform active:scale-75 transition-transform'
                        >
                            <FavoriteIcon />
                            <span className='interactive_icon_name ml-2'>Like</span>
                        </div>
                    ) : (
                        <div
                            onClick={handleLike}
                            className=' flex-1 text-center hover:bg-gray-100 rounded-md cursor-pointer transform active:scale-75 transition-transform'
                        >
                            <FavoriteBorderIcon />
                            <span className='interactive_icon_name ml-2'>Like</span>
                        </div>
                    )}

                    {postDetailsModal && !detailPost && (
                        <PostDetailsModal
                            auth={auth}
                            post={post}
                            handleTogglePostDetailsModal={handleTogglePostDetailsModal}
                        />
                    )}

                    <div
                        onClick={handleTogglePostDetailsModal}
                        className='flex-1 text-center hover:bg-gray-100 rounded-md cursor-pointer'
                    >
                        <ChatBubbleOutlineOutlinedIcon />
                        <span className='interactive_icon_name ml-2'>Comments</span>
                    </div>

                    {post.saved.find((userId) => userId === auth.user?._id) ? (
                        <div
                            onClick={handleUnSavedPost}
                            className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'
                        >
                            <BookmarkIcon />
                            <span className='interactive_icon_name ml-2'>Save</span>
                        </div>
                    ) : (
                        <div
                            onClick={handleSavedPost}
                            className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'
                        >
                            <BookmarkBorderOutlinedIcon />
                            <span className='interactive_icon_name ml-2'>Save</span>
                        </div>
                    )}
                </div>
            </div>
            {detailPost && <CommentCard post={post} auth={auth} socket={socket} />}
        </>
    );
}

export default FooterCard;
