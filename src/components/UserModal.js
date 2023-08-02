import { themSelector } from '../redux/selector';
import { useSelector } from 'react-redux';
import Account from './Account';

function UserModal({ modalInfo, setPopup }) {
    const theme = useSelector(themSelector);

    return (
        <div
            className={`${theme === true ? 'bg-white/75' : ''} modal_wrapper`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    setPopup(false);
                }
            }}
        >
            <div className='modal_container'>
                <div>
                    <h1 className='model_title flex w-full justify-center font-bold'>
                        {modalInfo.title}
                    </h1>
                    <button
                        onClick={() => {
                            setPopup(false);
                        }}
                        className='absolute top-0 right-2 text-gray-400 text-3xl hover:text-red-500 font-semibold transition linear'
                    >
                        &times;
                    </button>
                </div>

                <div className='user_wrapper flex-1 relative'>
                    {modalInfo.users.length === 0 && (
                        <div className='font-semibold text-base w-full h-full flex justify-center items-center'>
                            <span>{`0 ${modalInfo.title}`}</span>
                        </div>
                    )}
                    {modalInfo.users.map((user) => (
                        <Account
                            className='follow_user'
                            key={user._id}
                            username={user.username}
                            fullname={user.fullname}
                            avatar={user.avatar}
                            id={user._id}
                            onClick={() => {
                                setPopup(false);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserModal;
