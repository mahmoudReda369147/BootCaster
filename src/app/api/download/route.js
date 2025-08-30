import { NextResponse } from "next/server";
import { getSignedUrlForFile } from "@/lib/s3";
import asyncWraper from "@/utils/asyncWraper";
import AppError from "@/utils/appError";

export const POST = asyncWraper(async (request) => {
    try {
        const { fileName } = await request.json();
        
        if (!fileName) {
            throw new AppError("File name is required", 400, "fail");
        }

        // Generate a signed URL for the file
        const signedUrl = await getSignedUrlForFile(fileName, 3600); // 1 hour expiry

        return new NextResponse(
            JSON.stringify({
                status: "success",
                data: {
                    downloadUrl: signedUrl,
                    fileName: fileName
                }
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    } catch (error) {
        console.error('Download API error:', error);
        throw new AppError(
            error.message || "Failed to generate download URL", 
            500, 
            "fail"
        );
    }
}); 