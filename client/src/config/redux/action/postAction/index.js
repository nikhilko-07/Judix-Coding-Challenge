import {createAsyncThunk} from "@reduxjs/toolkit";
import {clientServer} from "@/config";

export const getRandomPost = createAsyncThunk(
    "user/getRandomPost",
    async (_, thunkAPI) => {
        try {
            // 🔹 Token lena localStorage se
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("No token provided");

            // 🔹 Redux se previously seen IDs lena
            const state = thunkAPI.getState();
            const previouslySeenIds = state.posts.previouslySeenIds || [];

            // 🔹 API call
            const response = await clientServer.post(
                "/getRand",
                { previouslySeenIds }, // 🧠 backend ko bhej rahe hain
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 🔹 Response data return karna (posts + updated IDs)
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            console.error("getRandomPost error:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch random post"
            );
        }
    }
);
