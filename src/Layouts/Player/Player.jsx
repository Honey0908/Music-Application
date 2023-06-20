import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { getNewAccessToken, spotifyApi } from '../../Services/spotify';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useDispatch, useSelector } from 'react-redux';
import { Favorite, FavoriteBorder, PauseCircleOutline } from '@mui/icons-material';
import { audioElement } from '../../App';
import styles from './Player.module.css';
import { Avatar } from '@mui/material';
import { formatDuration } from '../../Utils/Helper';
import ProgressBar from './Components/ProgressBar/ProgressBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { currentTrackActions } from '../../Store/CurrentTrackSlice';
import { addTrackToFavorite, removeTrackFromFavourties } from '../../Store/Favorites';
import { ToastContainer, toast } from 'react-toastify';
import { authActions } from '../../Store/authSlice';
import { Link } from 'react-router-dom';

const Player = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();

    const track = useSelector((state) => state.currentTrack.trackID);
    const favoriteTracksIDs = useSelector((state) => state.favorites.favoriteTracksIDs);

    const [isPlaying, setIsPlaying] = useState(false);
    const [trackData, setTrackData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        async function fetchSong() {
            if (track) {
                try {
                    const trackData = await spotifyApi.getTrack(track);
                    if (trackData?.preview_url) {
                        audioElement.src = trackData?.preview_url;
                        audioElement.addEventListener('ended', handleSongEnded);
                        audioElement.play();
                        setTrackData(trackData);
                        setIsPlaying(true);
                        return;
                    }
                    toast.error("Song preview is not available.");
                    await playNext()

                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        const newAccessToken = await getNewAccessToken();
                        dispatch(authActions.setAccessToken(newAccessToken));
                    }
                }
            }
        }
        fetchSong();
        return () => {
            audioElement.removeEventListener('ended', handleSongEnded);
            audioElement.pause();
            audioElement.src = null;
        };
    }, [track]);

    useEffect(() => {
        const isTrackFavorite = favoriteTracksIDs.includes(track);
        setIsFavorite(isTrackFavorite);
    }, [favoriteTracksIDs, track]);

    const handleSongEnded = () => {
        audioElement.src = null;
        dispatch(currentTrackActions.setNextTrack());
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        setIsPlaying(!isPlaying);
    };

    const playPrevious = async () => {
        dispatch(currentTrackActions.setPrevTrack());
    };

    const playNext = async () => {
        dispatch(currentTrackActions.setNextTrack());
    };

    const handleAddToFavorite = useCallback(
        (e) => {
            e.stopPropagation();
            if (isFavorite) {
                dispatch(removeTrackFromFavourties(track));
            } else {
                dispatch(addTrackToFavorite(track));
            }
            setIsFavorite(!isFavorite);
        },
        [isFavorite, dispatch, track]
    );

    return (
        trackData && (
            <Box className={`${styles.playerContainer} ${!track ? styles.hide : styles.show}`}>

                <div className={styles.AvtarNameWrapper}>
                    <Avatar alt={trackData.name} variant="square" src={trackData?.album?.images[0]?.url} className={styles.PlayerImg} />
                    <div>
                        <h4>{trackData.name}</h4>
                        <div className={styles.artistName}>
                            {trackData.artists.map((artist) => {
                                return (
                                    <Fragment key={artist.id}>
                                        <Link className='artistNameLink' to={`artist/${artist.id}`}> {artist.name + " "} </Link>
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.ProgressControlsWrapper}>
                    <div style={{ width: '90%' }} className={styles.progressBarDiv}>
                        <ProgressBar />
                    </div>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!isMobile ? (
                            <>
                                <IconButton aria-label="previous" onClick={playPrevious} style={{ padding: 0, paddingInline: '0.5em' }}>
                                    <SkipPreviousIcon className="darkModeIcon" />
                                </IconButton>
                                <IconButton aria-label="play/pause" onClick={togglePlay} style={{ padding: 0, paddingInline: '0.5em' }}>
                                    {isPlaying ? (
                                        <PauseCircleOutline sx={{ height: 38, width: 38 }} className="darkModeIcon" />
                                    ) : (
                                        <PlayArrowIcon sx={{ height: 38, width: 38 }} className="darkModeIcon" />
                                    )}
                                </IconButton>
                                <IconButton aria-label="next" onClick={playNext} style={{ padding: 0, paddingInline: '0.5em' }}>
                                    <SkipNextIcon className="darkModeIcon" />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton aria-label="play/pause" onClick={togglePlay} style={{ padding: 0, paddingInline: '0.5em' }}>
                                {isPlaying ? (
                                    <PauseCircleOutline sx={{ height: 38, width: 38 }} className="darkModeIcon" />
                                ) : (
                                    <PlayArrowIcon sx={{ height: 38, width: 38 }} className="darkModeIcon" />
                                )}
                            </IconButton>
                        )}
                    </Box>
                </div>
                <div className={styles.DurationFavoriteWrapper}>
                    <p>{formatDuration(trackData.duration_ms)}</p>
                    {isFavorite ? (
                        <Favorite onClick={handleAddToFavorite} color="secondary" />
                    ) : (
                        <FavoriteBorder onClick={handleAddToFavorite} color="secondary" />
                    )}
                </div>
            </Box>
        )
    );
};

export default Player;
