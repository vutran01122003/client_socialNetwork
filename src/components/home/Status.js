import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import Avatar from '../Avatar';
import { useState } from 'react';
import ModalPost from '../ModalPost';

function Status() {
    const auth = useSelector(authSelector);
    const [openModalPost, setOpenModalPost] = useState(false);

    const handleOpenModalPost = () => {
        setOpenModalPost(true);
    };

    const handleHideModalPost = () => {
        setOpenModalPost(false);
    };

    return (
        <>
            <div className='status_wrapper wrapper flex gap-2'>
                <Avatar avatar={auth.user.avatar} size='small' />
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
                />
            )}
        </>
    );
}

export default Status;
