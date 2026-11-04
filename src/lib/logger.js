/**
 * Logger central de l'application.
 *
 * - `debug` et `info` sont silencieux en production (bruit et fuite d'infos).
 * - `warn` et `error` restent actifs et passent par la console courante, afin
 *   que les éventuels intercepteurs (global-toast-patch) continuent de fonctionner.
 *
 * Usage : import { logger } from '@/lib/logger';
 */
const isProd = import.meta.env.PROD;

export const logger = {
  debug: (...args) => { if (!isProd) console.log(...args); },
  info: (...args) => { if (!isProd) console.info(...args); },
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  group: (...args) => { if (!isProd) console.group(...args); },
  groupEnd: () => { if (!isProd) console.groupEnd(); },
};

export default logger;
