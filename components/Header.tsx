
import React from 'react';
import { APP_TITLE } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold text-center text-sky-400 tracking-tight">
          {APP_TITLE}
        </h1>
      </div>
    </header>
  );
};
