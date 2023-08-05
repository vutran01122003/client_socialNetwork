import { Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { alertSelector } from '../../redux/selector';

function Toast({ status, msg }) {
    const [open, setOpen] = useState(true);
    const alert = useSelector(alertSelector);

    useEffect(() => {
        if (msg) {
            setOpen(true);
        }
    }, [msg, alert]);

    return (
        <>
            <Snackbar
                className='toast'
                open={open}
                autoHideDuration={2000}
                onClose={() => {
                    setOpen(false);
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={status}
                    sx={{ width: '100%' }}
                    className='text-base font-bold'
                >
                    {msg}
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
