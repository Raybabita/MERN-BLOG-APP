const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postsRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer");
const path = require("path");
const cors = require("cors")



dotenv.config();
app.use(express.json())
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));



// app.use("/lama", (req, res) => {
//     console.log("hey this lama server")
// })

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,

    useUnifiedTopology: true
}).then(console.log("connected to MONGO DB")).catch((error) => console.log(`Error while connecting to mongoDB`, error));

//image Storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});



//Routes
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postsRoute)
app.use("/api/categories", categoryRoute)

app.listen('3005', () => {
    console.log(`Express Server Running`);
})