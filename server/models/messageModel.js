import db from "../config/db.js";

export const getConversationId = async (p1_id, p1_role, p2_id, p2_role) => {
  let [rows] = await db.query(
    `SELECT id FROM conversations 
     WHERE (participant1_id = ? AND participant1_role = ? AND participant2_id = ? AND participant2_role = ?)
        OR (participant1_id = ? AND participant1_role = ? AND participant2_id = ? AND participant2_role = ?)`,
    [p1_id, p1_role, p2_id, p2_role, p2_id, p2_role, p1_id, p1_role]
  );
  if (rows.length) return rows[0].id;
  const [result] = await db.query(
    `INSERT INTO conversations (participant1_id, participant1_role, participant2_id, participant2_role)
     VALUES (?, ?, ?, ?)`,
    [p1_id, p1_role, p2_id, p2_role]
  );
  return result.insertId;
};

export const saveMessage = async (conversationId, senderId, senderRole, receiverId, receiverRole, message) => {
  const [result] = await db.query(
    `INSERT INTO messages (conversation_id, sender_id, sender_role, receiver_id, receiver_role, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [conversationId, senderId, senderRole, receiverId, receiverRole, message]
  );
  return result.insertId;
};

export const updateConversationLastMessage = async (conversationId, message, time) => {
  await db.query(`UPDATE conversations SET last_message = ?, last_message_time = ? WHERE id = ?`, [message, time, conversationId]);
};

export const getConversationsForUser = async (userId, userRole) => {
  const [rows] = await db.query(
    `SELECT c.*,
      CASE WHEN c.participant1_id = ? AND c.participant1_role = ? THEN c.participant2_id ELSE c.participant1_id END as other_user_id,
      CASE WHEN c.participant1_id = ? AND c.participant1_role = ? THEN c.participant2_role ELSE c.participant1_role END as other_user_role,
      u.name as other_user_name,
      u.email as other_user_email,
      (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = FALSE AND receiver_id = ? AND receiver_role = ?) as unread_count
    FROM conversations c
    JOIN users u ON (CASE WHEN c.participant1_id = ? AND c.participant1_role = ? THEN c.participant2_id ELSE c.participant1_id END) = u.id
    WHERE (c.participant1_id = ? AND c.participant1_role = ?) OR (c.participant2_id = ? AND c.participant2_role = ?)
    ORDER BY c.last_message_time DESC`,
    [userId, userRole, userId, userRole, userId, userRole, userId, userRole, userId, userRole, userId, userRole]
  );
  return rows;
};

export const getMessages = async (conversationId, userId, userRole) => {
  await db.query(
    `UPDATE messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_id = ? AND receiver_role = ?`,
    [conversationId, userId, userRole]
  );
  const [rows] = await db.query(`SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`, [conversationId]);
  return rows;
};