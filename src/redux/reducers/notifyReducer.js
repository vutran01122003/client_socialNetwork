import { GLOBALTYPES } from '../actions/globalTypes';
import replaceOldElem from '../../utils/replaceOldElem';
const initialState = { unread: 0, notifications: [] };

function notifyReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION:
            if (
                action.payload.createdNotification.receiver.find(
                    (receiverId) => {
                        return receiverId === action.payload.authId;
                    }
                )
            )
                return {
                    unread: ++state.unread,
                    notifications: [
                        action.payload.createdNotification,
                        ...state.notifications
                    ]
                };

            return state;
        case GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS:
            let unread = 0;
            action.payload.notifications.forEach((notification) => {
                if (!notification.readedUser.includes(action.payload.userId))
                    ++unread;
            });

            return {
                unread,
                notifications: [...action.payload.notifications]
            };
        case GLOBALTYPES.NOTIFICATION.UPDATE_NOTIFICATION:
            const updatedNotifications = replaceOldElem(
                state.notifications,
                action.payload.newNotification
            );
            return {
                unread:
                    action.payload.type === 'read'
                        ? --state.unread
                        : ++state.unread,
                notifications: updatedNotifications
            };
        default:
            return state;
    }
}

export default notifyReducer;
