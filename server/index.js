import path from 'path'
import express from "express";
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDb.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import cors from "cors"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()



app.use(express.json({ limit: "900mb" }));
app.use(express.urlencoded({ extended: true }));

const corsOptions ={
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions))



app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/upload", uploadRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*",(req, res)=>{
        res.sendFile(path.resolve)(__dirname,"client", "build", "index.html")
    })
}

app.listen(PORT, () => {
    console.log("server is conneted")
    connectMongoDB()
})