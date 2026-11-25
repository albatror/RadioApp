export type Lang = 'en' | 'fr';

export type T = (en: string, fr: string) => string;

export const makeT = (lang: Lang): T => (en, fr) => (lang === 'fr' ? fr : en);
