import express from "express";
import {
  createRoom,
  getRooms,
  joinPrivateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getRooms);
router.post("/", protect, createRoom);
router.post("/join", protect, joinPrivateRoom);
router.delete("/:roomId", protect, deleteRoom);
export default router;