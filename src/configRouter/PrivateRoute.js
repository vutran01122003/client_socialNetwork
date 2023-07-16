import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { postDataApi } from '../utils/fetchData';
import SimpleBackdrop from '../components/alert/Loading';

const PrivateRoute = () => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postDataApi('/refresh_token')
            .then(() => {
                setAuth(true);
            })
            .catch(() => {
                setAuth(false);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    if (loading) return <SimpleBackdrop />;

    return auth ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
