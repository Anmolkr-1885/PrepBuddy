import express from "express"
import {ENV} from "./lib/env.js";

console.log(ENV.PORT);

const app = express();


app.get("/health",(req,res)=>{
    res.status(200).json({msg:"API is running good"})
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})