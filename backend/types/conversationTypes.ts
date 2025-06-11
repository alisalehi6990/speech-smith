export interface ConversationSession {
  sessionId: string;
  requiredFields: string[];
  collectedData: Record<string, any>;
  nextField: string | null;
  completed: boolean;
  nextQuestion: string;
}

export interface LLMQuestionResponse {
  extracted: Record<string, any>;
  nextField: string | null;
  askAgain: boolean;
  message: string;
}
