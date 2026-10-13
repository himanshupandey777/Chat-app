import bcrypt from "bcryptjs";
import Room from "../models/Room.js";
import Message from "../models/Message.js";


const cleanRoom = (room) => {
  const data = room.toObject();
  delete data.passcode;
  return data;
};

export const createRoom = async (req, res) => {
  try {
    const { name, isPrivate, passcode, autoDelete } = req.body;
    if (!name) return res.status(400).json({ message: "Room name required" });

    const exists = await Room.findOne({ name });
    if (exists) return res.status(400).json({ message: "Room name already taken" });

    const roomData = { name, createdBy: req.user._id, isPrivate: !!isPrivate };

    if (isPrivate) {
      if (!passcode) {
        return res.status(400).json({ message: "Passcode required for private room" });
      }
      roomData.passcode = await bcrypt.hash(passcode, 10);
      roomData.members = [req.user._id];
      roomData.autoDelete = autoDelete !== false;
    }

    const room = await Room.create(roomData);
    req.app.get("io").emit("roomsChanged");
    res.status(201).json(cleanRoom(room));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRooms = async (req, res) => {
  try {
    let rooms;
    if (req.user.isAdmin) {
      rooms = await Room.find().select("-passcode").sort({ createdAt: 1 });
    } else {

      rooms = await Room.find({
        $or: [{ isPrivate: { $ne: true } }, { members: req.user._id }],
      })
        .select("-passcode")
        .sort({ createdAt: 1 });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const joinPrivateRoom = async (req, res) => {
  try {
    const { name, passcode } = req.body;
    if (!name || !passcode) {
      return res.status(400).json({ message: "Room name and passcode required" });
    }

    const wrongMessage = "Wrong room name or passcode";
    const room = await Room.findOne({ name, isPrivate: true });
    if (!room) return res.status(400).json({ message: wrongMessage });

    const match = await bcrypt.compare(passcode, room.passcode);
    if (!match) return res.status(400).json({ message: wrongMessage });

    const alreadyMember = room.members.some((id) => id.equals(req.user._id));
    if (!alreadyMember) {
      room.members.push(req.user._id);
      await room.save();
    }
    res.json(cleanRoom(room));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const isOwner = room.createdBy && room.createdBy.equals(req.user._id);
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Message.deleteMany({ room: room._id });
    await room.deleteOne();

    const io = req.app.get("io");
    io.to(room._id.toString()).emit("roomDeleted", room._id.toString());
    io.emit("roomsChanged");
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};