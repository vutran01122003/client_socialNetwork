import { GLOBALTYPES } from '../actions/globalTypes';
import removeElem from '../../utils/removeElem';

const initialState = {
    loading: false,
    currentReceiver: {},
    currentConversation: {},
    messages: {},
    conversations: [],
    onlineUserList: {}
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.MESSAGE.MESSAGE_LOADING:
            return {
                ...state,
                loading: action.payload.loading
            };
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
        case GLOBALTYPES.MESSAGE.GET_MESSAGES: {
            if (action.payload.page > 1) {
                return {
                    ...state,
                    messages: {
                        ...state.messages,
                        [action.payload.conversationId]: {
                            ...state.messages[action.payload.conversationId],
                            page: action.payload.page,
                            data: [
                                ...action.payload.messages,
                                ...state.messages[action.payload.conversationId].data
                            ],
                            result:
                                state.messages[action.payload.conversationId].data.length +
                                action.payload.messages.length
                        }
                    }
                };
            }

            return {
                ...state,
                messages: { ...state.messages, ...action.payload }
            };
        }
        case GLOBALTYPES.MESSAGE.ADD_MESSAGE: {
            const messages = { ...state.messages };
            if (!messages[action.payload.conversationId]) {
                messages[action.payload.conversationId] = {
                    data: [action.payload],
                    page: 1,
                    maxPage: false,
                    result: state.messages[action.payload.conversationId].result.length + 1
                };
            } else {
                messages[action.payload.conversationId].data.push(action.payload);
            }
            return {
                ...state,
                messages: {
                    ...messages,
                    [action.payload.conversationId]: {
                        ...state.messages[action.payload.conversationId],
                        result: state.messages[action.payload.conversationId].result + 1
                    }
                }
            };
        }
        case GLOBALTYPES.MESSAGE.UPDATE_MESSAGE: {
            if (action.payload.deletedMessage) {
                const messages = { ...state.messages };
                const newMessages = removeElem(
                    messages[action.payload.deletedMessage.conversationId].data,
                    action.payload.deletedMessage._id
                );
                return {
                    ...state,
                    messages: {
                        ...state.messages,
                        [action.payload.deletedMessage.conversationId]: {
                            ...state.messages[action.payload.deletedMessage.conversationId],
                            data: newMessages
                        }
                    }
                };
            }

            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.payload.conversationId]: {
                        ...state.messages[action.payload.conversationId],
                        ...action.payload.updatedMessage
                    }
                }
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
