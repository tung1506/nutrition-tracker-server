import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/index";
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config();

const app = express(),
    swaggerDocs = require('./config/swagger'),
    authMiddleware = require('./middlewares/authMiddleware'),
    swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(authMiddleware);
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);
connectDB();

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
})