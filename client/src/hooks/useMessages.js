import { useState, useEffect } from "react";
import { getMessages } from "../services/roomService";
import { useSocket } from "./useSocket";

export const useMessages = (roomId) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  
  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    const loadMessages = async () => {
      try {
        const data = await getMessages(roomId);
        setMessages(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    loadMessages();
  }, [roomId]);

  
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("joinRoom", roomId);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    const handleMessageDeleted = (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };
    const handleOnlineUsers = (names) => setOnlineUsers(names);
    const handleTyping = (name) => setTypingUser(name);
    const handleStopTyping = () => setTypingUser("");

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userTyping", handleTyping);
    socket.on("userStoppedTyping", handleStopTyping);

    
    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
      setTypingUser("");
    };
  }, [socket, roomId]);

  const sendMessage = (text) => socket.emit("sendMessage", { roomId, text });
  const startTyping = () => socket.emit("typing", roomId);
  const stopTyping = () => socket.emit("stopTyping", roomId);

  return { messages, onlineUsers, typingUser, sendMessage, startTyping, stopTyping };
};