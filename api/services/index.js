import clientPromise from "../_db.js";
import { verifyAdmin } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        // Protect route (admin only)
        verifyAdmin(req);

        const client = await clientPromise;
        const db = client.db("salonDB");
        const services = db.collection("services");

        /* ======================
           GET SERVICES
        ====================== */
        if (req.method === "GET") {
            const data = await services
                .find({ isActive: true })
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json(data);
        }

        /* ======================
           CREATE SERVICE
        ====================== */
        if (req.method === "POST") {
            const {
                name,
                category,
                price,
                duration,
                description,
                isActive = true
            } = req.body;

            // Basic validation
            if (!name || !price || !duration) {
                return res.status(400).json({
                    message: "Name, price, and duration are required"
                });
            }

            const service = {
                name: name.trim(),
                category: category?.trim() || "General",
                price: Number(price),
                duration: duration.toString(),
                description: description?.trim() || "",
                isActive,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await services.insertOne(service);
            const newService = { ...service, _id: result.insertedId };

            return res.status(201).json(newService);
        }

        /* ======================
           UPDATE SERVICE
        ====================== */
        if (req.method === "PUT") {
            const { id } = req.query;
            const {
                name,
                category,
                price,
                duration,
                description,
                isActive
            } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Service ID is required" });
            }

            const updateData = {
                ...(name && { name: name.trim() }),
                ...(category && { category: category.trim() }),
                ...(price && { price: Number(price) }),
                ...(duration && { duration: duration.toString() }),
                ...(description !== undefined && { description: description.trim() }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: new Date()
            };

            await services.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

            return res.status(200).json({ message: "Service updated successfully" });
        }

        /* ======================
           TOGGLE ACTIVE STATUS
        ====================== */
        if (req.method === "PATCH") {
            const { id } = req.query;
            const { isActive } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Service ID is required" });
            }

            await services.updateOne(
                { _id: new ObjectId(id) },
                { $set: { isActive, updatedAt: new Date() } }
            );

            return res.status(200).json({ message: "Service status updated" });
        }

        /* ======================
           DELETE SERVICE
        ====================== */
        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: "Service ID is required" });
            }

            await services.deleteOne({ _id: new ObjectId(id) });

            return res.status(200).json({ message: "Service deleted successfully" });
        }

        return res.status(405).json({ message: "Method Not Allowed" });

    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
