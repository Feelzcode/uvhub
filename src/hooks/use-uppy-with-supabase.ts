/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";
import { Uppy } from "@uppy/core";
import Tus from "@uppy/tus";
import { useState, useEffect } from "react";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Custom hook for configuring Uppy with Supabase authentication and TUS resumable uploads
 * @param {Object} options - Configuration options for the Uppy instance.
 * @param {string} options.bucketName - The bucket name in Supabase where files are stored.
 * @returns {Object} uppy - Uppy instance with configured upload settings.
 */
export const useUppyWithSupabase = ({ bucketName, folderName }: { bucketName: string, folderName?: string }) => {
    // Initialize Uppy instance only once
    const [uppy] = useState(() => new Uppy());
    
    useEffect(() => {
        const initializeUppy = async () => {
            // Initialize Supabase client with project URL and anon key
            const supabase = await createClient();
            // Retrieve the current user's session for authentication
            const {
                data: { session },
            } = await supabase.auth.getSession();
            uppy.use(Tus, {
                endpoint: `${PROJECT_URL}/storage/v1/upload/resumable`, // Supabase TUS endpoint
                retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delays for resumable uploads
                headers: {
                    authorization: `Bearer ${session?.access_token}`, // User session access token
                    apikey: ANON_KEY!, // API key for Supabase
                },
                uploadDataDuringCreation: true, // Send metadata with file chunks
                removeFingerprintOnSuccess: true, // Remove fingerprint after successful upload
                chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
                allowedMetaFields: [
                    "bucketName",
                    "objectName",
                    "contentType",
                    "cacheControl",
                ], // Metadata fields allowed for the upload
                onError: (error: Error) => console.error("Upload error:", error), // Error handling for uploads
            }).on("file-added", (file: any) => {
                // Attach metadata to each file, including bucket name and content type
                file.meta = {
                    ...file.meta,
                    bucketName, // Bucket specified by the user of the hook
                    objectName: folderName ? `${folderName}/${file.name}` : file.name, // Use file name as object name
                    contentType: file.type, // Set content type based on file MIME type
                };
            });
        };
        // Initialize Uppy with Supabase settings
        initializeUppy();
    }, [uppy, bucketName, folderName]);
    // Return the configured Uppy instance
    return uppy;
};