import axios from "axios";
import { logger } from "../../utils/logger";
import { parseJSON } from "../../utils/jsonParser";
import {
  ConversationSession,
  LLMQuestionResponse,
} from "../../types/conversationTypes";
import { generateQuestionPrompt } from "./prompts";
import { sessionStore } from "./sessionStore";

const OLLAMA_API_URL = process.env.OLLAMA_HOST + "/api/generate";

// Max number of retries for LLM response
const MAX_RETRIES = 3;

export const startNewConversation = (requiredFields: string[]) => {
  return sessionStore.createSession(requiredFields);
};

export const processUserAnswer = async (
  sessionId: string,
  answerText: string
): Promise<LLMQuestionResponse> => {
  const session = sessionStore.getSession(sessionId);
  if (!session) throw new Error("Session not found");
  const prompt = generateQuestionPrompt(
    session.requiredFields,
    session.collectedData,
    answerText
  );
  let lastError: any;
  let parsedResponse: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.debug(`[Attempt ${attempt}] Sending prompt to LLM`);

      const payload = {
        model: "llama3.1",
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.1,
          stop: ["(COMPLETED)", "Example:", "```"],
        },
      };

      const response = await axios.post(OLLAMA_API_URL, payload);
      // Try to parse LLM response
      parsedResponse = parseJSON(response.data.response);

      // If parsing succeeds, break the loop
      if (
        parsedResponse &&
        typeof parsedResponse === "object" &&
        parsedResponse.extracted?.[session.nextField as string]
      ) {
        break;
      }
    } catch (error: any) {
      logger.warn(`LLM call failed on attempt ${attempt}: ${error.message}`);
      lastError = error;
    }
  }
  // If we still can't get valid JSON after retries
  if (!parsedResponse) {
    logger.error(`Failed to get valid JSON after ${MAX_RETRIES} retries`, {
      sessionId,
      answerText,
    });

    return {
      extracted: {},
      nextField: session.nextField,
      askAgain: true,
      message:
        "I couldn't understand that clearly. Could you please rephrase or repeat?",
    };
  }

  // Update session state
  const extracted = parsedResponse.extracted || {};
  const updatedData = { ...session.collectedData, ...extracted };
  const updatedMissingFields = session.requiredFields.filter(
    (f) => !(f in updatedData)
  );

  const updatedSession: ConversationSession = {
    ...session,
    collectedData: updatedData,
    nextField: parsedResponse.nextField,
    completed: updatedMissingFields.length === 0,
  };

  const nextQuestion = updatedSession.completed
    ? "Thank you! I've collected all the information."
    : parsedResponse.message ||
      `Could you tell me your ${updatedSession.nextField}?`;
  sessionStore.updateSession({ ...updatedSession, nextQuestion });

  return {
    extracted: updatedData,
    nextField: updatedSession.completed ? null : updatedSession.nextField,
    askAgain: false,
    message: nextQuestion,
  };
};
