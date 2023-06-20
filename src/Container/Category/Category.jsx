import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getNewAccessToken, spotifyApi } from '../../Services/spotify';
import '../../assets/Styles/common.css'
import ShowData from '../../Components/showData/ShowData';
import { authActions } from '../../Store/authSlice';
import { useDispatch } from 'react-redux';
const Category = () => {
    const params = useParams();

    const [data, setdata] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await spotifyApi.getCategoryPlaylists(params.id)
                setdata(data)
            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    const newAccessToken = await getNewAccessToken();
                    dispatch(authActions.setAccessToken(newAccessToken));
                }
            }
        }
        fetchData()

    }, [])
    return (
        data && (
            <div className="verticalCardWrapper">
                {
                    data?.playlists?.items.map((playlist) => {
                        if (playlist.type === "playlist") {
                            return <ShowData key={playlist.id} data={playlist} type="playlist" />
                        }
                    })}
            </div>
        )
    )
}

export default Category
