import React from 'react'
import { SpotifyAuthnticationUrl } from '../../Services/spotify'
import { Button } from '@mui/material'
import musicImg from '../../assets/Images/login.png'
import styles from './Login.module.css'
import { useDispatch } from 'react-redux'
import { fetchAccessToken } from '../../Store/authSlice'


const Login = () => {

    const user = localStorage.getItem("user");
    const dispatch = useDispatch()

    const handleLogin = () => {
        dispatch(fetchAccessToken())
    }

    return (
        <div className={styles.loginBox}>
            <div className={styles.loginCard}>
                <div className={styles.loginPageImage}>
                    <img src={musicImg} alt="" height="100%" width="100%" />
                </div>
                <div className={styles.loginButtons}>
                    <Button variant="contained" size="large" style={{ backgroundColor: '#FFC600' }} href={SpotifyAuthnticationUrl}>Login With Spotify</Button>
                    {user && <Button variant="contained" size="large" style={{ backgroundColor: '#FFC600', marginTop: "0.5em" }} onClick={handleLogin}>Login as {user}</Button>}
                </div>
            </div>

        </div>

    )
}

export default Login