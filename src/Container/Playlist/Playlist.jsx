import React, { useDeferredValue, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { spotifyApi } from '../../Services/spotify';
import '../../assets/Styles/common.css'
import styles from './Playlist.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { currentTrackActions } from '../../Store/CurrentTrackSlice';
import styled from '@emotion/styled'
import TrackList from '../../Components/TrackList/TrackList';
import SearchTrack from './Components/SearchTrack/SearchTrack';
import SearchResults from './Components/SearchResults/SearchResults';



const Playlist = () => {

    const location = useLocation()
    const state = location.state;
    const dispatch = useDispatch();

    const ref = useRef(null);

    const params = useParams();

    const [data, setdata] = useState(null)

    const fetchData = async () => {
        const playlistData = await spotifyApi.getPlaylist(params.id);
        setdata(playlistData);
        console.log(playlistData);
        console.log("fetched data again");
    };

    useEffect(() => {
        fetchData();
    }, [params])

    let playlistTrackIDQueue;

    if (data) {
        playlistTrackIDQueue = data?.tracks?.items?.map(track => track?.track?.id)
        console.log(playlistTrackIDQueue);
    }

    const handleTrack = (id) => {
        console.log("clicked" + id);
        dispatch(currentTrackActions.addTrackQueue(playlistTrackIDQueue))
        dispatch(currentTrackActions.addTrackId(id));
        ref.current.scrollIntoView({ behavior: 'smooth' });
    }


    const Container = styled.div`
        background: linear-gradient(to right, var(--primary-color) 0%, rgba(255, 255, 255, 0) 69%), url(${props => props.imageUrl}) no-repeat;
        background-size: 50%;
        background-position: right;
        background-color: var(--primary-color);
        backdrop-filter: blur(10px);
        border: none;
   
        @media screen and (max-width: 768px) {
            background: linear-gradient(0deg, var(--overlay-color), var(--overlay-color)), url(${props => props.imageUrl}) no-repeat;
            background-size: "cover";
        }
      `;

    return (
        <>
            {data && (

                <div className="d-flex-column">

                    <Container className={styles.playlistHeader} imageUrl={data?.images[0]?.url} >
                        <div className={styles.headertext}>
                            <h1 className={styles.playlistNameHeading}>{data.name}</h1>
                            <h2 >{data.description}</h2>
                            <h3>{data?.tracks?.total} Songs</h3>
                            <h3>Followed By {data?.followers?.total}</h3>
                        </div>

                        {state && <SearchTrack />}

                    </Container>



                    {state && <SearchResults fetchData={fetchData} />}


                    <div className={styles.tracksContainer} ref={ref}>

                        {
                            data?.tracks?.items?.map((track) => {
                                return (
                                    <React.Fragment key={track?.track?.id} >
                                        <TrackList data={track?.track} handleTrack={handleTrack} />
                                    </React.Fragment>
                                );
                            })
                        }

                    </div>

                </div>
            )}
        </>
    )
}

export default Playlist