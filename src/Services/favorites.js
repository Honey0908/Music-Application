import { spotifyApi } from "./spotify";

export const getUserFavoritesTrack = async () => {
    try {
        const response = await spotifyApi.getMySavedTracks();
        const tracks = response.items.map((item) => item.track);
        return tracks;
    } catch (error) {
        throw Error(error.message);
    }
}

export const addTrackToFavorites = async (trackID) => {
    try {
        await spotifyApi.addToMySavedTracks([trackID])
        const response = spotifyApi.getTrack(trackID);
        return response;
    } catch (error) {
        throw Error(error.message);
    }
}

export const removeFromFavourties = async (trackID) => {
    try {
        await spotifyApi.removeFromMySavedTracks([trackID]);
        return trackID;
    } catch (error) {
        throw Error(error.status);
    }

}