export interface FieldDefinition {
  name: string;
  label?: string;
  description?: string;
  format?: "string" | "number";
}

export interface ConversationSession {
  sessionId: string;
  collectedData: Record<string, unknown>;
  nextField: string | null;
  message: string;
}
