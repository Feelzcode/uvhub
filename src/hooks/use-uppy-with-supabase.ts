/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";
import { Uppy } from "@uppy/core";
import Tus from "@uppy/tus";
import { useState, useEffect, useRef, useCallback } from "react";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface UploadProgress {
    isUploading: boolean;
    progress: number;
    currentFile?: string;
    totalFiles: number;
    uploadedFiles: number;
}

export interface UploadCallbacks {
    onProgress?: (progress: UploadProgress) => void;
    onSuccess?: (files: any[]) => void;
    onError?: (error: Error) => void;
    onStart?: () => void;
    onComplete?: () => void;
}

/**
 * Custom hook for configuring Uppy with Supabase authentication and TUS resumable uploads
 * @param {Object} options - Configuration options for the Uppy instance.
 * @param {string} options.bucketName - The bucket name in Supabase where files are stored.
 * @param {UploadCallbacks} options.callbacks - Optional callbacks for upload events.
 * @returns {Object} uppy - Uppy instance with configured upload settings and progress tracking.
 */
export const useUppyWithSupabase = ({ 
    bucketName, 
    folderName, 
    callbacks 
}: { 
    bucketName: string, 
    folderName?: string,
    callbacks?: UploadCallbacks
}) => {
    // Initialize Uppy instance only once
    const [uppy] = useState(() => new Uppy());
    const isInitialized = useRef(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        isUploading: false,
        progress: 0,
        totalFiles: 0,
        uploadedFiles: 0
    });
    
    // Progress tracking
    const updateProgress = useCallback((progress: Partial<UploadProgress>) => {
        setUploadProgress(prev => ({ ...prev, ...progress }));
        callbacks?.onProgress?.({ ...uploadProgress, ...progress });
    }, [callbacks, uploadProgress]);

    const resetProgress = useCallback(() => {
        setUploadProgress({
            isUploading: false,
            progress: 0,
            totalFiles: 0,
            uploadedFiles: 0
        });
    }, []);
    
    useEffect(() => {
        const initializeUppy = async () => {
            // Prevent duplicate initialization
            if (isInitialized.current) {
                return;
            }
            
            // Initialize Supabase client with project URL and anon key
            const supabase = await createClient();
            // Retrieve the current user's session for authentication
            const {
                data: { session },
            } = await supabase.auth.getSession();
            
            // Check if Tus plugin is already added
            if (!uppy.getPlugin('Tus')) {
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
                    onError: (error: Error) => {
                        console.error("Upload error:", error);
                        callbacks?.onError?.(error);
                        resetProgress();
                    },
                });
            }
            
            // Add file-added event handler
            uppy.on("file-added", (file: any) => {
                // Generate unique filename to prevent conflicts
                const timestamp = Date.now();
                const randomId = Math.random().toString(36).substring(2, 15);
                const fileExtension = file.name.split('.').pop();
                const fileNameWithoutExt = file.name.replace(`.${fileExtension}`, '');
                const uniqueFileName = `${fileNameWithoutExt}_${timestamp}_${randomId}.${fileExtension}`;
                
                // Attach metadata to each file, including bucket name and content type
                file.meta = {
                    ...file.meta,
                    bucketName, // Bucket specified by the user of the hook
                    objectName: folderName ? `${folderName}/${uniqueFileName}` : uniqueFileName, // Use unique file name as object name
                    contentType: file.type, // Set content type based on file MIME type
                };
            });

            // Upload progress tracking
            uppy.on('upload-progress', (file: any, progress: any) => {
                updateProgress({
                    isUploading: true,
                    progress: Math.round((progress.bytesUploaded / progress.bytesTotal) * 100),
                    currentFile: file.name
                });
            });

            // Upload start
            uppy.on('upload-start', (data: any) => {
                updateProgress({
                    isUploading: true,
                    progress: 0,
                    totalFiles: data?.fileIDs?.length || 0,
                    uploadedFiles: 0
                });
                callbacks?.onStart?.();
            });

            // Upload success
            uppy.on('upload-success', (file: any, response: any) => {
                updateProgress(prev => ({
                    ...prev,
                    uploadedFiles: prev.uploadedFiles + 1
                }));
            });

            // Upload complete
            uppy.on('complete', (result: any) => {
                updateProgress({
                    isUploading: false,
                    progress: 100,
                    uploadedFiles: result?.successful?.length || 0
                });
                callbacks?.onComplete?.();
                callbacks?.onSuccess?.(result?.successful || []);
                
                // Reset progress after a delay
                setTimeout(resetProgress, 2000);
            });
            
            isInitialized.current = true;
        };
        
        // Initialize Uppy with Supabase settings
        initializeUppy();
        
        // Cleanup function
        return () => {
            if (uppy) {
                // Remove all event listeners instead of calling close()
                uppy.off('file-added');
                uppy.off('upload-progress');
                uppy.off('upload-start');
                uppy.off('upload-success');
                uppy.off('complete');
                uppy.off('error');
            }
        };
    }, [uppy, bucketName, folderName, callbacks, updateProgress, resetProgress]);
    
    // Return the configured Uppy instance and progress state
    return { uppy, uploadProgress };
};