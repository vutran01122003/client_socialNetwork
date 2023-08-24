import Avatar from '../../Avatar';
import moment from 'moment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from '../../../redux/actions/postAction';

function HeaderCard({ post, auth, detailPost }) {
    const user = post.user;
    const dispatch = useDispatch();
    const [openMoreBtn, setOpenMoreBtn] = useState(false);

    const handleToggleMoreBtn = () => {
        setOpenMoreBtn((prev) => !prev);
    };

    const handleHideMoreBtn = () => {
        setOpenMoreBtn(false);
    };

    const handleOpenModalPost = () => {
        if (detailPost) {
            dispatch({
                type: GLOBALTYPES.STATUS.OPEN_MODAL_DETAIL_POST
            });
        } else {
            dispatch({
                type: GLOBALTYPES.STATUS.OPEN_MODAL_HOME_POST
            });
            dispatch({
                type: GLOBALTYPES.STATUS.CURRENT_EDIT_STATUS,
                payload: post
            });
        }
    };

    const handleRemovePost = () => {
        dispatch(deletePost({ post, auth }));

        if (detailPost) {
            window.location.reload();
        }
    };

    return (
        <div className='header_card flex items-center justify-between'>
            <div className='user_info flex  items-center'>
                <Link to={`/profile/${user._id}`}>
                    <Avatar avatar={user.avatar} size='small' />
                </Link>
                <div className='ml-2'>
                    <h3 className='header_username font-base text-xl font-medium hover:underline decoration-1'>
                        <Link to={`/profile/${user._id}`}>{user.username}</Link>
                    </h3>
                    <h4 className='created_at text-gray-500 text-sm'>
                        {moment(post.createdAt).fromNow()}
                    </h4>
                </div>
            </div>
            <Tippy
                placement='bottom-end'
                visible={openMoreBtn}
                onClickOutside={handleHideMoreBtn}
                interactive
                zIndex={999}
                render={(attrs) => (
                    <div className='more_wrapper select-none' tabIndex='-1' {...attrs}>
                        {auth.user?._id === user._id ? (
                            <>
                                <div
                                    className='more_item'
                                    onClick={() => {
                                        handleHideMoreBtn();
                                        handleOpenModalPost();
                                    }}
                                >
                                    <EditOutlinedIcon /> Edit post
                                </div>
                                <div
                                    className='more_item'
                                    onClick={() => {
                                        handleRemovePost();
                                        handleHideMoreBtn();
                                    }}
                                >
                                    <DeleteOutlineIcon /> Remove post
                                </div>
                            </>
                        ) : (
                            <div
                                className='more_item'
                                onClick={() => {
                                    handleHideMoreBtn();
                                }}
                            >
                                <ReportGmailerrorredIcon /> Report post
                            </div>
                        )}
                    </div>
                )}
            >
                <div onClick={handleToggleMoreBtn} className='more_horz_wrapper cursor-pointer'>
                    <MoreHorizIcon />
                </div>
            </Tippy>
        </div>
    );
}

export default HeaderCard;
