import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { authSelector } from '../../redux/selector';
import Header from '../header/Header';
import { Toolbar } from '@mui/material';

function Layout() {
    const auth = useSelector(authSelector) || {};
    return (
        <>
            {auth?.token && <Header />}
            {auth?.token && <Toolbar />}
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
