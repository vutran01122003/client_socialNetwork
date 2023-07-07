import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { authSelector } from '../redux/selector';

const PrivateRoute = () => {
    const auth = useSelector(authSelector);
    return auth.token ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
