import db from "../../config/db.js";

export const getActivityLogs = async (req, res) => {
    const { type, dateRange } = req.query;
    try {
        let query = `
            SELECT id, user_id, user_role, action, entity_type, entity_id, details, ip_address, created_at as time
            FROM activity_logs
            WHERE 1=1
        `;
        const params = [];

        if (type && type !== 'all') {
            query += ` AND entity_type = ?`;
            params.push(type);
        }
        if (dateRange === 'today') {
            query += ` AND DATE(created_at) = CURDATE()`;
        } else if (dateRange === 'week') {
            query += ` AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
        } else if (dateRange === 'month') {
            query += ` AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
        }
        query += ` ORDER BY created_at DESC LIMIT 100`;

        const [logs] = await db.query(query, params);
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};