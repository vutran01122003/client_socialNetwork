import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Alert from './components/alert/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { getDataApi } from './utils/fetchData';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { authSelector, themSelector } from './redux/selector';
import PageRender from './configRouter/PageRender';
import PrivateRoute from './configRouter/PrivateRoute';
import Layout from './components/layout/Layout';

function App() {
    const dispatch = useDispatch();
    const theme = useSelector(themSelector);
    const auth = useSelector(authSelector);

    useEffect(() => {
        dispatch({
            type: GLOBALTYPES.THEME,
            payload: localStorage.getItem('theme') === 'true'
        });

        getDataApi('/access_token')
            .then((res) => {
                localStorage.setItem('logged', true);
                dispatch({
                    type: GLOBALTYPES.AUTH,
                    payload: res.data
                });
            })
            .catch((e) => {
                if (e.response?.data.status === 403) {
                    localStorage.removeItem('logged');
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: e.response?.data.msg || 'Error'
                        }
                    });
                    return <Navigate to='/login' />;
                } else
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: e.message || 'Error'
                        }
                    });
            });
    }, [dispatch]);

    return (
        <Router>
            <Alert />
            <input
                type='checkbox'
                checked={theme}
                readOnly
                id='theme'
                hidden={true}
            />
            <div className='App'>
                <Fragment>
                    <Routes>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/' element={<Layout />}>
                            <Route
                                index
                                element={auth.token ? <Home /> : <Login />}
                            />
                            <Route path='*' element={<PageRender />} />
                            <Route path='/' element={<PrivateRoute />}>
                                <Route path='/:page' element={<PageRender />} />
                                <Route
                                    path='/:page/:id'
                                    element={<PageRender />}
                                />
                            </Route>
                        </Route>
                    </Routes>
                </Fragment>
            </div>
        </Router>
    );
}

export default App;
