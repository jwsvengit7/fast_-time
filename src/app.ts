import express from "express";
import { PORT } from "./utils/valuesUtils";
import { connection } from './config/connections'
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from "./controllers/routes/userRoutes";

connection();

const app:any = express();
const corsOptions = {
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

app.use("/api/v1",userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

