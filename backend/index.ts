import express from "express";
import cors from "cors";
import fs from "fs";

import { transcribeAudio } from "./services/transcription";
import { extractFields } from "./services/extraction";
import { audioUpload, saveTempAudioFile } from "./services/audioUpload";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/process", audioUpload, async (req, res) => {
  const { fieldNames } = req.body;
  const file = req.file;

  if (!file || !fieldNames) {
    res.status(400).send({ error: "Missing audio file or field names" });
    return;
  }

  const audioFilePath = await saveTempAudioFile(file.buffer, file.mimetype);

  try {
    const fieldNamesList = JSON.parse(fieldNames);
    const transcript = await transcribeAudio(audioFilePath);
    const extractedData = await extractFields(transcript, fieldNamesList);

    const missingFields = fieldNamesList.filter((field: string) => {
      const value = extractedData[field];
      return value === null || value === undefined;
    });

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
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Processing failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
