import axios from "axios";

const WHISPER_API_URL = "http://localhost:11434/api/generate";

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  // TODO: use real audio file
  console.log(`Transcribing file: ${audioFilePath}`);
  const prompt = `Transcribe the following audio: ${audioFilePath}`;
  return "I am 28 years old and am 175 cm tall.";

  // TODO: use NLP to transcribe the audio
  const response = await axios.post(WHISPER_API_URL, {
    model: "whisper:base",
    prompt,
    stream: false,
  });

  return response.data.text || "";
}
