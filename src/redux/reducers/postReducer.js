import removeElem from '../../utils/removeElem';
import replaceOldElem from '../../utils/replaceOldElem';
import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    result: 0,
    posts: [],
    page: 0,
    maxPage: false
};

function postReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.POST.CREATE_POST:
            const newPosts = [...state.posts];
            newPosts.unshift(action.payload);
            return {
                ...state,
                posts: newPosts,
                result: state.result + 1
            };
        case GLOBALTYPES.POST.LOADING_POST:
            return { ...state, ...action.payload };
        case GLOBALTYPES.POST.GET_POSTS:
            return {
                ...state,
                posts: [...state.posts, ...action.payload.posts],
                result: state.posts.length + action.payload.posts.length,
                page: action.payload.page,
                maxPage: action.payload.maxPage
            };
        case GLOBALTYPES.POST.UPDATE_POST:
            const newUpdatedPosts = replaceOldElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newUpdatedPosts]
            };
        case GLOBALTYPES.POST.DELETE_POST:
            const newDeletedPosts = removeElem(
                state.posts,
                action.payload.postId
            );
            return {
                ...state,
                posts: [...newDeletedPosts],
                result: state.result - 1
            };
        default:
            return state;
    }
}

export default postReducer;
