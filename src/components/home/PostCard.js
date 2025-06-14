import HeaderCard from '../post/header/HeaderCard';
import BodyCard from '../post/body/BodyCard';
import FooterCard from '../post/footer/FooterCard';
import { socketSelector } from '../../redux/selector';
import { useSelector } from 'react-redux';

function PostCard({ auth, post, detailPost }) {
    const socket = useSelector(socketSelector);
    return (
        <div className='relative h-full'>
            <HeaderCard post={post} auth={auth} detailPost={detailPost} />
            <BodyCard post={post} />
            <FooterCard post={post} auth={auth} socket={socket} detailPost={detailPost} />
        </div>
    );
}

export default PostCard;
