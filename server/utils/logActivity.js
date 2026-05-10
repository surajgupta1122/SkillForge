import db from "../config/db.js";

export const logActivity = async ({ userId, userRole, action, entityType, entityId, details, ipAddress }) => {
    try {
        await db.query(
            `INSERT INTO activity_logs (user_id, user_role, action, entity_type, entity_id, details, ip_address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, userRole, action, entityType, entityId, details, ipAddress]
        );
    } catch (err) {
        console.error("Failed to log activity:", err);
    }
};