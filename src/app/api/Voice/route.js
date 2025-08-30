// create a route that adds a voice to the database

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConection";
import Voice from "@/models/voiceModel";
import asyncWraper from "@/utils/asyncWraper";

export async function POST(request) {
    try {
        // Connect to database
        await connectToDatabase();

        const { name, description, voiceUrl, imageUrl } = await request.json();
        const voice = new Voice({ name, description, voiceUrl, imageUrl });
        await voice.save();

        console.log(voice);

        return NextResponse.json(
            {
                status: "success",
                data: voice,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding voice:", error);
        return NextResponse.json(
            { error: "Failed to add voice" },
            { status: 500 }
        );
    }
}
export const GET = asyncWraper(async () => {
    await connectToDatabase();
    const voices = await Voice.find();
    return NextResponse.json(voices);
});
