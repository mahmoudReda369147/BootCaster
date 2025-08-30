import dbconnection from "@/lib/dbConection";
import keysModel from "@/models/keysModel";
import { NextResponse } from "next/server";
import asyncWraper from "@/utils/asyncWraper";

export const POST = asyncWraper(async (requist) => {
    await dbconnection();
    const { key } = await requist.json();
    if (!key) {
        return NextResponse.json(
            { message: "Key is required" },
            { status: 400 }
        );
    }
    const existingKey = await keysModel.findOne({ key });
    if (existingKey) {
        return NextResponse.json(
            { message: "Key already exists" },
            { status: 400 }
        );
    }
    const keyModel = new keysModel({ key });
    await keyModel.save();
    return NextResponse.json(
        { message: "Key saved successfully", key },
        { status: 201 }
    );
});

export const GET = asyncWraper(async () => {
    await dbconnection();
    const keys = await keysModel.find({});
    // Filter keys that are not used in any bootcast yet

    const avilabelKeys = keys.filter((key) => {
        return key.usage < 16;
    });

    return NextResponse.json({ success: true, data: avilabelKeys[0] });
});

export const PATCH = asyncWraper(async (requist) => {
    await dbconnection();
    //get key from params
    const { key } = await requist.json();
    if (!key) {
        return NextResponse.json(
            { message: "Key is required" },
            { status: 400 }
        );
    }
    //check if key exists
    const existingKey = await keysModel.findOne({ key });
    if (!existingKey) {
        return NextResponse.json(
            { message: "Key does not exist" },
            { status: 404 }
        );
    }
    //get usage of key
    const usage = existingKey.usage;
    if (usage >= 16) {
        return NextResponse.json(
            { message: "Key is already in use" },
            { status: 409 }
        );
    }

    const updatedKey = await keysModel.findByIdAndUpdate(
        existingKey._id,
        { usage: usage + 1 },
        { new: true }
    );
    return NextResponse.json(
        { message: "Key usage updated successfully", data: updatedKey },
        { status: 200 }
    );
});
