import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function auth(req, res) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
