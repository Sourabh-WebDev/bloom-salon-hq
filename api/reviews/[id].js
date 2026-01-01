import clientPromise from "../_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("salonDB");
        const reviews = db.collection("reviews");

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        if (req.method === "PATCH") {
            const { isApproved } = req.body;

            await reviews.updateOne(
                { _id: new ObjectId(id) },
                { $set: { isApproved } }
            );

            return res.status(200).json({ message: "Review updated successfully" });
        }

        return res.status(405).json({ message: "Method Not Allowed" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}