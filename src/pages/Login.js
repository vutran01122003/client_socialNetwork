import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../redux/actions/authAction';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Navigate } from 'react-router-dom';
import { authSelector } from '../redux/selector';
import { blue } from '@mui/material/colors';

function Copyright(props) {
    return (
        <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            {...props}
        >
            {'Copyright © '}
            <Link color='inherit' href='/'>
                Smedia
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginAction(userData));
    };

    const handleUserData = (e) => {
        setUserData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (auth.token) return <Navigate to='/' />;
    }, [auth]);

    if (localStorage.getItem('logged')) return <></>;

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container
                    component='main'
                    maxWidth='xs'
                    sx={{
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: blue[600] }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component='h1' variant='h5'>
                            Sign in
                        </Typography>
                        <Box component='form' noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label='Email Address'
                                name='email'
                                autoComplete='email'
                                autoFocus
                                value={userData.email}
                                onChange={handleUserData}
                            />

                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                autoComplete='current-password'
                                value={userData.password}
                                onChange={handleUserData}
                            ></TextField>
                            <span
                                onClick={(e) => {
                                    setShowPassword((prev) => !prev);
                                }}
                                className='text-blue-500 text-sm select-none flex gap-2 items-center font-medium'
                            >
                                {showPassword ? (
                                    <>
                                        <Visibility />
                                        Show
                                    </>
                                ) : (
                                    <>
                                        <VisibilityOff />
                                        Hide
                                    </>
                                )}
                            </span>
                            <Button
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleLogin}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link
                                        href='#'
                                        variant='body2'
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link
                                        href='/register'
                                        variant='body2'
                                        style={{ textDecoration: 'none' }}
                                    >
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        </>
    );
}
