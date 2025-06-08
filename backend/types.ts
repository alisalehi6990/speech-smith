// Types for field definitions and extraction

export interface FieldDefinition {
  name: string;
  label: string;
  description?: string;
  format?: 'string' | 'number' | 'boolean';
  optional?: boolean;
}

export interface ExtractionResult {
  [key: string]: any;
  _missing?: string[];
}

export interface QuestionGenerationRequest {
  fields: FieldDefinition[];
  currentData: Record<string, any>;
}

export interface TranscriptionResponse {
  text: string;
}