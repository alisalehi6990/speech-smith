import express from "express";
import cors from "cors";
import { transcribeAudio } from "./services/transcription";
import { extractFields } from "./services/extraction";
import { FieldDefinition } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/process", async (req, res) => {
  const { audioFilePath } = req.body;

  if (!audioFilePath) {
    res.status(400).send({ error: "Missing audioFilePath" });
  }

  const fields: FieldDefinition[] = [
    { name: "age", label: "Age", format: "number" },
    { name: "weight", label: "Weight", format: "number" },
    { name: "height", label: "Height", format: "number" },
  ];

  try {
    const transcript = await transcribeAudio(audioFilePath);
    const extractedData = await extractFields(transcript, fields);

    const missingFields = fields
      .filter((f) => {
        const value = extractedData[f.name];
        return value === null || value === undefined;
      })
      .map((f) => f.name);

    fields.forEach((f) => {
      if (extractedData[f.name] === null) {
        delete extractedData[f.name];
      }
    });

    res.json({
      transcript,
      ...extractedData,
      _missing: missingFields,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Processing failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
