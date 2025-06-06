
import React, { useState, useCallback, ChangeEvent } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { OutputDisplay } from './components/OutputDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { extractDataFromDocument } from './services/geminiService';
import { OutputFormat, ExtractedData, OutputFormatOption } from './types';
import { OUTPUT_FORMAT_OPTIONS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from './constants';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // For images only
  const [fileContentForApi, setFileContentForApi] = useState<string | null>(null); // Text content or base64 for images/PDFs
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OutputFormat.SUMMARY);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setError(null);
    setExtractedData(null);
    setFilePreview(null); // Reset image preview

    if (!file) {
      setSelectedFile(null);
      setFileContentForApi(null);
      setFileMimeType(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      setSelectedFile(null);
      setFileContentForApi(null);
      setFileMimeType(null);
      return;
    }

    const isTextFile = ALLOWED_FILE_TYPES.text.includes(file.type);
    const isImageFile = ALLOWED_FILE_TYPES.image.includes(file.type);
    const isPdfFile = ALLOWED_FILE_TYPES.pdf.includes(file.type);

    if (!isTextFile && !isImageFile && !isPdfFile) {
      setError('Unsupported file type. Please upload a text, image, or PDF file.');
      setSelectedFile(null);
      setFileContentForApi(null);
      setFileMimeType(null);
      return;
    }

    setSelectedFile(file);
    setFileMimeType(file.type);

    const reader = new FileReader();

    reader.onloadend = () => {
      if (isImageFile) {
        const base64String = (reader.result as string).split(',')[1];
        setFilePreview(reader.result as string);
        setFileContentForApi(base64String);
      } else if (isPdfFile) {
        const base64String = (reader.result as string).split(',')[1];
        setFileContentForApi(base64String);
        setFilePreview(null); // No preview for PDF, just name
      } else { // Text file
        setFilePreview(null); 
        setFileContentForApi(reader.result as string);
      }
    };

    reader.onerror = () => {
      setError(`Error reading ${file.type} file.`);
      setSelectedFile(null);
      setFilePreview(null);
      setFileContentForApi(null);
      setFileMimeType(null);
    };

    if (isImageFile || isPdfFile) {
      reader.readAsDataURL(file);
    } else { // Text file
      reader.readAsText(file);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !fileContentForApi) {
      setError('Please select a file first.');
      return;
    }
    if (!process.env.API_KEY) {
      setError('API Key is not configured. Please set the API_KEY environment variable.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    const selectedFormatOption = OUTPUT_FORMAT_OPTIONS.find(opt => opt.id === outputFormat);
    if (!selectedFormatOption) {
        setError('Invalid output format selected.');
        setIsLoading(false);
        return;
    }

    let fullPrompt = selectedFormatOption.promptBase;
    if (customPrompt.trim()) {
      fullPrompt += `\n\nAdditionally, consider the following: ${customPrompt.trim()}`;
    }
    
    try {
      const result = await extractDataFromDocument(
        fileContentForApi,
        fileMimeType!, 
        fullPrompt,
        selectedFormatOption.requiresJsonOutput
      );
      setExtractedData({
        format: outputFormat,
        content: result.data,
        rawText: result.rawText,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during extraction.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
          <p className="mb-6 text-lg text-slate-300">
            Upload a document (text, image, or PDF) and select an output format.
            DocuExtract AI will process it and provide structured information.
          </p>

          <FileUpload onFileChange={handleFileChange} currentFile={selectedFile} />
          
          {selectedFile && filePreview && ALLOWED_FILE_TYPES.image.includes(selectedFile.type) && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-slate-200 mb-2">Image Preview:</h3>
              <img src={filePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border-2 border-slate-600" />
            </div>
          )}
          {selectedFile && (ALLOWED_FILE_TYPES.text.includes(selectedFile.type) || ALLOWED_FILE_TYPES.pdf.includes(selectedFile.type)) && !filePreview && (
             <div className="mt-4">
              <p className="text-sm text-slate-400">Selected file: <span className="font-medium text-slate-300">{selectedFile.name}</span></p>
            </div>
          )}

          {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

          {selectedFile && (
            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="outputFormat" className="block text-sm font-medium text-slate-300 mb-1">Output Format:</label>
                <select
                  id="outputFormat"
                  value={outputFormat}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-100"
                  aria-label="Select output format"
                >
                  {OUTPUT_FORMAT_OPTIONS.map((option: OutputFormatOption) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="customPrompt" className="block text-sm font-medium text-slate-300 mb-1">
                  Custom Instructions (Optional):
                </label>
                <textarea
                  id="customPrompt"
                  rows={3}
                  value={customPrompt}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., 'Focus on financial figures' or 'Extract names and dates only'"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-500"
                  aria-label="Custom instructions for data extraction"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !selectedFile || !fileContentForApi}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-150"
                aria-live="polite"
                aria-busy={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : 'Extract Data'}
              </button>
            </div>
          )}
          
          {extractedData && !isLoading && (
            <div className="mt-8">
              <OutputDisplay data={extractedData} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
