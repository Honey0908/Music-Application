import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../Services/user';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (dispatch) => {
        const user = await fetchUserProfile(dispatch);
        return user;
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
            state.accessToken = action.payload
        },
        removeAccessToken: (state) => {
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
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;