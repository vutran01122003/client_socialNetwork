import HeaderCard from '../postCard/HeaderCard';
import BodyCard from '../postCard/BodyCard';
import FooterCard from '../postCard/FooterCard';

function PostCard({ auth, post, detailPost }) {
    return (
        <>
            <HeaderCard post={post} auth={auth} detailPost={detailPost} />
            <BodyCard post={post} />
            <FooterCard post={post} auth={auth} />
        </>
    );
}

export default PostCard;
