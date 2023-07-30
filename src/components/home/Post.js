import CircularProgress from '@mui/material/CircularProgress';
import HeaderCard from './postCard/HeaderCard';
import BodyCard from './postCard/BodyCard';
import FooterCard from './postCard/FooterCard';

function Post({ auth, posts }) {
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
                    </div>
                ))
            )}
        </div>
    );
}

export default Post;
