import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import { getPost } from '../../redux/actions/postAction';
import HeaderCard from './postCard/HeaderCard';
import BodyCard from './postCard/BodyCard';
import FooterCard from './postCard/FooterCard';
import InputComment from './postCard/InputComment';
import CommentCard from './postCard/CommentCard';

function Post() {
    const auth = useSelector(authSelector);
    const posts = useSelector((state) => state.homePost);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPost({ id: auth.user?._id }));
    }, [posts.result, auth.user?._id, dispatch]);

    return (
        <div className='post_wrapper wrapper'>
            {posts.loading ? (
                <CircularProgress />
            ) : posts.result === 0 ? (
                <h3 className='font-semibold mt-2'>NO POSTS</h3>
            ) : (
                posts.posts.map((post) => (
                    <div key={post._id} className='post_item'>
                        <HeaderCard post={post} auth={auth} />
                        <BodyCard post={post} />
                        <FooterCard post={post} auth={auth} />
                        <CommentCard post={post} auth={auth} />
                        <InputComment post={post} auth={auth} />
                    </div>
                ))
            )}
        </div>
    );
}

export default Post;
