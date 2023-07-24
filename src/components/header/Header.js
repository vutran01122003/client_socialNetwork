import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MessageIcon from '@mui/icons-material/Message';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Person3Icon from '@mui/icons-material/Person3';
import Person4Icon from '@mui/icons-material/Person4';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Avatar from '../Avatar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { activePageAction } from '../../redux/actions/activePageAction';
import {
    activePageSelector,
    authSelector,
    themSelector
} from '../../redux/selector';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import Search from './Search';

const pages = [
    { icon: HomeIcon, name: 'Home', path: '/' },
    { icon: MessageIcon, name: 'Message', path: '/message' },
    { icon: ExploreIcon, name: 'Discover', path: 'discover' },
    { icon: NotificationsIcon, name: 'Notify', path: 'notify' }
];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const activePage = useSelector(activePageSelector).name;
    const theme = useSelector(themSelector);
    const auth = useSelector(authSelector);

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleActivePage = (pageName) => {
        dispatch(activePageAction(pageName));
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
        <AppBar color='inherit' elevation={1}>
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
                    <Box>
                        <Link
                            to='/'
                            className='flex items-center gap-2 font-semibold'
                        >
                            <img
                                src={require('../../images/logo2.png')}
                                style={{ height: '40px' }}
                                alt=''
                            />
                            <span className='text-2xl'> Smedia </span>
                        </Link>
                    </Box>

                    <Box
                        sx={{
                            height: '40px',
                            display: { xs: 'none', md: 'flex' }
                        }}
                    >
                        <Search />
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', gap: 4 }}>
                        <Box
                            className={`text-white`}
                            sx={{
                                display: {
                                    xs: 'none',
                                    md: 'flex'
                                }
                            }}
                        >
                            {pages.map((page, index) => (
                                <Link
                                    key={index}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        handleActivePage(page.name);
                                    }}
                                    to={page.path}
                                    className={`${
                                        activePage === page.name
                                            ? 'text-gray-700'
                                            : 'text-gray-400'
                                    } hover:text-gray-700 px-4 transition linear`}
                                >
                                    <page.icon fontSize='large' />
                                </Link>
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
                                color='gray'
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
                                                className='flex gap-2 text-gray-700 hover:text-gray-800'
                                            >
                                                <page.icon />
                                                {page.name}
                                            </Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Tooltip
                            title='Open settings'
                            sx={{ padding: 0, overflow: 'visible' }}
                        >
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    avatar={auth.user?.avatar}
                                    size='small'
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            disableScrollLock={true}
                            sx={{ mt: '45px' }}
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
                            <MenuItem
                                onClick={handleCloseUserMenu}
                                sx={{
                                    padding: 0,
                                    height: '40px',
                                    minWidth: '150px'
                                }}
                            >
                                <Link
                                    to={`/profile/${auth.user?._id}`}
                                    className='flex gap-2 items-center w-full h-full ml-2'
                                >
                                    {(auth.user?.gender === 'male' ||
                                        auth.user?.gender === 'other') && (
                                        <Person4Icon />
                                    )}
                                    {auth.user?.gender === 'female' && (
                                        <Person3Icon />
                                    )}

                                    <span className='flex-1'>Profile</span>
                                </Link>
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    padding: 0,
                                    height: '40px'
                                }}
                                onClick={() => {
                                    handleCloseUserMenu();
                                    handleTheme();
                                }}
                            >
                                <div>
                                    <label
                                        htmlFor='theme'
                                        className='flex items-center gap-2 ml-2'
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
                                </div>
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    padding: 0,
                                    height: '40px'
                                }}
                                onClick={() => {
                                    handleCloseUserMenu();
                                    handleLogout();
                                }}
                                className='border-t-2 border-gray-500'
                            >
                                <div className='flex gap-2 items-center w-full ml-2'>
                                    <ExitToAppIcon /> <span>Logout</span>
                                </div>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
