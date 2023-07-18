import { useSelector } from 'react-redux';
import { profileSelector, themSelector } from '../redux/selector';
import Account from '../components/Account';

function FollowInfo({ audience, setAudience }) {
    const theme = useSelector(themSelector);

    return (
        <div
            className={`${theme === true ? 'bg-white/75' : ''} follow_wrapper`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    setAudience(null);
                }
            }}
        >
            <div className='follow_container'>
                <div>
                    <h1 className='title flex w-full justify-center font-bold mb-2'>
                        {audience.title}
                    </h1>
                    <button
                        onClick={() => {
                            setAudience(null);
                        }}
                        className='absolute top-0 right-2 text-gray-400 text-3xl hover:text-red-500 font-semibold transition linear'
                    >
                        &times;
                    </button>
                </div>

                <div className='user_wrapper flex-1 relative'>
                    {audience.users.length === 0 && (
                        <div className='font-semibold text-base w-full h-full flex justify-center items-center'>
                            <span>{`No ${audience.title}`}</span>
                        </div>
                    )}
                    {audience.users.map((user) => (
                        <Account
                            className='follow_user'
                            key={user._id}
                            username={user.username}
                            fullname={user.fullname}
                            avatar={user.avatar}
                            id={user._id}
                            onClick={() => {
                                setAudience(null);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FollowInfo;
