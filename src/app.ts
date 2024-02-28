import express from "express";
import { PORT } from "./utils/valuesUtils";
import { connection } from './config/connections'
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from "./controllers/routes/userRoutes";
import userAuthRoutes from "./controllers/routes/userAuthRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


const app:any = express();
const corsOptions = {
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type', 
};


const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Fast Time API Documentation',
        version: '1.0.0',
        description: 'API Documentation for your project',
        
      },
    },
    apis: ['/Users/jwsven/Desktop/node-project/fast_-time/src/controllers/routes/userRoutes.ts'], 
  };
app.use(cors(corsOptions));

connection();

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1",userRoutes)
app.use("/api/v1/auth",userAuthRoutes)


app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});

