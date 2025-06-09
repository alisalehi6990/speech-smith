import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { logger } from "../utils/logger";

export async function transcribeAudio(filePath: string): Promise<string> {
  const formData = new FormData();
  const file = fs.readFileSync(filePath);
  formData.append("audio_file", file, "audio.wav");

  logger.debug(`transcribeAudio: Sending audio file to Whisper API`);
  try {
    const response = await axios.post(
      process.env.WHISPER_HOST + "/asr",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    logger.info(`transcribeAudio: Transcribed text: "${response.data.trim()}"`);
    return response.data.trim();
  } catch (error: any) {
    logger.error(
      `transcribeAudio: Whisper transcription failed: ${error.message}`,
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );
    throw error;
  }
}
