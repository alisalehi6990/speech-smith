import { ConversationSession } from '../../types/conversationTypes';

const sessions: Record<string, ConversationSession> = {};

export const sessionStore = {
  createSession: (requiredFields: string[]): ConversationSession => {
    const sessionId = Math.random().toString(36).substring(2);
    const session: ConversationSession = {
      sessionId,
      requiredFields,
      collectedData: {},
      nextField: requiredFields[0] || null,
      nextQuestion: "",
      completed: false
    };
    sessions[sessionId] = session;
    return session;
  },

  getSession: (sessionId: string): ConversationSession | null => {
    return sessions[sessionId] || null;
  },

  updateSession: (session: ConversationSession): void => {
    sessions[session.sessionId] = session;
  }
};