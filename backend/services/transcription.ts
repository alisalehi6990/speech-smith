import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export async function transcribeAudio(filePath: string): Promise<string> {
  const formData = new FormData();
  const file = fs.readFileSync(filePath);
  formData.append("audio_file", file, "audio.wav");

  try {
    const response = await axios.post(
      process.env.WHISPER_HOST + "/asr",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return response.data.trim();
  } catch (error: any) {
    console.error("Transcription failed:", error.message);
    throw error;
  }
}
