import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    currentReceiver: {},
    currentConversation: {},
    messages: {},
    conversations: [],
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
        case GLOBALTYPES.MESSAGE.GET_MESSAGE:
            return {
                ...state,
                messages: { ...state.messages, ...action.payload }
            };
        case GLOBALTYPES.MESSAGE.ADD_MESSAGE: {
            const messages = { ...state.messages };
            messages[action.payload.conversationId].push(action.payload);
            return {
                ...state,
                messages
            };
        }
        case GLOBALTYPES.MESSAGE.GET_CONVERSATIONS:
            return {
                ...state,
                conversations: [...action.payload]
            };
        case GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION:
            return {
                ...state,
                currentConversation: action.payload
            };
        default:
            return state;
    }
}

export default messageReducer;
