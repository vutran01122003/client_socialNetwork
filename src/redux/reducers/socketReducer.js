import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    socket: null
};

const socketReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.SOCKET:
            return {
                ...state,
                socket: action.payload
            };
        default:
            return state;
    }
};

export default socketReducer;
