import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import { getPost } from '../../redux/actions/postAction';
import HeaderCard from './postCard/HeaderCard';
import BodyCard from './postCard/BodyCard';
import FooterCard from './postCard/FooterCard';

function Post() {
    const auth = useSelector(authSelector);
    const posts = useSelector((state) => state.homePost);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPost({ id: auth.user._id }));
        // eslint-disable-next-line
    }, [posts.result]);

    return (
        <div className='post_wrapper wrapper'>
            {posts.loading ? (
                <CircularProgress />
            ) : posts.result === 0 ? (
                <h3 className='font-semibold mt-2'>NO POSTS</h3>
            ) : (
                posts.posts.map((post) => (
                    <div key={post._id} className='post_item'>
                        <HeaderCard post={post} />
                        <BodyCard post={post} />
                        <FooterCard post={post} />
                    </div>
                ))
            )}
        </div>
    );
}

export default Post;
