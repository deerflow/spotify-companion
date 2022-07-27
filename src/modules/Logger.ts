import Mailjet from './Mailjet';
import pino from 'pino';

const Logger = pino();

process.on('uncaughtException', (err, origin) => {
    Logger.trace({ err, origin });
    Mailjet.instance.sendException(err, origin);
});

export default Logger;
