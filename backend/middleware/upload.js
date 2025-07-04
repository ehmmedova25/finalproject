import multer from "multer";
import { storage } from "../utils/Cloudinary.js";

const upload = multer({ storage });

export default upload;
