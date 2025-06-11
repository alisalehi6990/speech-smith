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
    2. If more data is needed, ask one clear, natural question to collect the next field.
    3. If all fields are collected, respond with "COMPLETED".

    Example format:
    { "extracted": { "${missingFields[0]}": 28 }, "nextField": "${missingFields[1]}", "message": "Could you please tell me your ${missingFields[1]}?" }

    Return ONLY the JSON object — no explanation.
  `;
};
