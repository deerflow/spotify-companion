require('dotenv').config();
import './modules/Logger';
import { createServer } from 'http';
import app from './app';

createServer(app).listen(process.env.PORT, () =>
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
);
