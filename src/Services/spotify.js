import SpotifyWebApi from 'spotify-web-api-js';
import { authActions } from '../Store/authSlice';

export const spotifyApi = new SpotifyWebApi();

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-top-read',
    'user-modify-playback-state',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-modify-public',
    'user-library-modify',
    'user-library-read'
];
const authEndpoint = 'https://accounts.spotify.com/authorize';

export const SpotifyAuthnticationUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=code&show_dialog=true`;

export const exchangeCodeForTokens = async (code) => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri
            })
        });
        if (!response.ok) {
            throw new Error('Failed to exchange authorization code for tokens');
        }

        const data = await response.json();
        const { access_token, refresh_token } = data;

        return { access_token, refresh_token };
    } catch (error) {
        console.error('Failed to exchange authorization code for tokens:', error);
        throw error;
    }
};

export const getAccessToken = async () => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
        try {
            const { access_token, refresh_token } = await exchangeCodeForTokens(code);
            localStorage.setItem('refreshToken', refresh_token);
            // window.location.search = "";
            return access_token;
        } catch (error) {
            console.error('Error exchanging code for tokens:', error);
        }
    }

    const refresh_token = localStorage.getItem('refreshToken');
    if (refresh_token) {
        const newAccessToken = await getNewAccessToken();
        return newAccessToken;
    }
};


export const getNewAccessToken = async () => {
    const refresh_token = localStorage.getItem('refreshToken');
    if (refresh_token) {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: localStorage.getItem('refreshToken'),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();
        const { access_token } = data;

        // Store the new access token and its expiration time in your app
        // You can use it for subsequent API calls
        // spotifyApi.setAccessToken(access_token);
        return access_token;
    }
    return null;
};
