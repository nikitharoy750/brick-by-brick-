import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      concepts = [],
      caption = "",
      hashtags = [],
    } = body;

    if (!Array.isArray(concepts) || concepts.length === 0) {
      return NextResponse.json(
        { error: "No concepts were provided." },
        { status: 400 }
      );
    }

    const prompt = `
You are the AI behind a humorous website called "Brick by Brick".

The website analyzes someone's Instagram Reel habits
and turns them into a ridiculous fictional algorithm personality.

The user's selected Reel concepts are:

${concepts.join(", ")}

Caption:
${caption || "No caption supplied"}

Hashtags:
${hashtags.length ? hashtags.join(", ") : "No hashtags supplied"}

Analyze the concepts together and roast the user's Instagram algorithm.

The roast should:
- Be extremely sarcastic
- Be funny and playful
- Use natural Malayalam/Manglish
- Sound like a friend roasting them
- Mix Malayalam and English naturally
- Reference the combination of concepts
- Avoid genuinely hateful or abusive content

Return:
1. A ridiculous algorithm personality name
2. A short description
3. A sarcastic Malayalam/Manglish roast
4. The funniest combination of concepts
5. Four scores from 0 to 100:
   - delusion
   - brainrot
   - mainCharacter
   - usefulContent

Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            personality: {
              type: "string",
            },
            description: {
              type: "string",
            },
            roast: {
              type: "string",
            },
            topCombination: {
              type: "string",
            },
            delusion: {
              type: "integer",
            },
            brainrot: {
              type: "integer",
            },
            mainCharacter: {
              type: "integer",
            },
            usefulContent: {
              type: "integer",
            },
          },

          required: [
            "personality",
            "description",
            "roast",
            "topCombination",
            "delusion",
            "brainrot",
            "mainCharacter",
            "usefulContent",
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = JSON.parse(response.text);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Gemini analysis error:", error);

    return NextResponse.json(
      { error: "Failed to analyze the algorithm." },
      { status: 500 }
    );
  }
}