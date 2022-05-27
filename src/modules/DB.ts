import { MongoClient } from 'mongodb';
import SpotifyWebClient from './SpotifyWebClient';
import Playlist from '../types/models/Playlist';
import User from '../types/models/User';

export const mongoClient = new MongoClient(
    process.env.NODE_ENV === 'production' ? (process.env.DB_PROD as string) : (process.env.DB_DEV as string)
);
const DB = mongoClient.db('spotify-companion');

export const Users = DB.collection<User>('User');
export const Playlists = DB.collection<Playlist>('Playlist');

export const updateUserInDb = async (client: SpotifyWebClient) => {
    const { id, email, code, refreshToken, accessToken } = client;
    await Users.updateOne({ _id: id }, { $set: { email, code, refreshToken, accessToken } }, { upsert: true });
};

export default DB;
