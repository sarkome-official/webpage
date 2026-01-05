import 'i18next';
import { resources, defaultNS } from '../i18n/config';

type Resources = typeof resources['en'];

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
    ns: ['common'];
  }
}
