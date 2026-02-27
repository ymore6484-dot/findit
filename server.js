const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/finditDB", { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// Item Schema
const itemSchema = new mongoose.Schema({
    type: String,
    name: String,
    description: String,
    location: String,
    image: String,
    email: String
});
const Item = mongoose.model("Item", itemSchema);

// Multer setup
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.send("Registered");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.send("Success");
    else res.send("Invalid");
});

app.post("/add-item", upload.single("image"), async (req, res) => {
    const item = new Item({
        type: req.body.type,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        image: req.file.filename,
        email: req.body.email
    });
    await item.save();
    res.send("Item Submitted Successfully");
});

app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// Socket chat
io.on("connection", (socket) => {
    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));