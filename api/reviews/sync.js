import { verifyAdmin } from "../middleware/auth.js";
import syncGoogleReviews from "../services/syncGoogleReviews.js";

const isCronSecretValid = (req) => {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return false;

    const authHeader = req.headers.authorization || "";
    return authHeader === `Bearer ${cronSecret}`;
};

export default async function handler(req, res) {
    if (req.method !== "POST" && req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const isCronAuth = isCronSecretValid(req);
        if (!isCronAuth) {
            verifyAdmin(req);
        }

        const result = await syncGoogleReviews();

        return res.status(200).json({
            message: "Google reviews synced successfully",
            triggeredBy: isCronAuth ? "cron" : "admin",
            ...result
        });
    } catch (error) {
        const statusCode = error.message === "Admin access required"
            ? 403
            : error.message === "Not authenticated" || error.message === "Invalid token"
                ? 401
                : 500;

        return res.status(statusCode).json({
            message: error.message || "Failed to sync Google reviews"
        });
    }
}
