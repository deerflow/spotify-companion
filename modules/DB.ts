import { MongoClient } from 'mongodb';

export const mongoClient = new MongoClient('mongodb://localhost:27017');
const DB = mongoClient.db('spotify-companion');

export const Users = DB.collection<{
    _id: string;
    email: string;
    code: string;
    refreshToken?: string;
    accessToken?: string;
}>('User');

export default DB;
