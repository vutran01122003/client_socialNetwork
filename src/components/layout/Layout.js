import { Outlet, useParams } from 'react-router-dom';
import Header from '../header/Header';
import { Toolbar } from '@mui/material';
import SidebarRight from '../home/SidebarRight';

function Layout({ auth, theme }) {
    const { page } = useParams();

    return (
        <>
            {auth?.token && <Header auth={auth} theme={theme} />}
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
