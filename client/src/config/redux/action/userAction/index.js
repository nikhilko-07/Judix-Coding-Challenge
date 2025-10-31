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
            console.log(user);
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
            return thunkAPI.rejectWithValue(error.response.data);
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

            return thunkAPI.fulfillWithValue(response.data);

        }catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error);
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
        const raw = localStorage.getItem("token");
        const token = raw ? raw.replace(/['"]+/g, "") : null;
        if (!token) return thunkAPI.rejectWithValue("Token not found");

        const response = await clientServer.get("/getOwnProfile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return thunkAPI.fulfillWithValue(response.data);
    }
);
