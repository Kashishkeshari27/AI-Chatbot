const express = require("express");
const cors = require("cors");
const mongoose =require("mongoose")
require("dotenv").config();

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const {GoogleGenAI} = require("@google/genai");

const Chat=require("./models/Chat")
const User=require("./models/User")

const authMiddleware=require("./middleware/authMiddleware")

const ai=new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
});



const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.json({
    success:true,
    message: "AI Chatbot Backend is running"
  });
});
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}
app.post("/api/chat",authMiddleware, async(req, res) => {
  try{
  const { message } = req.body;

  if(!message || !message.trim()){
    return res.status(400).json({
      success:false,
      message:"Message is required"
  });
}
let response;
for(let attempt=1;attempt<=3;attempt++){
  try{
    response=await ai.models.generateContent({
      model:"gemini-3.5-flash",
      contents:`You are a helpful technical AI assistant for computer science students.

Your job is to answer questions related to:
- Programming
- Data Structures and Algorithms
- Web Development
- JavaScript
- React
- Node.js
- Express.js
- MongoDB
- Python
- SQL
- Java
- C/C++
- APIs
- Git and GitHub
- Software Engineering
- Computer Science concepts

Rules:
1. Explain concepts in simple language.
2. Give practical examples whenever useful.
3. If the user asks for code, provide clean and readable code.
4. Explain important parts of the code.
5. Mention time and space complexity for DSA problems when relevant.
6. If the question is not technical, answer normally but briefly.
7. Do not unnecessarily make answers complicated.

User question:
${message}`
    })
    break
  }
  catch(error){
    console.error(`Gemini attempt ${attempt} failed: `,error.message);
    if(attempt ===3){
      throw error;
    }
    const delay = attempt*2000;
    await new Promise(resolve => setTimeout(resolve,delay))
  }
}
 
const reply=response.text;

      const chat = new Chat({
        userId:req.userId,
        userMessage: message,
        aiResponse: reply
    });

    await chat.save();

  res.json({
    success:true,
    reply:reply
  });
}
catch(error){
  console.error("Gemini Error: ",error);
  res.status(500).json({
    success:false,
    message: error.message || "AI response failed."
  });
}
});

app.get("/api/chat/history",authMiddleware,async(req,res)=>{
  try{
    const chats=await Chat.find({userId:req.userId}).sort({createdAt: 1});
    res.json({
      success:true,
      chats:chats
    })
  }catch(error){
    console.error("History Error:",error);
    res.status(500).json({
      success:false,
      message:"Unable to fetch chat history"
    })
  }
})

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
})
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString()
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});