import { GoogleGenAI } from "@google/genai";
import wav from "node-wav";
import { NextResponse } from "next/server";
import bootCasteModel from "@/models/bootCasteModel";
import connectToDatabase from "@/lib/dbConection";
import asyncWraper from "@/utils/asyncWraper";
import { verifyFirebaseToken } from "@/lib/server-auth";
import path from "path";
import { writeFile } from "fs/promises";
import AppError from "@/utils/appError";
import User from "@/models/userModel";

function encodeWav(pcmData, channels = 1, sampleRate = 24000) {
    // pcmData: Buffer (int16)
    const floatArray = new Float32Array(pcmData.length / 2);
    for (let i = 0; i < floatArray.length; i++) {
        floatArray[i] = pcmData.readInt16LE(i * 2) / 32768;
    }
    const buffer = wav.encode([floatArray], {
        sampleRate,
        float: true,
        bitDepth: 32,
    });
    return buffer;
}

//create a function generate the current date and time in the format of YYYY-MM-DD_HH-MM-SS
function getCurrentDateTime() {
    const now = new Date();
    return now
        .toISOString()
        .replace("T", "_")
        .replace(/:/g, "-")
        .substring(0, 19);
}

export const POST = asyncWraper(async (request) => {
    // الاتصال بقاعدة البيانات أولاً
    await connectToDatabase();

    const { content, characters, name1, name2, isPrompit, bootcastName } =
        await request.json();
    let token =
        request.headers.get("authorization") ||
        request.headers.get("Authorization");
    token = token.split(" ")[1];
    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken.isValid) {
        throw new AppError("this tokin is not valid", 400, "fail");
    }
    const userData = decodedToken.user;
    console.log(userData);
    const user = await User.findOne({ email: userData.email }); 
    if (!user) {
        throw new AppError("user not found", 400, "fail");
    }
    if (!user.canCreateBootCastes || user.NumberOfBootCastesIsUsed >= user.bootcastPlanNumber) {
        throw new AppError("you have used all your bootcastes", 400, "fail");
    }
    if (
        !content ||
        !characters ||
        !name1 ||
        !name2 ||
        characters.length !== 2
    ) {
        throw new AppError(
            `content:${content} or characters:${characters} or name1:${name1} or name2:${name2} is not valid`,
            400,
            "fail"
        );
    }
    let apiKey = await fetch("http://localhost:3000/api/keys");
    apiKey = await apiKey.json();
    apiKey = await apiKey.data.key;
    console.log("apiKey", apiKey);

    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });
    const transcript = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: !isPrompit
            ? `TTS the following conversation between ${name1} and ${name2}: ${content}`
            : content,
    });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: transcript,
        config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [
                        {
                            speaker: name1,
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: characters[0],
                                },
                            },
                        },
                        {
                            speaker: name2,
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: characters[1],
                                },
                            },
                        },
                    ],
                },
            },
        },
    });
    //create afetch with patch method to update key
    //create afetch with patch method to update key
    const updateKeyResponse = await fetch("http://localhost:3000/api/keys", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key: apiKey,
        }),
    });
    if (!updateKeyResponse.ok) {
        throw new AppError("Failed to update key", 500, "fail");
    }
    console.log("key updated successfully");

    const data =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, "base64");
    const wavBuffer = encodeWav(audioBuffer);
    const currentDateTime = getCurrentDateTime();
    const fileName = `BootCaster_${currentDateTime}.wav`;
    const audioPath = path.join(process.cwd(), "public", "audio", fileName);
    await writeFile(audioPath, wavBuffer);
    const bootCaste = new bootCasteModel({
        uid: userData.uid,
        content,
        characters,
        link: "http://localhost:3000/audio/" + fileName,
        name1,
        name2,
        bootcastName,
    });
    await bootCaste.save();
    //update the number of bootcaste used
   //find the user by email

    user.NumberOfBootCastesIsUsed++;
    if (user.NumberOfBootCastesIsUsed >= user.botcastPlanNumber) {
        user.canCreateBootCastes = false;
    }
    await user.save();
    return new NextResponse(
        JSON.stringify({
            status: "success",
            data: {
                uid: userData.uid,
                content,
                characters,
                link: "http://localhost:3000/audio/" + fileName,
                name1,
                name2,
                bootcastName,
            },
        }),
        {
            status: 201,
        }
    );
});
