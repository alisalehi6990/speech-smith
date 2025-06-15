export const generateQuestionPrompt = (
  requiredFields: string[],
  collectedData: Record<string, any>,
  lastAnswer: string
): string => {
  const missingFields = requiredFields.filter((f) => !(f in collectedData));
  const missingFieldsStr = missingFields.join(", ");

  return `
    You are a helpful assistant helping collect structured data.
    So far, the user has provided: ${Object.entries(collectedData).map(([k, v]) => `${k}=${v}`).join(", ") || "nothing"}
    The remaining fields to collect are: ${missingFieldsStr || "none"}

    RETURN ONLY A JSON OBJECT CONTAINING THE EXACT FIELDS REQUESTED.
    DO NOT INCLUDE ANY FIELD THAT IS NOT MENTIONED IN THE INPUT.
    IF A FIELD CANNOT BE FOUND, OMIT IT FROM THE OUTPUT.
    NEVER USE null OR undefined VALUES.

    Your task:
    1. Based on the user's latest answer ("${lastAnswer}"), extract any known variables.
    2. If more data is needed, ask one clear, natural question to collect the next field and put it inside "message" property in your response.
    3. Always use metric system for data collection and ask question accordingly, like how much is your weight in kilogram
    4. If all fields are collected, respond with "COMPLETED".

    Example format:
    { "extracted": { {The fields you managed to extract from user' latest answer} }, "nextField": "{The field you are about to ask for in message}", "message": "{Question you generated to ask for next field}" }

    Return ONLY the JSON object — no explanation.
  `;
};
