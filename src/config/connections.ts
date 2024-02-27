import { Sequelize } from "sequelize";
import { SERVER } from "../utils/valuesUtils";
import dotenv from 'dotenv';

dotenv.config();

const dbHost = SERVER;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDatabase = process.env.DB_DATABASE as string;
const dbPort = parseInt(process.env.DB_PORT as string);

const sequelize = new Sequelize(dbDatabase,dbUser,dbPassword,{
    dialect :"mysql",
    host:dbHost,
    port: dbPort,
    logging: false
}); 




export const connection = ()=>{
  sequelize.sync({ force: true })    
  .then(() => {
    console.log('Database tables synchronized successfully');
  })
  .catch((error) => {
    console.error('Error synchronizing database tables:', error);
  });

    sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
}
 
export default  sequelize ;