import { generateQuestionPrompt } from "../services/conversation/prompts";

describe("generateQuestionPrompt", () => {
  it("should generate prompt with missing fields and collected data", () => {
    const requiredFields = ["age", "name"];
    const collectedData = { age: 30 };
    const lastAnswer = "My name is John";
    const prompt = generateQuestionPrompt(requiredFields, collectedData, lastAnswer);
    expect(prompt).toContain("user has provided: age=30");
    expect(prompt).toContain("remaining fields to collect are: name");
    expect(prompt).toContain('"name"');
    expect(prompt).toContain('latest answer ("My name is John")');
  });

  it("should show 'nothing' if no collected data", () => {
    const prompt = generateQuestionPrompt(["foo"], {}, "bar");
    expect(prompt).toContain("user has provided: nothing");
  });

  it("should show 'none' if no missing fields", () => {
    const prompt = generateQuestionPrompt(["foo"], { foo: 1 }, "bar");
    expect(prompt).toContain("remaining fields to collect are: none");
  });
});
