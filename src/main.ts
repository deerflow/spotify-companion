import './startup';
import './modules/Logger';
import { createServer } from 'http';
import app from './app';
import cron from './cron';

createServer(app).listen(process.env.PORT, () =>
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
);

cron();

setInterval(cron, 60000);
