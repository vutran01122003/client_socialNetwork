import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import MultipleImageIcon from '../icon/MultipleImageIcon';

function PostsThumb({ posts }) {
    return (
        <div className='user_posts'>
            {posts.map((post) => (
                <div key={post._id} className='post_thumb_item'>
                    <div className='post_thumb_item_height'></div>
                    <Link
                        to={`/post/${post._id}`}
                        className='post_thumb_item_img'
                    >
                        <img
                            src={
                                post.images[0]?.url ??
                                'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg'
                            }
                            alt='image_thumb'
                        />
                        <div className='post_thumb_item_info flex'>
                            <div className='post_thumb_item_info_icon'>
                                <FavoriteIcon />
                                <span className='post_thumb_item_info_num'>
                                    {post.likes?.length}
                                </span>
                            </div>
                            <div className='post_thumb_item_info_icon'>
                                <ModeCommentIcon />
                                <span className='post_thumb_item_info_num'>
                                    {post.comments?.length}
                                </span>
                            </div>
                            {post.images.length > 1 && (
                                <div className='mul_img_wrapper'>
                                    <MultipleImageIcon />
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default PostsThumb;