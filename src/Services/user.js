

import { spotifyApi } from "./spotify";
import { authActions } from "../Store/authSlice";


export const fetchUserProfile = async (dispatch) => {
    try {
        if (spotifyApi.getAccessToken()) {
            const response = await spotifyApi.getMe();
            return { name: response?.display_name, email: response?.email, followers: response?.followers, image: response?.images, id: response.id };
        }
    } catch (error) {
        if (error.status === 401) {
            localStorage.removeItem("token");
            dispatch(authActions.removeAccessToken());
        }
        if (error.status === 403) {
            localStorage.removeItem("token");
            spotifyApi.setAccessToken("");
            throw new Error(error.response);
        }
        throw new Error(error)
    }
};