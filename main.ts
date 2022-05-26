require('dotenv').config();
import { createServer } from 'http';
import app from './app';

createServer(app).listen(process.env.PORT, () =>
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
);
