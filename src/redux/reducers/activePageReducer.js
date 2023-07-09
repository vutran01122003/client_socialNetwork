import { GLOBALTYPES } from '../actions/globalTypes';

function activePageReducer(state = { name: 'Home' }, action) {
    switch (action.type) {
        case GLOBALTYPES.ACTIVE_PAGE:
            return { ...state, name: action.payload };

        default:
            return state;
    }
}

export default activePageReducer;
