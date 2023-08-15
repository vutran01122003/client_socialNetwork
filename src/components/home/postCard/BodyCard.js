import Carousel from './Carousel';
import Content from '../../Content';

function BodyCard({ post, messagePage }) {
    return (
        <div className={messagePage ? 'body_card_message' : 'body_card'}>
            <div className='body_content'>
                <Content content={post.content} limit={200} />
            </div>
            {post.files?.length > 0 && (
                <div className='carousel_wrapper'>
                    <Carousel post={post} />
                </div>
            )}
        </div>
    );
}

export default BodyCard;
