import asyncWraper from "@/utils/asyncWraper";
import connectToDatabase from "@/lib/dbConection";
import { NextResponse } from "next/server";

import User from "@/models/userModel";

export const POST = asyncWraper(async (req) => {
    const {email} = await req.json();
    await connectToDatabase();
   
    const newUser = await User.create({email});
    return NextResponse.json(newUser);  
})
export const GET = asyncWraper(async (req) => {
    //get email from query params
    const {searchParams} = new URL(req.url);
    const email = searchParams.get("email");
    console.log("email", email);
    await connectToDatabase();
    const user = await User.findOne({email});
    return NextResponse.json(user);
})