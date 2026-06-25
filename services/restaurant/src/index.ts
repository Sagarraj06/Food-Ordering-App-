import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import restaurantRoutes from "./routes/restaraunt.js";
import cors from "cors";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors())


const PORT = process.env.PORT || 5001;

app.use("/api/restaurant", restaurantRoutes)


 
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
    