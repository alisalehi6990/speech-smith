import multer from "multer";
import fs from "fs";
import os from "os";
import path from "path";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedExts = /wav|mp3/;
    const allowedMimes = /audio\/x-wav|audio\/wav|audio\/mpeg/;
    const extname = allowedExts.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedMimes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);

    cb(new Error("Only .wav and .mp3 audio files are allowed."));
  },
});

export const audioUpload = upload.single("audio");

export const saveTempAudioFile = (buffer: Buffer, mimeType: string): string => {
  const tmpDir = os.tmpdir();
  const ext = mimeType.includes("mp3") ? ".mp3" : ".wav";
  const filePath = path.join(tmpDir, `audio-${Date.now()}${ext}`);

  fs.writeFileSync(filePath, buffer);
  return filePath;
};
