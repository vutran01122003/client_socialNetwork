import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { themSelector } from '../redux/selector';
import { checkImageUpload } from '../utils/uploadImage';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { useRef, useState } from 'react';

function ModalPost({ handleHideModalPost, auth }) {
    const theme = useSelector(themSelector);
    const inputRef = useRef();
    const videoRef = useRef();
    const canvasRef = useRef();
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const [openVideo, setOpenVideo] = useState(false);
    const [stream, setStream] = useState(null);

    const handleClearImages = () => {
        setImages([]);
        if (inputRef.current !== null) inputRef.current.value = '';
    };

    const handleStopCamera = (stream) => {
        setOpenVideo(false);
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    };

    const handleOpenCamera = async () => {
        setOpenVideo(true);
        try {
            let stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            setStream(stream);
            if (videoRef.current !== null) videoRef.current.srcObject = stream;
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error
                }
            });
        }
    };

    const handleInsertImages = (e) => {
        const files = [...e.target.files];
        const newImages = [];
        files.forEach((file) => {
            const { inValid, msg } = checkImageUpload(file);
            if (inValid) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: msg
                    }
                });
            } else {
                newImages.push(file);
            }
        });
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleCaptureCamera = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const width = video.clientWidth;
        const height = video.clientHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        let image_data_url = canvas.toDataURL('image/jpeg');

        setImages((prev) => [...prev, { imgCamera: image_data_url }]);
    };

    return (
        <div
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    if (stream) handleStopCamera(stream);
                    handleHideModalPost();
                }
            }}
            className={`${theme === true ? 'bg-white/75' : ''} post_modal`}
        >
            <form className='post_form overflow-auto'>
                <div className='post_title relative'>
                    <h1 className='text-center font-bold text-xl'>
                        Create Post
                    </h1>
                    <div
                        onClick={() => {
                            if (stream) handleStopCamera(stream);
                            handleHideModalPost();
                        }}
                        className='post_close_btn hover:text-red-500'
                    >
                        <CloseIcon fontSize='small' />
                    </div>
                </div>

                <textarea
                    className='post_textarea w-full outline-none overflow-auto'
                    placeholder={`What's on your mind, ${auth.user?.username}?`}
                ></textarea>
                {openVideo && (
                    <div className='camera_wrapper'>
                        <video autoPlay muted ref={videoRef} />
                        <canvas ref={canvasRef} hidden />
                    </div>
                )}

                {images.length > 0 && (
                    <div className='show_images'>
                        <div className='images_wrapper relative'>
                            <div className='absolute top-5 right-2 post_close_btn hover:text-red-500'>
                                <CloseIcon
                                    onClick={handleClearImages}
                                    fontSize='small'
                                />
                            </div>
                            {images.map((image, index) => (
                                <img
                                    src={
                                        image?.imgCamera ||
                                        URL.createObjectURL(image)
                                    }
                                    key={index}
                                    alt='pre_image'
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className='more_btn_wrapper'>
                    <div className='icons_btn_wrapper relative'>
                        {openVideo ? (
                            <>
                                <ArrowBackIcon
                                    onClick={() => {
                                        handleStopCamera(stream);
                                    }}
                                    className='text-gray-500 hover:text-black close_camera_btn'
                                    fontSize='large'
                                />
                                <label className='absolute left-1/2 -translate-x-1/2 block p-1 rounded-full hover:bg-gray-200 transition linear'>
                                    <PhotoCameraIcon
                                        onClick={handleCaptureCamera}
                                        fontSize='large'
                                    />
                                </label>
                            </>
                        ) : (
                            <>
                                <span className='font-semibold text-base whitespace-nowrap'>
                                    Add to your post
                                </span>
                                <div className='icons_wrapper flex gap-3 items-center'>
                                    <label
                                        htmlFor='insert_image'
                                        className='icon-item'
                                    >
                                        <ImageIcon sx={{ color: '#50C878' }} />
                                    </label>

                                    <label className='icon-item'>
                                        <PhotoCameraIcon
                                            onClick={handleOpenCamera}
                                        />
                                    </label>

                                    <label className='icon-item'>
                                        <InsertEmoticonIcon
                                            sx={{ color: '#FFC000' }}
                                        />
                                    </label>
                                    <input
                                        id='insert_image'
                                        type='file'
                                        ref={inputRef}
                                        multiple
                                        accept='image/*'
                                        onChange={handleInsertImages}
                                        hidden
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className='post_btn_wrapper'>
                        <button className='post_btn'>Post</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ModalPost;