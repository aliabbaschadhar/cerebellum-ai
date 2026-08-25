export type ChatRole = "USER" | "ASSISTANT";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  referenceIds: string[];
  createdAt: string;
}
