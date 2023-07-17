import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getDataApi, postDataApi } from '../utils/fetchData';
import SimpleBackdrop from '../components/alert/Loading';

const PrivateRoute = ({ auth }) => {
    const [checkAuth, setCheckAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDataApi('/access_token')
            .then(() => {
                setCheckAuth(true);
            })
            .catch(async () => {
                setCheckAuth(false);
                await postDataApi('/refresh_token')
                    .then(() => {
                        setCheckAuth(true);
                    })
                    .catch(() => {
                        setCheckAuth(false);
                    });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [auth]);

    if (loading) return <SimpleBackdrop />;

    return checkAuth ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
