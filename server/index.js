const express = require("express");
const app = express();

const http = require("http");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const aiRoutes = require("./routes/ai.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const projectRoutes = require("./routes/project.routes");
const { generateResult } = require("./utils/ai.service");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const projectModel = require("./models/project.model");
const quizRoutes = require("./routes/quiz");

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
      origin: '*'
  }
}); 
database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});



app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/quiz", quizRoutes);
app.use("/ai", aiRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

io.use(async (socket, next) => {

  try {

      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
      const projectId = socket.handshake.query.projectId;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
          return next(new Error('Invalid projectId'));
      }


      socket.project = await projectModel.findById(projectId);


      if (!token) {
          return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
          return next(new Error('Authentication error'))
      }


      socket.user = decoded;

      next();

  } catch (error) {
      next(error)
  }

})


io.on('connection', socket => {
  socket.roomId = socket.project._id.toString()

  console.log('a user connected');

  socket.join(socket.roomId);

  socket.on('project-message', async data => {

      const message=data.message;
      

      const aiIsPresentInMessage = message.includes('@ai');
      socket.broadcast.to(socket.roomId).emit('project-message', data)

      if (aiIsPresentInMessage) {

          const prompt = message.replace('@ai', '');

          const result = await generateResult(prompt);

          io.to(socket.roomId).emit('project-message', {
              message: result,
              sender: {
                  _id: 'ai',
                  email: 'AI'
              }
          })

          return
      }

  })

  socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.leave(socket.roomId)
  });
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
