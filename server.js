import dotenv from "dotenv";

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import User from "./models/user.js";
import Message from "./models/message.js";

import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);


// ========================================
// CONNECT TO MONGODB
// ========================================

connectDB();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
    res.send("Server Running");
});


// ========================================
// USER ROUTES
// ========================================

// CREATE USER
app.post("/users", async (req, res) => {

    try {

        const { name } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({
                error: "Name is required"
            });

        }

        const user = await User.create({
            name: name.trim()
        });

        console.log("Created User:", user);

        res.status(201).json(user);

    } catch (error) {

        console.error("Error creating user:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// GET ALL USERS
app.get("/users", async (req, res) => {

    try {

        const users = await User.find()
            .sort({ createdAt: 1 });

        res.json(users);

    } catch (error) {

        console.error("Error getting users:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ========================================
// MESSAGE ROUTES
// ========================================

// CREATE MESSAGE
app.post("/messages", async (req, res) => {

    try {

        const {
            senderName,
            text
        } = req.body;

        if (!senderName || !text) {

            return res.status(400).json({
                error: "senderName and text are required"
            });

        }

        const newMessage = await Message.create({

            message: {

                senderName: senderName,

                text: text

            }

        });

        console.log("Message created:", newMessage);

        res.status(201).json(newMessage);

    } catch (error) {

        console.error("Error creating message:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// GET ALL MESSAGES
app.get("/messages", async (req, res) => {

    try {

        const messages = await Message.find()
            .sort({ "message.time": 1 });

        res.json(messages);

    } catch (error) {

        console.error("Error getting messages:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ========================================
// SOCKET.IO
// ========================================

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: [
            "GET",
            "POST"
        ]

    }

});


// ========================================
// SOCKET.IO LOGIC
// ========================================

setupSocket(io);


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});