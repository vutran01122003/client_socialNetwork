import { GLOBALTYPES } from '../actions/globalTypes';

export const themeReducer = (state = false, action) => {
    switch (action.type) {
        case GLOBALTYPES.THEME:
            localStorage.setItem('theme', action.payload);
            return action.payload;

        default:
            return state;
    }
};
