import express from "express";
import fs from "fs";
import {
  startNewConversation,
  processUserAnswer,
} from "../services/conversation";
import { logger } from "../utils/logger";
import { audioUpload, saveTempAudioFile } from "../services/audioUpload";
import { transcribeAudio } from "../services/transcription";
import { sessionStore } from "../services/conversation/sessionStore";

export const conversationRouter = express.Router();

// Start new conversation
conversationRouter.post("/start", (req, res) => {
  const { requiredFields } = req.body;
  if (!Array.isArray(requiredFields)) {
    res.status(400).send({ error: "Invalid requiredFields" });
    return;
  }

  const session = startNewConversation(requiredFields);
  logger.info(`Started new conversation`, { sessionId: session.sessionId });
  const nextQuestion = `Hello! Could you please tell me your ${session.nextField}?`;
  res.json({
    sessionId: session.sessionId,
    message: nextQuestion,
    nextField: session.nextField,
  });
  sessionStore.updateSession({ ...session, nextQuestion });
});

// Get conversation status
conversationRouter.get("/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = sessionStore.getSession(sessionId);

  if (!session) {
    res.status(404).send({ error: "Session not found" });
    return;
  }
  res.json(session);
});

// Process text answer
conversationRouter.post("/:sessionId", express.json(), async (req, res) => {
  const { sessionId } = req.params;
  const { answer } = req.body;

  if (!answer) {
    res.status(400).send({ error: "Missing text answer" });
    return;
  }

  try {
    const result = await processUserAnswer(sessionId, answer);

    if (result.nextField === null) {
      res.json({
        ...result,
        completed: true,
        message: "Thank you! I've collected all the information.",
      });
      return;
    }

    res.json(result);
  } catch (error: any) {
    logger.error(`Error processing answer: ${error.message}`, {
      sessionId,
      answer,
    });
    res.status(500).json({ error: "Processing failed" });
  }
});

// Process audio answer
conversationRouter.post("/:sessionId/audio", audioUpload, async (req, res) => {
  const { sessionId } = req.params;
  const file = req.file;

  if (!file) {
    res.status(400).send({ error: "Missing audio file" });
    return;
  }

  const audioFilePath = await saveTempAudioFile(file.buffer, file.mimetype);
  logger.debug(`Saved temporary audio file at: ${audioFilePath}`);

  try {
    // Step 1: Transcribe
    const transcript = await transcribeAudio(audioFilePath);
    logger.info(`Transcript: "${transcript}"`);

    // Step 2: Process through conversation engine
    const result = await processUserAnswer(sessionId, transcript);

    // Step 3: Clean up
    fs.unlink(audioFilePath, () => {});

    if (result.nextField === null) {
      res.json({
        ...result,
        completed: true,
        message: "Thank you! I've collected all the information.",
      });
      return;
    }

    res.json(result);
  } catch (error: any) {
    logger.error(`Audio processing failed: ${error.message}`, {
      sessionId,
      error: error.message,
    });
    res
      .status(500)
      .json({ error: "Audio processing failed: " + error.message });
  }
});
