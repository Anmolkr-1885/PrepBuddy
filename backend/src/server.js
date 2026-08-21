import express from "express"
import path from "path"
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";


const app = express();

const __dirname = path.resolve();

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"API is running good"})
})

app.get("/books",(req,res)=>{
    res.status(200).json({msg:"BOOKS API is running good"})
})

if(ENV.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



const PORT = ENV.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error(" Error starting the server", error);
  }
};

startServer();
