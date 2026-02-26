import axios from "axios";
import clientPromise from "../_db.js";
import { buildGoogleReviewDocument } from "../models/GoogleReview.js";

const GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

const buildUpsertUpdate = (review, existingReview) => {
    const next = buildGoogleReviewDocument({
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        profilePhoto: review.profile_photo_url,
        reviewTime: review.time,
        isApproved: existingReview?.isApproved ?? false
    });

    // Keep original creation timestamp for existing records.
    if (existingReview?.createdAt) {
        next.createdAt = existingReview.createdAt;
    }

    return next;
};

const syncGoogleReviews = async () => {
    const placeId = process.env.PLACE_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!placeId || !apiKey) {
        throw new Error("PLACE_ID and GOOGLE_API_KEY are required");
    }

    const response = await axios.get(GOOGLE_PLACE_DETAILS_URL, {
        params: {
            place_id: placeId,
            fields: "reviews",
            key: apiKey
        }
    });

    if (response.data?.status && response.data.status !== "OK") {
        throw new Error(`Google Places API error: ${response.data.status}`);
    }

    const googleReviews = response.data?.result?.reviews || [];
    const client = await clientPromise;
    const db = client.db("salonDB");
    const reviews = db.collection("reviews");

    let upserted = 0;
    let modified = 0;

    for (const review of googleReviews) {
        const filter = {
            source: "google",
            reviewTime: Number(review.time),
            authorName: review.author_name
        };

        const existingReview = await reviews.findOne(filter, {
            projection: { _id: 1, isApproved: 1, createdAt: 1 }
        });

        const updateDoc = buildUpsertUpdate(review, existingReview);
        const result = await reviews.updateOne(
            filter,
            { $set: updateDoc },
            { upsert: true }
        );

        if (result.upsertedCount) upserted += result.upsertedCount;
        if (result.modifiedCount) modified += result.modifiedCount;
    }

    return {
        fetched: googleReviews.length,
        upserted,
        updated: modified
    };
};

export default syncGoogleReviews;
