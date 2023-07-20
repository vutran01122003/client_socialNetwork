import { Link } from 'react-router-dom';
import Avatar from './Avatar';

function Account({ avatar, fullname, username, id, onClick }) {
    return (
        <Link
            to={`/profile/${id}`}
            className='avatar w-full flex gap-2 p-2 items-center bg-white hover:bg-gray-100'
            onClick={onClick}
        >
            <div className='w-10 h-10'>
                <Avatar avatar={avatar} size='small' />
            </div>
            <div className='user_description text-black flex-1'>
                <h3 className='font-bold text-slate-700'>{username}</h3>
                <p className='font-light text-gray-500'>{fullname}</p>
            </div>
        </Link>
    );
}

export default Account;
