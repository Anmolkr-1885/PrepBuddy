import express from "express"
import path from "path"
import {ENV} from "./lib/env.js";


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

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});