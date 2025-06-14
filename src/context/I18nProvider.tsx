import dynamic from 'next/dynamic';

export const I18nextProvider = dynamic(
    () => import('react-i18next').then(mod => mod.I18nextProvider),
    { ssr: false }
);