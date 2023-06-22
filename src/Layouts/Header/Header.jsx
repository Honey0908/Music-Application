import React, { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined, DarkMode, LightMode, LogoutOutlined } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import styles from './Header.module.css';
import { SearchActions } from '../../Store/SearchSlice';
import { ThemeContext } from '../../Context/ThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import { authActions } from '../../Store/authSlice';

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState('');

    const { theme, toggleTheme } = useContext(ThemeContext)

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };

    useEffect(() => {
        const handleSearchDebounced = debounce((query) => {
            dispatch(SearchActions.changeSearchQuery(query));
        }, 500);

        handleSearchDebounced(inputValue);
        return () => {
            handleSearchDebounced.cancel();
        };
    }, [inputValue, dispatch]);


    const handleFocus = () => {
        navigate('/search');
    };

    const handleLogout = () => {
        dispatch(authActions.removeAccessToken());
    }


    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerIcons}>
                    <ArrowBackIosNewOutlined onClick={() => navigate(-1)} disabled />
                    <ArrowForwardIosOutlined onClick={() => navigate(1)} />
                </div>


                <div className={styles.searchBarContainer}>
                    <SearchIcon style={{ color: 'grey' }} />
                    <input
                        type="search"
                        placeholder="Search For music, artists and more"
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                    />
                </div>
            </div>
            <Tooltip title="Change Theme">
                <IconButton onClick={toggleTheme}>
                    {theme === "light" ? <DarkMode className="darkModeIcon" /> : <LightMode className="darkModeIcon" />}
                </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
                <IconButton onClick={handleLogout}>
                    <LogoutOutlined className="darkModeIcon" />
                </IconButton>
            </Tooltip>

        </div>
    );
};

export default Header;
