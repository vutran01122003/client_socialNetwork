import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function SomeComponent() {
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket);
    console.log(socket);
    useEffect(() => {
        if (Object.keys(socket).length > 0) {
            socket.emit('some_event', { data: 'Hello' });
        }
    }, [socket]);

    return <></>;
}

export default SomeComponent;
