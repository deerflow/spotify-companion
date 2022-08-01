class SpotifyApi {
    private static _instance: SpotifyApi;
    private _retryAfter: number = 0;

    static get instance() {
        if (!SpotifyApi._instance) {
            SpotifyApi._instance = new SpotifyApi();
        }
        return SpotifyApi._instance;
    }

    get retryAfter() {
        return this._retryAfter;
    }

    set retryAfter(retryAfter: number) {
        this._retryAfter = retryAfter;
    }

    private constructor() {}
}

export default SpotifyApi;
