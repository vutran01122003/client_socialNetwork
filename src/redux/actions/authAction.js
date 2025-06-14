import { getDataApi, postDataApi } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const getAuthInfo = () => async (dispatch) => {
    getDataApi("/access_token")
        .then((res) => {
            localStorage.setItem("logged", true);
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: res.data
            });
        })
        .catch((e) => {
            if (e.response?.data.status === 403) {
                if (localStorage.getItem("logged")) {
                    localStorage.removeItem("logged");
                    window.location.reload();
                }
            } else
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: e.response?.data.msg || "Error"
                    }
                });
        });
};

export const loginAction = (payload) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await postDataApi("/login", payload);
        localStorage.setItem("logged", true);
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                user: res.data.user,
                token: res.data.token.accessToken
            }
        });
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.status }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data.msg }
        });
    }
};

export const refreshToken = () => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await getDataApi("/refresh_token");
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                user: res.data.user,
                token: res.data.token?.accessToken
            }
        });
        dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data.msg || "Error" }
        });
    }
};

export const register = (userData) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { loading: true }
        });

        const res = await postDataApi("/register", userData);

        localStorage.setItem("logged", true);

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                user: res.data.user,
                token: res.data.token.accessToken
            }
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.status }
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data.msg || "Error"
            }
        });
    }
};

export const logout = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { loading: true }
        });

        const res = await getDataApi("/logout");

        localStorage.removeItem("logged");

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {}
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data }
        });

        window.location.reload();
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data.msg || "Error"
            }
        });
    }
};
