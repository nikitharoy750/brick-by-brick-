import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

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
You are the AI behind a fun website called "Brick by Brick".

The website analyzes a user's Instagram Reel collection and determines
what kind of algorithmic personality their feed has.

Analyze the ENTIRE collection together.

Do not analyze each concept in isolation.
Look for combinations, patterns, contradictions, and recurring themes.

The tone should be:
- funny
- highly sarcastic
- playful
- internet-native
- specific to the provided content
- natural Malayalam + English (Manglish) when writing the roast

Do NOT be hateful, discriminatory, threatening, or genuinely insulting.
The roast should feel like a friend making fun of someone's Instagram
algorithm.

USER'S SELECTED CONCEPTS:
${JSON.stringify(concepts)}

USER'S REEL CAPTION:
${caption || "No caption provided"}

USER'S REEL HASHTAGS:
${JSON.stringify(hashtags)}

Generate:

1. personality
A short funny name for this person's algorithm personality.

2. description
A short explanation of what their algorithm says about them.

3. roast
A sarcastic Malayalam/Manglish roast based specifically on the
combination of concepts, caption, and hashtags.

4. topCombination
The most interesting combination of concepts you detected.

5. delusion
A score from 0 to 100 representing how delusional the algorithm is.

6. brainrot
A score from 0 to 100 representing how brainrotted the algorithm is.

7. mainCharacter
A score from 0 to 100 representing how much main-character energy
the algorithm has.

8. usefulContent
A score from 0 to 100 representing how useful the overall content is.

Be creative, but base the result on the provided data.
`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality: {
              type: Type.STRING,
              description: "Funny name for the user's algorithm personality.",
            },
            description: {
              type: Type.STRING,
              description: "Short explanation of the algorithm personality.",
            },
            roast: {
              type: Type.STRING,
              description: "Funny sarcastic Malayalam/Manglish roast.",
            },
            topCombination: {
              type: Type.STRING,
              description: "Most interesting combination of concepts.",
            },
            delusion: {
              type: Type.NUMBER,
              description: "Delusion score from 0 to 100.",
            },
            brainrot: {
              type: Type.NUMBER,
              description: "Brainrot score from 0 to 100.",
            },
            mainCharacter: {
              type: Type.NUMBER,
              description: "Main character score from 0 to 100.",
            },
            usefulContent: {
              type: Type.NUMBER,
              description: "Useful content score from 0 to 100.",
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
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze the reels.",
      },
      { status: 500 }
    );
  }
}