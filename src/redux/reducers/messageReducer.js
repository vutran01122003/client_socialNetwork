import { GLOBALTYPES } from '../actions/globalTypes';
import removeElem from '../../utils/removeElem';
import replaceOldElem from '../../utils/replaceOldElem';

const initialState = {
    loading: false,
    currentReceiver: {},
    currentConversation: {},
    messages: {},
    conversations: {},
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
            if (!state.messages[action.payload.conversationId]) {
                return {
                    ...state,
                    messages: {
                        ...state.messages,
                        [action.payload.conversationId]: {
                            data: [action.payload],
                            page: 1,
                            maxPage: true,
                            result: 1
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
                        data: [
                            ...state.messages[action.payload.conversationId].data,
                            action.payload
                        ],
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
        case GLOBALTYPES.MESSAGE.UPDATE_READED_CONVERSATION: {
            const conversationsData = [...state.conversations.data];
            const newConversations = replaceOldElem(conversationsData, action.payload);
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    data: newConversations
                }
            };
        }
        case GLOBALTYPES.MESSAGE.GET_CONVERSATIONS:
            return {
                ...state,
                conversations: {
                    data:
                        action.payload.page === 1
                            ? [...action.payload.conversations]
                            : [...state.conversations.data, ...action.payload.conversations],
                    currentConversations:
                        action.payload.page === 1
                            ? action.payload.conversations.length
                            : state.conversations?.data.length +
                              action.payload.conversations.length,
                    page: action.payload.page,
                    maxPage: action.payload.maxPage
                }
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
