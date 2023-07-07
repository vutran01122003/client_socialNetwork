import { Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

function Toast({ status, msg }) {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setOpen(false);
        }, 3000);

        return () => {
            clearTimeout(timeoutID);
        };
    }, []);

    return (
        <>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={status}
                    sx={{ width: '100%' }}
                    className='text-base font-bold'
                >
                    {msg}{' '}
                    <CloseIcon
                        fontSize='small'
                        onClick={(e) => {
                            setOpen((prev) => !prev);
                        }}
                    />
                </Alert>
            </Snackbar>
        </>
    );
}

export default Toast;
