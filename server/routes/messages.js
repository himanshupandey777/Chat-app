import express from "express";
import { getMessages, deleteMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/:roomId", protect, getMessages);
router.delete("/:messageId", protect, deleteMessage);
export default router;