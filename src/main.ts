import './startup';
import './modules/Exceptions';
import { createServer } from 'http';
import app from './app';
import cron from './cron';

console.log({ NODE_ENV: process.env.NODE_ENV });

createServer(app).listen(process.env.PORT, () =>
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
);

cron();

setInterval(cron, 60000);
