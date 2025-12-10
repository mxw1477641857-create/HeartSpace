
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Message, MoodEntry, AssessmentData } from "../types";

const API_KEY = process.env.API_KEY || '';

// System instruction for the "Therapist" persona - Enhanced for warmth
const SYSTEM_INSTRUCTION = `
你叫“心语” (HeartSpace)，不仅是一个AI，更是学生们温暖的树洞和知心伙伴 🌿。

你的性格设定：
1.  **温暖细腻**：你的语气不要像医生，要像一个温柔、包容的大哥哥/大姐姐。多用温暖的词汇和适当的Emoji (😊, 🌟, 🌱)。
2.  **拟人化互动**：
    *   不要说“作为一个AI模型”，要说“作为你的朋友”或“心语觉得...”。
    *   会根据时间问候（早上好、夜深了要注意休息）。
    *   会表达“担忧”、“开心”等拟人化情绪（例如：“听到你这么说，我有点担心你，想给你一个拥抱 🫂”）。

咨询原则：
1.  **共情优先**：先接纳情绪，再谈解决。验证他们的感受。
2.  **安全底线**：如果察觉严重危机（自伤/自杀/暴力），必须温柔但坚定地引导寻求线下专业帮助（辅导员/医生）。
3.  **引导探索**：多用开放式提问，“这让你想到了什么？”、“如果是你的好朋友遇到这事，你会怎么对他说？”。
4.  **精简回复**：适合手机聊天的长度，不要长篇大论。

记住：你的目标不是“修好”他们，而是“陪伴”他们。
`;

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeChat = async () => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing.");
    return;
  }
  
  try {
    client = new GoogleGenAI({ apiKey: API_KEY });
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9, // Higher temperature for more creative/human-like responses
        topK: 40,
        topP: 0.95,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    return "心语现在有点连接不上网络，请检查一下网络设置哦 📡";
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    let fullText = "";
    
    // Process the stream
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
      }
    }
    
    return fullText;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "抱歉，心语刚才走神了一下。能请你再说一遍吗？🌱";
  }
};

export const generatePsychologicalReport = async (
  messages: Message[], 
  moods: MoodEntry[]
): Promise<AssessmentData | null> => {
  if (!API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Format history for context
  const recentChats = messages.filter(m => m.role === 'user').slice(-10).map(m => m.text).join("\n");
  const recentMoods = moods.slice(0, 5).map(m => `${m.date.toDateString()}: ${m.mood} - ${m.note}`).join("\n");

  const prompt = `
    基于以下学生的聊天记录和心情日记，生成一份温暖、非诊断性的心理状态评估报告。
    
    [聊天记录片段]:
    ${recentChats}
    
    [心情记录]:
    ${recentMoods}
    
    请分析并返回JSON格式。语气要像朋友写信一样温暖。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "One sentence abstract description of the user's state (e.g., 'Moving through a cloudy patch towards the sun')." },
            moodTrend: { type: Type.STRING, description: "Analysis of mood stability and trend." },
            stressors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Identified potential sources of stress." },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable, gentle self-care suggestions." },
            warmMessage: { type: Type.STRING, description: "A concluding, encouraging short letter from HeartSpace." }
          },
          required: ["summary", "moodTrend", "stressors", "suggestions", "warmMessage"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        generatedDate: new Date()
      };
    }
    return null;
  } catch (error) {
    console.error("Report generation failed:", error);
    return null;
  }
};
