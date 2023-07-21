import { uploadImage } from '../../utils/uploadImage';
import { GLOBALTYPES } from './globalTypes';
import { getDataApi, postDataApi } from '../../utils/fetchData';

export const createPost =
    ({ user, content, images }) =>
    async (dispatch) => {
        if (content === '' && images.length === 0) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'post empty'
                }
            });
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            let imgUrlArr = [];
            if (images.length > 0) {
                imgUrlArr = await uploadImage(images);
            }
            postDataApi(`/post/${user._id}`, {
                postData: {
                    user,
                    content,
                    images: imgUrlArr
                }
            })
                .then((res) => {
                    dispatch({
                        type: GLOBALTYPES.POST.CREATE_POST,
                        payload: res.data.postData
                    });
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            success: res.data.status
                        }
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: err.response?.data.msg || 'Error'
                        }
                    });
                });
        }
    };

export const getPost =
    ({ id }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi(`/post/${id}`);
            dispatch({
                type: GLOBALTYPES.POST.GET_POST,
                payload: res.data
            });

            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: false
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg
                }
            });
        }
    };
