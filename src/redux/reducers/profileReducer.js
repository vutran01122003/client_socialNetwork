import replaceOldElem from '../../utils/replaceOldElem';
import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    users: [],
    posts: {},
    saved: {}
};

function profileReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PROFILE.LOADING:
            return { ...state, loading: action.payload };
        case GLOBALTYPES.PROFILE.GET_USER:
            return { ...state, users: [...state.users, action.payload] };
        case GLOBALTYPES.PROFILE.GET_USER_POST:
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.payload.userId]: {
                        data:
                            action.payload.page === 1
                                ? action.payload.posts
                                : [
                                      ...state.posts[action.payload.userId].data,
                                      ...action.payload.posts
                                  ],
                        page: action.payload.page,
                        maxPage: action.payload.maxPage,
                        currentPost:
                            action.payload.page === 1
                                ? action.payload.posts.length
                                : action.payload.posts.length +
                                  state.posts[action.payload.userId].data.length
                    }
                }
            };
        case GLOBALTYPES.PROFILE.GET_USER_SAVED_POSTS: {
            return {
                ...state,
                saved: {
                    ...state.saved,
                    data:
                        action.payload.page === 1
                            ? [...action.payload.savedPosts]
                            : [...state.saved.data, ...action.payload.savedPosts],
                    page: action.payload.page,
                    maxPage: action.payload.maxPage
                }
            };
        }
        case GLOBALTYPES.PROFILE.RESET_USER_POSTS:
            const newPosts = { ...state.posts };
            delete newPosts[action.payload.userId];
            return { ...state, posts: newPosts };
        case GLOBALTYPES.PROFILE.RESET_USER_SAVED_POSTS:
            const newSavedPosts = { ...state.saved };
            delete newSavedPosts[action.payload.userId];
            return { ...state, saved: newSavedPosts };
        case GLOBALTYPES.PROFILE.SET_USER: {
            const newUsers = replaceOldElem(state.users, action.payload);
            return { ...state, users: [...newUsers] };
        }
        default:
            return state;
    }
}

export default profileReducer;
