
export enum OutputFormat {
  SUMMARY = 'SUMMARY',
  JSON_EXTRACT = 'JSON_EXTRACT',
  KEY_VALUE_PAIRS = 'KEY_VALUE_PAIRS',
}

export interface OutputFormatOption {
  id: OutputFormat;
  label: string;
  promptBase: string;
  requiresJsonOutput: boolean;
}

export interface ExtractedData {
  format: OutputFormat;
  content: string | object; // string for summary/key-value, object for JSON
  rawText?: string; // The raw text response from Gemini before parsing
}
