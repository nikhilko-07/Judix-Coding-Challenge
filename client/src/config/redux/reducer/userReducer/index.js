import {createSlice} from "@reduxjs/toolkit";
import {getOwnProfile, loginUser, profileFetch} from "@/config/redux/action/userAction";


const initialState={
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    isLogged:false,
    isTokenThere:false,
    message:'',
    profileFetched:false,
    ownProfileFetched:false,
    ownProfileData:{},
    getUserName:{},
    getOwnPosts:{}
}
const authSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
    },
        extraReducers:(builder)=>{
            builder
                .addCase(loginUser.pending,(state, action)=>{
                    state.isLoading = true;
                    state.message = "Knocking the door...";
                })
                .addCase(loginUser.rejected,(state, action)=>{
                    state.isLoading = false;
                    state.message = action.payload;
                    state.isError = true;
                })
                .addCase(loginUser.fulfilled,(state, action)=>{
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.isLogged = true;
                    state.message = "User Logged Successfully";
                    state.isTokenThere = true;
                })
                .addCase(profileFetch.pending,(state,action)=>{
                    state.isLoading = true;
                    state.message = "Knocking the door...";
                })
                .addCase(profileFetch.rejected,(state, action)=>{
                    state.isLoading = false;
                    state.message = action.payload;
                    state.isError = true;
                })
                .addCase(profileFetch.fulfilled,(state, action)=>{
                    state.isLoading = false;
                    state.message = action.payload;
                    state.profileFetched = true;
                    state.isError = false;
                })
                .addCase(getOwnProfile.pending,(state,action)=>{
                    state.isLoading = true;
                    state.message = "Knocking the door...";
                })
                .addCase(getOwnProfile.rejected,(state, action)=>{
                    state.isLoading = false;
                    state.message = action.payload;
                    state.isError = true;
                })
                .addCase(getOwnProfile.fulfilled,(state,action)=>{
                    state.isLoading = false;
                    state.message = action.payload.message;
                    state.ownProfileFetched = true;
                    state.ownProfileData = action.payload.profile;
                    state.getUserName = action.payload.user;
                    state.getOwnPosts = action.payload.profile.ownPosts;
                })
        }
});

export default authSlice.reducer;