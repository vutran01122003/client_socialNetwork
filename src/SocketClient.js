import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { useDispatch } from 'react-redux';

function SocketClient({ auth }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_URI);
        socket.on('connect', () => {
            dispatch({
                type: GLOBALTYPES.SOCKET,
                payload: socket
            });
            socket.emit('connected_user', auth?.user._id);
        });

        // like post
        socket.on('liked_post', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        socket.on('unliked_post', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        // comment post
        socket.on('created_comment', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        socket.on('deleted_comment', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        // Follow
        socket.on('followed_user', (newUser) => {
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { ...auth, user: newUser }
            });
        });

        socket.on('unfollowed_user', (newUser) => {
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { ...auth, user: newUser }
            });
        });

        // Remember to disconnect the socket when the app unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    return <></>;
}

export default SocketClient;
