
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/30 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} DocuExtract AI. Powered by Gemini.
        </p>
      </div>
    </footer>
  );
};
