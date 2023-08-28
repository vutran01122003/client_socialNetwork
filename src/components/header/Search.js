import Tippy from '@tippyjs/react/headless';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchUser } from '../../redux/actions/usersAction';
import { userSelector } from '../../redux/selector';
import UserCard from '../UserCard';

function Search() {
    const users = useSelector(userSelector);
    const observer = useRef();

    const [searchValue, setSearchValue] = useState('');
    const [openResult, setOpenResult] = useState(false);

    const dispatch = useDispatch();

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleGetUser = async ({ searchValue, page, loadMore }) => {
        if (searchValue !== '') {
            const formatSearchValue = searchValue.toLowerCase().replace(/ /g, '');
            dispatch(getSearchUser({ searchValue: formatSearchValue, page, loadMore }));
        }
        return;
    };

    const getLastUserCard = useCallback(
        (elem) => {
            if (users.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !users.maxPage) {
                        handleGetUser({ searchValue, page: users.page + 1, loadMore: true });
                    }
                },
                { threshold: 1 }
            );
            if (elem) observer.current.observe(elem);
        },
        // eslint-disable-next-line
        [users.loading, users.page, searchValue]
    );

    useEffect(() => {
        const timeId = setTimeout(() => {
            handleGetUser({ searchValue, page: 1 });
        }, 500);

        return () => {
            clearTimeout(timeId);
        };
        // eslint-disable-next-line
    }, [searchValue]);

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
                    {users.userList.map((user, index) => {
                        if (users?.userList.length === index + 1)
                            return (
                                <div className='last_item' ref={getLastUserCard} key={user._id}>
                                    <UserCard user={user} onClick={hideResult} />
                                </div>
                            );
                        return (
                            <div key={user._id}>
                                <UserCard user={user} onClick={hideResult} />
                            </div>
                        );
                    })}

                    {users.loading && (
                        <div className='text-center p-2'>
                            <CircularProgress />
                        </div>
                    )}

                    {!users.loading && users?.userList.length === 0 && (
                        <h3 className='text-black font-semibold text-center p-3'>
                            Username does not exist
                        </h3>
                    )}
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
