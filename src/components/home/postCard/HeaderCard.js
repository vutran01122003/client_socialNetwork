import Avatar from '../../Avatar';
import moment from 'moment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from 'react-router-dom';

function HeaderCard({ post }) {
    const user = post.user;
    const [openMoreBtn, setOpenMoreBtn] = useState(false);

    const handleToggleMoreBtn = () => {
        setOpenMoreBtn((prev) => !prev);
    };
    const handleHideMoreBtn = () => {
        setOpenMoreBtn(false);
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
                render={(attrs) => (
                    <div className='more_wrapper' tabIndex='-1' {...attrs}>
                        <div className='more_item'>
                            <EditOutlinedIcon /> Edit post
                        </div>
                        <div className='more_item'>
                            <DeleteOutlineIcon /> Remove post
                        </div>
                    </div>
                )}
            >
                <div
                    onClick={handleToggleMoreBtn}
                    className='more_horz_wrapper'
                >
                    <MoreHorizIcon />
                </div>
            </Tippy>
        </div>
    );
}

export default HeaderCard;
