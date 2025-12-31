import {createAsyncThunk} from "@reduxjs/toolkit";
import {clientServer} from "@/config";


export const loginUser = createAsyncThunk(
    "user/login",
    async(user, thunkAPI)=>{
        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password,
            })
            if(response.data.token){
                localStorage.setItem("token", response.data.token)
            }else{
                return thunkAPI.rejectWithValue({
                    message:"token not found"
                })
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI)=>{
        try {
            const response = await clientServer.post("/register",{
                email: user.email,
                password: user.password,
                name: user.name,
            })

            return thunkAPI.fulfillWithValue(response.data.message);

        }catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const profileFetch = createAsyncThunk(
    "user/profileFetch",
    async (_, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");

            const response = await clientServer.get("/fetchProfile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            console.error("Request failed:", error.response?.data || error.message);
            if (error.response?.status === 400 || error.response?.status === 401) {
                localStorage.removeItem("token");
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Profile fetch failed"
            );
        }
    }
);

export const getOwnProfile = createAsyncThunk(
    "user/getOwnProfile",
    async (_, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");

            const response = await clientServer.get("/getOwnProfile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            return thunkAPI.fulfillWithValue(response.data);
        }catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const searchUser = createAsyncThunk(
    "user/searchUser",
    async(name, thunkAPI)=>{
        try{
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g,"") : null;
            if(!token)return thunkAPI.rejectWithValue("Token not found...");
            const response = await clientServer.get(`/searchUser?query=${name}`,{
                headers:{Authorization : `Bearer ${token}`}
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            console.log(err);
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)

export const updateProfilePicture = createAsyncThunk(
    "user/updateProfilePicture",
    async (user, thunkAPI)=>{
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");
            const formData = new FormData();
            formData.append("profilePicture", user);
            const response = await clientServer.post("/updateProfilePicture", formData,{
            headers:{Authorization: `Bearer ${token}`}
        });
            thunkAPI.dispatch(getOwnProfile())
            return thunkAPI.fulfillWithValue(response.data.message);
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue("Something went wrong...");
        }
    }
)

export const updateProfileData = createAsyncThunk(
    "user/updateProfileData",
    async (data, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");

            const response = await clientServer.post("/updateProfileData", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            thunkAPI.dispatch(getOwnProfile())
            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);



export const getUserProfileAction = createAsyncThunk(
    "user/getUserProfile",
    async (user, thunkAPI) => {

        const raw = localStorage.getItem("token");

        const token = raw ? raw.replace(/['"]+/g, "") : null;

        const response = await clientServer.get("/getUserProfile", {
            params: { _id: user },
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    }
);

export const FollowMethodAction = createAsyncThunk(
    "user/updateFollowMethod",
    async (followingid, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");
            const response = await clientServer.post("/updateFollowMethod", {followingid} ,
                {headers: {Authorization: `Bearer ${token}`}}
                )
            return thunkAPI.fulfillWithValue(response.data);
        }catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong at FollowMethod Action")
        }
    }
)

export const getFollowersList = createAsyncThunk(
    "user/FollowersList",
    async (user, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");
            const response = await clientServer.get("/FollowersList", {
                params: {_id: user},
                headers: { Authorization: `Bearer ${token}` }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong at getFollowersList");
        }
    }
)
export const getFollowingList = createAsyncThunk(
    "user/followersList",
    async (user, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if (!token) return thunkAPI.rejectWithValue("Token not found");
            const response = await clientServer.get("/FollowingList", {
                params: {_id: user},
                headers: { Authorization: `Bearer ${token}` }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong at getFollowersList");
        }
    }
)


export const getOwnSavedPosts = createAsyncThunk(
    "user/getOwnSavedPosts",
    async (_, thunkAPI)=>{
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if(!token) return thunkAPI.rejectWithValue("Token not provided...");
            const response = await clientServer.get("/getOwnSavedPosts",{
                headers:{Authorization: `Bearer ${token}`},
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.message);
        }
    }
)

