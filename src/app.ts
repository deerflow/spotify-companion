import express from 'express';
import queryString from 'node:querystring';
import SpotifyWebClient from './modules/SpotifyWebClient';
import path from 'path';
import { Users } from './modules/DB';
import User from './types/models/User';

const app = express();
const SCOPE = 'playlist-read-private playlist-modify-private user-read-email user-read-private';

console.log(path.join(__dirname, 'front/dist/assets'), express.static('front/dist/assets'));

app.use('/assets', express.static(path.join(__dirname, 'front/dist/assets')));

app.get(['/', '/profile', '/error/login', '/token/save'], (req, res) => {
    res.sendFile(path.join(__dirname, '/front/dist/index.html'));
});

app.get('/users/login', async (req, res) => {
    const goToSpotifyLogin = () =>
        res.redirect(
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
    if (!req.query.token) {
        return goToSpotifyLogin();
    }
    const user = await Users.find({ _id: req.query.token });
    if (!user) {
        return goToSpotifyLogin();
    }
    return res.redirect(`/profile?token=${req.query.token}`);
});

app.get('/callback/code', async (req, res) => {
    return console.log(req.query);
    if (req.query.error || !req.query.code) {
        res.status(403).json({ message: 'failed to authenticate', error: req.query.error });
    }
    const webClient = new SpotifyWebClient({ code: req.query.code as string });
    try {
        await webClient.authenticate();
        await webClient.getCurrentUserProfile();
        const _id = await webClient.upsertUser();
        res.redirect(`/token/save?token=${_id}&redirect_uri=/profile`);
    } catch (e) {
        res.redirect('/error/login');
    }
});

app.get('/data/profile', async (req, res) => {
    if (!req.query.token) {
        return res.status(400).json({ error: 'no token provided' });
    }
    const user = await Users.findOne({ _id: req.query.token });
    if (!user) {
        return res.status(400).json({ error: 'invalid token' });
    }

    const { accessToken, refreshToken, code, ...userWithoutTokens } = user;
    return userWithoutTokens;
});

app.patch('/data/profile', async (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({ error: 'missing token' });
    }
    const { language, removeDuplicatesInRewindPlaylists }: User = req.body;
    if (!language || !removeDuplicatesInRewindPlaylists) {
        return res.status(400).json({ error: 'missing fields to update' });
    }
    const webClient = new SpotifyWebClient({ id: req.body.token, language, removeDuplicatesInRewindPlaylists });
    try {
        await webClient.upsertUser();
    } catch (e) {
        return res.status(400).json({ error: 'could not update user in database' });
    }
});

app.delete('/stop', async (req, res) => {
    if (!req.query.token) {
        return res.status(400).json({ error: 'missing token' });
    }
    const { deletedCount } = await Users.deleteOne({ _id: req.query.token });
    if (!deletedCount) {
        return res.status(400).json({ error: 'invalid token' });
    }
    return res.status(200).json({ msg: 'Account deleted' });
});

export default app;
