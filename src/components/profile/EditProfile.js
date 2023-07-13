import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import EditIcon from '@mui/icons-material/Edit';
import checkImageUpload from '../../utils/checkImageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

function Edit({ setEdit }) {
    const auth = useSelector(authSelector);
    const [userData, setUserData] = useState(auth.user);
    const [avatar, setAvatar] = useState(userData.avatar);
    const refInput = useRef();
    const { fullname, username, website, story, gender } = userData;
    const dispatch = useDispatch();

    const handleUserData = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function loadURLToInputFiled(url) {
        getImgURL(url, (imgBlob) => {
            // Load img blob to input
            // WIP: UTF8 character error
            let fileName = 'hasFilename.jpg';
            let file = new File(
                [imgBlob],
                fileName,
                { type: 'image/jpeg', lastModified: new Date().getTime() },
                'utf-8'
            );
            let container = new DataTransfer();
            container.items.add(file);
            refInput.current.files = container.files;
        });
    }

    function getImgURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            callback(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const handleFile = (e) => {
        const file = e.target.files[0];
        const { inValid, msg } = checkImageUpload(file);

        if (inValid && file) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: msg
                }
            });
            loadURLToInputFiled(auth.user.avatar);
        }

        if (file && !inValid) {
            const imgURL = URL.createObjectURL(file);
            setAvatar(imgURL);
        }
    };

    return (
        <div className='edit_wrapper '>
            <div className=''>
                <form className='edit_container relative bg-gray-100 p-5 rounded-md mt-10'>
                    <button
                        onClick={() => {
                            setEdit(false);
                        }}
                        className='absolute top-0 right-2 text-gray-400 text-3xl hover:text-red-500 font-semibold transition linear'
                    >
                        &times;
                    </button>
                    <h1 className='title flex w-full justify-center font-bold mb-4'>
                        Edit Profile
                    </h1>
                    <div className='profile_image flex w-full justify-center'>
                        <div className='img_wrapper relative'>
                            <img
                                src={avatar}
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
                                value={fullname}
                                onChange={handleUserData}
                            />
                            <span
                                className={`${
                                    fullname.length > 30
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                } absolute block right-2 top-1/2 count_letter -translate-y-1/2`}
                            >{`${fullname.length}/30`}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Username: </label>
                        <div className='input_wrapper relative'>
                            <input
                                name='username'
                                className='outline-none border border-gray rounded-md w-full py-2 px-4'
                                type='text'
                                value={username}
                                onChange={handleUserData}
                            />
                            <span
                                className={`${
                                    username.length > 30
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                } absolute block right-2 top-1/2 count_letter -translate-y-1/2`}
                            >{`${username.length}/30`}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Website: </label>
                        <input
                            name='website'
                            className='outline-none border border-gray rounded-md w-full py-2 px-4'
                            type='text'
                            value={website}
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
                                value={story}
                                onChange={handleUserData}
                            />
                            <span
                                className={`${
                                    story.length > 200
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                } absolute count_letter block right-2 bottom-0 -translate-y-1/2`}
                            >{`${story.length}/200`}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block p-2'>Gender: </label>
                        <select
                            className='outline-none border border-gray rounded-md w-full py-2 px-4'
                            value={gender}
                            onChange={handleUserData}
                            name='gender'
                        >
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>
                    <button className='w-full mt-5 py-3 px-8 bg-blue-600 font-bold text-white rounded-md transform active:scale-95'>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Edit;
