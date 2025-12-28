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
        const customersCollection = db.collection("customers");

        /* =====================================================
           GET → Fetch all bookings
        ===================================================== */
        if (req.method === "GET") {
            const bookings = await bookingsCollection
                .find({})
                .sort({ createdAt: -1 })
                .toArray();

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
           POST → Create booking + sync customer
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

            const bookingAmount = Number(amount) || serviceDoc.price;

            const booking = {
                customerName: customerName.trim(),
                customerEmail: customerEmail?.trim() || "",
                customerPhone: customerPhone?.trim() || "",

                serviceId: new ObjectId(serviceDoc._id),
                serviceName: serviceDoc.name,

                date,
                time,
                paymentMethod: paymentMethod || "cash",
                amount: bookingAmount,

                status: "pending",
                notes: notes?.trim() || "",

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // 1️⃣ Insert booking
            const result = await bookingsCollection.insertOne(booking);

            // 2️⃣ Sync customer data
            const customerFilter = {
                ...(booking.customerEmail && { email: booking.customerEmail }),
                ...(booking.customerPhone && { phone: booking.customerPhone }),
            };


            const existingCustomer = await customersCollection.findOne(customerFilter);

            if (existingCustomer) {
                // Update existing customer
                await customersCollection.updateOne(
                    { _id: existingCustomer._id },
                    {
                        $inc: {
                            totalVisits: 1,
                            totalSpent: bookingAmount,
                        },
                        $set: {
                            lastVisit: date,
                        },
                    }
                );
            } else {
                // Create new customer
                await customersCollection.insertOne({
                    name: booking.customerName,
                    email: booking.customerEmail,
                    phone: booking.customerPhone,
                    totalVisits: 1,
                    totalSpent: bookingAmount,
                    lastVisit: date,
                    createdAt: new Date(),
                });
            }

            return res.status(201).json({
                message: "Booking created successfully",
                bookingId: result.insertedId,
            });
        }

        /* =====================================================
           PATCH → Update booking status
           body: { id, status }
        ===================================================== */
        if (req.method === "PATCH") {
            const { id, status } = req.body;

            if (!id || !status) {
                return res.status(400).json({
                    message: "Booking ID and status required",
                });
            }

            const allowedStatus = [
                "pending",
                "confirmed",
                "completed",
                "cancelled",
            ];

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
