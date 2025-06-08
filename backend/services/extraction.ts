import axios from "axios";
import { FieldDefinition } from "../types";

const OLLAMA_API_URL = process.env.OLLAMA_HOST + "/api/generate";

export async function extractFields(
  text: string,
  fields: FieldDefinition[]
): Promise<Record<string, any>> {
  const fieldNames = fields.map((f) => f.name).join(", ");
  const systemPrompt = `
    You are an assistant that extracts specific variables from natural language.
    Given the following text, extract these fields: ${fieldNames}.

    If a field cannot be found, omit it or mark as null.
    Do NOT use null or undefined values.

    Return ONLY a JSON object with those fields. Do NOT say any additional things.
    Example:
    Text: "I am 28 years old, weigh 70 kg and am 175 cm tall."
    Fields: age, weight, height
    Output: { "age": 28, "weight": 70, "height": 175 }

    Text: "I am 28 years old and am 175 cm tall."
    Fields: age, weight, height
    Output: { "age": 28, "height": 175 }
  `;

  const payload = {
    model: "llama3", // TODO: will there be stronger models to extract fields?
    prompt: `${systemPrompt}\n\nText: "${text}"\nFields: ${fieldNames}`,
    stream: false,
  };

  const response = await axios.post(OLLAMA_API_URL, payload);

  try {
    return JSON.parse(response.data.response);
  } catch (e) {
    console.error("Failed to parse LLM response:", response.data.response);
    return {};
  }
}
