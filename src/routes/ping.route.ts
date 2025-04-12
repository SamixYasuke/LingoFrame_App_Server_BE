import { Router, Request, Response } from "express";
import { HfInference } from "@huggingface/inference";

const router = Router();

const hf = new HfInference("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");

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "PONG" });
});

router.get("/translate", async (req: Request, res: Response) => {
  try {
    const text =
      (req.query.text as string) || "My name is Wolfgang and I live in Berlin";
    if (!text) {
      return res
        .status(400)
        .json({ error: "Text query parameter is required" });
    }

    const output = await hf.translation({
      model: "Helsinki-NLP/opus-mt-en-fr",
      inputs: text,
    });
    res
      .status(200)
      .json({ output: output, translation: output.translation_text });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
