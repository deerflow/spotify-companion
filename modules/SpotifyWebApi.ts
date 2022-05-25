import axios from 'axios';

class SpotifyWebApi {
    private static _instance: SpotifyWebApi;
    private _accessToken: string | null = null;

    static get instance() {
        if (!SpotifyWebApi._instance) {
            SpotifyWebApi._instance = new SpotifyWebApi();
        }
        return SpotifyWebApi._instance;
    }

    private constructor() {}

    async authenticate() {
        const res = await axios('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString(
                    'base64'
                )}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({ grant_type: 'client_credentials' }),
        });
        console.log({ data: res.data });
    }
}

export default SpotifyWebApi;
