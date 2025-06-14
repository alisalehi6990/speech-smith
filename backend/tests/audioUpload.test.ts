import fs from "fs";
import os from "os";
import path from "path";
import { audioUpload, saveTempAudioFile } from "../services/audioUpload";

jest.mock("fs");
jest.mock("os");
jest.mock("path");

describe("audioUpload", () => {
  it("should be a multer middleware", () => {
    expect(typeof audioUpload).toBe("function");
    expect(audioUpload.length).toBe(3); // req, res, next
  });
});

describe("saveTempAudioFile", () => {
  const buffer = Buffer.from("audio");
  const tmpDir = "/tmp";
  const now = 1234567890;
  beforeEach(() => {
    (os.tmpdir as jest.Mock).mockReturnValue(tmpDir);
    jest.spyOn(Date, "now").mockReturnValue(now);
    (path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("should save .mp3 file if mimeType includes mp3", () => {
    const filePath = saveTempAudioFile(buffer, "audio/mp3");
    expect(filePath).toBe(`${tmpDir}/audio-${now}.mp3`);
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, buffer);
  });

  it("should save .wav file otherwise", () => {
    const filePath = saveTempAudioFile(buffer, "audio/wav");
    expect(filePath).toBe(`${tmpDir}/audio-${now}.wav`);
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, buffer);
  });
});
