import { useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { authSelector } from '../../redux/selector';
import Header from '../header/Header';
import { Toolbar } from '@mui/material';
import SidebarRight from '../home/SidebarRight';

function Layout() {
    const auth = useSelector(authSelector) || {};
    const { page } = useParams();

    return (
        <>
            {auth?.token && <Header />}
            {auth?.token && <Toolbar />}
            <div className='app_container'>
                {/* <SidebarLeft auth={auth} /> */}
                <main>
                    <Outlet />
                </main>
                {auth?.token && !page && <SidebarRight auth={auth} />}
            </div>
        </>
    );
}

export default Layout;
