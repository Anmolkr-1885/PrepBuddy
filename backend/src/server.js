import express from "express"
import path from "path"
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import cors from "cors";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";





const app = express();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

const __dirname = path.resolve();

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health",(req,res)=>{
  console.log("health route triggered")
    res.status(200).json({msg:"API is running good"})
})

app.get("/books",(req,res)=>{
    res.status(200).json({msg:"BOOKS API is running good"})
})

app.post("/api/execute", async (req, res) => {
  // console.log("request is coming in backend")

  
  try {
    const { language, code, stdin } = req.body;

    const JDOODLE_LANGUAGES = {
      javascript: { language: "nodejs", versionIndex: "4" },
      python: { language: "python3", versionIndex: "4" },
      java: { language: "java", versionIndex: "4" },
    };

    const langConfig = JDOODLE_LANGUAGES[language];
    if (!langConfig) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: ENV.JDOODLE_CLIENT_ID,
        clientSecret: ENV.JDOODLE_CLIENT_SECRET,
        script: code,
        language: langConfig.language,
        versionIndex: langConfig.versionIndex,
        stdin: stdin || "",
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `JDoodle HTTP error: ${response.status}`,
      });
    }

    const data = await response.json();

    if (data.error) {
      return res.json({
        success: false,
        output: data.output || "",
        error: data.error,
      });
    }

    return res.json({
      success: true,
      output: data.output || "No output",
      memory: data.memory,
      cpuTime: data.cpuTime,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Failed to execute code: ${error.message}`,
    });
  }
});

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
