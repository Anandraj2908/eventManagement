import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";
import eventRouter from "./routers/event.router.js";
import attendeeRouter from "./routers/attendee.router.js";
import userRouter from "./routers/user.router.js";
import taskRouter from "./routers/tasks.router.js";

const app =express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', "DELETE", "PATCH"],
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use("/api/v1/event",eventRouter);
app.use("/api/v1/attendee",attendeeRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/task",taskRouter);

dotenv.config()

try{
    const db = process.env.MONGODB_URI
    await mongoose.connect(db)
    console.log("MongoDB connected")

    const PORT = process.env.PORT || 8000
    app.listen( PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}
catch(error){
    console.log("Connection failed",error)
    process.exit(1)
}
