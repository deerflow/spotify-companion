import Mailjet from './Mailjet';

process.on('uncaughtException', (err, origin) => {
    console.error(err, origin);
    Mailjet.instance.sendException(err, origin);
});
