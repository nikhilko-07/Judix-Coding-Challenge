import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/userReducer";
import postReducer from "@/config/redux/reducer/postReducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
    }
})