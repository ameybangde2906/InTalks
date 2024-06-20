import { configureStore } from "@reduxjs/toolkit";
import signInReducer from '../slices/setSignInSlice';
import uploadReducer from '../slices/setUploadPodcast'

const store = configureStore({
    reducer: {
        signIn: signInReducer,
        upload: uploadReducer,
    }
})

export default store;