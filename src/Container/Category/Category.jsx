import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { spotifyApi } from '../../Services/spotify';
import '../../assets/Styles/common.css'
import ShowData from '../../Components/showData/ShowData';
const Category = () => {
    const params = useParams();

    const [data, setdata] = useState(null)

    useEffect(() => {

        async function fetchData() {
            const data = await spotifyApi.getCategoryPlaylists(params.id)
            setdata(data)
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
