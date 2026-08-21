import mongoose from "mongoose"

import {ENV} from "./env.js"
import { CLIENT_RENEG_WINDOW } from "node:tls";

export const connectDB = async()=>{
    try {
        const conn  = await mongoose.connect(ENV.DB_URL);
        console.log(`connected to database`);

    } catch (error) {
        console.log("ERROR IN CONNECTING DATABASE");
    }
}