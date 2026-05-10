import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getConversations, getMessages, searchUsers, startConversation } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", verifyToken, getConversations);
router.get("/conversation/:id", verifyToken, getMessages);
router.get("/search", verifyToken, searchUsers);
router.post("/start", verifyToken, startConversation);

export default router;