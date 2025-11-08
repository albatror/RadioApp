import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
        {/* Logo */}
        <img
          src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png"
          alt="EthnAfrika Logo"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
        />

        {/* Title & Description */}
        <div className="sm:ml-6 mt-4 sm:mt-0">
          <h1 className="text-3xl font-extrabold tracking-widest text-yellow-400 uppercase">
            EthnAfrika WebRadio
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Dive into the vibrant essence of the African continent with us.
           <strong> EthnAfrika</strong> — the webradio that celebrates the diversity of Afro-descendant sounds & cultures.  
            From the spiritual energy of Reggae to the hypnotic pulses of Tribal, through the warmth of African House, the ancestral beats of Drums, the modern edge of Afro Pop, the irresistible Afro World & Afro Digital, and the depth of traditional music.  
            <br />
            <span className="block mt-2 font-semibold text-yellow-400">
              EthnAfrika — The Sound of Africa, Worldwide.
            </span>
          </p>
        </div>
      </div>
    </header>
  );
};

