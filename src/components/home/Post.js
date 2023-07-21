import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import { getPost } from '../../redux/actions/postAction';

function Post() {
    const auth = useSelector(authSelector);
    const posts = useSelector((state) => state.homePost);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPost({ id: auth.user._id }));
    }, []);

    return (
        <div className='post_wrapper wrapper'>
            {posts.loading ? (
                <CircularProgress />
            ) : posts.result === 0 ? (
                <h3 className='font-semibold mt-2'>NO POSTS</h3>
            ) : (
                <>Post</>
            )}
        </div>
    );
}

export default Post;
