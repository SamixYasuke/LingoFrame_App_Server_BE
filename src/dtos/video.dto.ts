import { z } from "zod";

// Define language names as a readonly array for type safety
const languageNames = [
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Arabic",
  "Chinese",
  "English",
  "Japanese",
  "Korean",
  "Polish",
  "Turkish",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Greek",
  "Czech",
  "Hungarian",
  "Romanian",
  "Bulgarian",
  "Ukrainian",
  "Hebrew",
  "Hindi",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Malayalam",
  "Kannada",
  "Odia",
  "Assamese",
  "Nepali",
  "Sinhala",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Filipino",
  "Swahili",
  "Zulu",
  "Xhosa",
  "Afrikaans",
  "Amharic",
  "Somali",
  "Hausa",
  "Yoruba",
  "Igbo",
  "Sesotho",
  "Shona",
  "Kinyarwanda",
  "Tigrinya",
  "Mongolian",
  "Kazakh",
  "Uzbek",
  "Turkmen",
  "Kyrgyz",
  "Tajik",
  "Pashto",
  "Dari",
  "Farsi (Persian)",
  "Urdu",
  "Sindhi",
  "Balochi",
  "Kurdish",
  "Armenian",
  "Georgian",
  "Azerbaijani",
  "Macedonian",
  "Albanian",
  "Serbian",
  "Croatian",
  "Bosnian",
  "Slovak",
  "Slovenian",
  "Estonian",
  "Latvian",
  "Lithuanian",
  "Icelandic",
  "Irish",
  "Scottish Gaelic",
  "Welsh",
  "Basque",
  "Catalan",
  "Galician",
  "Esperanto",
  "Latin",
  "Haitian Creole",
  "Quechua",
  "Nahuatl",
  "Māori",
  "Samoan",
  "Tongan",
  "Fijian",
  "Hmong",
  "Burmese",
  "Khmer",
  "Lao",
] as const;

// Define font names as a readonly array for type safety
const fontNames = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
  "Trebuchet MS",
  "Comic Sans MS",
  "Impact",
  "DejaVu Serif",
  "DejaVu Sans Mono",
  "Liberation Serif",
  "Liberation Mono",
  "Chiller",
  "Colonna MT",
] as const;

const colorSchema = z.string().regex(/^&H[0-9A-Fa-f]{8}$/, {
  message:
    "Color must be in the format &H followed by 8 hexadecimal digits (e.g., &H00FFFFFF)",
});

const customizationOptions = z
  .object({
    fontName: z.enum(fontNames),
    fontSize: z.number().min(1, { message: "Font size must be positive" }),
    primaryColour: colorSchema,
    outline: z
      .number()
      .min(0)
      .max(1, { message: "Outline must be between 0 and 1" }),
    outlineColour: colorSchema,
    bold: z.boolean(),
    italic: z.boolean(),
    underline: z.boolean(),
    verticalPosition: z.enum(["top", "center", "bottom"]),
    horizontalPosition: z.enum(["left", "middle", "right"]),
    fadeInDuration: z
      .number()
      .min(0, { message: "Duration must be non-negative" }),
    fadeOutDuration: z
      .number()
      .min(0, { message: "Duration must be non-negative" }),
  })
  .optional();

export const GetVideoEstimateDto = z.object({
  video_url: z
    .string({ required_error: "Video URL is required" })
    .url({ message: "Invalid URL" })
    .refine((url) => /\.(mp4|mov|avi|mkv|webm)$/i.test(new URL(url).pathname), {
      message: "URL must point to a video file",
    }),
  file_name: z
    .string({ required_error: "File name is required" })
    .min(1, { message: "File name cannot be empty" })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message:
        "File name can only contain letters, numbers, dots, hyphens, or underscores",
    }),
  subtitle_type: z.enum(["srt", "merge"], {
    required_error: "Subtitle type is required",
  }),
  customization_options: customizationOptions,
  translation_language: z
    .enum([...languageNames, ""], { message: "Invalid language" })
    .default(""),
});

export type GetVideoEstimateDtoType = z.infer<typeof GetVideoEstimateDto>;
