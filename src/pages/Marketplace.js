import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import Tippy from '@tippyjs/react/headless';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords, getProducts } from '../redux/actions/marketplaceAction';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { marketplaceSelector } from '../redux/selector';

function Marketplace() {
    const dispatch = useDispatch();
    const observer = useRef();
    const marketplace = useSelector(marketplaceSelector);
    const products = marketplace.data;
    const [searchValue, setSearchValue] = useState('');
    const [prevSearchValue, setPrevSearchValue] = useState('');
    const [openSearch, setOpenSearch] = useState(false);

    const handleOpenSeach = () => {
        setOpenSearch(true);
    };

    const handleHideSearch = () => {
        setOpenSearch(false);
    };

    const handleSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    const handleGetProduct = ({ searchValue, nextPage }) => {
        if (searchValue !== prevSearchValue || searchValue !== marketplace.searchedKeyword) {
            dispatch({
                type: GLOBALTYPES.MARKETPLACE.MARKETPLACE_RESET
            });
        }

        dispatch(getProducts({ searchValue, nextPage }));
        setPrevSearchValue(searchValue);

        dispatch({
            type: GLOBALTYPES.MARKETPLACE.MARKETPLACE_SET_SEARCHED_KEYWORD,
            payload: searchValue
        });
    };

    const handleClickNameProduct = (keyword) => {
        setSearchValue(keyword);
        handleGetProduct({ searchValue: keyword });
        handleHideSearch();
    };

    const handleKeydown = (e) => {
        if (searchValue === prevSearchValue) return;
        if (e.key === 'Enter') handleGetProduct({ searchValue });
    };

    const lastPostElementRef = useCallback(
        (elem) => {
            if (marketplace.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !marketplace.maxPage) {
                    handleGetProduct({
                        searchValue: marketplace.searchedKeyword,
                        nextPage: marketplace.nextPage
                    });
                }
            });
            if (elem) observer.current.observe(elem);
        },
        // eslint-disable-next-line
        [marketplace.loading]
    );

    useEffect(() => {
        if (products.length === 0)
            dispatch(
                getProducts({
                    nextPage: null,
                    searchValue: 'laptop'
                })
            );
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        let timerId = setTimeout(() => {
            if (searchValue) dispatch(getKeywords({ searchValue }));
            return;
        }, 500);
        return () => {
            clearTimeout(timerId);
        };
    }, [searchValue, dispatch]);

    return (
        <div className='marketplace_container'>
            <div
                className='move_top_icon_wrapper'
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <NavigationIcon />
            </div>

            <div className='marketplace_search_wrapper'>
                <Tippy
                    interactive
                    visible={openSearch && searchValue ? true : false}
                    onClickOutside={handleHideSearch}
                    placement='bottom-start'
                    render={(attrs) => (
                        <>
                            {marketplace.queryList.length > 0 && (
                                <div
                                    className='more_wrapper search_marketplace_result'
                                    tabIndex='-1'
                                    {...attrs}
                                >
                                    {marketplace.queryList.map((queryItem, index) => (
                                        <div
                                            key={queryItem.query + index}
                                            className='more_item'
                                            onClick={() => {
                                                handleClickNameProduct(queryItem.query);
                                            }}
                                        >
                                            {queryItem.query}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                >
                    <div className='marketplace_search'>
                        <input
                            type='text'
                            onChange={handleSearchValue}
                            onKeyDown={handleKeydown}
                            onClick={handleOpenSeach}
                            placeholder='Search marketplace'
                            value={searchValue}
                        />
                        <SearchIcon fontSize='small' className='marketplace_search_icon' />
                    </div>
                </Tippy>
            </div>

            <div className='marketplace_wrapper'>
                {products.length > 0 ? (
                    <>
                        {products.map((product, index) => (
                            <a
                                href={product.node.listing.share_uri}
                                target='_blank'
                                rel='noreferrer'
                                ref={index + 1 === products.length ? lastPostElementRef : null}
                                key={product.node.id + index}
                                className='marketplace_item'
                            >
                                <div className='marketplace_item_thumbnail'>
                                    <img
                                        src={
                                            product.node.listing.primary_listing_photo?.thumbnail
                                                .uri ||
                                            product.node.listing.primary_listing_photo?.image.uri
                                        }
                                        alt='product'
                                    />
                                </div>

                                <div className='marketplace_item_description'>
                                    <h3 className='marketplace_item_description_price'>
                                        {product.node.listing.formatted_price.text}
                                    </h3>
                                    <h3 className='marketplace_item_description_title'>
                                        {product.node.listing.marketplace_listing_title}
                                    </h3>
                                    <h4 className='marketplace_item_description_location'>
                                        {
                                            product.node.listing.location?.reverse_geocode_detailed
                                                .city
                                        }
                                    </h4>
                                </div>
                            </a>
                        ))}{' '}
                    </>
                ) : (
                    <div className='w-full h-full text-center mt-32'>
                        {!marketplace.loading ? (
                            <>
                                <h3 className='font-semibold text-2xl'>
                                    No listings found for "{marketplace.searchedKeyword}"
                                </h3>
                                <h4 className='text-gray-500'>
                                    Try a new search. Check spelling, change your filters, or try a
                                    less specific search term.
                                </h4>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
            </div>
            <div className='w-full h-full flex justify-center p-2'>
                {marketplace.loading && <CircularProgress />}
            </div>
        </div>
    );
}

export default Marketplace;
