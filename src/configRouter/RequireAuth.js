import { useSelector } from 'react-redux';
import { authSelector } from '../redux/selector';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
    const auth = useSelector(authSelector);
    return auth.token ? { children } : <Navigate to='/' />;
}

export default RequireAuth;
