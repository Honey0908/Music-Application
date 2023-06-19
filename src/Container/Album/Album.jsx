import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { spotifyApi } from '../../Services/spotify';
import '../../assets/Styles/common.css'
import { useDispatch } from 'react-redux';
import { currentTrackActions } from '../../Store/CurrentTrackSlice';
import styles from './Album.module.css'
import TrackList from '../../Components/TrackList/TrackList';
import { Grid } from '@mui/material';
import { authActions } from '../../Store/authSlice';


const Album = () => {
    const ref = useRef(null);

    const dispatch = useDispatch()
    const params = useParams();

    const [data, setdata] = useState(null)

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await spotifyApi.getAlbum(params.id)
                setdata(data)
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(authActions.removeAccessToken());
                }
            }
        }
        fetchData()

    }, [])

    let albumTracksQueue;
    if (data) {
        albumTracksQueue = data.tracks.items.map(track => track.id)
    }
    const handleTrack = (id) => {
        dispatch(currentTrackActions.addTrackQueue(albumTracksQueue))
        dispatch(currentTrackActions.addTrackId(id));
        ref.current.scrollIntoView({ behavior: 'smooth' });
    }


    return (

        data &&

        <Grid container sx={{ height: "100%" }}>

            <Grid item lg={5} xs={12} sx={{ alignSelf: "center" }}>
                <div className={styles.ImgWrapper}>
                    <img src={data?.images[0]?.url} alt={data.name} width="100%" height="100%" />
                </div>
            </Grid>
            <Grid item lg={7} xs={12} >

                <div className={styles.AlbumTextWrapper}>

                    <div>
                        <h2 className={styles.playlistNameHeading}>{data.name}</h2>
                        <h3>
                            {data.label}
                        </h3>
                    </div>
                    <h3 > {data?.tracks?.total} Songs</h3>

                </div >
                < div className={styles.tracksListContainer} ref={ref} >

                    {data?.tracks?.items?.map((track) => {
                        return (
                            <React.Fragment key={track.id} >
                                <TrackList data={track} handleTrack={handleTrack} image={data?.images[0]?.url} />
                            </React.Fragment>
                        );
                    })}

                </ div>

            </Grid>

        </Grid>




    )
}

export default Album