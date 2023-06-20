import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNewAccessToken, spotifyApi } from '../../Services/spotify';
import '../../assets/Styles/common.css'

import Headings from '../../Components/Headings/Headings';
import TrackList from '../../Components/TrackList/TrackList';
import { Grid } from '@mui/material';
import { currentTrackActions } from '../../Store/CurrentTrackSlice';
import ShowData from '../../Components/showData/ShowData';
import { authActions } from '../../Store/authSlice';
const Search = () => {
    const searchQuery = useSelector((state) => state.search.searchQuery);
    const categories = useSelector((state) => state.browse.categories);
    const [data, setdata] = useState(null);
    const dispatch = useDispatch()

    useEffect(() => {

        async function search() {
            if (searchQuery.trim() !== '') {
                try {

                    const searchData = await spotifyApi.search(searchQuery, [
                        'track',
                        'album',
                        'artist',
                        'playlist',
                    ], { limit: 10 });
                    setdata(searchData);
                    return;
                }
                catch (error) {
                    if (error.response && error.response.status === 401) {
                        const newAccessToken = await getNewAccessToken();
                        dispatch(authActions.setAccessToken(newAccessToken));
                    }
                }
            }
            setdata(null);
        }
        search();
    }, [searchQuery]);


    let TrackIdsQueue;
    if (data) {
        TrackIdsQueue = data?.tracks?.items?.map(track => track.id)
    }
    const handleTrack = (id) => {
        dispatch(currentTrackActions.addTrackId(id));
        dispatch(currentTrackActions.addTrackQueue(TrackIdsQueue));

    }

    return (
        <>
            {data ? (
                <>
                    <Headings heading={"Playlists"} />
                    <div className="CardHorizontalContainer">
                        {
                            data?.playlists?.items.map((playlist) => {
                                if (playlist.type === "playlist") {
                                    return <ShowData key={playlist.id} data={playlist} type="playlist" />
                                }
                            })
                        }
                    </div>


                    <Headings heading={"Albums"} />
                    <div className="CardHorizontalContainer">
                        {
                            data?.albums?.items?.map((album) => {
                                if (album.type === "album") {
                                    return <ShowData key={album.id} data={album} type="album" />
                                }
                            })
                        }
                    </div>

                    <Grid container>
                        <Grid item md={6} xs={12}>

                            <Headings heading={"Tracks"} />
                            <div className="p-1" style={{ height: "50vh", overflow: "auto" }}>
                                {
                                    data?.tracks?.items?.map((track) => {
                                        return (
                                            <React.Fragment key={track?.id} >
                                                <TrackList data={track} handleTrack={handleTrack} />
                                            </React.Fragment>
                                        );
                                    })
                                }
                            </div>
                        </Grid >
                        <Grid item md={6} xs={12} className='p-1' >
                            <Headings heading={"Artists"} />
                            <div className="verticalCardWrapper" style={{ height: "50vh", overflow: "auto" }}>
                                {
                                    data?.artists?.items.map((artist) => {
                                        return <ShowData key={artist.id} data={artist} type="artist" />
                                    })
                                }
                            </div>
                        </Grid>
                    </Grid>
                </>






            ) : (
                <div className="verticalCardWrapper">
                    {
                        categories?.items?.map((category) => {
                            return <ShowData key={category.id} data={category} type="category" />
                        })
                    }
                </div>
            )
            }
        </>
    );
};

export default Search;
