import clientPromise from "../_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("salonDB");
        const reviews = db.collection("reviews");

        /* ======================
           GET REVIEWS + STATS
        ====================== */
        if (req.method === "GET") {
            const { serviceId, stats, admin, approved } = req.query;

            const baseFilter = serviceId
                ? { serviceId: new ObjectId(serviceId) }
                : {};

            /* ======================
GET APPROVED REVIEWS ONLY
====================== */
            if (approved === "true") {
                const filter = {
                    ...(serviceId && { serviceId: new ObjectId(serviceId) }),
                    isApproved: true
                };

                const approvedReviews = await reviews
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .toArray();

                return res.status(200).json(approvedReviews);
            }


            // Admin mode - return all reviews with stats
            if (admin) {
                const allReviews = await reviews
                    .find(baseFilter)
                    .sort({ createdAt: -1 })
                    .toArray();

                const aggregation = await reviews.aggregate([
                    { $match: baseFilter },
                    {
                        $group: {
                            _id: null,
                            totalReviews: { $sum: 1 },
                            approvedReviews: {
                                $sum: { $cond: ["$isApproved", 1, 0] }
                            },
                            pendingReviews: {
                                $sum: { $cond: ["$isApproved", 0, 1] }
                            },
                            avgRating: {
                                $avg: {
                                    $cond: ["$isApproved", "$rating", null]
                                }
                            }
                        }
                    }
                ]).toArray();

                const statsData = aggregation[0] || {
                    totalReviews: 0,
                    approvedReviews: 0,
                    pendingReviews: 0,
                    avgRating: 0
                };

                return res.status(200).json({
                    stats: {
                        totalReviews: statsData.totalReviews,
                        approvedReviews: statsData.approvedReviews,
                        pendingReviews: statsData.pendingReviews,
                        avgRating: Number(statsData.avgRating?.toFixed(1)) || 0
                    },
                    reviews: allReviews
                });
            }

            // Normal reviews list (approved only)
            const reviewsList = await reviews
                .find({ ...baseFilter, isApproved: true })
                .sort({ createdAt: -1 })
                .toArray();

            // If stats not required → old behavior
            if (!stats) {
                return res.status(200).json(reviewsList);
            }

            /* ======================
               STATS AGGREGATION
            ====================== */
            const aggregation = await reviews.aggregate([
                { $match: baseFilter },
                {
                    $group: {
                        _id: null,
                        totalReviews: { $sum: 1 },
                        approvedReviews: {
                            $sum: { $cond: ["$isApproved", 1, 0] }
                        },
                        pendingReviews: {
                            $sum: { $cond: ["$isApproved", 0, 1] }
                        },
                        avgRating: {
                            $avg: {
                                $cond: ["$isApproved", "$rating", null]
                            }
                        }
                    }
                }
            ]).toArray();

            const statsData = aggregation[0] || {
                totalReviews: 0,
                approvedReviews: 0,
                pendingReviews: 0,
                avgRating: 0
            };

            return res.status(200).json({
                stats: {
                    totalReviews: statsData.totalReviews,
                    approvedReviews: statsData.approvedReviews,
                    pendingReviews: statsData.pendingReviews,
                    avgRating: Number(statsData.avgRating?.toFixed(1)) || 0
                },
                reviews: reviewsList
            });
        }

        /* ======================
           POST REVIEW
        ====================== */
        if (req.method === "POST") {
            const { serviceId, name, rating, comment } = req.body;

            if (!serviceId || !name || !rating) {
                return res.status(400).json({
                    message: "Service ID, name, and rating are required"
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5"
                });
            }

            const review = {
                serviceId: new ObjectId(serviceId),
                name: name.trim(),
                rating: Number(rating),
                comment: comment?.trim() || "",
                isApproved: false,
                createdAt: new Date()
            };

            await reviews.insertOne(review);

            return res.status(201).json({
                message: "Review submitted successfully"
            });
        }

        return res.status(405).json({ message: "Method Not Allowed" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
