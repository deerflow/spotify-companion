interface User {
    _id: string;
    spotifyId: string;
    email: string;
    code: string;
    refreshToken?: string;
    accessToken?: string;
    removeDuplicatesInRewindPlaylists: boolean;
    language: 'english' | 'french';
}

export default User;
