import { createSlice } from "@reduxjs/toolkit";

const forgotPassword = createSlice({
    name:'forgotPassword',
    initialState:{
        openfp:false
    },
    reducers:{
        openForgotPassword:(state)=>{
            state.openfp = true;
        },
        closeForgotPassword:(state)=>{
            state.openfp = false
        }
    }
})

export const {openForgotPassword, closeForgotPassword} = forgotPassword.actions

export default forgotPassword.reducer;
