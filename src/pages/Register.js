import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
    return (
        <Typography
            className='copy_right_content'
            variant='body2'
            color='text.secondary'
            align='center'
            {...props}
        >
            {'Copyright © '}
            <Link color='inherit' href='/'>
                Smedia
            </Link>
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showCfPassword, setShowCfPassword] = React.useState(false);
    const auth = useSelector((state) => state.auth);
    const [userData, setUserData] = React.useState({
        email: '',
        fullname: '',
        username: '',
        password: '',
        cf_password: '',
        gender: 'male'
    });
    const { email, fullname, username, password, cf_password, gender } = userData;

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(register(userData));
    };

    const handleUserData = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    React.useEffect(() => {
        if (auth.token) navigate('/');
    }, [navigate, auth]);

    if (localStorage.getItem('logged')) {
        return <></>;
    }

    return (
        <div className='register h-screen w-screen flex justify-center'>
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
                            Sign up
                        </Typography>
                        <Box
                            className='register_input_wrapper'
                            component='form'
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id='fullname'
                                        label='Fullname'
                                        name='fullname'
                                        onChange={handleUserData}
                                        value={fullname}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id='username'
                                        label='Username'
                                        name='username'
                                        value={username.toLowerCase().replace(/ /g, '')}
                                        onChange={handleUserData}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id='email'
                                        label='Email Address'
                                        name='email'
                                        autoComplete='email'
                                        value={email}
                                        onChange={handleUserData}
                                    />
                                </Grid>

                                <Grid item xs={12} className='relative'>
                                    <TextField
                                        required
                                        fullWidth
                                        name='password'
                                        label='Password'
                                        type={showPassword ? 'text' : 'password'}
                                        id='password'
                                        value={password}
                                        autoComplete='new-password'
                                        onChange={handleUserData}
                                    />
                                    <span
                                        onClick={(e) => {
                                            setShowPassword((prev) => !prev);
                                        }}
                                        className='text-blue-500 text-sm select-none absolute right-2 top-1/2 transform  -translate-y-1/4'
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </Grid>

                                <Grid item xs={12} className='relative'>
                                    <TextField
                                        required
                                        fullWidth
                                        name='cf_password'
                                        label='Confirm Password'
                                        type={showCfPassword ? 'text' : 'password'}
                                        id='cf_password'
                                        onChange={handleUserData}
                                        value={cf_password}
                                        autoComplete='new-password'
                                    />
                                    <span
                                        onClick={(e) => {
                                            setShowCfPassword((prev) => !prev);
                                        }}
                                        className='text-blue-500 text-sm select-none absolute right-2 top-1/2 transform  -translate-y-1/4'
                                    >
                                        {showCfPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl className='w-full'>
                                        <FormLabel id='demo-radio-buttons-group-label'>
                                            Gender
                                        </FormLabel>
                                        <RadioGroup
                                            aria-labelledby='demo-radio-buttons-group-label'
                                            defaultValue={gender}
                                            row
                                            name='gender'
                                            className='flex w-full gender_radio_group'
                                            onChange={handleUserData}
                                        >
                                            <FormControlLabel
                                                value='male'
                                                control={<Radio />}
                                                label='Male'
                                            />
                                            <FormControlLabel
                                                value='female'
                                                control={<Radio />}
                                                label='Female'
                                            />
                                            <FormControlLabel
                                                value='other'
                                                control={<Radio />}
                                                label='Other'
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent='flex-end'>
                                <Grid item>
                                    <Link
                                        to='/login'
                                        className='text-sm text-blue-500 hover:underline decoration-1'
                                    >
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 5 }} />
                </Container>
            </ThemeProvider>
        </div>
    );
}
