import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ResumeAnalysis {
  skills: string[];
  experienceSummary: string;
  suitabilityScore: number;
  suggestions: string[];
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze the following resume text and provide a structured evaluation.
        
        Resume Text:
        ${resumeText}
        
        Provide the output in JSON format with the following structure:
        {
          "skills": ["skill1", "skill2", ...],
          "experienceSummary": "A brief summary of work experience",
          "suitabilityScore": 85, (a number between 0 and 100)
          "suggestions": ["suggestion1", "suggestion2", ...]
        }` }],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of extracted technical and soft skills",
          },
          experienceSummary: {
            type: Type.STRING,
            description: "A concise summary of the candidate's professional experience",
          },
          suitabilityScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing overall resume quality and professional readiness",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable tips to improve the resume",
          },
        },
        required: ["skills", "experienceSummary", "suitabilityScore", "suggestions"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result as ResumeAnalysis;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}
