import Message from "../models/Message.js";
import Room from "../models/Room.js";
import { canAccessRoom } from "../utils/roomAccess.js";


export const getMessages = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!canAccessRoom(room, req.user)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ room: room._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "username");
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const room = await Room.findById(message.room);

    const isSender = message.sender.equals(req.user._id);
    const isRoomOwner =
      room && room.isPrivate && room.createdBy && room.createdBy.equals(req.user._id);

    if (!isSender && !isRoomOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await message.deleteOne();
    req.app
      .get("io")
      .to(message.room.toString())
      .emit("messageDeleted", message._id.toString());
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};