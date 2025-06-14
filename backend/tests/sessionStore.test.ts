import { sessionStore } from "../services/conversation/sessionStore";
import { ConversationSession } from "../types/conversationTypes";

describe("sessionStore", () => {
  it("should create a new session with required fields", () => {
    const requiredFields = ["foo", "bar"];
    const session = sessionStore.createSession(requiredFields);
    expect(session.sessionId).toBeDefined();
    expect(session.requiredFields).toEqual(requiredFields);
    expect(session.collectedData).toEqual({});
    expect(session.nextField).toBe("foo");
    expect(session.completed).toBe(false);
    expect(typeof sessionStore.getSession(session.sessionId)).toBe("object");
  });

  it("should return null for missing session", () => {
    expect(sessionStore.getSession("notfound")).toBeNull();
  });

  it("should update session", () => {
    const session = sessionStore.createSession(["a"]);
    session.collectedData = { a: 1 };
    sessionStore.updateSession(session);
    const updated = sessionStore.getSession(session.sessionId);
    expect(updated?.collectedData).toEqual({ a: 1 });
  });
});
