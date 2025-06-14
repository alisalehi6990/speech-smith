import axios from "axios";
import fs from "fs";
import { transcribeAudio } from "../services/transcription";
import { logger } from "../utils/logger";

jest.mock("axios");
jest.mock("fs");
jest.mock("../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("transcribeAudio", () => {
  const mockFilePath = "test.wav";
  const mockFileBuffer = Buffer.from("audio");
  const mockTranscription = "hello world";
  const mockResponse = { data: mockTranscription };

  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(mockFileBuffer);
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    process.env.WHISPER_HOST = "http://fake-whisper";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send audio file and return transcription", async () => {
    const result = await transcribeAudio(mockFilePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(axios.post).toHaveBeenCalled();
    expect(result).toBe(mockTranscription);
    expect(logger.debug).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      `transcribeAudio: Transcribed text: "${mockTranscription}"`
    );
  });

  it("should trim whitespace from transcription", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: "  foo bar  " });
    const result = await transcribeAudio(mockFilePath);
    expect(result).toBe("foo bar");
  });

  it("should log and throw error on failure", async () => {
    const error = { message: "fail", response: { status: 500, data: "err" } };
    (axios.post as jest.Mock).mockRejectedValue(error);
    await expect(transcribeAudio(mockFilePath)).rejects.toBe(error);
    expect(logger.error).toHaveBeenCalledWith(
      `transcribeAudio: Whisper transcription failed: ${error.message}`,
      { status: 500, data: "err" }
    );
  });
});
