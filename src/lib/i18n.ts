// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from '../../public/locales/es/errors.json';

// Comprobamos si estamos en el navegador antes de inicializar
if (typeof window !== 'undefined' && !i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources: {
                es: { errors: es },
            },
            lng: 'es',
            fallbackLng: 'es',
            interpolation: { escapeValue: false },
        });
}

export default i18n;