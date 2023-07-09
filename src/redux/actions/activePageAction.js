import { GLOBALTYPES } from './globalTypes';
export const activePageAction = (payload) => {
    return {
        type: GLOBALTYPES.ACTIVE_PAGE,
        payload
    };
};
