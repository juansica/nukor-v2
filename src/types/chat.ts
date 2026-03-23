export interface IMessageSource {
  title: string;
  collectionName?: string | null;
}

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  sources?: IMessageSource[];
}

export interface IConversation {
  id: string;
  title: string;
  messages: IMessage[];
  created_at: string;
  updated_at: string;
}
