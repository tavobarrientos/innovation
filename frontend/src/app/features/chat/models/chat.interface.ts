export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'code' | 'image' | 'file';
  isTyping?: boolean;
  metadata?: {
    [key: string]: any;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  isActive: boolean;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: {
    documentId?: string;
    currentPage?: string;
    selectedText?: string;
  };
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  suggestions?: string[];
  relatedDocuments?: {
    id: string;
    title: string;
    relevance: number;
  }[];
}

export interface AICapabilities {
  textGeneration: boolean;
  codeGeneration: boolean;
  documentAnalysis: boolean;
  summarization: boolean;
  translation: boolean;
  questionAnswering: boolean;
}
