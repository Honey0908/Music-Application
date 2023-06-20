import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../Services/user';
import { spotifyApi } from '../Services/spotify';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const user = await fetchUserProfile();
            return user;
        } catch (error) {
            dispatch(authActions.removeAccessToken());
            return rejectWithValue(error);
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
                state.error = null;
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                if (action.payload.status === 403) {
                    state.error = action.payload.message;
                }
            });
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;