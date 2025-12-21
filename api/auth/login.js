import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import clientPromise from "../_db.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing credentials" });
    }

    const client = await clientPromise;
    const db = client.db("salonDB");
    const admin = await db.collection("admins").findOne({ email });

    if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        })
    );

    res.status(200).json({ message: "Login successful" });
}
