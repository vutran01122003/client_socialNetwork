import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    currentReceiver: {},
    messages: [],
    onlineUserList: {}
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.MESSAGE.GET_USER_ONLINE_LIST:
            return {
                ...state,
                onlineUserList: action.payload
            };
        case GLOBALTYPES.MESSAGE.SET_CURRENT_RECEIVER:
            return {
                ...state,
                currentReceiver: action.payload
            };
        case GLOBALTYPES.MESSAGE.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        default:
            return state;
    }
}

export default messageReducer;
