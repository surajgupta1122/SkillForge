import db from "../config/db.js";
import { getConversationsForUser, getMessages as getMessagesModel, getConversationId } from "../models/messageModel.js";

export const getConversations = async (req, res) => {
  const { id: userId, role: userRole } = req.user;
  try {
    const conversations = await getConversationsForUser(userId, userRole);
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  const conversationId = req.params.id;
  const { id: userId, role: userRole } = req.user;
  try {
    const messages = await getMessagesModel(conversationId, userId, userRole);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  const { q, role } = req.query;
  const currentUserId = req.user.id;
  try {
    let query = `SELECT id, name, email, role FROM users WHERE (name LIKE ? OR email LIKE ?) AND id != ?`;
    const params = [`%${q}%`, `%${q}%`, currentUserId];
    if (role && role !== "all") {
      query += ` AND role = ?`;
      params.push(role);
    }
    const [users] = await db.query(query, params);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const startConversation = async (req, res) => {
  const { receiver_id, receiver_role } = req.body;
  const sender_id = req.user.id;
  const sender_role = req.user.role;
  try {
    let conversationId = await getConversationId(sender_id, sender_role, receiver_id, receiver_role);
    res.json({ conversationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};