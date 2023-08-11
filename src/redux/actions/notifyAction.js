import {
    deleteDataApi,
    getDataApi,
    patchDataApi,
    postDataApi
} from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const createNotification =
    ({ authId, notifyData }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi('/notification', notifyData);
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION,
                payload: {
                    createdNotification: res.data.createdNotification,
                    authId
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const getNotifications =
    ({ userId, nextPageNotification, currentNotifications }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(
                `/notification?page=${nextPageNotification}&currentQuantity=${currentNotifications}`
            );
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS,
                payload: {
                    notifications: res.data.notifications,
                    userId,
                    page: nextPageNotification,
                    maxPage: res.data.notifications.length === 0 ? true : false
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const readedNotification =
    ({ notificationId, userId }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi('/readed_notification', {
                notificationId,
                userId
            });
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.UPDATE_NOTIFICATION,
                payload: {
                    newNotification: res.data.readedNotification,
                    type: res.data.type
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const unreadedNotification =
    ({ notificationId, userId }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi('/unreaded_notification', {
                notificationId,
                userId
            });
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.UPDATE_NOTIFICATION,
                payload: {
                    newNotification: res.data.unreadedNotification,
                    type: res.data.type
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const deleteNotification =
    ({ userId, id }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi(`/notification/${id}`, {
                userId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.DELETE_NOTIFICATION,
                payload: { notification: res.data.deletedNotification, userId }
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };
