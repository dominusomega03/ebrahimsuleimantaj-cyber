
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Service, Product } from '../types';

// Initialize Gemini
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getAIRecommendation = async (
  user: UserProfile, 
  services: Service[], 
  context: string
): Promise<string> => {
  if (!apiKey) return "Tumy is calculating your next level of success...";

  const modelId = "gemini-2.5-flash";
  const prompt = `
    You are "Tumy", a high-end Concierge and Sales Psychologist.
    User: ${user.name}, Location: ${user.location} (Tier: ${user.tier}).
    Goal: Use Robert Cialdini's principles of persuasion (Scarcity, Authority, Social Proof) to suggest a service.
    
    Trigger: The user is in a high-income area. They value status, time-saving, and exclusivity.
    
    Task: Write a 1-sentence "Hook" that creates desire or FOMO (Fear Of Missing Out).
    Tone: Sophisticated, Exclusive, Urgent, Motivational.
    
    Example 1: "Karen's elite are booking the Ceramic Shield—don't let your investment fade."
    Example 2: "Your schedule is demanding; let our Executive Wash handle the details while you lead."
    Example 3: "Unlock the full potential of your ride with a custom wrap before the weekend."
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Upgrade your lifestyle today. You deserve the best.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Invest in yourself. Book a premium service today.";
  }
};

export const chatWithConcierge = async (
  history: { role: string; text: string }[], 
  message: string,
  user: UserProfile
) => {
  if (!apiKey) throw new Error("API Key missing");

  const modelId = "gemini-2.5-flash";
  const systemInstruction = `
    You are 'Tumy', an elite Lifestyle Manager and Sales Expert.
    Your goal is not just to answer, but to *persuade* and *upsell* using the AIDA model (Attention, Interest, Desire, Action).
    
    Key Traits:
    1. **Authority**: You know what's best for luxury vehicles and homes.
    2. **Scarcity**: Remind them that slots are filling up fast in ${user.location}.
    3. **Empathy**: You understand they are busy and successful.
    
    If they ask about a wash, suggest the "Ceramic Coating" for long-term value.
    If they ask about cleaning, mention "Deep Sofa Restoration" for a healthier home.
    
    Always end with a Call to Action (CTA).
    Keep it fun, 3D-minded (realistic and vivid descriptions), and professional.
  `;

  const chat = ai.chats.create({
    model: modelId,
    config: { systemInstruction },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const findRelevantServices = async (
    query: string,
    services: Service[]
): Promise<string[]> => {
    if (!apiKey) return [];
    
    const serviceList = services.map(s => `${s.id}: ${s.title} - ${s.description}`).join('\n');
    const prompt = `
        User Query: "${query}"
        
        Available Services:
        ${serviceList}
        
        Task: Identify the IDs of the services that best match the user's natural language query.
        Return ONLY a JSON array of strings (service IDs). If no match, return empty array [].
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("AI Search Error", e);
        return [];
    }
}
