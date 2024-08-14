import { configureStore } from "@reduxjs/toolkit";
import signInReducer from '../slices/setSignInSlice';
import uploadReducer from '../slices/setUploadPodcast'
import forgotPasswordReducer from '../slices/setForgotPasswordSlice'
const store = configureStore({
    reducer: {
        signIn: signInReducer,
        upload: uploadReducer,
        forgotPassword: forgotPasswordReducer
    }
})

export default store;