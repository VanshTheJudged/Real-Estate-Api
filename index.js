import "dotenv/config";
import express from "express";// usually not supported by node.js
import cors from 'cors';
import morgan from 'morgan';
import mongoose, { mongo } from "mongoose";
import authRoutes from './routes/auth.js';
const app = express();


//MiddleWare
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Connecting with dataBase
mongoose
 .connect(process.env.DATABASE)
 .then(() =>{
    console.log("DB Connected")
    //Routes middleware
    app.use('/api', authRoutes);// it is put here as it is important first to connect with the database
 })
 .catch((err) => console.log("DB connection Error =>", err));

// app.get('/api', (req, res) => {
//     res.send(`The current time is ${new Date().toLocaleTimeString()}`);
// });

const l = 8000;

app.listen(l, ()=> console.log(`The server is running ${l}`));