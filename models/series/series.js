const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const seriesSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true }, // e.g. 'mdcat-series-2025'
        title: { type: String, required: true },
        coverImageUrl: { type: String },
        description: { type: String, required: true },
        subjects: [{ type: String, required: true }], // e.g. ["Biology","Chemistry","Physics"]
        difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
        price: { type: Number, required: true }, // PKR
        originalPrice: { type: Number },
        isActive: { type: Boolean, default: true },
        tags: [{ type: String }], // e.g. ["mdcat","medical"]
        totalTests: { type: Number, required: true },
        totalDurationMin: { type: Number },
        ratings: {
            count: { type: Number, default: 0 },
            average: { type: Number, default: 0 },
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // admin id
        expiresAt: { type: Date },
    },
    { timestamps: true }
);

const Series= model("Series", seriesSchema);
module.exports=Series;
