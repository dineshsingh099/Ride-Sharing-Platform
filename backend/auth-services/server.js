import http from 'http';
import app from './src/app.js';
import "dotenv/config";
import connectDB from "./src/db/database.js";

connectDB();

const server = http.createServer(app);

server.listen(3001,()=>{
    console.log('Auth service is running on port 3001');
});