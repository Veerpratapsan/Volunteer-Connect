import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API using the environment variable string
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCR5hCBwwmhukhHJTUnC5CyhdOf2O6kpNg';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ExtractedNeedData {
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  volunteerCount: string;
  location: string;
  deadline: string;
  description: string;
  requiredSkills: string;
}

export const extractNeedDataFromText = async (text: string): Promise<ExtractedNeedData | null> => {
  if (!API_KEY) {
    console.warn("Gemini API key is not configured.");
    return null;
  }

  try {
    // Using 'gemini-flash-latest' for maximum stability across different API key tiers
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
You are an intelligent data extraction assistant for an NGO portal.
Extract information from the unstructured text below to fill an NGO task request.
Return ONLY raw JSON, with no markdown wrappers, no \`\`\`json, just the object.

Required fields in the JSON:
- "title": A short, clear title matching the need (String, e.g. "Flood Relief Assistance").
- "category": The category (String, e.g. "Disaster Relief", "Education", "Food Security").
- "priority": Must be strictly one of these values: "low", "medium", "high", or "urgent".
- "volunteerCount": Estimated number of volunteers needed, as a string number (e.g. "10"). Use "5" if unclear.
- "location": The physical location mentioned, or empty string.
- "deadline": Best guess deadline formatted as YYYY-MM-DD. If none mentioned, guess a date 3 days from now.
- "description": A concise, well-written description of the task based on the text.
- "requiredSkills": A comma-separated list of skills extracted (e.g. "Heavy lifting, First Aid").

Unstructured Text:
"""
${text}
"""
    `;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();

    // Extract everything between the first { and the last } to handle any conversational filler or markdown
    const match = output.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("No JSON object found in AI output:", output);
      return null;
    }

    return JSON.parse(match[0]) as ExtractedNeedData;
  } catch (err: any) {
    console.error("AI Extraction Error:", err);
    return null;
  }
}
