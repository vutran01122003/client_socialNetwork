import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Alert from './components/alert/Alert';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { authSelector, themeSelector } from './redux/selector';
import PageRender from './configRouter/PageRender';
import PrivateRoute from './configRouter/PrivateRoute';
import Layout from './components/layout/Layout';
import { getAuthInfo } from './redux/actions/authAction';
import SocketClient from './SocketClient';
import PeerClient from './PeerClient';
import Password from './pages/Password';

function App() {
    const dispatch = useDispatch();
    const theme = useSelector(themeSelector);
    const auth = useSelector(authSelector);

    useEffect(() => {
        dispatch({
            type: GLOBALTYPES.THEME,
            payload: localStorage.getItem('theme') === 'true'
        });
        dispatch(getAuthInfo());
    }, [dispatch]);

    return (
        <Router>
            <Alert />

            <div className={`App ${theme ? 'dark' : 'light'}`}>
                {auth?.user && (
                    <>
                        <SocketClient auth={auth} />
                        <PeerClient auth={auth} />
                    </>
                )}
                <Fragment>
                    <Routes>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/password' element={<Password />} />
                        <Route path='/' element={<Layout theme={theme} auth={auth} />}>
                            <Route index element={auth.token ? <Home /> : <Login />} />
                            <Route path='*' element={<PageRender />} />
                            <Route path='/' element={<PrivateRoute />}>
                                <Route path='/:page' element={<PageRender />} />
                                <Route path='/:page/:id' element={<PageRender />} />
                            </Route>
                        </Route>
                    </Routes>
                </Fragment>
            </div>
        </Router>
    );
}

export default App;
