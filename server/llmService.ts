// server/llmService.ts
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Define the expected structure of the AI analysis output
export interface AIAnalysis {
  summary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  innovationScore: number; // 0-100
  marketPotential: {
    score: number; // 0-100
    justification: string;
  };
  technicalFeasibility: {
    score: number; // 0-100
    justification: string;
  };
}

export const llmService = {
  async analyzeIdea(title: string, description: string): Promise<AIAnalysis | null> {
    const prompt = `
      You are an expert business analyst AI. Analyze the following idea and provide a comprehensive assessment in JSON format.
      The analysis should include:
      1. A 'summary' of the idea.
      2. A 'swot' analysis with lists of strengths, weaknesses, opportunities, and threats.
      3. An 'innovationScore' from 0 to 100.
      4. A 'marketPotential' object with a 'score' from 0 to 100 and a 'justification'.
      5. A 'technicalFeasibility' object with a 'score' from 0 to 100 and a 'justification'.

      Ensure the output is a valid JSON object matching the following TypeScript interface:
      interface AIAnalysis {
        summary: string;
        swot: {
          strengths: string[];
          weaknesses: string[];
          opportunities: string[];
          threats: string[];
        };
        innovationScore: number;
        marketPotential: {
          score: number;
          justification: string;
        };
        technicalFeasibility: {
          score: number;
          justification: string;
        };
      }

      Idea Title: "${title}"
      Idea Description: "${description}"

      JSON Output:
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Attempt to parse the JSON. LLMs can sometimes add extra text.
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      let jsonString = jsonMatch ? jsonMatch[1] : text;

      // Basic cleanup if LLM adds markdown block or other text
      jsonString = jsonString.replace(/```json/, '').replace(/```/, '').trim();

      const analysis: AIAnalysis = JSON.parse(jsonString);
      return analysis;
    } catch (error) {
      console.error('Error analyzing idea with LLM:', error);
      // More robust error handling might involve retries or specific error messages
      return null;
    }
  },
};
