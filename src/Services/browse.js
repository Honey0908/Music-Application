import { spotifyApi } from "./spotify"



// export const getNextPage = async (nextUrl) => {
//     try {
//         const response = await spotifyApi.getGeneric(nextUrl);
//         console.log(response);
//     } catch (error) {
//         console.error('Error occurred while fetching the next page:', error);
//     }
// };



export const getNewReleases = async () => {
    try {
        const response = await spotifyApi.getNewReleases();
        return response.albums;

    } catch (error) {
        console.error('Error occurred while fetching new releases:', error);
    }
};
export const getFeaturedPlaylists = async () => {
    try {
        const response = await spotifyApi.getFeaturedPlaylists();
        return response;

    } catch (error) {
        console.error('Error occurred while fetching featured playlists:', error);
    }
};
export const getCategories = async () => {
    try {
        const response = await spotifyApi.getCategories();
        return response.categories;

    } catch (error) {
        console.error('Error occurred while fetching categories:', error);
    }
};
export const getCategoryPlaylists = async (id) => {
    try {
        const response = await spotifyApi.getCategoryPlaylists(id);

    } catch (error) {
        console.error('Error occurred while fetching category playlist:', error);
    }
};


