import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import registerChatHandlers from "./chatHandlers.js";

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL },
    
  });


  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Not authorized"));
    }
  });

  io.on("connection", (socket) => {
    registerChatHandlers(io, socket);
  });
  return io;
};

export default setupSocket;