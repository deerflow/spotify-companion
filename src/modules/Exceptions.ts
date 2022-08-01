import Logger from './Logger';

import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: 'https://b95acaad25a440e1bcf6fd762c084de1@o1336456.ingest.sentry.io/6605393',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction',
});

export const handleException = (err: Error, origin?: NodeJS.UncaughtExceptionOrigin) => {
    Logger.trace({ err, origin });
    // @ts-ignore
    Sentry.captureException(err, { origin });
};

process.on('uncaughtException', (err, origin) => {
    handleException(err, origin);
});
