import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION ,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLICAWS_SECRET_ACCESS_KEY ,
    },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

// Upload file to S3
export async function uploadToS3(fileBuffer, fileName, contentType = 'audio/wav') {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `bootcastes/${fileName}`,
            Body: fileBuffer,
            ContentType: contentType,
            // Removed ACL parameter since bucket has ACLs disabled
        });

        const result = await s3Client.send(command);
        
        // Return the public URL
        const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/bootcastes/${fileName}`; 
        
        return {
            success: true,
            url: publicUrl,
            key: `bootcastes/${fileName}`,
            etag: result.ETag,
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
}

// Get signed URL for private files (if needed)
export async function getSignedUrlForFile(fileName, expiresIn = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `bootcastes/${fileName}`,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
}

// Delete file from S3
export async function deleteFromS3(fileName) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `bootcastes/${fileName}`,
        });

        await s3Client.send(command);
        return { success: true };
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
}

// Get public URL for a file
export function getPublicUrl(fileName) {
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/bootcastes/${fileName}`;
} 