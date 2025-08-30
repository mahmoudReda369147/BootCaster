// lib/mongodb.js
import mongoose from "mongoose";
// Remove invalid timestamps setting
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not set");
    throw new Error(
        "Please set the NEXT_PUBLIC_MONGODB_URI environment variable"
    );
}

// كاش الاتصال العالمي لمنع إعادة الاتصال في كل طلب
let cached = global.mongoose || { conn: null, promise: null };

export default async function connectToDatabase() {
    try {
        console.log("Connecting to MongoDB...");

        // If we have a cached connection, return it
        if (cached.conn) {
            console.log("Using cached database connection");
            return cached.conn;
        }

        // If we don't have a connection promise, create one
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            cached.promise = mongoose.connect(MONGODB_URI, opts);
        }

        cached.conn = await cached.promise;
        console.log("Successfully connected to MongoDB");

        global.mongoose = cached;
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        console.error("Database connection error:", err);
        throw new Error(`Failed to connect to MongoDB: ${err.message}`);
    }
}
