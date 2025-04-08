import { SubtitleOptions } from "./subtitle-options";

export interface DecodedVideoData {
  userId: string;
  videoUrl: string;
  fileName: string;
  videoSizeInBytes: number;
  videoDurationInSeconds: number;
  subtitleType: "merge" | "srt";
  customizationOptions: SubtitleOptions;
  translationLanguage: string;
  creditEstimate: number;
  jobId: string;
  exp?: number;
}
