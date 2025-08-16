import mongoose from "mongoose";
const { Schema, model } = mongoose;



const enrollmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true },

    activatedAt: { type: Date, required: true },
    expiresAt: { type: Date }, // optional per-user expiry

    sourceOrderId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },

    progress: {
      testsAttempted: { type: Number, default: 0 },
      avgScore: { type: Number },
      lastAttemptAt: { type: Date },
    },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);



// ✅ Indexes
enrollmentSchema.index({ userId: 1, seriesId: 1 }, { unique: true }); 
enrollmentSchema.index({ "progress.lastAttemptAt": -1 });

export default model("Enrollment", enrollmentSchema);
