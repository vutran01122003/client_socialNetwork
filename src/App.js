import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';
import Register from './pages/Register';
import axios from 'axios';
import Alert from './components/notify/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { getDataApi } from './utils/fetchData';
import { refreshToken } from './redux/actions/authAction';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { authSelector, themSelector } from './redux/selector';
import PageRender from './configRouter/PageRender';
import PrivateRoute from './configRouter/PrivateRoute';

function App() {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = process.env.REACT_APP_API_URI;
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const theme = useSelector(themSelector);

    useEffect(() => {
        dispatch({
            type: GLOBALTYPES.THEME,
            payload: localStorage.getItem('theme') === 'true'
        });

        getDataApi('access_token')
            .then((res) => {
                localStorage.setItem('logged', true);
                dispatch({
                    type: GLOBALTYPES.AUTH,
                    payload: res.data
                });
            })
            .catch((e) => {
                if (e.response?.data.status === 401) {
                    dispatch(refreshToken());
                } else {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: e.message || 'Error'
                        }
                    });
                }
            });
    }, [dispatch]);

    return (
        <>
            <input type='checkbox' checked={theme} readOnly id='theme' hidden />
            <div className='App'>
                <Alert />
                <Router>
                    <Fragment>
                        {auth?.token && <Header />}
                        <Routes>
                            <Route
                                path='/'
                                element={auth?.token ? <Home /> : <Login />}
                            />
                            <Route path='/register' element={<Register />} />
                            <Route path='/login' element={<Login />} />

                            <Route path='/' element={<PrivateRoute />}>
                                <Route path='/:page' element={<PageRender />} />
                                <Route
                                    path='/:page/:id'
                                    element={<PageRender />}
                                />
                            </Route>
                        </Routes>
                    </Fragment>
                </Router>
            </div>
        </>
    );
}

export default App;
