import * as dotenv from "dotenv";
import express from "express";
import connection from "./src/db/connection.js";
import authRoutes from './src/routes/authRoutes.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json({limit: "10MB"}));
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.send({message: "Welcome to Clearly Backend"})
})

app.use('/', authRoutes)

app.listen(port, () => console.log(`Express app running on ${port}`))