import React, { useContext, useEffect, useState } from 'react';
import { Grid, Hidden } from '@mui/material';
import Header from '../../Layouts/Header/Header';
import Main from '../../Layouts/Main/Main';
import Sidebar from '../../Layouts/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchFeaturedPlaylists, fetchNewReleases } from '../../Store/browseSlice';
import { ThemeContext } from '../../Context/ThemeContext';
import Player from '../../Layouts/Player/Player';
import NavbarFooter from '../../Layouts/NavbarFooter/NavbarFooter';
import { fetchFavoriteTracks } from '../../Store/Favorites';
import { fetchUserPlaylists } from '../../Store/userPlaylists';
import { DotLoader } from 'react-spinners';
import { fetchUserData } from '../../Store/authSlice';



const Body = () => {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.auth.loading)
    const accessToken = useSelector(state => state.auth.accessToken)
    const user = useSelector(state => state.auth.user)

    useEffect(() => {
        if (user) {
            dispatch(fetchFeaturedPlaylists())
            dispatch(fetchNewReleases())
            dispatch(fetchCategories())
            dispatch(fetchFavoriteTracks());
        }
    }, [user])

    useEffect(() => {
        if (user) {
            dispatch(fetchUserPlaylists(user?.id))
        }
    }, [user])

    const { theme } = useContext(ThemeContext);

    return (

        loading ? (
            <DotLoader className="loading-component" color='orange' />) :
            <Grid container direction="row" height="100vh" className={`container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                <Hidden smDown>
                    <Grid item lg={2} md={3} sm={3.5} height="100vh">
                        <Sidebar />
                    </Grid>
                </Hidden>
                <Grid item xs={12} md={9} lg={10} sm={8.5} sx={{ overflow: "auto" }} maxHeight="100vh">
                    <Header />
                    <Main />
                </Grid>
                <Hidden smUp>
                    <NavbarFooter />
                </Hidden>
                <Player />
            </Grid>



    );

};

export default Body;