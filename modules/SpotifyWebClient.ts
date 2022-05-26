import axios, { AxiosInstance } from 'axios';

class SpotifyWebClient {
    private readonly _code: string;
    private _refreshToken?: string;
    private _accessToken?: string;
    private _axios: AxiosInstance = axios.create();

    get code() {
        return this._code;
    }
    get refreshToken() {
        return this._refreshToken;
    }
    get accessToken() {
        return this._accessToken;
    }
    get axios() {
        return this._axios;
    }

    constructor({ code, refreshToken, accessToken }: { code: string; refreshToken?: string; accessToken?: string }) {
        this._code = code;
        this._refreshToken = refreshToken;
        this._accessToken = accessToken;
    }

    async authenticate() {
        if (this.accessToken) {
            this.refreshAxiosInstance();
            return true;
        }
        if (this.refreshToken) {
            const res = await axios(`${process.env.SPOTIFY_ACCOUNTS_URI}/api/token`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${new Buffer(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken,
                }),
            });
            const { access_token, refresh_token } = res.data;
            this._accessToken = access_token;
            this._refreshToken = refresh_token ?? this.refreshToken;
            this.refreshAxiosInstance();
            return true;
        }

        const res = await axios(`${process.env.SPOTIFY_ACCOUNTS_URI}/api/token`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${new Buffer(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: this.code,
                redirect_uri: `http://localhost:${process.env.PORT}/callback/code`,
            }),
        });
        const { access_token, refresh_token } = res.data;
        this._accessToken = access_token;
        this._refreshToken = refresh_token;
        this.refreshAxiosInstance();
        return true;
    }

    private refreshAxiosInstance() {
        this._axios = axios.create({
            baseURL: process.env.SPOTIFY_API_URI,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
    }

    async getCurrentUserProfile() {
        const res = await this.axios.get('/me');
        console.log(res.data);
    }

    async getCurrentUserPlaylists({ limit, offset } = { limit: 20, offset: 0 }) {
        const res = await this.axios.get('/users/22ghqzd7uidbgq3d4nnpsvtxy/playlists', { params: { limit, offset } });
        console.log({ data: res.data });
    }
}

export default SpotifyWebClient;
