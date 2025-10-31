    import {getRandomPost} from "@/config/redux/action/postAction";
    import {createSlice} from "@reduxjs/toolkit";


    const initialState = {
        randPostsGet: false,
        isError: false,
        isLoading: false,
        message: "",
        randPosts: [],
        previouslySeenIds: [],
    }

    const postSlice = createSlice({
        name: "post",
        initialState,
        reducers: {

        },
        extraReducers:(builder) => {
            builder
                .addCase(getRandomPost.pending, (state) => {
                    state.isLoading = true;
                    state.isError = false;
                    state.message = "Fetching random posts...";
                })
                .addCase(getRandomPost.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.randPosts = [...state.randPosts, ...action.payload.posts];
                    state.previouslySeenIds = action.payload.nextPreviouslySeenIds;
                })
                .addCase(getRandomPost.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload || "Failed to fetch posts";
                });


        }
    })
    export default postSlice.reducer;