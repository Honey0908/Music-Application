import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CreateUserPlaylists, DeleteUserPlaylist, getUserPlaylists } from '../Services/myPlaylist';

// Fetch user playlists


export const fetchUserPlaylists = createAsyncThunk(
    'userPlaylists/fetchUserPlaylists',
    async (userId) => {
        const response = await getUserPlaylists(userId);
        return response.items;
    }
);

// Create a new user playlist
export const createUserPlaylist = createAsyncThunk(
    'userPlaylists/createUserPlaylist',
    async (userArr) => {
        const response = await CreateUserPlaylists(userArr);
        return response;
    }
);

// // Update an existing user playlist
// export const updateUserPlaylist = createAsyncThunk(
//     'userPlaylists/updateUserPlaylist',
//     async ({ playlistId, playlistData }) => {
//         const response = await spotifyApi.updatePlaylist(playlistId, playlistData);
//         return response;
//     }
// );

// Delete a user playlist
export const deleteUserPlaylist = createAsyncThunk(
    'userPlaylists/deleteUserPlaylist',
    async (playlistId) => {
        await DeleteUserPlaylist(playlistId);
        return playlistId;
    }
);

const userPlaylistsSlice = createSlice({
    name: 'userPlaylists',
    initialState: {
        playlists: [],
        openModal: false,
        loading: false,
        error: null,
    },
    reducers: {
        ToggleModal: (state) => {
            state.openModal = !state.openModal
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
                state.playlists = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createUserPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUserPlaylist.fulfilled, (state, action) => {
                state.playlists.push(action.payload)
                state.loading = false;
            })
            .addCase(createUserPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // .addCase(updateUserPlaylist.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(updateUserPlaylist.fulfilled, (state, action) => {
            //     const updatedPlaylist = action.payload;
            //     const index = state.playlists.findIndex((p) => p.id === updatedPlaylist.id);
            //     if (index !== -1) {
            //         state.playlists[index] = updatedPlaylist;
            //     }
            //     state.loading = false;
            // })
            // .addCase(updateUserPlaylist.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })
            .addCase(deleteUserPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserPlaylist.fulfilled, (state, action) => {
                const deletedPlaylistId = action.payload;
                state.playlists = state.playlists.filter((p) => p.id !== deletedPlaylistId);
                state.loading = false;
            })
            .addCase(deleteUserPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const userPlaylistsActions = {
    ...userPlaylistsSlice.actions,
    fetchUserPlaylists,
    createUserPlaylist,
    // updateUserPlaylist,
    deleteUserPlaylist,
};



export default userPlaylistsSlice.reducer;
