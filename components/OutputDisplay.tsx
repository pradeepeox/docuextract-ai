
import React from 'react';
import { ExtractedData, OutputFormat } from '../types';

interface OutputDisplayProps {
  data: ExtractedData;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data }) => {
  const renderContent = () => {
    if (data.format === OutputFormat.JSON_EXTRACT) {
      let contentToDisplay: string;
      // Check if content is an object with the specific error structure from geminiService
      if (typeof data.content === 'object' && data.content !== null && 'error' in data.content && 'rawResponse' in data.content) {
        contentToDisplay = (data.content as {rawResponse: string}).rawResponse; // Show the raw response if parsing failed
      } else if (typeof data.content === 'string') {
         // This case might happen if Gemini returned string despite being asked for JSON,
         // or if rawText is to be shown due to other upstream issues before parsing attempt.
        contentToDisplay = data.rawText || data.content;
      } else {
        // Content is already a parsed JSON object
        contentToDisplay = JSON.stringify(data.content, null, 2);
      }
      
      // Attempt to pretty-print if it's a string that looks like JSON,
      // but preserve as is if it's not valid JSON (e.g. the rawResponse error string)
      try {
        const parsed = JSON.parse(contentToDisplay);
        contentToDisplay = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // Not a valid JSON string, display as is (this is expected for rawResponse)
      }

      return (
        <pre className="whitespace-pre-wrap break-all bg-slate-900 p-4 rounded-md text-sm text-sky-300 overflow-x-auto">
          {contentToDisplay}
        </pre>
      );
    }
    // For SUMMARY and KEY_VALUE_PAIRS, content is expected to be a string
    if (typeof data.content === 'string') {
      return <div className="whitespace-pre-wrap break-words bg-slate-700 p-4 rounded-md text-slate-200">{data.content}</div>;
    }
    // Fallback for unexpected content type
    return <div className="text-red-400">Error: Unexpected data format for display. Please check raw output.</div>;
  };

  const handleCopyToClipboard = async () => {
    let textToCopy: string;

    if (data.format === OutputFormat.JSON_EXTRACT) {
        // Prioritize rawText for copying if available, as it's the direct Gemini output
        if (data.rawText) {
            textToCopy = data.rawText;
        } else if (typeof data.content === 'object' && data.content !== null && 'error' in data.content && 'rawResponse' in data.content) {
            textToCopy = (data.content as {rawResponse: string}).rawResponse;
        } else if (typeof data.content === 'string') {
            textToCopy = data.content;
        } else {
            textToCopy = JSON.stringify(data.content, null, 2);
        }
    } else {
        textToCopy = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      // Consider replacing alert with a less intrusive notification component
      const alertElement = document.createElement('div');
      alertElement.textContent = 'Copied to clipboard!';
      alertElement.className = 'fixed top-5 right-5 bg-sky-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300';
      document.body.appendChild(alertElement);
      setTimeout(() => {
        alertElement.style.opacity = '0';
        setTimeout(() => alertElement.remove(), 300);
      }, 2000);

    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard.');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-sky-400">Extracted Information:</h3>
        <button
            onClick={handleCopyToClipboard}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-sky-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
            aria-label="Copy extracted information to clipboard"
        >
            Copy
        </button>
      </div>
      <div className="border border-slate-700 rounded-lg shadow-inner">
        {renderContent()}
      </div>
       {data.rawText && data.format === OutputFormat.JSON_EXTRACT && (
        <details className="mt-2 text-sm text-slate-400 cursor-pointer">
          <summary className="hover:text-slate-300">View Raw AI Response</summary>
          <pre className="mt-1 whitespace-pre-wrap break-all bg-slate-950 p-3 rounded-md text-xs text-slate-500 overflow-x-auto">
            {data.rawText}
          </pre>
        </details>
      )}
    </div>
  );
};
