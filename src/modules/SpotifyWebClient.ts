import axios, { AxiosInstance } from 'axios';
import { mongoClient, Playlists } from './DB';
import { GetCurrentUserPlaylist, Playlist } from '../types/requests/GetCurrentUserPlaylist';
import { GetPlaylist } from '../types/requests/GetPlaylist';
import { CreatePlaylist } from '../types/requests/CreatePlaylist';
import { GetPlaylistItems } from '../types/requests/GetPlaylistItems';
import User from '../types/models/User';

class SpotifyWebClient {
    private readonly _code: string;
    private _refreshToken?: string;
    private _accessToken?: string;
    private _email?: string;
    private _id?: string;
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
    get email() {
        return this._email;
    }
    get id() {
        return this._id;
    }

    constructor({
        code,
        refreshToken,
        accessToken,
        id,
        email,
    }: {
        code: string;
        refreshToken?: string;
        accessToken?: string;
        id?: string;
        email?: string;
    }) {
        this._code = code;
        this._refreshToken = refreshToken;
        this._accessToken = accessToken;
        this._id = id;
        this._email = email;
        this.refreshAxiosInstance();
    }

    async authenticate(removeAccessToken = false) {
        if (removeAccessToken) {
            this._accessToken = undefined;
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
                redirect_uri:
                    process.env.NODE_ENV === 'production'
                        ? `${process.env.HOST_PROD}/callback/code`
                        : `http://localhost:${process.env.PORT}/callback/code`,
            }),
        });
        const { access_token, refresh_token } = res.data;
        this._accessToken = access_token;
        this._refreshToken = refresh_token;
        this.refreshAxiosInstance();
        return true;
    }

    refreshAxiosInstance() {
        this._axios = axios.create({
            baseURL: process.env.SPOTIFY_API_URI,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
    }

    async updateUserInDb(client = mongoClient) {
        const { id, email, code, refreshToken, accessToken } = this;
        const Users = client.db('spotify-companion').collection<User>('User');
        await Users.updateOne({ _id: id }, { $set: { email, code, refreshToken, accessToken } }, { upsert: true });
    }

    async getCurrentUserProfile() {
        const res = await this.axios.get('/me');
        const { email, id } = res.data;
        this._email = email;
        this._id = id;
    }

    async getCurrentUserPlaylists() {
        let offset = 0;
        let next: string | null = null;
        let playlists: Playlist[] = [];
        do {
            const res = await this.axios.get<GetCurrentUserPlaylist>('/me/playlists', {
                params: { limit: 50, offset },
            });
            next = res.data.next;
            offset += 50;
            playlists = [...playlists, ...res.data.items];
        } while (next !== null);
        return playlists.filter(playlist => playlist.owner.id === this.id);
    }

    async getPlaylist(playlistId: string) {
        const res = await this.axios.get<GetPlaylist>(`/playlists/${playlistId}`, {
            params: { fields: 'id,tracks(items(track(uri)))' },
        });
        const { id, tracks } = res.data;
        return { id, tracks: tracks.items.map(item => item.track.uri) };
    }

    async getPlaylistItems(playlistId: string) {
        let offset = 0;
        let next: string | null = null;
        let tracks: string[] = [];
        do {
            const res = await this.axios.get<GetPlaylistItems>(`/playlists/${playlistId}/tracks`, {
                params: { limit: 100, offset, fields: 'next,items(track(uri))' },
            });
            next = res.data.next;
            offset += 100;
            tracks = [...tracks, ...res.data.items.map(item => item.track.uri)];
        } while (next !== null);
        return tracks;
    }

    async addTracksToPlaylist({ playlistId, tracks }: { playlistId: string; tracks: string[] }) {
        const res = await this.axios.post<string>(`/playlists/${playlistId}/tracks`, {
            uris: tracks,
        });
        return res.data;
    }

    async removeTracksFromPlaylist({ playlistId, tracks }: { playlistId: string; tracks: string[] }) {
        const res = await this.axios.delete<{ snapshot_id: string }>(`/playlists/${playlistId}/tracks`, {
            data: {
                tracks: tracks.map(track => ({ uri: track })),
            },
        });
        return res.data.snapshot_id;
    }

    async createPlaylist({
        name,
        isPublic = false,
        collaborative = false,
        description,
    }: {
        name: string;
        isPublic?: boolean;
        collaborative?: boolean;
        description: string;
    }) {
        const res = await this.axios.post<CreatePlaylist>(`/users/${this.id}/playlists`, {
            name,
            public: isPublic,
            collaborative,
            description,
        });
        return res.data;
    }

    async removeDuplicateTracksInPlaylist(playlistId: string) {
        const playlist = await this.getPlaylist(playlistId);
        if (!playlist) {
            throw new Error(
                'Exception while calling SpotifyWebClient.removeDuplicateTracksInPlaylist : Playlist not found'
            );
        }
        const playlistTracksDuplicates = playlist.tracks.filter(
            (track, index) => playlist.tracks.indexOf(track) !== index
        );
        await this.removeTracksFromPlaylist({ playlistId, tracks: playlistTracksDuplicates });
        return this.addTracksToPlaylist({ playlistId, tracks: [...new Set(playlistTracksDuplicates)] });
    }

    async removeDuplicateTracksInPlaylistAndDbPlaylist(playlistId: string) {
        const snapshotId = await this.removeDuplicateTracksInPlaylist(playlistId);
        const dbPlaylist = await Playlists.findOne({ _id: playlistId });
        if (!dbPlaylist) {
            throw new Error(
                'Exception while calling SpotifyWebClient.removeDuplicateTracksInPlaylistAndDbPlaylist : DbPlaylist not found'
            );
        }
        const newDbPlaylistTracks = [...new Set(dbPlaylist?.tracks)];
        await Playlists.updateOne({ _id: playlistId }, { $set: { tracks: newDbPlaylistTracks, snapshotId } });
    }
}

export default SpotifyWebClient;
