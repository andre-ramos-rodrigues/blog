const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postsRoute = require('./routes/posts')
const catRoute = require('./routes/categories')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

app.use(cors())
dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL)
.then(console.log('DB Connected'))
.catch((err) => console.error(err))

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

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postsRoute)
app.use('/api/categories', catRoute)

app.listen('5000', () => {
  console.log('backend server running')
})