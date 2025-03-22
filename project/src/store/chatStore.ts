import { create } from 'zustand';
import { getAIResponse } from '../lib/gemini';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  addMessage: (text: string, isAI: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  addMessage: (text: string, isAI: boolean) => {
    const message: Message = {
      id: Math.random().toString(36).substring(7),
      text,
      isAI,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  sendMessage: async (text: string) => {
    set({ loading: true, error: null });
    get().addMessage(text, false);

    try {
      const response = await getAIResponse(text);
      get().addMessage(response, true);
    } catch (error) {
      set({ error: 'Failed to get AI response' });
    } finally {
      set({ loading: false });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));