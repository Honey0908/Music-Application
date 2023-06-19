import { spotifyApi } from "./spotify";

export const getUserPlaylists = async (userId) => {
    try {
        if (userId) {
            const playlists = await spotifyApi.getUserPlaylists(userId);
            return playlists;
        }

    } catch (error) {
        console.error('Error occurred while fetching playlists', error);
    }
};


export const CreateUserPlaylists = async ([userId, name, description]) => {
    try {
        if (userId) {

            const playlist = await spotifyApi.createPlaylist(userId, {
                "name": name,
                "description": description,
                "public": false
            });
            return playlist;
        }

    } catch (error) {
        console.error('Error occurred while fetching playlists', error.status);
    }
};


export const DeleteUserPlaylist = async (playlistID) => {
    try {

        const response = await spotifyApi.unfollowPlaylist(playlistID);
        return response;


    } catch (error) {
        console.error('Error occurred while deleting error', error);
    }
};