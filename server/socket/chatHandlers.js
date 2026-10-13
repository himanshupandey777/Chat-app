import Message from "../models/Message.js";
import Room from "../models/Room.js";
import { canAccessRoom } from "../utils/roomAccess.js";

const ONE_DAY = 24 * 60 * 60 * 1000;


const onlineUsers = {};

const sendOnlineUsers = (io, roomId) => {
  const names = Object.values(onlineUsers[roomId] || {});
  io.to(roomId).emit("onlineUsers", names);
};

const registerChatHandlers = (io, socket) => {
  socket.on("joinRoom", async (roomId) => {
    try {
      const room = await Room.findById(roomId);
      
      if (!room || !canAccessRoom(room, socket.user)) return;

      socket.join(roomId);
      if (!onlineUsers[roomId]) onlineUsers[roomId] = {};
      onlineUsers[roomId][socket.id] = socket.user.username;
      sendOnlineUsers(io, roomId);
    } catch (err) {
      console.log("joinRoom error:", err.message);
    }
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    if (onlineUsers[roomId]) delete onlineUsers[roomId][socket.id];
    sendOnlineUsers(io, roomId);
  });

  socket.on("sendMessage", async ({ roomId, text }) => {
    try {
      if (!text || !text.trim()) return;

      const room = await Room.findById(roomId);
      if (!room || !canAccessRoom(room, socket.user)) return;

      
      const shouldExpire = !room.isPrivate || room.autoDelete;

      const message = await Message.create({
        room: roomId,
        sender: socket.user._id,
        text,
        expireAt: shouldExpire ? new Date(Date.now() + ONE_DAY) : undefined,
      });
      const full = await message.populate("sender", "username");
      io.to(roomId).emit("newMessage", full);
    } catch (err) {
      console.log("sendMessage error:", err.message);
    }
  });

  socket.on("typing", (roomId) => {
    if (!socket.rooms.has(roomId)) return; 
    socket.to(roomId).emit("userTyping", socket.user.username);
  });

  socket.on("stopTyping", (roomId) => {
    if (!socket.rooms.has(roomId)) return;
    socket.to(roomId).emit("userStoppedTyping", socket.user.username);
  });

  socket.on("disconnect", () => {
    for (const roomId in onlineUsers) {
      if (onlineUsers[roomId][socket.id]) {
        delete onlineUsers[roomId][socket.id];
        sendOnlineUsers(io, roomId);
      }
    }
  });
};

export default registerChatHandlers;