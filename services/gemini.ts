import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { calculateFinalPrice } from "../constants";
import { Product } from "../types";

let chatSession: Chat | null = null;
let lastUsedProductsHash: string = "";

const formatCatalogForPrompt = (products: Product[]) => {
    return products.map(p => 
        `- SKU: "${p.sku || p.id}" | Name: "${p.name}" | Description: "${p.description}" | Category: "${p.category}" | Unit Price: ₱${calculateFinalPrice(p.price).toFixed(2)} | Stock: ${p.stock} | ImagePath: "${p.image ? 'Present' : 'Missing'}"`
    ).join('\n');
};

export const initializeChat = async (products: Product[]) => {
    if (!process.env.API_KEY) {
        console.warn("Gemini API Key missing");
        return null;
    }

    // Generate a lightweight hash to check if catalog data changed, avoiding huge base64 strings
    const currentHash = JSON.stringify(products.map(p => p.id + p.stock + p.price));
    
    // Reuse session if catalog hasn't changed
    if (chatSession && lastUsedProductsHash === currentHash) {
        return chatSession;
    }

    lastUsedProductsHash = currentHash;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `SYSTEM ROLE: Online Catalog Engine + Auto-Quotation Expert

DESCRIPTION:
You are the permanent AI engine of the Online Catalog and Auto-Quotation App. 
Your primary function is to store, recall, and use all product data provided in the context.

CORE FUNCTIONS:

1. PRODUCT RETRIEVAL
- Search by SKU, Title, Keywords, or Image.
- Always return the exact stored record from the provided catalog.
- IMPORTANT: You must always display the 'ImagePath' exactly as provided in the data.

2. AUTO QUOTATION GENERATION
- When requested, generate a quotation using stored product data.
- Compute: Unit Price, Quantity, Line Total, Subtotal, Discount (default 0), Delivery (default 0), Grand Total.
- Output structured format: SKU – Title – Description – Unit Price – Quantity – Total – Image Path.

3. SYSTEM RELIABILITY
- The catalog data provided to you is the "Fixed Memory".
- Do not hallucinate products not in the list.
- If a user asks to "Edit" or "Delete", politely inform them to use the manual override buttons in the UI (Edit/Delete buttons on the product cards).

DATA CONTEXT:
Here is the current Fixed Memory (Product Catalog):
${formatCatalogForPrompt(products)}

OUTPUT STYLE:
- Provide clean, structured catalog data.
- Ensure accurate quotation breakdowns.
- Use Markdown for tables.
- Be professional and precise.`,
        }
    });

    return chatSession;
};

export const sendMessage = async (message: string, products: Product[]): Promise<string> => {
    const chat = await initializeChat(products);
    if (!chat) return "I'm sorry, my connection to the server is currently unavailable. Please check the API key configuration.";

    try {
        const result: GenerateContentResponse = await chat.sendMessage({ message });
        return result.text || "I'm not sure how to respond to that.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I encountered an error processing your request. Please try again.";
    }
};

export const searchProducts = async (searchTerm: string, products: Product[]): Promise<string[]> => {
    if (!process.env.API_KEY) {
        console.warn("Gemini API Key missing");
        return [];
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const catalogContext = products.map(p => {
        const finalPrice = calculateFinalPrice(p.price);
        return `ID: "${p.id}" | Name: "${p.name}" | Category: "${p.category}" | Desc: "${p.description}" | Dimensions: "${p.dimensions || ''}" | Final Price: ${finalPrice}`;
    }).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
                You are an intelligent search engine for a furniture store.
                Analyze the User Search Query and return a JSON array of Product IDs that match the intent.

                User Search Query: "${searchTerm}"
                
                Product Catalog Data:
                ${catalogContext}
                
                Logic:
                1. Text Match: Match keywords in Name, Description, or Category.
                2. Price Filtering: If the user specifies a price, strictly filter based on 'Final Price'.
                3. Feature Matching: Match specific attributes.
                4. Return ONLY a JSON array of strings (Product IDs).
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return [];

        // Clean up markdown code blocks if present
        const cleanedJson = jsonText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Gemini Search Error:", error);
        return [];
    }
};

export const generateProductDescription = async (name: string, category: string, keywords: string = ""): Promise<string | null> => {
    if (!process.env.API_KEY) {
        console.warn("Gemini API Key missing");
        return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
                Generate a concise, professional product description for a furniture item.
                
                Product Name: "${name}"
                Category: "${category}"
                Key Features/Context: "${keywords}"
                
                Requirements:
                - Integrate the provided key features naturally into the description.
                - Focus on material quality, functionality, and design style.
                - Max 2-3 sentences.
                - Tone: Premium, inviting, sales-oriented.
                - Output only the description text, no labels, no markdown.
            `,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Description Generation Error:", error);
        return null;
    }
};

export const generateProductImage = async (productName: string, description: string, category: string = ''): Promise<string | null> => {
    if (!process.env.API_KEY) {
        console.warn("Gemini API Key missing");
        return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Define category-specific visual keywords to guide the model
    const categoryKeywords: Record<string, string> = {
        'Executive Table': 'luxury office desk, mahogany wood, glass top, executive suite, corporate power, ceo office, premium finish',
        'Office Table': 'modern workspace desk, ergonomic, clean lines, productivity, melamine finish, office workstation, professional',
        'Office Chair': 'ergonomic office chair, mesh back, leather seat, comfortable seating, adjustable armrests, rolling casters',
        'Cabinet & Storage': 'steel filing cabinet, organized office, secure storage, metal rack, archival system, sleek storage solution',
        'Reception & Conference': 'modern conference table, meeting room, professional gathering, sleek design, boardroom centerpiece',
        'Partition': 'office partition, privacy screen, cubicle system, sound absorption, open plan separation, modular workspace',
        'Accessories': 'office desk organizer, modern office tool, minimal design, essential workspace accessory',
        'Home Furniture': 'cozy home office, residential furniture, stylish interior, modern living space'
    };

    const styleContext = categoryKeywords[category] || 'modern minimalist office furniture, professional studio lighting, high-end commercial design';

    const maxRetries = 2; // Total attempts: 1 initial + 2 retries
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { 
                            text: `Generate a photorealistic, high-end commercial product photography image of "${productName}".

                            Category: ${category}
                            Context Keywords: ${styleContext}
                            Product Description: "${description}"

                            CRITICAL VISUAL GUIDELINES:
                            1. **Subject**: Show the ${category || 'furniture'} piece fully assembled, isolated in the center. 
                            2. **Background**: Pure solid white background (Hex #FFFFFF) or very subtle light grey studio cyclorama to emphasize the product.
                            3. **Lighting**: Professional studio lighting. Softbox lighting to create smooth highlights on surfaces (wood, glass, metal) and soft shadows underneath to ground the product. Avoid harsh, dark shadows.
                            4. **Angle**: 
                               - Tables/Desks: 3/4 perspective view to show legroom, depth, and surface area.
                               - Cabinets/Shelves: Front 3/4 view to show storage capacity and depth.
                               - Chairs: 3/4 view.
                            5. **Style**: Modern, Corporate, Clean, Architectural, Premium quality.
                            6. **Quality**: 4k resolution, sharp focus throughout the object.
                            
                            The image should look like it belongs in a premium office furniture catalog.` 
                        }
                    ]
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1",
                    }
                }
            });

            const parts = response.candidates?.[0]?.content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData) {
                        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    }
                }
            }
        } catch (error) {
            console.error(`Gemini Image Generation Error (Attempt ${attempt + 1}/${maxRetries}):`, error);
            // If it's the last attempt, re-throw or return null
            if (attempt === maxRetries - 1) {
                return null;
            }
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
    }
    return null; // Return null if all retries fail
};