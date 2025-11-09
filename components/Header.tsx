import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Conteneur principal : logo à gauche, texte à côté */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-center">
        {/* Logo à gauche */}
        <img
          src="https://i.ibb.co/YBntfXQm/logo-digital-K-2.png"
          alt="EthnAfrika Logo"
          className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
        />

        {/* Texte centré horizontalement par rapport à son bloc */}
        <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-widest text-yellow-400 uppercase">
            EthnAfrika.org
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Dive into the vibrant essence of the African continent with us.
            <strong> EthnAfrika.org</strong> — the webradio that celebrates the diversity of Afro-descendant sounds & cultures.  
            From the spiritual energy of Reggae to the hypnotic pulses of Tribal & traditional music, through the warmth of African House, the ancestral beats of Drums, the modern edge of Afro Pop.  
            <br />
            <span className="block mt-2 font-semibold text-yellow-400">
              EthnAfrika.org — The Sound of Africa, Worldwide.
            </span>
          </p>
        </div>
      </div>
    </header>
  );
};
