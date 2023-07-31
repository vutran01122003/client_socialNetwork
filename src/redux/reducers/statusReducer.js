import { GLOBALTYPES } from '../actions/globalTypes';

function statusReducer(
    state = {
        openModalHomePost: false,
        openModalDetailPost: false,
        currentPost: {}
    },
    action
) {
    switch (action.type) {
        case GLOBALTYPES.STATUS.OPEN_MODAL_HOME_POST:
            return { ...state, openModalHomePost: true };
        case GLOBALTYPES.STATUS.HIDE_MODAL_HOME_POST:
            return { ...state, openModalHomePost: false };
        case GLOBALTYPES.STATUS.OPEN_MODAL_DETAIL_POST:
            return { ...state, openModalDetailPost: true };
        case GLOBALTYPES.STATUS.HIDE_MODAL_DETAIL_POST:
            return { ...state, openModalDetailPost: false };
        case GLOBALTYPES.STATUS.CURRENT_EDIT_STATUS:
            return { ...state, currentPost: action.payload };
        default:
            return state;
    }
}

export default statusReducer;
