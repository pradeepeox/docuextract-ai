
import { OutputFormat, OutputFormatOption } from './types';

export const APP_TITLE = "DocuExtract AI";

export const OUTPUT_FORMAT_OPTIONS: OutputFormatOption[] = [
  {
    id: OutputFormat.SUMMARY,
    label: 'Summary',
    promptBase: 'Summarize the key information from the following document content. Provide a concise and comprehensive overview.',
    requiresJsonOutput: false,
  },
  {
    id: OutputFormat.JSON_EXTRACT,
    label: 'JSON Structure',
    promptBase: 'Analyze the following document content and extract structured information as a JSON object. Identify meaningful fields and values. If the document appears to be a form, invoice, or has a clear tabular structure, try to replicate that. For unstructured text, identify key entities, topics, and their relevant details. Ensure the output is a valid JSON object.',
    requiresJsonOutput: true,
  },
  {
    id: OutputFormat.KEY_VALUE_PAIRS,
    label: 'Key-Value Pairs',
    promptBase: 'Extract the most important key-value pairs from the following document content. List them clearly, for example:\nKey1: Value1\nKey2: Value2',
    requiresJsonOutput: false,
  },
];

export const ALLOWED_FILE_TYPES = {
  text: ['text/plain', 'text/markdown'],
  image: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  pdf: ['application/pdf'],
};

export const MAX_FILE_SIZE_MB = 10; // Increased slightly for potentially larger PDFs
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
// Use the same model for multimodal capabilities (images and PDFs)
export const GEMINI_MULTIMODAL_MODEL = 'gemini-2.5-flash-preview-04-17';
