import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeImage = async (filePath: string) => {
  try {
    const base64ImageFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      {
        text: `
          Analyze this food image.
          Return ONLY valid JSON in this format:
          {
            "name": "food name",
            "calories": number
          }

          - Calories must be a number only.
          - Do not include units like "calories".
          - No extra text.
          `,
      },
    ];

    const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          calories: { type: "number" },
        },
        required: ["name", "calories"],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
