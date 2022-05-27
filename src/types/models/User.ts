interface User {
    _id: string;
    email: string;
    code: string;
    refreshToken?: string;
    accessToken?: string;
}

export default User;
