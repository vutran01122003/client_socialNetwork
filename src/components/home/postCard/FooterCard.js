import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { likePost, unlikePost } from '../../../redux/actions/postAction';

function FooterCard({ post, auth }) {
    const [like, setLike] = useState(false);
    const dispatch = useDispatch();

    const handleLike = () => {
        dispatch(likePost(post._id, auth.user));
    };

    const handleUnlike = () => {
        dispatch(unlikePost(post._id, auth.user));
    };

    useEffect(() => {
        const checkLiked = post.likes.find((user) => {
            return user._id === auth.user?._id;
        });
        setLike(!!checkLiked);
    }, [post.likes, auth.user?._id]);

    return (
        <div className='footer_card select-none'>
            <div className='interactive_details flex justify-between text-gray-600 py-1'>
                <div className='likes_details cursor-pointer hover:underline decoration-1'>
                    {post.likes.length} likes
                </div>
                <div className='flex gap-3'>
                    <div className='cursor-pointer hover:underline decoration-1'>
                        {post.comments.length} comments
                    </div>
                    <div className='cursor-pointer hover:underline decoration-1'>
                        {post.comments.length} save
                    </div>
                </div>
            </div>
            <div className='interactive_icons_wrapper flex items-center text-gray-600 font-medium'>
                {like ? (
                    <div
                        onClick={handleUnlike}
                        className='active flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer transform active:scale-75 transition-transform'
                    >
                        <FavoriteIcon />
                        <span className='interactive_icon_name ml-2'>Like</span>
                    </div>
                ) : (
                    <div
                        onClick={handleLike}
                        className=' flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer transform active:scale-75 transition-transform'
                    >
                        <FavoriteBorderIcon />
                        <span className='interactive_icon_name ml-2'>Like</span>
                    </div>
                )}

                <div className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'>
                    <ChatBubbleOutlineOutlinedIcon />
                    <span className='interactive_icon_name ml-2'>Comments</span>
                </div>

                <div className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'>
                    <BookmarkBorderOutlinedIcon />
                    <span className='interactive_icon_name ml-2'>Save</span>
                </div>
            </div>
        </div>
    );
}

export default FooterCard;
