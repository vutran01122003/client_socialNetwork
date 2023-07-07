import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MessageIcon from '@mui/icons-material/Message';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Person3Icon from '@mui/icons-material/Person3';
import Person4Icon from '@mui/icons-material/Person4';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/authAction';
import { authSelector, themSelector } from '../redux/selector';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

const pages = [
    { icon: HomeIcon, name: 'Home', path: '/' },
    { icon: MessageIcon, name: 'Message', path: '/message' },
    { icon: ExploreIcon, name: 'Discover', path: 'discover' },
    { icon: NotificationsIcon, name: 'Notify', path: 'notify' }
];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const theme = useSelector(themSelector);
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleTheme = () => {
        dispatch({
            type: GLOBALTYPES.THEME,
            payload: !theme
        });
    };
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <Typography
                        variant='h6'
                        noWrap
                        component='a'
                        href='./'
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            alignItems: 'center',
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            gap: 2
                        }}
                    >
                        <img
                            src={require('../images/logo2.png')}
                            style={{ height: '40px' }}
                            alt=''
                        />
                        <span className='text-2xl'> Smedia </span>
                    </Typography>

                    <Typography
                        variant='h5'
                        noWrap
                        href='./'
                        component='a'
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            gap: 2
                        }}
                    >
                        <img
                            src={require('../images/logo2.png')}
                            style={{ height: '30px' }}
                            alt=''
                        />
                        <span> Smedia </span>
                    </Typography>

                    <Box sx={{ flexGrow: 0, display: 'flex', gap: 4 }}>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', md: 'flex' }
                            }}
                        >
                            {pages.map((page, index) => (
                                <Button
                                    key={index}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block'
                                    }}
                                >
                                    <Link to={page.path}>
                                        <page.icon fontSize='large' />
                                    </Link>
                                </Button>
                            ))}
                        </Box>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'flex', md: 'none' }
                            }}
                        >
                            <IconButton
                                size='large'
                                aria-label='account of current user'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleOpenNavMenu}
                                color='inherit'
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' }
                                }}
                            >
                                {pages.map((page, index) => (
                                    <MenuItem
                                        key={index}
                                        onClick={handleCloseNavMenu}
                                        className='my-2'
                                    >
                                        <Typography textAlign='center'>
                                            <Link
                                                to={page.path}
                                                className='flex gap-2'
                                            >
                                                <page.icon />
                                                {page.name}
                                            </Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Tooltip title='Open settings'>
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt='Remy Sharp'
                                    src={auth.user.avatar}
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px', width: '200px' }}
                            id='menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign='center'>
                                    <Link
                                        to='/profile'
                                        className='flex gap-2 items-center'
                                    >
                                        {(auth.user.gender === 'male' ||
                                            auth.user.gender === 'other') && (
                                            <Person4Icon />
                                        )}
                                        {auth.user.gender === 'female' && (
                                            <Person3Icon />
                                        )}

                                        <span>Profile</span>
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography
                                    textAlign='center'
                                    onClick={handleTheme}
                                >
                                    <label
                                        htmlFor='theme'
                                        className='flex items-center gap-2'
                                    >
                                        {theme ? (
                                            <>
                                                <DarkModeIcon />
                                                <span>Dark Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <LightModeIcon />{' '}
                                                <span>Light Mode</span>
                                            </>
                                        )}
                                    </label>
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={handleCloseUserMenu}
                                className='border-t-2 border-gray-500'
                            >
                                <Typography
                                    onClick={handleLogout}
                                    className='flex gap-2 items-center'
                                    textAlign='center'
                                >
                                    <LogoutIcon /> <span>Logout</span>
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
