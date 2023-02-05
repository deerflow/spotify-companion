interface User {
    _id: string;
    spotifyId: string;
    email: string;
    code: string;
    refreshToken?: string;
    accessToken?: string;
    removeDuplicatesInRewindPlaylists: boolean;
    language: 'en-US' | 'fr-FR';
}

export default User;
