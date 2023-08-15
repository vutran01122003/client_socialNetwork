import { postDataApi } from '../../utils/fetchData';
import { uploadFile } from '../../utils/uploadFile';
import { GLOBALTYPES } from './globalTypes';

export const getMessages =
    ({ user }) =>
    async (dispatch) => {
        try {
        } catch (error) {}
    };

export const createMessage =
    ({ receiver, sender, content, files }) =>
    async (dispatch) => {
        // dispatch({
        //     type: GLOBALTYPES.ALERT,
        //     payload: {
        //         loading: true
        //     }
        // });

        dispatch({
            type: GLOBALTYPES.MESSAGE.ADD_MESSAGE,
            payload: {
                receiver,
                sender,
                content,
                files
            }
        });

        // let fileUrlArr = [];
        // if (files.length > 0) {
        //     fileUrlArr = await uploadFile(files);
        // }
        // postDataApi(`/message/:id`, {
        //     postData: {
        //         user,
        //         content,
        //         images: fileUrlArr
        //     }
        // })
        //     .then((res) => {
        //         dispatch({
        //             type: GLOBALTYPES.POST.CREATE_POST,
        //             payload: res.data.postData
        //         });

        //         dispatch({
        //             type: GLOBALTYPES.PROFILE.RESET_USER_POSTS,
        //             payload: {
        //                 userId: user._id
        //             }
        //         });

        //         dispatch({
        //             type: GLOBALTYPES.ALERT,
        //             payload: {
        //                 success: res.data.status
        //             }
        //         });
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         dispatch({
        //             type: GLOBALTYPES.ALERT,
        //             payload: {
        //                 error: err.response?.data.msg || 'Error'
        //             }
        //         });
        //     });
    };
