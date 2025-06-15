import { useState } from "react";
import axios from "axios";
import type { ConversationSession } from "../components/ConversationalForm/types";

type options = {
  apiBaseUrl?: string;
};

export const useConversation = (
  options: options = { apiBaseUrl: "http://localhost:3001" }
) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [nextField, setNextField] = useState<string | null>(null);
  const [collectedData, setCollectedData] = useState<
    ConversationSession["collectedData"]
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startConversation = async (requiredFields: string[]) => {
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${options.apiBaseUrl}/api/conversation/start`,
        {
          requiredFields,
        }
      );
      const data = res.data;

      setSessionId(data.sessionId);
      setMessage(data.message);
      setNextField(data.nextField);
    } catch (err) {
      console.error("Failed to start conversation", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendAnswer = async (formData: FormData): Promise<unknown> => {
    if (!sessionId) throw new Error("No active session");
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${options.apiBaseUrl}/api/conversation/${sessionId}/audio`,
        formData
      );
      const result = res.data;

      const updatedData = { ...collectedData, ...result.extracted };
      setCollectedData(updatedData);
      setMessage(result.message);
      setNextField(result.nextField);

      return result;
    } catch (err) {
      console.error("Error sending answer", err);
      return {
        extracted: {},
        nextField: null,
        message: "I couldn't understand that clearly. Could you rephrase?",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendTextAnswer = async (text: string): Promise<unknown> => {
    if (!sessionId) throw new Error("No active session");
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${options.apiBaseUrl}/api/conversation/${sessionId}`,
        {
          answer: text,
        }
      );

      const result = res.data;

      const updatedData = { ...collectedData, ...result.extracted };
      setCollectedData(updatedData);
      setMessage(result.message);
      setNextField(result.nextField);

      return result;
    } catch (err) {
      console.error("Error sending text answer", err);
      return {
        extracted: {},
        nextField: null,
        message: "I couldn't understand that clearly. Could you rephrase?",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startConversation,
    sendAnswer,
    sendTextAnswer,
    message,
    isLoading,
    nextField,
    collectedData,
  };
};
