import { createSlice } from "@reduxjs/toolkit";


const signin = createSlice({
    name: 'signin',
    initialState: {
        opensi: false,
    },
    reducers: {
        openSignin: (state) => {
            state.opensi = true;
        },
        closeSignin: (state) => {
            state.opensi = false;
        },
    }
});

export const { openSignin, closeSignin } = signin.actions;

export default signin.reducer;