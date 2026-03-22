export interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
}

export interface IConversation {
  id: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
}
