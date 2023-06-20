import { Avatar, Button } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
import styles from './TrackList.module.css'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { formatDuration } from '../../Utils/Helper'
import { spotifyApi } from '../../Services/spotify'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTrackToFavorite, removeTrackFromFavourties } from '../../Store/Favorites'

const TrackList = ({ data, handleTrack, image, searchTrack, params, fetchData }) => {

    const dispatch = useDispatch();

    const favoriteTracksIDs = useSelector(state => state.favorites.favoriteTracksIDs)

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const isTrackFavorite = favoriteTracksIDs.includes(data.id);
        setIsFavorite(isTrackFavorite);
    }, [favoriteTracksIDs]);

    const handleAddToFavorite = (e) => {
        e.stopPropagation();
        if (isFavorite) {
            dispatch(removeTrackFromFavourties(data.id))
            setIsFavorite(!isFavorite);
            return;
        }
        dispatch(addTrackToFavorite(data.id))
        setIsFavorite(!isFavorite);
    };


    const addTrackToPlaylist = async (e) => {
        e.stopPropagation();
        if (params) {
            await spotifyApi.addTracksToPlaylist(params.id, [data.uri]);
            fetchData();

        }
    }

    return (

        data?.name &&

        <div className={styles.trackRowContainer} onClick={() => handleTrack(data.id)}>
            <div className='d-flex-row' style={{ flex: 2 }}>

                <Avatar alt={data.name} src={image ? image : data?.album?.images[0]?.url} />

                <div className={styles.TextWrapper}>

                    <h5 className={styles.trackName}>{data.name}</h5>

                    <div className={styles.artists}>
                        {data.artists.map((artist) => {
                            return (
                                <Fragment key={artist.id}>
                                    <span className={styles.artistName} >{artist.name} </span>
                                </Fragment>
                            )
                        })}
                    </div>


                </div>
            </div>

            <div className={styles.TimeHeartWrapper}>

                <p >{formatDuration(data.duration_ms)} </p>

                {isFavorite ? (
                    <Favorite onClick={(e) => handleAddToFavorite(e)} color='secondary' />
                ) : (
                    <FavoriteBorder onClick={(e) => handleAddToFavorite(e)} color='secondary' />
                )}

                {searchTrack && <Button variant="contained" onClick={addTrackToPlaylist}>Add</Button>}

            </div>
        </div>

    )
}

export default TrackList
