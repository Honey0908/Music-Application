import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../Services/user';
import { getAccessToken, getNewAccessToken, spotifyApi } from '../Services/spotify';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const user = await fetchUserProfile();
            return user;
        } catch (error) {
            if (error.status == 401) {
                const newAccessToken = await getNewAccessToken(dispatch)
                if (newAccessToken) {
                    dispatch(authActions.setAccessToken(newAccessToken));
                }
            }
            dispatch(authActions.removeAccessToken());
            return rejectWithValue(error);
        }
    }
);


export const fetchAccessToken = createAsyncThunk(
    'user/fetchAccessToken',
    async (_, { dispatch, rejectWithValue }) => {

        const token = await getAccessToken();
        if (token) {
            dispatch(authActions.setAccessToken(token));
            dispatch(fetchUserData())
        }

    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: localStorage.getItem('token') || null,
        user: null,
        loading: false,
        authLoading: false,
        error: null,
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
            localStorage.setItem('token', action.payload);
            localStorage.setItem("isloggedIn", true);
            spotifyApi.setAccessToken(action.payload);
        },
        removeAccessToken: (state) => {
            localStorage.removeItem("token");
            localStorage.setItem("isloggedIn", false);
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
                localStorage.setItem("user", action.payload.name)
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                if (action.payload.status == 403) {
                    state.error = action.payload.message;
                }
            })
            .addCase(fetchAccessToken.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(fetchAccessToken.fulfilled, (state) => {
                state.error = null;
                state.authLoading = false;
            })
            .addCase(fetchAccessToken.rejected, (state, action) => {
                state.authLoading = false;
                state.error = "Something Wrong !"
            });
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;