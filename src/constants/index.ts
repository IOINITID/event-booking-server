import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qwu0m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
