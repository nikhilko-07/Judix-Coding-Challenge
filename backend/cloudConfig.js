import multer from "multer";
import cloudinary from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";

cloudinary.v2.config({
    cloud_name: "di4uufzov",
    api_key: "566188942436697",
    api_secret: "EBEcllgtxvkhJwG_kqMplxPoryU",
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params:{
        folder:"ping",
        allowed_formats:["png","jpg","jpeg","png","gif","webp", "mp4"],
    },
});

const upload = multer({ storage});
export {cloudinary, upload, storage};