import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../redux/selector';
import Post from '../components/home/Post';
import Status from '../components/home/Status';
import { getPost } from '../redux/actions/postAction';

function Home() {
    const auth = useSelector(authSelector);
    const posts = useSelector((state) => state.homePost);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPost({ id: auth.user?._id }));
    }, [auth.user, dispatch]);

    return (
        <div className='home'>
            <Status auth={auth} />
            <Post auth={auth} posts={posts} />
        </div>
    );
}

export default Home;
