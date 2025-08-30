import { NextResponse } from "next/server";
import asyncWraper from "@/utils/asyncWraper";
import dbConnect from "@/lib/dbConection";
import BootCaste from "@/models/bootCasteModel";

export const GET = asyncWraper(async (req) => {
    await dbConnect(); // Ensure DB is connected
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const podcasts = await BootCaste.find({ uid });
    return NextResponse.json({ success: true, data: podcasts });
});
