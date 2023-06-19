import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../Services/user';
import { spotifyApi } from '../Services/spotify';
import { useDispatch } from 'react-redux';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const user = await fetchUserProfile();
            return user;
        } catch (error) {
            if (error.message == 401) {
                dispatch(authActions.removeAccessToken());
            }
            return rejectWithValue({ message: error.message, status: error.status });
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: localStorage.getItem('token') || null,
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        setAccessToken: (state, action) => {
            localStorage.setItem('token', action.payload);
            spotifyApi.setAccessToken(action.payload);
            state.accessToken = action.payload
        },
        removeAccessToken: (state) => {
            localStorage.removeItem("token");
            spotifyApi.setAccessToken("");
            state.accessToken = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                console.log(action);
                // state.loading = false;
                // if (action.error.message == 403) {
                //     state.error = action.error.message;
                // }
                // if (action.error.message == 401) {
                //     console.log("here");
                //     dispatch(authActions.removeAccessToken())
                // }
            });
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;