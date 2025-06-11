import { logger } from "./logger";

/**
 * Safely parses LLM response into JSON object
 */
export const parseJSON = (raw: string): Record<string, any> | null => {
  if (!raw || typeof raw !== "string") return null;

  try {
    // First attempt: try to parse directly
    return JSON.parse(raw);
  } catch (e) {
    logger.warn("Direct JSON.parse failed", { raw });
  }

  try {
    // Second attempt: strip everything before first '{' and after last '}'
    const cleaned = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    if (cleaned.trim()) {
      return JSON.parse(cleaned);
    }
  } catch (e) {
    logger.warn("Cleaned JSON parsing failed", { raw });
  }

  try {
    // Third attempt: use non-recursive strategy to find JSON block
    const jsonStartIndex = raw.indexOf("{");
    if (jsonStartIndex !== -1) {
      // Try to find matching closing brace using stack logic
      let openBraces = 0;
      let startIndex = -1;

      const chars = raw.substring(jsonStartIndex).split("");
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char === "{") {
          if (startIndex === -1) startIndex = i;
          openBraces++;
        } else if (char === "}") {
          openBraces--;
          if (openBraces === 0) {
            const possibleJson = raw.substring(
              jsonStartIndex + startIndex,
              jsonStartIndex + i + 1
            );
            return JSON.parse(possibleJson);
          }
        }
      }
    }
  } catch (e) {
    logger.warn("Stack-based JSON extraction failed", { raw });
  }

  logger.error("All parsing attempts failed", { raw });
  return null;
};
