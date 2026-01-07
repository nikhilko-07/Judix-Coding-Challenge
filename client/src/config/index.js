import axios from "axios";

export const BASE_URL = "https://judix-coding-challenge.vercel.app/";

export const clientServer = axios.create({
    baseURL: BASE_URL,
})

