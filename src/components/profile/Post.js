import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPost } from '../../redux/actions/profileActions';
import { profileSelector } from '../../redux/selector';
import { CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import MultipleImageIcon from '../icon/MultipleImageIcon';

function Post({ userInfo, auth, id }) {
    const dispatch = useDispatch();
    const profile = useSelector(profileSelector);
    const [userPosts, setUserPosts] = useState({});

    useEffect(() => {
        if (
            !profile.posts.some(
                (post) => post.userId === id && JSON.stringify(userPosts)
            )
        ) {
            dispatch(getUserPost({ id }));
        }

        if (profile.posts.length > 0) {
            const postsData = profile.posts.find(
                (posts) => posts.userId === id
            );

            if (postsData) setUserPosts(postsData);
        }
        // eslint-disable-next-line
    }, [id, profile.posts, dispatch]);

    if (profile.loading && !userPosts) return <CircularProgress />;
    if (userPosts?.posts)
        return (
            <div className='user_posts_wrapper'>
                <div className='user_posts'>
                    {userPosts.posts.map((post) => (
                        <div key={post._id} className='post_thumb_item'>
                            <div className='post_thumb_item_height'></div>
                            <div className='post_thumb_item_img'>
                                <img
                                    src={
                                        post.images[0]?.url ??
                                        'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg'
                                    }
                                    alt='image_thumb'
                                />
                                <div className='post_thumb_item_info flex'>
                                    <div className='post_thumb_item_info_icon'>
                                        <FavoriteIcon />{' '}
                                        <span className='post_thumb_item_info_num'>
                                            {post.likes?.length}
                                        </span>
                                    </div>
                                    <div className='post_thumb_item_info_icon'>
                                        <ModeCommentIcon />{' '}
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
}

export default Post;
