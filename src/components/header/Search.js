import Tippy from '@tippyjs/react/headless';
import { useCallback, useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchUser } from '../../redux/actions/usersAction';
import { alertSelector, userSelector } from '../../redux/selector';
import UserCard from '../UserCard';

function Search() {
    const userData = useSelector(userSelector);
    const alert = useSelector(alertSelector);
    const users = userData.userList;

    const [searchValue, setSearchValue] = useState('');
    const [openResult, setOpenResult] = useState(false);

    const dispatch = useDispatch();

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleGetUser = useCallback(
        async (searchValue) => {
            if (searchValue !== '') {
                const formatSearchValue = searchValue.toLowerCase().replace(/ /g, '');
                dispatch(getSearchUser(formatSearchValue));
            }
            return;
        },
        [dispatch]
    );

    useEffect(() => {
        const timeId = setTimeout(() => {
            handleGetUser(searchValue);
        }, 500);

        return () => {
            clearTimeout(timeId);
        };
    }, [searchValue, handleGetUser]);

    const hideResult = () => {
        setOpenResult(false);
    };

    const visibleResult = () => {
        setOpenResult(true);
    };

    return (
        <Tippy
            visible={openResult && searchValue.length > 0}
            interactive
            placement='bottom-start'
            onClickOutside={hideResult}
            render={(attrs) => (
                <div className='box_search' tabIndex='-1' {...attrs}>
                    <div className='label text-gray-600 font-semibold px-2 py-1'>Account</div>

                    {alert.pedding && (
                        <div className='text-center p-2'>
                            <CircularProgress />
                        </div>
                    )}

                    {!alert.pedding && users.length === 0 && (
                        <h3 className='text-black font-semibold text-center p-3'>
                            Username does not exist
                        </h3>
                    )}

                    {users.map((user) => (
                        <UserCard key={user._id} user={user} onClick={hideResult} />
                    ))}
                </div>
            )}
        >
            <div className='search search_wrapper text-black font-semibold flex items-center h-full'>
                <input
                    type='search'
                    className='search_input py-2 px-3 outline-none bg-gray-100'
                    placeholder='Search on smedia'
                    value={searchValue}
                    onChange={handleSearch}
                    onClick={visibleResult}
                />
            </div>
        </Tippy>
    );
}

export default Search;
