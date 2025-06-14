import { Outlet, useParams } from 'react-router-dom';
import Header from '../header/Header';
import { Toolbar } from '@mui/material';
import SidebarRight from '../sidebar/SidebarRight';
import SidebarLeft from '../sidebar/SidebarLeft';
import CallModal from '../modal/CallModal';
import { useSelector } from 'react-redux';
import { callSelector, peerSelector, socketSelector } from '../../redux/selector';

function Layout({ auth, theme }) {
    let { page } = useParams();
    page = page ? page : 'home';
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const call = useSelector(callSelector);

    return (
        <>
            {auth?.token && <Header auth={auth} theme={theme} />}
            {auth?.token && <Toolbar />}

            {Object.keys(call).length > 0 && !call.calling && (
                <CallModal auth={auth} call={call} socket={socket} peer={peer} />
            )}

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
