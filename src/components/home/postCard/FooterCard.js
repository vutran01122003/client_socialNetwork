import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

function FooterCard({ post }) {
    return (
        <div className='footer_card'>
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
                <div className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'>
                    <FavoriteBorderIcon />
                    <span className='ml-2'>Like</span>
                </div>
                <div className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'>
                    <ChatBubbleOutlineOutlinedIcon />
                    <span className='ml-2'>Comments</span>
                </div>

                <div className='flex-1 text-center hover:bg-gray-100 rounded-md p-1 cursor-pointer'>
                    <BookmarkBorderOutlinedIcon />
                    <span className='ml-2'>Save</span>
                </div>
            </div>
        </div>
    );
}

export default FooterCard;
