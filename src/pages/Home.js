import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../components/home/Post';
import ModalPost from '../components/home/ModalPost';
import Status from '../components/home/Status';
import { authSelector, postSelector } from '../redux/selector';
import { getPosts } from '../redux/actions/postAction';
import { statusSelector } from '../redux/selector';

function Home() {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const { openModalHomePost, currentPost } = useSelector(statusSelector);
    const posts = useSelector(postSelector);

    useEffect(() => {
        dispatch(getPosts({ id: auth.user?._id }));
    }, [auth.user, dispatch]);

    return (
        <div className='home'>
            <Status auth={auth} />
            <Post auth={auth} posts={posts} />
            {openModalHomePost && (
                <ModalPost auth={auth} currentPost={currentPost} />
            )}
        </div>
    );
}

export default Home;
