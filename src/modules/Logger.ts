import Mailjet from './Mailjet';
import pino from 'pino';

process.on('uncaughtException', (err, origin) => {
    Logger.trace({ err, origin });
    Mailjet.instance.sendException(err, origin);
});

const Logger = pino();

export default Logger;
