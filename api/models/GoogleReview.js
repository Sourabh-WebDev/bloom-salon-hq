const GOOGLE_REVIEW_COLLECTION = "reviews";

const toOptionalTrimmedString = (value) => {
    if (typeof value !== "string") return "";
    return value.trim();
};

export const buildGoogleReviewDocument = (payload = {}) => {
    const authorName = toOptionalTrimmedString(payload.authorName);
    const text = toOptionalTrimmedString(payload.text);
    const profilePhoto = toOptionalTrimmedString(payload.profilePhoto);
    const rating = Number(payload.rating);
    const reviewTime = Number(payload.reviewTime);

    if (!authorName) {
        throw new Error("authorName is required");
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        throw new Error("rating must be between 1 and 5");
    }

    const now = new Date();

    return {
        source: "google",
        authorName,
        rating,
        text,
        profilePhoto,
        reviewTime: Number.isFinite(reviewTime) ? reviewTime : null,
        isApproved: Boolean(payload.isApproved),
        // Keep compatibility with existing admin UI fields.
        name: authorName,
        comment: text,
        createdAt: now,
        updatedAt: now
    };
};

export default GOOGLE_REVIEW_COLLECTION;
