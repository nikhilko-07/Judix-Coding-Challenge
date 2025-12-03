import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

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

export const getRandMedia = createAsyncThunk(
  "user/getRandMedia",
  async (_, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      if (!token) return thunkAPI.rejectWithValue("No token get at Thunk");
      const state = thunkAPI.getState();
      const previousSeenMedia = state.posts.previousSeenMedia || [];

      const response = await clientServer.post(
        "getRandMedia",
        { previousSeenMedia },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      console.log("Error at getRandThunk", err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const deletePost = createAsyncThunk(
  "user/deletePost",
  async (user, thunkAPI) => {
    console.log(user);
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      if (!token) return thunkAPI.rejectWithValue("No token provided");
      const response = await clientServer.delete("/deletePost", {
        data: { id: user },
        headers: { Authorization: `Bearer ${token}` },
      });

      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      console.error("deletePost error:", error);
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const incrementLikes = createAsyncThunk(
  "user/incrementLikes",
  async (user, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      if (!token) return thunkAPI.rejectWithValue("No token provided");
      const response = await clientServer.post(
        "/incrementLike",
        { post_id: user },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      console.error("incrementLikes error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getComments = createAsyncThunk(
  "user/getComments",
  async (id, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      if (!token) return thunkAPI.rejectWithValue("Token Not Provided");
      const response = await clientServer.get("/getComments", {
        headers: { Authorization: `Bearer ${token}` },
        params: { postid: id }, // send as query param for GET
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      console.error("Fetch Comments", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createComment = createAsyncThunk(
  "user/createComment",
  async (data, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      if (!token) return thunkAPI.rejectWithValue("Token Not Provided");
      const respose = await clientServer.post(
        "/createComment",
        { post_id: data.post_id, body: data.body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return thunkAPI.fulfillWithValue(respose.data);
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "user/deleteComment",
  async (data, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      const response = await clientServer.delete("/deleteComment", {
        data: { comment_id: data },
        headers: { Authorization: `Bearer ${token}` },
      });
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("error at delete Thunk");
    }
  }
);

export const savedPost = createAsyncThunk(
  "user/savedPost",
  async (data, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;
      const response = await clientServer.post(
        "/savePost",
        { post_id: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(
        "Something went wrong at savedPost Action"
      );
    }
  }
);

export const getPostInfo = createAsyncThunk(
  "user/getPostInfo",
  async(id, thunkAPI)=>{
    try{
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, ""): null;
      if(!token) return thunkAPI.rejectWithValue("Token not provided...");
      const response = await clientServer.get(
        "/postInfo",{
          headers:{Authorization: `Bearer ${token}`},
          params:{post_id: id}
        }
      )
      return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
        console.error("Fetch Comments", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
)

export const getPostPictures = createAsyncThunk(
    "user/getPostPictures",
    async (id, thunkAPI)=>{
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            if(!token) return thunkAPI.rejectWithValue("Token not provided...");
            const response = await clientServer.get("/getPostImages",{
                headers:{Authorization: `Bearer ${token}`},
                params:{userId: id}
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch (err){
            return thunkAPI.rejectWithValue(err.message);
        }
    }
)