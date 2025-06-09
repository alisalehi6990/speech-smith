import multer from "multer";
import fs from "fs";
import os from "os";
import path from "path";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const audioUpload = upload.single("audio");

export const saveTempAudioFile = (buffer: Buffer, mimeType: string): string => {
  const tmpDir = os.tmpdir();
  const ext = mimeType.includes("mp3") ? ".mp3" : ".wav";
  const filePath = path.join(tmpDir, `audio-${Date.now()}${ext}`);

  fs.writeFileSync(filePath, buffer);
  return filePath;
};
