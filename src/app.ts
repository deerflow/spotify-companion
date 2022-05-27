import express from 'express';
import queryString from 'node:querystring';
import SpotifyWebClient from './modules/SpotifyWebClient';
import { MongoClient } from 'mongodb';

const app = express();
const SCOPE = 'playlist-read-private playlist-modify-private user-read-email user-read-private';

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
    console.log({ webClient });
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

export default app;
