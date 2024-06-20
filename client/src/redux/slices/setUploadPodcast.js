import { createSlice } from "@reduxjs/toolkit";


const uploadState = createSlice({
    name: 'upload',
    initialState: {
        openul: false,
    },
    reducers: {
        openUpload: (state) => {
            state.openul = true;
        },
        closeUpload: (state) => {
            state.openul = false;
        },
    }
});

export const { openUpload, closeUpload } = uploadState.actions;

export default uploadState.reducer;