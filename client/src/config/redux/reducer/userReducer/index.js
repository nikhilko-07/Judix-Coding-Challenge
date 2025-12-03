import {createSlice} from "@reduxjs/toolkit";
import {
    getOwnProfile, getUserProfileAction,
    loginUser,
    profileFetch,
    searchUser, updateProfileData,
    updateProfilePicture
} from "@/config/redux/action/userAction";


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
    getOwnPosts:{},
    searchResult:[],
    searchLoading: false,
    ownSavedPosts:{},
    getUserProfileData:null
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
                    state.ownSavedPosts = action.payload.profile.savedPosts;
                })
                .addCase(searchUser.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = true;
                    state.searchLoading = false;
                    state.message = "Something went wrong at searchUser"
                })
                .addCase(searchUser.pending, (state, action)=>{
                    state.isLoading = true;
                    state.searchLoading = true;
                    state.isError = false;
                    state.message = "Knocking the door..."
                })
                .addCase(searchUser.fulfilled, (state, action)=>{
                    state.isLoading = false;
                    state.searchLoading = false;
                    state.message = "Fetched the User"
                    state.isError = false;
                    state.searchResult = action.payload;
                })
                .addCase(updateProfilePicture.pending, (state, action)=>{
                    state.isLoading = true;
                    state.message = "Knocking the door...";
                })
                .addCase(updateProfilePicture.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.message = "Something broken"
                })
                .addCase(updateProfilePicture.fulfilled, (state, action)=>{
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.isError = false;
                    state.message = "Update ProfilePicture";
                })
                .addCase(updateProfileData.pending, (state, action)=>{
                    state.isLoading = true;
                    state.message = "Knocking the door...";
                })
                .addCase(updateProfileData.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.message = "Something broken"
                })
                .addCase(updateProfileData.fulfilled, (state, action)=>{
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.isError = false;
                    state.message = "Data Updated";
                })
                .addCase(getUserProfileAction.pending, (state, action)=>{
                    state.isLoading = true;
                    state.message = "Knocking the door...";
                })
                .addCase(getUserProfileAction.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.message = "Something broken"
                })
                .addCase(getUserProfileAction.fulfilled, (state, action)=>{
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.isError = false;
                    state.message = "Data Updated";
                    state.getUserProfileData = action.payload.user;
                })
        }
});

export default authSlice.reducer;