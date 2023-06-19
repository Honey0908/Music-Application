

import { spotifyApi } from "./spotify";
import { authActions } from "../Store/authSlice";


export const fetchUserProfile = async () => {
    try {
        if (spotifyApi.getAccessToken()) {
            const response = await spotifyApi.getMe();
            return { name: response?.display_name, email: response?.email, followers: response?.followers, image: response?.images, id: response.id };
        }
    } catch (error) {
        throw new Error(error.status)
    }
};