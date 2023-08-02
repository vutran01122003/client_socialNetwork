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
            <div className='app_container'>
                <div className='app_sidebar'></div>
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default Layout;
