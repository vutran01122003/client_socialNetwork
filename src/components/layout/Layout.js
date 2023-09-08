import { Outlet, useParams } from 'react-router-dom';
import Header from '../header/Header';
import { Toolbar } from '@mui/material';
import SidebarRight from '../home/SidebarRight';
import SidebarLeft from '../home/SidebarLeft';
import CallModal from '../message/CallModal';
import { useSelector } from 'react-redux';
import { callSelector, peerSelector, socketSelector } from '../../redux/selector';

function Layout({ auth, theme }) {
    let { page } = useParams();
    page = page ? page : 'home';
    // const peer = useSelector(peerSelector);
    // const socket = useSelector(socketSelector);
    // const call = useSelector(callSelector);

    return (
        <>
            {auth?.token && <Header auth={auth} theme={theme} />}
            {auth?.token && <Toolbar />}
            <div className='app_container'>
                <main className={`main_${page}`}>
                    {auth?.token && page === 'home' && <SidebarLeft auth={auth} />}
                    <Outlet />
                    {auth?.token && page === 'home' && <SidebarRight auth={auth} />}
                </main>
            </div>
        </>
    );
}

export default Layout;
