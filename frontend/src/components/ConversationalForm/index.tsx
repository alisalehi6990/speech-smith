import React, { useState, useRef } from "react";
import { useConversation } from "../../hooks/useConversation";
import type { ConversationSession, FieldDefinition } from "./types";
import { Waveform } from "../Waveform/Waveform";
import { ActivityIndicator } from "../ActivityIndicator/ActivityIndicator";

interface ConversationalFormProps {
  initialMessage: string;
  requiredFields: FieldDefinition[];
  onComplete: (data: ConversationSession["collectedData"]) => void;
  apiBaseUrl?: string;
}

export const ConversationalForm = ({
  initialMessage,
  requiredFields,
  onComplete,
  apiBaseUrl = "http://localhost:3001",
}: ConversationalFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showStartButton, setShowStartButton] = useState(true);
  const {
    startConversation,
    sendAnswer,
    sendTextAnswer,
    message,
    isLoading,
    nextField,
    collectedData,
  } = useConversation({ apiBaseUrl });

  const handleStart = () => {
    const fieldNames = requiredFields.map((f) => f.name);
    startConversation(fieldNames);
    setShowStartButton(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("audio", file);

    await sendAnswer(formData);
  };

  const handleRecordClick = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone not supported in your browser.");
      return;
    }

    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.onstart = () => {
          setTimeout(() => {
            mediaRecorder.stop();
          }, 5000); // record for 5 seconds
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/mpeg" });
          const formData = new FormData();
          formData.append("audio", blob, "recording.mp3");
          sendAnswer(formData);
          setIsRecording(false);
        };

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.start();
      })
      .catch((err) => {
        setError("Microphone access denied");
        console.error(err);
        setIsRecording(false);
      });
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    await sendTextAnswer(textInput);
    setTextInput("");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      {!nextField && showStartButton ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-black">
            {initialMessage}
          </h2>
          <button
            onClick={handleStart}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
          >
            Start Conversation
          </button>
        </>
      ) : null}

      {nextField && (
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-md">
          <p>{message}</p>
        </div>
      )}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {!nextField ? null : (
            <div className="space-y-4 mb-6">
              {/* Text Input */}
              <input
                type="text"
                placeholder={`Type your answer here...`}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className={`w-full py-2 px-4 ${
                  !textInput.trim()
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white font-medium rounded-md transition-colors`}
              >
                Submit Text
              </button>

              {/* File Upload */}
              <label className="w-full mb-4">
                <input
                  ref={fileInputRef}
                  name="audio-file"
                  type="file"
                  accept="audio/mp3, audio/wav"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  disabled={isLoading}
                  className="w-full mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Upload Audio File
                </button>
              </label>
              {/* Record Button */}
              <button
                onClick={handleRecordClick}
                disabled={isRecording}
                className={`w-full py-2 px-4 ${
                  isRecording ? "bg-red-500" : "bg-green-500"
                } text-white font-medium rounded-md transition-colors`}
              >
                {isRecording ? "Recording..." : "🎤 Record Answer"}
              </button>

              {isRecording && <Waveform />}
            </div>
          )}
        </>
      )}

      {nextField === null && !isLoading && !showStartButton && (
        <div className="text-center mt-6 text-green-600 font-semibold">
          ✅ All fields collected!
        </div>
      )}

      {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

      {!nextField && !isLoading && !showStartButton && (
        <button
          onClick={() => onComplete(collectedData)}
          className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
        >
          Finish & View Results
        </button>
      )}
    </div>
  );
};
