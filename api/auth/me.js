import auth from "../middleware/auth.js";

export default async function handler(req, res) {
    const user = auth(req, res);
    if (!user) return;

    res.status(200).json({
        id: user.id,
        role: user.role
    });
}
