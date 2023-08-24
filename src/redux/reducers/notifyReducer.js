import { GLOBALTYPES } from '../actions/globalTypes';
import replaceOldElem from '../../utils/replaceOldElem';
import removeElem from '../../utils/removeElem';

const initialState = {
    unread: 0,
    notifications: [],
    currentNotifications: 0,
    page: 0,
    maxPage: false
};

function notifyReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION:
            if (
                action.payload.createdNotification.receiver.find((receiverId) => {
                    return receiverId === action.payload.authId;
                })
            )
                return {
                    ...state,
                    unread: ++state.unread,
                    notifications: [action.payload.createdNotification, ...state.notifications],
                    currentNotifications: ++state.currentNotifications
                };

            return state;
        case GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS:
            if (action.payload.resetNotifications) {
                return {
                    unread: 0,
                    notifications: [],
                    currentNotifications: 0,
                    page: 0,
                    maxPage: false
                };
            }

            let unread = 0;
            action.payload.notifications.forEach((notification) => {
                if (!notification.readedUser.includes(action.payload.userId)) ++unread;
            });

            return {
                ...state,
                page: action.payload.page,
                unread: action.payload.page === 1 ? unread : state.unread + unread,
                maxPage: action.payload.maxPage,
                notifications:
                    action.payload.page === 1
                        ? [...action.payload.notifications]
                        : [...state.notifications, ...action.payload.notifications],
                currentNotifications:
                    action.payload.currentNotifications === 0
                        ? action.payload.notifications.length
                        : state.notifications.length + action.payload.notifications.length
            };
        case GLOBALTYPES.NOTIFICATION.UPDATE_NOTIFICATION:
            const updatedNotifications = replaceOldElem(
                state.notifications,
                action.payload.newNotification
            );
            return {
                ...state,
                unread: action.payload.type === 'read' ? --state.unread : ++state.unread,
                notifications: updatedNotifications
            };
        case GLOBALTYPES.NOTIFICATION.DELETE_NOTIFICATION:
            const newNotifications = removeElem(
                state.notifications,
                action.payload.notification._id
            );

            return {
                ...state,
                unread: !action.payload.notification.readedUser.includes(action.payload.userId)
                    ? --state.unread
                    : state.unread,
                currentNotifications: --state.currentNotifications,
                notifications: [...newNotifications]
            };
        default:
            return state;
    }
}

export default notifyReducer;
