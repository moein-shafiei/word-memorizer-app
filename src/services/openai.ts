import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '../config/openai';

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Generate word meaning and example
export const generateWordContent = async (word: string): Promise<{ meaning: string; example: string }> => {
  try {
    const prompt = `Provide a clear definition and a practical example sentence for the word "${word}".
Format the response as:
Definition: [concise definition]
Example: [example sentence that clearly demonstrates usage]`;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const content = response.data.choices[0]?.text || '';
    
    // Parse the response
    const definitionMatch = content.match(/Definition:(.*?)(?=Example:|$)/s);
    const exampleMatch = content.match(/Example:(.*?)(?=$)/s);
    
    const meaning = definitionMatch ? definitionMatch[1].trim() : 'No definition available';
    const example = exampleMatch ? exampleMatch[1].trim() : 'No example available';
    
    return { meaning, example };
  } catch (error) {
    console.error('Error generating word content:', error);
    return { 
      meaning: 'Unable to generate definition at this time', 
      example: 'Unable to generate example at this time' 
    };
  }
};

// Generate image prompt for the word
export const generateImagePrompt = async (word: string, meaning: string): Promise<string> => {
  try {
    const prompt = `Create a detailed prompt to generate an image that represents the word "${word}" which means "${meaning}". The prompt should be descriptive and visual, focusing on elements that best represent the word's meaning.`;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.data.choices[0]?.text?.trim() || `An image representing the word "${word}"`;
  } catch (error) {
    console.error('Error generating image prompt:', error);
    return `An image representing the word "${word}"`;
  }
};

// Generate image for the word using DALL-E
export const generateWordImage = async (imagePrompt: string): Promise<string> => {
  try {
    const response = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: "512x512",
    });

    return response.data.data[0].url || '';
  } catch (error) {
    console.error('Error generating word image:', error);
    throw error;
  }
};

export default {
  generateWordContent,
  generateImagePrompt,
  generateWordImage,
};
