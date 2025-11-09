
import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { InstagramIcon } from './icons/InstagramIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-black/50 to-transparent pt-12 pb-8 text-center text-zinc-400">
      <div className="flex justify-center gap-6">
        <a href="#" className="hover:text-yellow-400 transition-colors" aria-label="Facebook">
          <FacebookIcon className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-yellow-400 transition-colors" aria-label="Twitter">
          <TwitterIcon className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-yellow-400 transition-colors" aria-label="Instagram">
          <InstagramIcon className="w-6 h-6" />
        </a>
      </div>
      <div className="mt-6 text-sm">
        <p>EthnAfrika.org — The Sound of Africa, Worldwide</p>
        <p className="mt-1">© 2025 EthnAfrika.org — All Rights Reserved.</p>
      </div>
    </footer>
  );
};
