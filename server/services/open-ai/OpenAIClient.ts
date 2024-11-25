import OpenAI from "openai";
import { Uploadable } from "openai/uploads.mjs";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

type TransformRawDataToStructuredJsonParams = {
    message: string;
    prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
};

type SchemaBasedCompletionParams<T extends z.ZodType> = {
    message: string;
    prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    schema: T;
};

type SpeechToTextParams = {
    file: Uploadable;
};

type GetInstance = {
    key: string;
    model: OpenAI.Chat.ChatModel;
    audioModel: OpenAI.AudioModel;
};

class OpenAIClient {
    private static instance: OpenAIClient;
    private client: OpenAI;
    private model: OpenAI.Chat.ChatModel;
    private audioModel: OpenAI.AudioModel;

    private constructor(key: string, model: OpenAI.Chat.ChatModel, whisperModel: OpenAI.AudioModel) {
        this.client = new OpenAI({
            apiKey: key,
        });
        this.model = model;
        this.audioModel = whisperModel;
    }

    public static getInstance({ key, model, audioModel: whisperModel }: GetInstance): OpenAIClient {
        if (!OpenAIClient.instance) {
            OpenAIClient.instance = new OpenAIClient(key, model, whisperModel);
        }
        return OpenAIClient.instance;
    }

    public async trasformRawDataToStructuredJson({ message, prompt }: TransformRawDataToStructuredJsonParams): Promise<string | null> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [...prompt, { role: "user", content: message }],
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error("An error occurred:", error);
            return null;
        }
    }

    public async schemaBasedCompletion<T extends z.ZodType>({ message, prompt, schema }: SchemaBasedCompletionParams<T>) {
        try {
            const response = await this.client.beta.chat.completions.parse({
                model: this.model,
                messages: [...prompt, { role: "user", content: message }],
                response_format: zodResponseFormat(schema, "entity"),
            });

            return response.choices[0].message.content;
        } catch (e) {
            console.log(e);

            return undefined;
        }
    }

    public async speechToText({ file }: SpeechToTextParams) {
        try {
            const response = await this.client.audio.transcriptions.create({
                file,
                model: this.audioModel,
                response_format: "json",
            });

            return response;
        } catch (error) {
            console.error("An error occurred:", error);
            return null;
        }
    }
}

export default OpenAIClient;

type PromptArray = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export type { PromptArray };
