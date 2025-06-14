import axios from "axios";
import { logger } from "../utils/logger";
import { parseJSON } from "../utils/jsonParser";
import { sessionStore } from "../services/conversation/sessionStore";
import * as index from "../services/conversation/index";

jest.mock("axios");
jest.mock("../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("../utils/jsonParser", () => ({
  parseJSON: jest.fn(),
}));

describe("startNewConversation", () => {
  it("should create a new session", () => {
    const spy = jest.spyOn(sessionStore, "createSession");
    index.startNewConversation(["foo"]);
    expect(spy).toHaveBeenCalledWith(["foo"]);
  });
});

describe("processUserAnswer", () => {
  const sessionId = "abc";
  const session = {
    sessionId,
    requiredFields: ["foo", "bar"],
    collectedData: {},
    nextField: "foo",
    nextQuestion: "",
    completed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(sessionStore, "getSession").mockReturnValue({ ...session });
    jest.spyOn(sessionStore, "updateSession").mockImplementation(() => {});
    process.env.OLLAMA_HOST = "http://fake-ollama";
  });

  it("should throw if session not found", async () => {
    (sessionStore.getSession as jest.Mock).mockReturnValue(null);
    await expect(index.processUserAnswer("bad", "hi")).rejects.toThrow("Session not found");
  });

  it("should retry and return askAgain if LLM fails", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error("fail"));
    (parseJSON as jest.Mock).mockReturnValue(null);
    const result = await index.processUserAnswer(sessionId, "hi");
    expect(result.askAgain).toBe(true);
    expect(result.message).toContain("couldn't understand");
    expect(logger.error).toHaveBeenCalled();
  });

  it("should process and update session on valid LLM response", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { response: "{}" } });
    (parseJSON as jest.Mock).mockReturnValue({
      extracted: { foo: 1 },
      nextField: "bar",
      message: "Next?",
    });
    const result = await index.processUserAnswer(sessionId, "hi");
    expect(result.extracted).toEqual({ foo: 1 });
    expect(result.nextField).toBe("bar");
    expect(result.message).toBe("Next?");
    expect(sessionStore.updateSession).toHaveBeenCalled();
  });

  it("should mark session completed if all fields collected", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { response: "{}" } });
    (parseJSON as jest.Mock).mockReturnValue({
      extracted: { foo: 1, bar: 2 },
      nextField: null,
      message: null,
    });
    const result = await index.processUserAnswer(sessionId, "hi");
    expect(result.nextField).toBeNull();
    expect(result.message).toContain("Thank you");
    expect(result.askAgain).toBe(false);
  });
});
