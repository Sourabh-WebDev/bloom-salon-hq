import clientPromise from "../../_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        const client = await clientPromise;
        const db = client.db("salonDB");
        const reviews = db.collection("reviews");

        await reviews.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isApproved: true, updatedAt: new Date() } }
        );

        return res.status(200).json({ message: "Approved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
