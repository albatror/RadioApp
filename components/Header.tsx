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
           Dive into the vibrant essence of the African continent with Us.
           EthnAfrika the webradio that celebrates the diversity of Afro-descendant sounds & cultures.
           From the spiritual energy of Reggae to the hypnotic pulses of Tribal,through the warmth of African House, the ancestral beats of Drums,the modern edge of Afro Pop, the irresistible Afro World, Afro Digital,and the depth of traditional music.EthnAfrika takes you on a sonic journey between roots and modernity.
           EthnAfrika — The Sound of Africa, Worldwide.
          </p>
        </div>
      </div>
    </header>
  );
};
