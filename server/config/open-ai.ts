import OpenAIClient from "@/server/services/open-ai/OpenAIClient";

export const openai = OpenAIClient.getInstance({ key: process.env.OPENAI_KEY || "", model: "gpt-4o-mini", audioModel: "whisper-1" });
