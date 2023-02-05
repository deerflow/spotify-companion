import express from 'express';
import queryString from 'node:querystring';
import SpotifyWebClient from './modules/SpotifyWebClient';
import { MongoClient } from 'mongodb';
import Logger from './modules/Logger';
import path from 'path';
import { Users } from './modules/DB';

const app = express();
const SCOPE = 'playlist-read-private playlist-modify-private user-read-email user-read-private';

console.log(path.join(__dirname, 'front/dist/assets'), express.static('front/dist/assets'));

app.use('/assets', express.static(path.join(__dirname, 'front/dist/assets')));

app.get(['/', '/profile'], (req, res) => {
    res.sendFile(path.join(__dirname, '/front/dist/index.html'));
});
app.get('/users/login', (req, res) => {
    return res.redirect(
        `${process.env.SPOTIFY_ACCOUNTS_URI}/authorize?${queryString.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: SCOPE,
            redirect_uri:
                process.env.NODE_ENV === 'production'
                    ? `${process.env.HOST_PROD}/callback/code`
                    : `http://localhost:${process.env.PORT}/callback/code`,
        })}`
    );
});

app.get('/callback/code', async (req, res) => {
    if (req.query.error || !req.query.code) {
        res.status(403).json({ message: 'Failed to authenticate', error: req.query.error });
    }
    const webClient = new SpotifyWebClient({ code: req.query.code as string });
    await webClient.authenticate();
    Logger.info({ webClient });
    await webClient.getCurrentUserProfile();
    res.json({ message: 'Successfully logged in' });
    const dbClient = new MongoClient(
        process.env.NODE_ENV === 'production' ? (process.env.DB_PROD as string) : (process.env.DB_DEV as string)
    );
    try {
        await dbClient.connect();
        await webClient.updateUserInDb(dbClient);
    } finally {
        await dbClient.close();
    }
});

app.get('/data/profile', async (req, res) => {
    if (!req.query.token) {
        return res.status(400).json({ error: 'No token provided' });
    }
    const user = await Users.find({ _id: req.query.token });
    if (!user) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    return user;
});

app.delete('/stop', async (req, res) => {
    if (!req.query.token) {
        return res.status(400).json({ error: 'No token provided' });
    }
    const { deletedCount } = await Users.deleteOne({ _id: req.query.token });
    if (!deletedCount) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    return res.status(200).json({ msg: 'Account deleted' });
});

export default app;
