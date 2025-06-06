
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_MULTIMODAL_MODEL, ALLOWED_FILE_TYPES } from '../constants';

interface ExtractionResult {
  data: string | object;
  rawText: string;
}

export const extractDataFromDocument = async (
  fileContent: string, // This is base64 for images/PDFs, raw text for text files
  mimeType: string,
  prompt: string,
  requiresJsonOutput: boolean
): Promise<ExtractionResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const isImageFile = ALLOWED_FILE_TYPES.image.includes(mimeType);
  const isPdfFile = ALLOWED_FILE_TYPES.pdf.includes(mimeType);
  
  // Use multimodal model for images and PDFs, text model for text files
  const isBinaryUpload = isImageFile || isPdfFile;
  const modelName = isBinaryUpload ? GEMINI_MULTIMODAL_MODEL : GEMINI_TEXT_MODEL;
  
  const parts: Part[] = [];

  if (isBinaryUpload) {
    // For images and PDFs, fileContent is a base64 string
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: fileContent,
      },
    });
    parts.push({ text: prompt }); // Prompt for the image/PDF
  } else {
    // For text files, fileContent is raw text. Combine prompt and file content.
    parts.push({ text: `${prompt}\n\nDocument Content:\n${fileContent}` });
  }

  const generationConfig: { responseMimeType?: string } = {};
  if (requiresJsonOutput) {
    generationConfig.responseMimeType = "application/json";
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: parts }],
      config: generationConfig,
    });

    const rawText = response.text;

    if (requiresJsonOutput) {
      let jsonStr = rawText.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/si;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      
      try {
        const parsedJson = JSON.parse(jsonStr);
        return { data: parsedJson, rawText };
      } catch (e) {
        console.warn("Failed to parse JSON response from Gemini, returning raw text within an error structure.", e);
        // Return the raw text but signal that JSON parsing failed.
        // OutputDisplay will show rawText if data.content has this error structure.
        return { data: { error: "Failed to parse JSON response from AI.", rawResponse: jsonStr }, rawText };
      }
    }
    
    return { data: rawText, rawText };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // More specific error handling could be added here if Gemini SDK provides structured errors
        throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with Gemini API.");
  }
};
