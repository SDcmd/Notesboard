import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
// const express = require("express");
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5001
const __dirname = path.resolve()



if(process.env.NODE_ENV !== "production"){

    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    ); //this allows every request from every single url 
}
//middleware that we add
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

// our simple custom middleware
// app.use((req, res, next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"../frontend","dist",))
});
}

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
})
})


// mongodb+srv://shersd:0N0IeK7hOSh8Fuki@cluster0.mhxpcg0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0