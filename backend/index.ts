import express from "express";
import cors from "cors";
import fs from "fs";

import { transcribeAudio } from "./services/transcription";
import { extractFields } from "./services/extraction";
import { audioUpload, saveTempAudioFile } from "./services/audioUpload";
import { logger } from "./utils/logger";
import { conversationRouter } from "./controllers/conversationController";

const app = express();
app.use(cors());
app.use(express.json());

// A test endpoint to test all models and extract flow
app.post("/api/process", audioUpload, async (req, res) => {
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

app.use("/api/conversation", conversationRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
