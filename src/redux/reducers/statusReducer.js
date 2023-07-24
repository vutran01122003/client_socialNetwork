import { GLOBALTYPES } from '../actions/globalTypes';

function statusReducer(
    state = {
        open: false,
        currentPost: {}
    },
    action
) {
    switch (action.type) {
        case GLOBALTYPES.STATUS.OPEN_MODAL:
            return { ...state, open: true };
        case GLOBALTYPES.STATUS.HIDE_MODAL:
            return { ...state, open: false };
        case GLOBALTYPES.STATUS.CURRENT_EDIT_STATUS:
            return { ...state, currentPost: action.payload };
        default:
            return state;
    }
}

export default statusReducer;
