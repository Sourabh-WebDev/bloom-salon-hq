import clientPromise from "../_db.js";
import { verifyAdmin } from "../middleware/auth.js";

export default async function handler(req, res) {
    try {
        // JWT protection
        verifyAdmin(req);

        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const client = await clientPromise;
        const db = client.db("salonDB");
        const services = db.collection("services");

        const data = await services
            .find({ active: true })
            .sort({ createdAt: -1 })
            .toArray();

        return res.status(200).json(data);

    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
