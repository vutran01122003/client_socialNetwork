import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import millify from 'millify';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    likePost,
    savedPost,
    unSavedPost,
    unlikePost
} from '../../../redux/actions/postAction';
import InputComment from '../postCard/InputComment';
import CommentCard from '../postCard/CommentCard';
import UserModal from '../../UserModal';

function FooterCard({ post, auth, socket }) {
    const [like, setLike] = useState(false);
    const [likesPopup, setLikesPopup] = useState(false);

    const dispatch = useDispatch();
    const inputCommentRef = useRef();

    const handleLike = () => {
        dispatch(likePost(post._id, auth.user, socket));
    };

    const handleUnlike = () => {
        dispatch(unlikePost(post._id, auth.user, socket));
    };

    const handleSavedPost = () => {
        dispatch(savedPost({ post: post, auth, user: post.user, socket }));
    };

    const handleUnSavedPost = () => {
        dispatch(unSavedPost({ post: post, auth }));
    };

    const handleScrollToInputComment = () => {
        inputCommentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    };

    useEffect(() => {
        const checkLiked = post.likes.find((user) => {
            return user._id === auth.user?._id;
        });
        setLike(!!checkLiked);
    }, [post.likes, auth.user?._id]);

    return (
        <>
            {likesPopup && (
                <UserModal
                    modalInfo={{
                        title: 'Likes',
                        users: post.likes
                    }}
                    setPopup={setLikesPopup}
                />
            )}

            <div className='footer_card select-none'>
                <div className='interactive_details flex justify-between text-gray-600'>
                    <div
                        onClick={() => {
                            setLikesPopup(true);
                        }}
                        className='likes_details cursor-pointer hover:underline decoration-1'
                    >
                        {post.likes.length > 1
                            ? `${millify(post.likes?.length)} likes`
                            : `${post.likes?.length} like`}
                    </div>
                    <div className='flex gap-3'>
                        <div
                            onClick={handleScrollToInputComment}
                            className='cursor-pointer hover:underline decoration-1'
                        >
                            {post.comments?.length > 1
                                ? `${millify(post.comments?.length)} comments`
                                : `${post.comments?.length} comment`}
                        </div>
                    </div>
                </div>
                <div className='interactive_icons_wrapper flex items-center text-gray-600 font-medium'>
                    {like ? (
                        <div
                            onClick={handleUnlike}
                            className='active flex-1 text-center hover:bg-gray-100 rounded-md cursor-pointer transform active:scale-75 transition-transform'
                        >
                            <FavoriteIcon />
                            <span className='interactive_icon_name ml-2'>
                                Like
                            </span>
                        </div>
                    ) : (
                        <div
                            onClick={handleLike}
                            className=' flex-1 text-center hover:bg-gray-100 rounded-md cursor-pointer transform active:scale-75 transition-transform'
                        >
                            <FavoriteBorderIcon />
                            <span className='interactive_icon_name ml-2'>
                                Like
                            </span>
                        </div>
                    )}

                    <div
                        onClick={handleScrollToInputComment}
                        className='flex-1 text-center hover:bg-gray-100 rounded-md cursor-pointer'
                    >
                        <ChatBubbleOutlineOutlinedIcon />
                        <span className='interactive_icon_name ml-2'>
                            Comments
                        </span>
                    </div>

                    {auth.user.saved.find(
                        (savedPost) => savedPost._id === post._id
                    ) ? (
                        <div
                            onClick={handleUnSavedPost}
                            className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'
                        >
                            <BookmarkIcon />
                            <span className='interactive_icon_name ml-2'>
                                UnSave
                            </span>
                        </div>
                    ) : (
                        <div
                            onClick={handleSavedPost}
                            className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'
                        >
                            <BookmarkBorderOutlinedIcon />
                            <span className='interactive_icon_name ml-2'>
                                Save
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <CommentCard post={post} auth={auth} socket={socket} />
            <InputComment
                inputCommentRef={inputCommentRef}
                post={post}
                auth={auth}
                socket={socket}
            />
        </>
    );
}

export default FooterCard;
