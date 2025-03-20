export interface DecodedVideoData {
  userId: string;
  videoUrl: string;
  fileName: string;
  videoSize: number;
  videoDuration: number;
  subtitleType: "merge" | "srt";
  customizationOptions: SubtitleOptions;
  translationLanguage: string;
  creditEstimate: number;
  jobId: string;
  exp?: number;
}
