import removeElem from '../../utils/removeElem';
import replaceOldElem from '../../utils/replaceOldElem';
import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    result: 0,
    posts: []
};

function postReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.POST.CREATE_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
                result: state.result + 1
            };
        case GLOBALTYPES.POST.LOADING_POST:
            return { ...state, ...action.payload };
        case GLOBALTYPES.POST.GET_POST:
            return {
                ...state,
                posts: [...action.payload.posts],
                result: action.payload.result
            };
        case GLOBALTYPES.POST.UPDATE_POST:
            const newUpdatedPosts = replaceOldElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newUpdatedPosts]
            };
        case GLOBALTYPES.POST.DELETE_POST:
            const newDeletedPosts = removeElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newDeletedPosts],
                result: state.result - 1
            };
        case GLOBALTYPES.POST.LIKE_POST:
            const newLikePosts = replaceOldElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newLikePosts]
            };
        case GLOBALTYPES.POST.UNLIKE_POST:
            const newUnlikePosts = replaceOldElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newUnlikePosts]
            };
        case GLOBALTYPES.POST.CREATE_COMMENT:
            const newCommentPosts = replaceOldElem(state.posts, action.payload);
            return {
                ...state,
                posts: [...newCommentPosts]
            };
        case GLOBALTYPES.POST.DELETE_COMMENT:
            const newDelCommentPosts = replaceOldElem(
                state.posts,
                action.payload
            );
            return {
                ...state,
                posts: [...newDelCommentPosts]
            };
        case GLOBALTYPES.POST.UPDATE_COMMENT:
            const newUpdateCommentPosts = replaceOldElem(
                state.posts,
                action.payload
            );
            return {
                ...state,
                posts: [...newUpdateCommentPosts]
            };
        case GLOBALTYPES.POST.LIKE_COMMENT:
            const newLikeCommentPosts = replaceOldElem(
                state.posts,
                action.payload
            );
            return {
                ...state,
                posts: [...newLikeCommentPosts]
            };
        case GLOBALTYPES.POST.UNLIKE_COMMENT:
            const newUnlikeCommentPosts = replaceOldElem(
                state.posts,
                action.payload
            );
            return {
                ...state,
                posts: [...newUnlikeCommentPosts]
            };
        default:
            return state;
    }
}

export default postReducer;
