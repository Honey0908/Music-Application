import React, { useEffect, useState } from 'react'
import { spotifyApi } from '../../Services/spotify'
import ShowData from '../showData/ShowData'
import Headings from '../Headings/Headings'

const UserTopItems = ({ atHomePage }) => {
    const [data, setdata] = useState(null)
    useEffect(() => {
        async function fetchTopItems() {
            const data = await spotifyApi.getMyTopArtists();
            setdata(data)
        }
        fetchTopItems();
    }, [])

    return (
        (data && data.items.length > 0) &&
        <>
            <Headings heading="My Top Artists" />
            <div className={atHomePage ? 'CardHorizontalContainer' : 'verticalCardWrapper'} >
                {data?.items.map((artist) => {
                    return <ShowData key={artist.id} data={artist} type="artist" />
                })}
            </div>

        </>

    )
}

export default UserTopItems
