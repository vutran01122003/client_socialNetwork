import { GLOBALTYPES } from '../actions/globalTypes';

function callReducer(state = {}, action) {
    switch (action.type) {
        case GLOBALTYPES.CALL.CALL_USER:
            return { ...action.payload };
        case GLOBALTYPES.CALL.CALLING:
            return {
                ...state,
                calling: action.payload
            };
        default:
            return state;
    }
}

export default callReducer;
