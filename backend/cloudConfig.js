import multer from "multer";
import cloudinary from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.v2.config({
    cloud_name: "doi5jii0f",
    api_key: "168134966858922",
    api_secret: "guj-oWb7j7lwkEImDb9xo5Wf7TM",
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params:{
        folder:"ping",
        allowed_formats:["png","jpg","jpeg","gif","webp", "mp4"],
    },
});

const upload = multer({ storage});
export {cloudinary, upload, storage};
