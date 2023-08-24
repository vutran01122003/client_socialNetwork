import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const createNotification =
    ({ authId, notifyData, socket }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi('/notification', notifyData);

            socket.emit(notifyData.type, res.data.createdNotification);

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
                    maxPage: res.data.notifications.length === 0 ? true : false,
                    currentNotifications
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

export const readedNotifications =
    ({ userId, notifications }) =>
    async (dispatch) => {
        try {
            if (notifications.find((notification) => !notification.readedUser.includes(userId))) {
                patchDataApi('/readed_notifications', {
                    userId
                }).then(() => {
                    dispatch(
                        getNotifications({
                            userId,
                            nextPageNotification: 1,
                            currentNotifications: 0
                        })
                    );
                });
            }
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
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const deleteNotifications =
    ({ userId, notifications }) =>
    async (dispatch) => {
        try {
            if (notifications.length !== 0) {
                await deleteDataApi(`/notification`, {
                    userId
                });

                dispatch({
                    type: GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS,
                    payload: {
                        resetNotifications: true
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                error: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };
