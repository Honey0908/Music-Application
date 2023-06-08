import SpotifyWebApi from 'spotify-web-api-js';

export const spotifyApi = new SpotifyWebApi();


const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-modify-public",
    "user-library-modify",
    "user-library-read"
];
const authEndpoint = 'https://accounts.spotify.com/authorize';

export const SpotifyAuthnticationUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=token&show_dialog=true`;




export const getAccessToken = () => {
    const hash = window.location.hash
    if (hash) {
        let token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
        window.location.hash = ""
        localStorage.setItem("token", token);
        spotifyApi.setAccessToken(token);
        return token;
    }
};


