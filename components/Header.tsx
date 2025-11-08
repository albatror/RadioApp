import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <img
          src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png"
          alt="EthnAfrika Logo"
          className="w-40 h-40 object-contain"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold tracking-wider text-yellow-400">
            EthnAfrika
          </h1>
          <p className="text-sm text-zinc-400">
            The Sound of Africa, Worldwide
          </p>
        </div>
      </div>
    </header>
  );
};
