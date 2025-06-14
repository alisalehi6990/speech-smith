import express from "express";
import axios from "axios";
import fs from "fs";
import { logger } from "../utils/logger";
import { audioUpload, saveTempAudioFile } from "../services/audioUpload";
import { transcribeAudio } from "../services/transcription";

export const testController = express.Router();

const OLLAMA_API_URL = process.env.OLLAMA_HOST + "/api/generate";
export async function extractFields(
  text: string,
  fieldNames: string[]
): Promise<Record<string, any>> {
  const systemPrompt = `
    You are an assistant that extracts specific variables from natural language.
    Given the following text, extract these fields: ${fieldNames.join(", ")}.

    RETURN ONLY A JSON OBJECT CONTAINING THE EXACT FIELDS REQUESTED.
    DO NOT INCLUDE ANY FIELD THAT IS NOT MENTIONED IN THE INPUT.
    IF A FIELD CANNOT BE FOUND, OMIT IT FROM THE OUTPUT.
    NEVER USE null OR undefined VALUES.

    Return ONLY a JSON object with those fields. Do NOT say any additional things.
    Example:
    Text: "I am 28 years old, weigh 70 kg and am 175 cm tall."
    Fields: age, weight, height
    Output: { "age": 28, "weight": 70, "height": 175 }

    Text: "I am 28 years old and am 175 cm tall."
    Fields: age, weight, height
    Output: { "age": 28, "height": 175 }
  `;

  const payload = {
    model: "llama3", // TODO: will there be stronger models to extract fields?
    prompt: `${systemPrompt}\n\nText: "${text}"\nFields: ${fieldNames}`,
    stream: false,
  };

  logger.debug(`extractFields: Calling LLM for field extraction`, {
    prompt: systemPrompt,
    text,
    fieldNames,
  });

  try {
    const response = await axios.post(OLLAMA_API_URL, payload);

    logger.debug(
      `extractFields: Raw LLM response: ${JSON.stringify(response.data)}`
    );

    return JSON.parse(response.data.response);
  } catch (error: any) {
    logger.error(`extractFields: LLM extraction failed: ${error.message}`, {
      status: error.response?.status,
      data: error.response?.data,
      payload,
    });
    return {};
  }
}

// A test endpoint to test all models and extract flow
testController.post("/api/process", audioUpload, async (req, res) => {
  try {
    const { fieldNames } = req.body;
    const file = req.file;

    if (!file || !fieldNames) {
      logger.warn("Endpoint /api/process: Missing audio file or field names");
      res.status(400).send({ error: "Missing audio file or field names" });
      return;
    }

    logger.info(
      `Endpoint /api/process: Received audio file: ${file.originalname}, size: ${file.size} bytes`
    );

    const audioFilePath = await saveTempAudioFile(file.buffer, file.mimetype);
    logger.debug(
      `Endpoint /api/process: Saved temporary audio file at: ${audioFilePath}`
    );

    try {
      const fieldNamesList = JSON.parse(fieldNames);
      logger.info(
        `Endpoint /api/process: Extracting fields: ${fieldNamesList.join(", ")}`
      );

      const transcript = await transcribeAudio(audioFilePath);
      logger.info(`Endpoint /api/process: Transcript: "${transcript}"`);

      const extractedData = await extractFields(transcript, fieldNamesList);
      logger.info(
        `Endpoint /api/process: Extracted data: ${JSON.stringify(
          extractedData
        )}`
      );

      const missingFields = fieldNamesList.filter((field: string) => {
        const value = extractedData[field];
        return value === null || value === undefined;
      });

      logger.info(
        `Endpoint /api/process: Missing fields: ${
          missingFields.join(", ") || "none"
        }`
      );

      // Clean up extracted data
      fieldNamesList.forEach((field: string) => {
        if (extractedData[field] === null) {
          delete extractedData[field];
        }
      });

      res.json({
        transcript,
        ...extractedData,
        _missing: missingFields,
      });

      fs.unlink(audioFilePath, () => {});
    } catch (error: any) {
      logger.error(
        `Endpoint /api/process: Processing failed: ${error.message}`,
        {
          stack: error.stack,
          body: req.body,
        }
      );
      res.status(500).send({ error: "Processing failed" });
    }
  } catch (error: any) {
    logger.fatal(
      `Endpoint /api/process: Unhandled exception: ${error.message}`,
      {
        stack: error.stack,
      }
    );
    res.status(500).send({ error: "Internal server error" });
  }
});
