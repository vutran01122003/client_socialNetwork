import HeaderCard from '../postCard/HeaderCard';
import BodyCard from '../postCard/BodyCard';
import FooterCard from '../postCard/FooterCard';
import { socketSelector } from '../../../redux/selector';
import { useSelector } from 'react-redux';

function PostCard({ auth, post, detailPost }) {
    const socket = useSelector(socketSelector);

    return (
        <>
            <HeaderCard post={post} auth={auth} detailPost={detailPost} />
            <BodyCard post={post} />
            <FooterCard post={post} auth={auth} socket={socket} />
        </>
    );
}

export default PostCard;
