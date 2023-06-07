import React from 'react'
import Categories from '../../Components/Categories/Categories'
import FeaturedPlaylist from '../../Components/FeaturedPlaylist/FeaturedPlaylist'
import NewReleases from '../../Components/NewReleases/NewReleases'
import { useSelector } from 'react-redux'
import { SyncLoader } from 'react-spinners'
import UserTopItems from '../../Components/UserTopItems/UserTopItems'


const Home = () => {
    const loading = useSelector(state => state.browse.loading)
    return (
        loading ? <SyncLoader className='loading-component' color='orange' /> :
            <>
                <Categories atHomePage="true" />
                <FeaturedPlaylist atHomePage="true" />
                <NewReleases atHomePage="true" />
                {/* <UserTopItems atHomePage="true" /> */}
            </>
    )
}

export default Home
