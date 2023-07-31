import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

function Status({ auth }) {
    const dispatch = useDispatch();

    const handleOpenModalPost = () => {
        dispatch({
            type: GLOBALTYPES.STATUS.OPEN_MODAL_HOME_POST
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
        </>
    );
}

export default Status;
