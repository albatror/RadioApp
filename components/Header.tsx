
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <LogoIcon className="h-10 w-auto" />
        <div className="ml-4">
          <h1 className="text-2xl font-bold tracking-wider text-yellow-400">EthnAfrika</h1>
          <p className="text-sm text-zinc-400">The Sound of Africa, Worldwide</p>
        </div>
      </div>
    </header>
  );
};
