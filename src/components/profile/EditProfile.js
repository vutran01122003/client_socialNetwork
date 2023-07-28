import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, themSelector } from '../../redux/selector';
import EditIcon from '@mui/icons-material/Edit';
import { checkImageUpload, loadURLToInputFiled } from '../../utils/uploadImage';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { updateUser } from '../../redux/actions/profileActions';

function Edit({ setOnEdit }) {
    const refInput = useRef();
    const theme = useSelector(themSelector);
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const [fileInput, setFileInput] = useState(null);
    const { avatar, fullname, username, website, story, gender } = auth.user;
    const originUserData = {
        fullname,
        username,
        website,
        story,
        gender
    };
    const [userData, setUserData] = useState({
        fullname,
        username,
        website,
        story,
        gender
    });
    const [avatarProfile, setAvatarProfile] = useState(avatar);
    const formData = new FormData();

    const handleUserData = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            JSON.stringify(originUserData) === JSON.stringify(userData) &&
            !fileInput
        ) {
            setOnEdit(false);
            return;
        }

        e.preventDefault();
        dispatch(updateUser({ auth, fileInput, formData, userData }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        const { inValid, msg } = checkImageUpload(file);

        if (inValid && file) {
            setFileInput(null);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: msg
                }
            });
            // Set Default avatar when an error occurred
            loadURLToInputFiled(auth.user?.avatar, refInput.current);
        }

        if (file && !inValid) {
            const imgURL = URL.createObjectURL(file);
            setAvatarProfile(imgURL);
            setFileInput(file);
        }
    };

    return (
        <div
            className={`${theme === true ? 'bg-white/75' : ''} edit_wrapper`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    setOnEdit(false);
                }
            }}
        >
            <div>
                <form
                    onSubmit={handleSubmit}
                    className='edit_container relative bg-gray-100 p-5 rounded-md mt-10'
                >
                    <button
                        onClick={() => {
                            setOnEdit(false);
                        }}
                        className='edit_close_btn absolute top-0 right-2 text-gray-400 text-3xl hover:text-red-500 font-semibold transition linear'
                    >
                        &times;
                    </button>
                    <h1 className='title flex w-full justify-center font-bold mb-4'>
                        Edit Profile
                    </h1>
                    <div className='profile_image flex w-full justify-center'>
                        <div className='img_wrapper relative'>
                            <img
                                src={avatarProfile}
                                alt='avatar'
                                className='medium rounded-full border border-black object-cover object-center'
                            />
                            <label
                                htmlFor='avatar'
                                className='block absolute bottom-0 right-0 bg-black/60 hover:bg-black/70 transition linear rounded-full w-8 h-8 flex items-center justify-center cursor-pointer'
                            >
                                <EditIcon
                                    fontSize='small'
                                    className='text-white'
                                />
                            </label>
                        </div>
                        <input
                            type='file'
                            accept='image/jpg, image/png, image/jpeg ,image/gif'
                            id='avatar'
                            onChange={handleFile}
                            hidden
                            ref={refInput}
                        />
                    </div>
                    <div className='mb-4 mt-2'>
                        <label className='block p-2'>Fullname: </label>
                        <div className='input_wrapper relative'>
                            <input
                                name='fullname'
                                className='outline-none border border-gray rounded-md w-full py-2 px-4'
                                type='text'
                                value={userData.fullname}
                                onChange={handleUserData}
                            />
                            <span
                                className={`${
                                    userData.fullname.length > 30
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                } absolute block right-2 top-1/2 count_letter -translate-y-1/2`}
                            >{`${userData.fullname.length}/30`}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Username: </label>
                        <div className='input_wrapper relative'>
                            <input
                                name='username'
                                className='outline-none border border-gray rounded-md w-full py-2 px-4'
                                type='text'
                                value={userData.username.trim()}
                                onChange={handleUserData}
                            />
                            <span
                                className={`${
                                    userData.username.length > 30
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                } absolute block right-2 top-1/2 count_letter -translate-y-1/2`}
                            >{`${userData.username.length}/30`}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Website: </label>
                        <input
                            name='website'
                            className='outline-none border border-gray rounded-md w-full py-2 px-4'
                            type='text'
                            value={userData.website}
                            onChange={handleUserData}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Story: </label>
                        <div className='textarea_wrapper relative'>
                            <textarea
                                rows='4'
                                name='story'
                                className='story_textarea block outline-none border border-gray rounded-md p-2 w-full'
                                placeholder='Write your story here...'
                                value={userData.story}
                                onChange={handleUserData}
                            />
                            <span
                                className={`${
                                    userData.story.length > 200
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                } absolute count_letter block right-2 bottom-0 -translate-y-1/2`}
                            >{`${userData.story.length}/200`}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Gender: </label>
                        <select
                            className='outline-none border border-gray rounded-md w-full py-2 px-4'
                            value={userData.gender}
                            onChange={handleUserData}
                            name='gender'
                        >
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>
                    <button className='save_edit_btn w-full mt-5 py-3 px-8 bg-blue-600 font-bold text-white rounded-md transform active:scale-95'>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Edit;
