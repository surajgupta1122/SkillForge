import db from "../config/db.js";
import { getConversationId, saveMessage, updateConversationLastMessage } from "../models/messageModel.js";

const onlineUsers = new Map();

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const userRole = socket.handshake.query.userRole;
    if (userId && userRole) {
      const userKey = `${userId}_${userRole}`;
      onlineUsers.set(userKey, socket.id);
      socket.join(`user_${userId}`);
      io.emit("user_online", { userId, userRole });
    }

    socket.on("send_message", async (data) => {
      const { receiverId, receiverRole, message, senderId, senderRole } = data;
      try {
        let conversationId = await getConversationId(senderId, senderRole, receiverId, receiverRole);
        const messageId = await saveMessage(conversationId, senderId, senderRole, receiverId, receiverRole, message);
        await updateConversationLastMessage(conversationId, message, new Date());

        const receiverKey = `${receiverId}_${receiverRole}`;
        const receiverSocketId = onlineUsers.get(receiverKey);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_message", {
            id: messageId,
            senderId,
            senderRole,
            message,
            time: new Date(),
            conversationId,
          });
        }
        socket.emit("message_sent", { id: messageId, conversationId });
      } catch (err) {
        console.error(err);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    socket.on("mark_as_read", async ({ messageIds, conversationId, userId, userRole }) => {
      await db.query(
        "UPDATE messages SET is_read = TRUE WHERE id IN (?) AND receiver_id = ? AND receiver_role = ?",
        [messageIds, userId, userRole]
      );
    });

    socket.on("disconnect", () => {
      if (userId && userRole) {
        const userKey = `${userId}_${userRole}`;
        onlineUsers.delete(userKey);
        io.emit("user_offline", { userId, userRole });
      }
    });
  });
};