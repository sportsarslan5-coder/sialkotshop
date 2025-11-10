import { GoogleGenAI } from "@google/genai";

const getAi = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSialkotHeritageInfo = async (): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      In a brief, elegant paragraph (around 100 words), describe the rich industrial heritage and craftsmanship of Sialkot, Pakistan. 
      Highlight its global reputation for producing high-quality goods like sports equipment, leather products, and surgical instruments. 
      Use an inspiring and professional tone.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
    // FIX: Added missing curly braces to the catch block to fix a syntax error.
  } catch (error) {
    console.error("Error fetching data from Gemini API:", error);
    return "Failed to retrieve information about Sialkot's heritage. The city is renowned for its skilled artisans and world-class manufacturing, a tradition stretching back centuries. Please try again later to learn more.";
  }
};

export const generateProductDescription = async (productName: string): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      Create a compelling, short e-commerce product description for a product named "${productName}".
      The product is from Sialkot, Pakistan, a city known for its high-quality craftsmanship.
      - Keep it under 50 words.
      - Highlight quality and craftsmanship.
      - Use an engaging and professional tone.
      - Do not use markdown or formatting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating product description with Gemini API:", error);
    return `Failed to generate description for ${productName}. Please write one manually.`;
  }
};

export const generateStoreSlogan = async (): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      Generate a short, catchy, and inspiring e-commerce slogan (under 10 words) for 'SialkotShop'.
      The store sells high-quality goods from Sialkot, Pakistan, a city famous for craftsmanship in sports, leather, and surgical items.
      The tone should be professional and trustworthy. Do not use quotation marks.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.replace(/"/g, ''); // Remove quotes if any
  } catch (error) {
    console.error("Error generating store slogan with Gemini API:", error);
    return "Quality You Can Trust.";
  }
};

export const generateSocialMediaPost = async (topic: string): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      Generate a short, engaging, and professional social media post (e.g., for Instagram or Twitter) for 'SialkotShop'.
      The topic is: "${topic}".
      - Keep it under 280 characters.
      - Use a friendly and enthusiastic tone.
      - Include 2-3 relevant hashtags like #Sialkot, #MadeInPakistan, #Craftsmanship.
      - Do not use markdown or formatting.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating social media post with Gemini API:", error);
    return "Failed to generate social media post. Please try again later.";
  }
};

export const generateCustomerServiceReply = async (customerQuery: string): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      You are a helpful and professional customer service agent for 'SialkotShop'.
      A customer has the following query: "${customerQuery}".
      Generate a polite, empathetic, and helpful reply.
      - Start with a friendly greeting.
      - Address their concern directly.
      - Offer a clear solution or next step.
      - End on a positive and helpful note.
      - Do not use markdown or formatting.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating customer service reply with Gemini API:", error);
    return "We're sorry, we couldn't generate a response. Please contact our support team directly for assistance.";
  }
};

export const generateAdCopy = async (productName: string): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      You are an expert digital marketing copywriter.
      Generate a short, compelling ad copy (under 150 characters) for a product named "${productName}" from SialkotShop.
      - Highlight its Sialkot-made quality and craftsmanship.
      - Use persuasive language.
      - Include a strong call-to-action like 'Shop Now' or 'Discover the Quality'.
      - Do not use hashtags or markdown.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating ad copy with Gemini API:", error);
    return `Failed to generate ad copy for ${productName}. Please try again.`;
  }
};
