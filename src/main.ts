import './startup';
import './modules/Exceptions';
import { createServer } from 'http';
import app from './app';
import cron from './cron';
import { mongoClient } from './modules/DB';
import Logger from './modules/Logger';

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

(async () => {
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB');
    createServer(app).listen(process.env.PORT, () =>
        console.log(`Server listening on http://localhost:${process.env.PORT}`)
    );
    cron();
    setInterval(cron, 60000);
})().catch(Logger.trace);
