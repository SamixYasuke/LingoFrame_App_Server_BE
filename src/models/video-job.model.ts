import mongoose, { Schema, Document } from "mongoose";

interface IVideoJob extends Document {
  job_id: string;
  user_id: string;
  video_url: string;
  file_name: string;
  duration_minutes: number;
  size_mb: number;
  customization_options: Record<string, any>;
  subtitle_type: "merge" | "srt";
  translation_language: string;
  credit_cost: number;
  status: "waiting" | "active" | "completed" | "failed";
  estimation_message: string;
  result_url?: string;
  error_message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const videoJobSchema: Schema<IVideoJob> = new mongoose.Schema(
  {
    job_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    video_url: {
      type: String,
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    duration_minutes: {
      type: Number,
      required: true,
    },
    size_mb: {
      type: Number,
      required: true,
    },
    customization_options: {
      type: Object,
      default: {},
    },
    subtitle_type: {
      type: String,
      enum: ["merge", "srt"],
      required: true,
    },
    translation_language: {
      type: String,
      default: "",
    },
    credit_cost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "active", "completed", "failed"] as const,
      default: "waiting",
    },
    estimation_message: {
      type: String,
    },
    result_url: {
      type: String,
    },
    error_message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const VideoJob = mongoose.model<IVideoJob>("VideoJob", videoJobSchema);

export default VideoJob;
