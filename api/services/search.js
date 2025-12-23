import clientPromise from "../_db.js";
import { verifyAdmin } from "../middleware/auth.js";

export default async function handler(req, res) {
    try {
        verifyAdmin(req);

        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const client = await clientPromise;
        const db = client.db("salonDB");
        const services = db.collection("services");

        const searchRegex = new RegExp(q, "i");
        
        const data = await services
            .find({
                $and: [
                    { isActive: true },
                    {
                        $or: [
                            { name: { $regex: searchRegex } },
                            { category: { $regex: searchRegex } },
                            { description: { $regex: searchRegex } }
                        ]
                    }
                ]
            })
            .sort({ createdAt: -1 })
            .toArray();

        return res.status(200).json(data);

    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}