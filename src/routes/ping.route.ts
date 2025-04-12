import { Router, Request, Response } from "express";
import { HfInference } from "@huggingface/inference";

const router = Router();

// Initialize Hugging Face Inference client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Supported languages (subset for demo; m2m100 supports 100 languages)
const supportedLanguages = [
  "en", // English
  "fr", // French
  "ha", // Hausa
  "yo", // Yoruba (limited support)
  "ig", // Igbo (limited support)
  "es", // Spanish
  // Add more as needed; see https://huggingface.co/facebook/m2m100_418M
];

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "PONG" });
});

router.get("/translate", async (req: Request, res: Response) => {
  try {
    const { text, source_lang, target_lang } = req.query;

    // Validate inputs
    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Text query parameter is required" });
    }
    if (!source_lang || typeof source_lang !== "string") {
      return res
        .status(400)
        .json({ error: "Source language (source_lang) is required" });
    }
    if (!target_lang || typeof target_lang !== "string") {
      return res
        .status(400)
        .json({ error: "Target language (target_lang) is required" });
    }

    // Validate language codes
    if (
      !supportedLanguages.includes(source_lang) ||
      !supportedLanguages.includes(target_lang)
    ) {
      return res.status(400).json({
        error: "Unsupported language code",
        supported_languages: supportedLanguages,
      });
    }

    // Perform translation
    const output = await hf.translation({
      model: "facebook/m2m100_418M",
      inputs: text,
      parameters: {
        src_lang: source_lang,
        tgt_lang: target_lang,
      },
    });

    res.status(200).json({ translation: output.translation_text });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
