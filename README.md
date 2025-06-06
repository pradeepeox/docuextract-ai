# DocuExtract AI

DocuExtract AI is an intelligent web application that allows you to upload documents (text files, images, and PDFs) and leverage the power of AI (Google's Gemini or Mistral AI) to extract structured data, summaries, or key-value pairs. It supports OCR for scanned documents and PDFs, bulk PDF processing, and custom templates for consistent extractions.

## Features

*   **Versatile File Upload**: Supports `.txt`, `.md`, `.png`, `.jpg`, `.jpeg`, `.webp`, and `.pdf` files.
*   **Choice of AI Provider**:
    *   **Google Gemini**: Utilizes Gemini models for extraction.
    *   **Mistral AI**: Utilizes Mistral models (e.g., `mistral-ocr-2505`) for extraction. (Requires separate API key setup).
*   **Multiple Output Formats**:
    *   **Summary**: Get a concise overview of the document.
    *   **JSON Structure**: Extract data in a structured JSON format.
    *   **Key-Value Pairs**: Pull out important key-value information.
*   **OCR Capabilities**: Automatically extracts text from images and scanned PDFs using the selected AI provider.
*   **Custom Instructions**: Tailor the extraction process with specific prompts.
*   **Template System**:
    *   Save frequently used extraction settings (AI provider, output format + custom instructions) as named templates.
    *   Quickly apply templates to new documents for consistent results.
    *   Manage (view/delete) saved templates.
*   **Bulk PDF Processing**:
    *   Upload and process up to 5 PDF files simultaneously with the selected AI provider.
    *   View extraction results for each file individually.
*   **CSV Export**:
    *   Export extracted JSON data from multiple files into a single CSV file.
*   **Responsive Design**: User-friendly interface that works on various screen sizes.

## Local Setup Instructions

Follow these steps to set up and run DocuExtract AI locally:

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   Node.js and npm (or yarn/pnpm) installed (since you are likely using `npm run dev` with Vite).
*   An active API Key for the AI provider(s) you intend to use:
    *   **Google Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Mistral AI API Key**: Obtain one from the [Mistral AI platform](https://console.mistral.ai/). (Ensure your key has permissions for the models you intend to use).

### Setup Steps

1.  **Download or Clone Files**:
    *   Download all the project files and place them in a single directory on your local machine.
    *   If you cloned a repository or have a `package.json`, run `npm install` (or `yarn install` / `pnpm install`) in the project directory to install dependencies.

2.  **Set Up API Keys (Crucial for Vite Projects)**:
    *   This application, when run with `npm run dev`, uses Vite, which handles environment variables through `.env` files.
    *   To expose environment variables to your client-side code, Vite requires them to be prefixed with `VITE_`.
    *   **Primary Method (Using `.env.local` file):**
        1.  In the **root directory** of your project, create a file named `.env.local` if it doesn't already exist.
        2.  Add your API keys to this `.env.local` file, prefixed with `VITE_`. For example:
            ```env
            VITE_GEMINI_API_KEY=your_actual_gemini_key_here
            VITE_MISTRAL_API_KEY=your_actual_mistral_key_here
            ```
            Replace `your_actual_gemini_key_here` and `your_actual_mistral_key_here` with your real API keys.
        3.  **Save the `.env.local` file.**
        4.  **Important**: `.env.local` is typically included in `.gitignore` to prevent accidentally committing secret keys. Ensure this is the case if you're using version control.
    *   The application code (e.g., `geminiService.ts`, `mistralService.ts`) will access these keys via `import.meta.env.VITE_GEMINI_API_KEY` and `import.meta.env.VITE_MISTRAL_API_KEY`.
    *   **Note on the `index.html` script block**: The `<script>` block in `index.html` previously suggested for setting `window.process.env` is generally **not needed and not recommended** for Vite projects. Vite has its own robust system for managing environment variables. This script block has been commented out.

3.  **Running the Application**:
    *   Open your terminal, navigate to the project's root directory.
    *   Run the development server:
        ```bash
        npm run dev
        ```
    *   Vite will start the development server and typically provide a local URL (e.g., `http://localhost:5173/`). Open this URL in your web browser.
    *   **Restart Server After `.env` Changes**: If you modify your `.env.local` file (or any `.env` file), you **must restart the Vite development server** for the changes to take effect.

## Usage Guide

1.  **Upload Document(s)**:
    *   Drag and drop your file(s) or click to browse.
    *   Supports single text, image, PDF, or multiple PDFs (up to 5).

2.  **Select AI Provider**:
    *   Choose between "Google Gemini" and "Mistral AI" from the "AI Provider" dropdown. Ensure the corresponding API key is set up as described above.

3.  **Select a Template (Optional)**:
    *   Choose a saved template. It will set the AI Provider, Output Format, and Custom Instructions.
    *   Click "Manage" to view or delete templates.

4.  **Choose Output Format**:
    *   Select Summary, JSON Structure, or Key-Value Pairs.

5.  **Provide Custom Instructions (Optional)**:
    *   Add specific instructions for the AI.

6.  **Save Current Settings as a Template (Optional)**:
    *   Enter a name and click "Save as Template" to store the current AI Provider, Output Format, and Custom Instructions.

7.  **Extract Data**:
    *   Click the "Extract Data with [Provider Name] from file(s)" button.

8.  **View Results**:
    *   Extracted information appears below, labeled with the provider used.
    *   "Copy Output" and "View Raw AI Response" (for JSON) are available.

9.  **Export to CSV (for JSON outputs)**:
    *   If JSON data was extracted, an "Export All JSON to CSV" button will appear.

## Troubleshooting

*   **API Key Error (e.g., "API Key is not configured")**:
    *   Ensure you have correctly created and populated your `.env.local` file in the project root with keys prefixed by `VITE_` (e.g., `VITE_GEMINI_API_KEY=...`).
    *   **Restart your Vite development server** after creating or modifying the `.env.local` file.
    *   Double-check that the keys are correct, active, and have the necessary permissions for the selected AI provider and model.
*   **Mistral API Not Working**:
    *   Check your `VITE_MISTRAL_API_KEY` in `.env.local`.
    *   Ensure the model name (`MISTRAL_OCR_MODEL` in `constants.ts`) is correct and supported by your key.
*   **File Type Not Supported / File Too Large**: Check allowed types and size limits mentioned in the UI.
*   **CORS Errors**: Vite's development server usually handles CORS proxying well for API requests. If you still encounter them, ensure your API provider doesn't have strict referer policies for development keys or explore Vite's server proxy options in `vite.config.js` (if you have one).

---

This application leverages AI SDKs/APIs to interact with Google's Gemini and Mistral AI models.
Ensure you comply with the respective AI providers' API usage policies.