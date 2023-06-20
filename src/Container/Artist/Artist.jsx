import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getNewAccessToken, spotifyApi } from '../../Services/spotify'
import TrackList from '../../Components/TrackList/TrackList';
import { currentTrackActions } from '../../Store/CurrentTrackSlice';
import { Grid } from '@mui/material';
import styles from './Artist.module.css'
import { useDispatch } from 'react-redux';
import { authActions } from '../../Store/authSlice';

const Artist = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const [artist, setArtist] = useState(null);
    const [artistTracks, setArtistTracks] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const artist = await spotifyApi.getArtist(params.id);
                const artistTracks = await spotifyApi.getArtistTopTracks(params.id, "IN");
                setArtist(artist);
                setArtistTracks(artistTracks);

            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    const newAccessToken = await getNewAccessToken();
                    dispatch(authActions.setAccessToken(newAccessToken));
                }
            }
        }
        fetchData()
    }, [params])

    let playlistTrackIDQueue;
    if (artistTracks) {
        playlistTrackIDQueue = artistTracks.tracks.map((track) => track.id)
    }

    const handleTrack = (id) => {
        dispatch(currentTrackActions.addTrackQueue(playlistTrackIDQueue))
        dispatch(currentTrackActions.addTrackId(id));
    }

    return (
        artist &&
        <Grid container>

            <Grid item lg={5} xs={12} className={styles.ImageTextWrapper} >

                <div className={styles.ImgWrapper}>
                    <img src={artist?.images[0]?.url} alt={artist.name} width="100%" height="auto" />
                </div>
                <div className={styles.ArtistTextWrapper}>
                    <h2 className={styles.playlistNameHeading}>{artist.name}</h2>
                    <h4>
                        followed By: {artist.followers.total}
                    </h4>
                </div >
            </Grid>
            <Grid item lg={7} xs={12} >

                < div className={styles.tracksListContainer}  >
                    {artistTracks && <>
                        {artistTracks?.tracks?.map((track) => {
                            return (
                                <React.Fragment key={track.id} >
                                    <TrackList data={track} handleTrack={handleTrack} />
                                </React.Fragment>
                            );
                        })}
                    </>}

                </ div>

            </Grid>

        </Grid>


    )
}

export default Artist
