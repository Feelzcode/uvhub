'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { UploadProgress } from '@/hooks/use-uppy-with-supabase';

interface UploadProgressProps {
    progress: UploadProgress;
    className?: string;
}

export function UploadProgressBar({ progress, className }: UploadProgressProps) {
    if (!progress.isUploading && progress.progress === 0) {
        return null;
    }

    const getStatusIcon = () => {
        if (progress.progress === 100) {
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
        if (progress.isUploading) {
            return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
        }
        return <Upload className="h-4 w-4 text-gray-500" />;
    };

    const getStatusText = () => {
        if (progress.progress === 100) {
            return 'Upload Complete';
        }
        if (progress.isUploading) {
            return progress.currentFile ? `Uploading ${progress.currentFile}...` : 'Uploading...';
        }
        return 'Ready to upload';
    };

    return (
        <Card className={className}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className="text-sm font-medium">{getStatusText()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {progress.uploadedFiles}/{progress.totalFiles} files
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {progress.progress}%
                        </span>
                    </div>
                </div>
                
                <Progress value={progress.progress} className="h-2" />
                
                {progress.currentFile && progress.isUploading && (
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                        Current: {progress.currentFile}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export function UploadProgressInline({ progress }: UploadProgressProps) {
    if (!progress.isUploading && progress.progress === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            {progress.isUploading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span className="text-muted-foreground">
                {progress.isUploading ? 'Uploading...' : 'Upload complete'}
            </span>
            {progress.isUploading && (
                <Progress value={progress.progress} className="h-1 w-16" />
            )}
        </div>
    );
}
