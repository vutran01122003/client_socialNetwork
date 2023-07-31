import { GLOBALTYPES } from '../actions/globalTypes';
import replaceOldElem from '../../utils/replaceOldElem';
import removeElem from '../../utils/removeElem';

function detailPostReducer(state = [], action) {
    switch (action.type) {
        case GLOBALTYPES.DETAILPOST.GET_DETAILPOST:
            return [...state, action.payload];
        case GLOBALTYPES.POST.UPDATE_POST:
            const newUpdateDetailPosts = replaceOldElem(state, action.payload);
            return newUpdateDetailPosts;
        case GLOBALTYPES.POST.DELETE_POST:
            const newDeleteDetailPosts = removeElem(
                state,
                action.payload.postId
            );
            return newDeleteDetailPosts;
        default:
            return state;
    }
}

export default detailPostReducer;
