import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { socketSelector } from '../../redux/selector';
import { checkImageUpload, checkVideoUpload } from '../../utils/uploadFile';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useEffect, useRef, useState } from 'react';
import { createPost, updatePost } from '../../redux/actions/postAction';
import EmotionBtn from '../EmotionBtn';
import readFile from '../../utils/readFile';
import { createMessage } from '../../redux/actions/messageAction';

function ModalPost({ auth, currentPost, detailPost, messageInput, message, scrollToBottom }) {
    const socket = useSelector(socketSelector);

    const inputRef = useRef();
    const videoRef = useRef();
    const canvasRef = useRef();
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const [openVideo, setOpenVideo] = useState(false);
    const [stream, setStream] = useState(null);
    const [content, setContent] = useState('');

    const handleCloseModalPost = (stream) => {
        if (stream) handleStopCamera(stream);

        if (detailPost) {
            dispatch({
                type: GLOBALTYPES.STATUS.HIDE_MODAL_DETAIL_POST
            });
        } else {
            dispatch({
                type: GLOBALTYPES.STATUS.HIDE_MODAL_HOME_POST
            });
        }

        setFiles([]);
        setContent('');

        if (currentPost && Object.keys(currentPost).length > 0)
            dispatch({
                type: GLOBALTYPES.STATUS.CURRENT_EDIT_STATUS,
                payload: {}
            });
    };

    const handleClearImages = () => {
        setFiles([]);
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

    const handleInsertFiles = async (e) => {
        let localFiles = [...e.target.files];

        const newFiles = [];
        for (let file of localFiles) {
            if (file.type.includes('video')) {
                const { inValid, msg } = checkVideoUpload(file);
                if (inValid) {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: msg
                        }
                    });
                } else {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            loading: true
                        }
                    });
                    const videoBase64 = await readFile(file);
                    newFiles.push({ video: videoBase64 });
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {}
                    });
                }
            } else {
                const { inValid, msg } = checkImageUpload(file);
                if (inValid) {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: msg
                        }
                    });
                } else {
                    newFiles.push(file);
                }
            }
        }
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleCaptureCamera = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const width = video.clientWidth;
        const height = video.clientHeight;

        const ctx = canvas.getContext('2d');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        let image_data_url = canvas.toDataURL('image/jpeg');

        setFiles((prev) => [...prev, { imgCamera: image_data_url }]);
    };

    const handleChangeValueTextarea = (e) => {
        setContent(e.target.value);
    };

    const handleSendMessage = async (e) => {
        if (!content) return;
        if (files.length >= 5) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'posts only allow a maximum of 5 files'
                }
            });
            e.target.value = '';
            return;
        }

        dispatch(
            createMessage({
                auth,
                socket,
                message,
                scrollToBottom,
                content,
                sender: auth.user._id,
                receiver: message.currentReceiver._id,
                files
            })
        );

        handleCloseModalPost(stream);
    };

    const handleSumbitPost = async (e) => {
        if (files.length >= 5) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'posts only allow a maximum of 5 files'
                }
            });
            e.target.value = '';
            return;
        }

        if (Object.keys(currentPost).length > 0) {
            dispatch(
                updatePost({
                    postId: currentPost._id,
                    content,
                    files,
                    currentPost: currentPost
                })
            );
        } else {
            dispatch(
                createPost({
                    socket,
                    user: auth.user,
                    content,
                    files
                })
            );
        }

        handleCloseModalPost(stream);
    };

    useEffect(() => {
        const post = currentPost;
        if (post) {
            setContent(post.content || '');
            setFiles(post.files || []);
        }
    }, [currentPost]);

    return (
        <div
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    handleCloseModalPost(stream);
                }
            }}
            className={`${messageInput ? 'message_modal' : 'post_modal'}`}
        >
            <form className='post_form'>
                {!messageInput && (
                    <div className='post_title relative'>
                        <h1 className='text-center font-bold text-xl'>
                            {Object.keys(currentPost).length > 0 ? 'Edit Post' : 'Create Post'}
                        </h1>

                        <div
                            onClick={() => {
                                handleCloseModalPost(stream);
                            }}
                            className='post_close_btn hover:text-red-500'
                        >
                            <CloseIcon fontSize='small' />
                        </div>
                    </div>
                )}

                <textarea
                    className='post_textarea w-full outline-none overflow-auto'
                    placeholder={
                        messageInput
                            ? `${'Enter your message...'}`
                            : `What's on your mind, ${auth.user?.username}?`
                    }
                    value={content}
                    onChange={handleChangeValueTextarea}
                ></textarea>
                {openVideo && (
                    <div className='camera_wrapper'>
                        <video autoPlay muted ref={videoRef} />
                        <canvas ref={canvasRef} hidden />
                    </div>
                )}

                {files?.length > 0 && (
                    <div className='show_images'>
                        <div className='images_wrapper relative'>
                            <div className='remove_img_btn hover:text-red-500'>
                                <CloseIcon onClick={handleClearImages} fontSize='small' />
                            </div>
                            {files.map((file, index) => {
                                if (
                                    file.video ||
                                    (file?.url && file?.url.includes('/video/upload/'))
                                ) {
                                    return (
                                        <video key={index} controls>
                                            <source src={file.video || file.url} />
                                        </video>
                                    );
                                }

                                return (
                                    <img
                                        src={
                                            file?.imgCamera ||
                                            (file.url ?? URL.createObjectURL(file))
                                        }
                                        key={index}
                                        alt='previewed_image'
                                    />
                                );
                            })}
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
                                {!messageInput && (
                                    <span className='font-semibold text-base whitespace-nowrap'>
                                        Add to your post
                                    </span>
                                )}
                                <div className='icons_wrapper flex gap-3 items-center'>
                                    <label htmlFor='insert_image' className='icon-item'>
                                        <ImageIcon sx={{ color: '#50C878' }} />
                                    </label>

                                    <label className='icon-item'>
                                        <PhotoCameraIcon
                                            sx={{ color: '#F02849' }}
                                            onClick={handleOpenCamera}
                                        />
                                    </label>

                                    <label className='icon-item'>
                                        <EmotionBtn setContent={setContent} />
                                    </label>
                                    <input
                                        id='insert_image'
                                        type='file'
                                        ref={inputRef}
                                        multiple
                                        accept='image/*,video/*'
                                        onChange={handleInsertFiles}
                                        hidden
                                    />
                                </div>
                                {messageInput && (
                                    <div
                                        onClick={handleSendMessage}
                                        className={`send_message ${
                                            content ? 'text-gray-700' : 'text-gray-300'
                                        }`}
                                    >
                                        <SendIcon />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {!messageInput && (
                        <button onClick={handleSumbitPost} className='post_btn'>
                            {Object.keys(currentPost).length > 0 ? 'Save' : 'Post'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ModalPost;
