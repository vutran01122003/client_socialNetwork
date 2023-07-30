import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import ModalPost from './ModalPost';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { statusSelector } from '../../redux/selector';

function Status({ auth }) {
    const status = useSelector(statusSelector);
    const openModalPost = status.open;
    const dispatch = useDispatch();

    const handleOpenModalPost = () => {
        dispatch({
            type: GLOBALTYPES.STATUS.OPEN_MODAL
        });
    };

    const handleHideModalPost = () => {
        dispatch({
            type: GLOBALTYPES.STATUS.HIDE_MODAL
        });
    };

    return (
        <>
            <div className='status_wrapper wrapper flex gap-2'>
                <Link to={`/profile/${auth.user?._id}`}>
                    <Avatar avatar={auth.user?.avatar} size='small' />
                </Link>
                <button
                    onClick={handleOpenModalPost}
                    className='btn_status_popup'
                >
                    What's on your mind, {auth.user?.username}?
                </button>
            </div>
            {openModalPost && (
                <ModalPost
                    handleHideModalPost={handleHideModalPost}
                    auth={auth}
                    status={status}
                />
            )}
        </>
    );
}

export default Status;
