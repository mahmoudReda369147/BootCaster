import { toast } from "react-toastify";

/**
 * Universal download handler that works with both S3 URLs and regular URLs
 * @param {string} url - The URL to download from
 * @param {string} filename - The filename for the download
 * @param {Function} setDownloading - State setter for loading state
 */
export const handleUniversalDownload = async (url, filename = "bootcast.wav", setDownloading = null) => {
    try {
        console.log('Starting download for URL:', url);
        console.log('Filename:', filename);
        console.log('URL type:', url.includes('s3.amazonaws.com') ? 'S3' : 'Regular');
        
        if (setDownloading) setDownloading(true);
        
        // Extract filename from URL if it's an S3 URL
        let fileName = filename;
        if (url.includes('s3.amazonaws.com')) {
            const urlParts = url.split('/');
            fileName = urlParts[urlParts.length - 1];
        }
        
        // For S3 URLs, use our download API to get a signed URL
        if (url.includes('s3.amazonaws.com')) {
            const downloadResponse = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName }),
            });
            
            if (!downloadResponse.ok) {
                throw new Error("Failed to generate download URL");
            }
            
            const downloadData = await downloadResponse.json();
            const downloadUrl = downloadData.data.downloadUrl;
            
            // Download the file using the signed URL
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("Network response was not ok");
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
            
            toast.success("downloaded successfully!");
        } else {
            // For regular URLs, force download
            console.log('Attempting to fetch regular URL:', url);
            
            let response;
            try {
                // Try with CORS first
                response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                });
            } catch (corsError) {
                console.log('CORS failed, trying without CORS mode:', corsError);
                // If CORS fails, try without CORS mode
                response = await fetch(url, {
                    method: 'GET',
                    mode: 'no-cors',
                });
            }
            
           
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            
            toast.success("downloaded successfully!");
        }
    } catch (err) {
        console.error('Download error:', err);
        console.error('URL being downloaded:', url);
        console.error('Filename:', filename);
        console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        toast.error("Failed to download: " + err.message);
    } finally {
        if (setDownloading) setDownloading(false);
    }
};

/**
 * Simple download handler that forces download to device
 * @param {string} url - The URL to download
 * @param {string} filename - The filename for the download
 */
export const handleSimpleDownload = async (url, filename = "download.wav") => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success("Downloaded successfully!");
    } catch (error) {
        console.error('Simple download error:', error);
        console.error('URL being downloaded:', url);
        console.error('Filename:', filename);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        toast.error("Failed to download: " + error.message);
    }
}; 