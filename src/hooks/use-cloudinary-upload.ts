import { useState, useCallback } from 'react';

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  currentFile?: string;
  totalFiles: number;
  uploadedFiles: number;
}

export interface UploadCallbacks {
  onProgress?: (progress: UploadProgress) => void;
  onStart?: () => void;
  onSuccess?: (files: CloudinaryUploadResponse[]) => void;
  onError?: (error: Error) => void;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

/**
 * Custom hook for Cloudinary file uploads
 * @param {Object} options - Configuration options for Cloudinary uploads
 * @param {string} options.folder - The folder in Cloudinary where files are stored
 * @param {UploadCallbacks} options.callbacks - Optional callbacks for upload events
 * @returns {Object} upload functions and progress tracking
 */
export const useCloudinaryUpload = ({ 
  folder = 'uvhub',
  callbacks 
}: { 
  folder?: string;
  callbacks?: UploadCallbacks;
}) => {
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

  // Upload a single file to Cloudinary
  const uploadFile = useCallback(async (file: File, options?: { folder?: string }): Promise<CloudinaryUploadResponse> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'uvhub_uploads');
      formData.append('folder', options?.folder || folder);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          updateProgress({ progress });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error('Invalid response from Cloudinary'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    });
  }, [folder, updateProgress]);

  // Upload multiple files
  const uploadFiles = useCallback(async (files: File[], options?: { folder?: string }): Promise<CloudinaryUploadResponse[]> => {
    if (!files.length) return [];

    callbacks?.onStart?.();
    updateProgress({ 
      isUploading: true, 
      totalFiles: files.length, 
      uploadedFiles: 0,
      progress: 0 
    });

    try {
      const uploadPromises = files.map(async (file, index) => {
        updateProgress({ 
          currentFile: file.name,
          progress: Math.round((index / files.length) * 100)
        });

        const result = await uploadFile(file, options);
        
        updateProgress({ 
          uploadedFiles: index + 1,
          progress: Math.round(((index + 1) / files.length) * 100)
        });

        return result;
      });

      const results = await Promise.all(uploadPromises);
      
      updateProgress({ 
        isUploading: false, 
        progress: 100,
        uploadedFiles: files.length 
      });

      callbacks?.onSuccess?.(results);
      return results;

    } catch (error) {
      updateProgress({ isUploading: false });
      const errorObj = error instanceof Error ? error : new Error('Upload failed');
      callbacks?.onError?.(errorObj);
      throw errorObj;
    }
  }, [callbacks, uploadFile, updateProgress]);

  // Upload a single file (convenience method)
  const uploadSingleFile = useCallback(async (file: File, options?: { folder?: string }): Promise<CloudinaryUploadResponse> => {
    return uploadFiles([file], options).then(results => results[0]);
  }, [uploadFiles]);

  return {
    uploadFile,
    uploadFiles,
    uploadSingleFile,
    uploadProgress,
    resetProgress
  };
};
