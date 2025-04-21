import OpenAI from 'openai';

// Initialize OpenAI client
// Replace with your actual OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For client-side usage (in production, use a backend proxy)
});

// Generate an image for a word using DALL-E
export const generateWordImage = async (word, meaning) => {
  try {
    const prompt = `Create a simple, clear image representing the word "${word}" which means "${meaning}". The image should be educational and help with memorization.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    return response.data[0].b64_json;
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    throw error;
  }
};

// Generate a definition and example for a word using GPT
export const generateWordDefinition = async (word) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides clear, concise definitions and examples for words."
        },
        {
          role: "user",
          content: `Provide a definition and example sentence for the word "${word}". Format your response as JSON with "meaning" and "example" fields.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating definition with OpenAI:', error);
    throw error;
  }
};
