import { GLOBALTYPES } from '../actions/globalTypes';

function passwordReducer(state = {}, action) {
    switch (action.type) {
        case GLOBALTYPES.PASSWORD.SEND_CODE:
            return {
                ...state,
                validEmail: action.payload.validEmail,
                user: action.payload.user
            };
        case GLOBALTYPES.PASSWORD.CONFIRM_CODE:
            return { ...state, validCode: action.payload.validCode, token: action.payload.token };
        case GLOBALTYPES.PASSWORD.RESET:
            return {};
        default:
            return state;
    }
}

export default passwordReducer;
