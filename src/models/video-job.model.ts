import mongoose, { Schema, Document } from "mongoose";

interface IVideoJob extends Document {
  job_id: string;
  user_id: string;
  video_url: string;
  file_name: string;
  duration: number;
  size_mb: number;
  features: string[];
  subtitle_options: Record<string, any>;
  credit_cost: number;
  status: "waiting" | "active" | "completed" | "failed";
  result_url?: string;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

const videoJobSchema: Schema<IVideoJob> = new mongoose.Schema({
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
  duration: {
    type: Number,
    required: true,
  },
  size_mb: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  subtitle_options: {
    type: Object,
    default: {},
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
  result_url: {
    type: String,
  },
  error_message: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const VideoJob = mongoose.model<IVideoJob>("VideoJob", videoJobSchema);

export default VideoJob;
