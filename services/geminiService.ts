
import { GoogleGenAI, Type } from "@google/genai";
import { Scenario } from "../components/OutputDisplay";

export interface VoiceParams {
    tone: string;
    gender: string;
    emotion: string;
    reverb: string;
}

export async function generateContentFromPrompt(
    prompt: string, 
    locale: string, 
    totalTime: number, 
    cutLength: number, 
    numCuts: number,
    voiceParams: VoiceParams
): Promise<Scenario> {
  // API key is read from environment variables
  if (!process.env.API_KEY) {
    throw new Error("API_key environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const languageInstruction = locale === 'ko' 
    ? "The entire JSON output, including all text values, must be in Korean." 
    : "The entire JSON output, including all text values, must be in English.";

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy title for the scenario." },
      logline: { type: Type.STRING, description: "A one-sentence summary of the story." },
      characters: {
        type: Type.ARRAY,
        description: "A list of the main characters.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The character's name." },
            description: { type: Type.STRING, description: "A brief description of the character." }
          },
          required: ["name", "description"]
        }
      },
      scenes: {
        type: Type.ARRAY,
        description: "The sequence of scenes, structured as human-readable prompts for AI video generation tools.",
        items: {
          type: Type.OBJECT,
          properties: {
            scene: { type: Type.INTEGER, description: "The scene number." },
            timeline: { type: Type.STRING, description: "The timeline for this cut (e.g., '0s-5s')." },
            visualPrompt: { type: Type.STRING, description: "A detailed visual description including actions, effects, and color tone." },
            cameraMovement: { type: Type.STRING, description: "Specific camera movement instructions." },
            dialogue: { type: Type.STRING, description: "Auto-generated dialogue for the scene, including detailed voice/emotion tags in brackets (e.g., '[shouting] Get out!'). Use 'None' if empty." },
            dialogueStructure: { type: Type.STRING, description: "The structure of the dialogue (e.g., 'Narration', 'Monologue', '1-on-1 Conversation', 'Multi-person Conversation')." },
            duration: { type: Type.INTEGER, description: "The duration of the scene in seconds." }
          },
          required: ["scene", "timeline", "visualPrompt", "cameraMovement", "dialogue", "dialogueStructure", "duration"]
        }
      },
      narration: {
        type: Type.OBJECT,
        description: "Details for generating narration audio, compatible with tools like Suno.",
        properties: {
            script: { type: Type.STRING, description: "A complete narration script for the entire video, automatically generated to fit the total duration and scenario. This is ready to be pasted into a speech generation tool." },
            voiceTags: { type: Type.STRING, description: "A string of tags for the AI audio tool, formatted like '[tag1] [tag2]'. For example: '[calm male voice] [sad tone] [light reverb]'."}
        },
        required: ["script", "voiceTags"]
      },
      timelineJson: {
        type: Type.ARRAY,
        description: "A machine-readable JSON array representing the timeline for tools like Sora or Veo.",
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER, description: "The cut number, starting from 1." },
                start_time: { type: Type.INTEGER, description: "Start time of the cut in seconds." },
                end_time: { type: Type.INTEGER, description: "End time of the cut in seconds." },
                prompt: { type: Type.STRING, description: "The combined visual and camera movement prompt for this cut." },
                dialogue: { type: Type.STRING, description: "The dialogue for this cut, matching the scene's dialogue, including any voice/emotion tags."}
            },
            required: ["id", "start_time", "end_time", "prompt", "dialogue"]
        }
      },
      bgm: {
        type: Type.OBJECT,
        description: "A prompt for generating background music for the entire scenario.",
        properties: {
            style: { type: Type.STRING, description: "The style or genre of the background music (e.g., 'Epic Orchestral', 'Lofi Hip-Hop', 'Cinematic Ambient')." },
            instruments: { type: Type.STRING, description: "The key instruments to be featured in the music (e.g., 'Piano, Strings, French Horn', '808 drums, Rhodes keyboard')." },
            mood: { type: Type.STRING, description: "The overall mood and feeling the music should evoke (e.g., 'Suspenseful, melancholic', 'Hopeful, adventurous')." }
        },
        required: ["style", "instruments", "mood"]
      }
    },
    required: ["title", "logline", "characters", "scenes", "narration", "timelineJson", "bgm"]
  };

  const detailedPrompt = `Generate a short-form video scenario based on the following prompt: "${prompt}".

Constraints:
- Total Video Length: ${totalTime} seconds
- Number of Scenes/Cuts: ${numCuts}
- Average Cut Duration: ${cutLength} seconds.

Narration Voice Parameters:
- Tone: ${voiceParams.tone || 'Not specified'}
- Gender: ${voiceParams.gender || 'Not specified'}
- Emotion: ${voiceParams.emotion || 'Not specified'}
- Reverb: ${voiceParams.reverb || 'Not specified'}

Your task is to auto-generate a full narration script and scene-by-scene dialogues based on the user's core scenario. Create a detailed, prompt-ready structure for each cut, a complete narration script for Suno, a background music prompt, and a machine-readable JSON timeline for Sora/Veo.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: detailedPrompt,
      config: {
        systemInstruction: `You are an expert prompt engineer and creative writer for AI video and audio generation tools. Your output must be a single, valid JSON object adhering to the provided schema.

Key instructions:
- **As a world-class genius film score composer**, you must generate a BGM (Background Music) prompt based on the entire scenario. This includes defining the style/genre, key instruments, and overall mood.
- **narration.script**: Based on the user's prompt, write a full, cohesive narration script for the entire video's duration. This script should be ready for a text-to-speech engine.
- **scenes.dialogue**: For each scene, generate relevant dialogue. Crucially, embed detailed voice and emotion tags directly within the dialogue string using square brackets, like 'Character A: [shouting angrily] I can't believe it!'. If there is no dialogue, you must use the string 'None'.
- **scenes.dialogueStructure**: Classify the dialogue in each scene into one of the following categories: 'Narration', 'Monologue', '1-on-1 Conversation', or 'Multi-person Conversation'.
- **scenes**: Create a human-readable breakdown for each scene. The number of scenes must exactly match the user's request.
- **narration.voiceTags**: Based on the user's voice parameters, generate a compact, tag-based 'voiceTags' string for an AI audio tool like Suno.
- **timelineJson**: Create a machine-readable JSON array for video tools like Sora or Veo. Combine 'visualPrompt' and 'cameraMovement' into a single 'prompt' field. Populate the 'dialogue' field in each timeline object with the content from the corresponding scene's 'dialogue'. Calculate 'start_time' and 'end_time' for each scene.

${languageInstruction}`,
        temperature: 0.8,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    
    const rawText = response.text;
    if (!rawText) {
        throw new Error("Received an empty response from the API.");
    }
    
    try {
        return JSON.parse(rawText);
    } catch (e) {
        console.error("Failed to parse JSON response:", rawText);
        throw new Error("The AI returned an invalid response format. Please try regenerating.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Error generating content: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating content.");
  }
}