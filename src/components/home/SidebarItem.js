import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

function SidebarItem({ Icon, name, url }) {
    const dispatch = useDispatch();

    const handleActivePage = () => {
        dispatch({
            type: GLOBALTYPES.ACTIVE_PAGE,
            payload: name
        });
    };

    return (
        <Link to={url} className='sidebar_item_wrapper' onClick={handleActivePage}>
            <Icon fontSize='large' />
            <span className='font-semibold text-gray-800 text-base'>{name}</span>
        </Link>
    );
}

export default SidebarItem;
