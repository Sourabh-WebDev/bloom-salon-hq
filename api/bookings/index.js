import clientPromise from "../_db.js";
import { verifyAdmin } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        // Admin only
        verifyAdmin(req);

        const client = await clientPromise;
        const db = client.db("salonDB");
        const bookingsCollection = db.collection("bookings");
        const servicesCollection = db.collection("services");

        /* =====================================================
           GET → Fetch all bookings
        ===================================================== */
        if (req.method === "GET") {
            const bookings = await bookingsCollection
                .find({})
                .sort({ createdAt: -1 })
                .toArray();

            // frontend-friendly shape
            const formatted = bookings.map((b) => ({
                id: b._id.toString(),
                customerName: b.customerName,
                customerEmail: b.customerEmail,
                customerPhone: b.customerPhone,
                service: b.serviceName,
                date: b.date,
                time: b.time,
                paymentMethod: b.paymentMethod,
                amount: b.amount,
                status: b.status,
                notes: b.notes,
                createdAt: b.createdAt,
            }));

            return res.status(200).json(formatted);
        }

        /* =====================================================
           POST → Create booking (your existing logic)
        ===================================================== */
        if (req.method === "POST") {
            const {
                customerName,
                customerEmail,
                customerPhone,
                service,
                date,
                time,
                paymentMethod,
                amount,
                notes,
            } = req.body;

            if (!customerName || !service || !date || !time) {
                return res.status(400).json({
                    message: "Customer name, service, date, and time are required",
                });
            }

            const serviceDoc = await servicesCollection.findOne({
                name: service,
                isActive: true,
            });

            if (!serviceDoc) {
                return res.status(404).json({ message: "Service not found" });
            }

            const booking = {
                customerName: customerName.trim(),
                customerEmail: customerEmail?.trim() || "",
                customerPhone: customerPhone?.trim() || "",

                serviceId: new ObjectId(serviceDoc._id),
                serviceName: serviceDoc.name,

                date,
                time,

                paymentMethod: paymentMethod || "cash",
                amount: Number(amount) || serviceDoc.price,

                status: "pending",
                notes: notes?.trim() || "",

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await bookingsCollection.insertOne(booking);

            return res.status(201).json({
                message: "Booking created successfully",
                bookingId: result.insertedId,
            });
        }

        /* =====================================================
           PATCH → Change booking status
           body: { id, status }
        ===================================================== */
        if (req.method === "PATCH") {
            const { id, status } = req.body;

            if (!id || !status) {
                return res.status(400).json({ message: "Booking ID and status required" });
            }

            const allowedStatus = ["pending", "confirmed", "completed", "cancelled"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const result = await bookingsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status,
                        updatedAt: new Date(),
                    },
                }
            );

            if (!result.matchedCount) {
                return res.status(404).json({ message: "Booking not found" });
            }

            return res.status(200).json({ message: "Booking status updated" });
        }

        /* =====================================================
           DELETE → Remove booking
           body: { id }
        ===================================================== */
        if (req.method === "DELETE") {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Booking ID required" });
            }

            const result = await bookingsCollection.deleteOne({
                _id: new ObjectId(id),
            });

            if (!result.deletedCount) {
                return res.status(404).json({ message: "Booking not found" });
            }

            return res.status(200).json({ message: "Booking deleted successfully" });
        }

        return res.status(405).json({ message: "Method Not Allowed" });

    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
