import mongoose, {Schema} from "mongoose";

const issueMediaSchema = new Schema(
  {
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    fileUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] }
  },
  { timestamps: true }
);

export const IssueMedia = mongoose.model("IssueMedia", issueMediaSchema);
