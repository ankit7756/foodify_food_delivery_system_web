import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "anonymous_secret_key";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodify_db";
export const PORT = process.env.PORT || 5050;