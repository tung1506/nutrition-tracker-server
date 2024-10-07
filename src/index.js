import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/index";
import connectDB from './config/connectDB';
import cors from 'cors';
const authMiddleware = require('./middlewares/authMiddleware');

require('dotenv').config();

const app = express(),
    swaggerSetup = require('./config/swagger');

app.use(authMiddleware);
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
swaggerSetup(app);

initWebRoutes(app);
connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
})