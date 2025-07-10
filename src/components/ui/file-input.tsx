"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconUpload, IconX } from "@tabler/icons-react"

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onFileChange?: (files: FileList | null) => void
  onFileRemove?: (index: number) => void
  multiple?: boolean
  accept?: string
  maxFiles?: number
  maxSize?: number // in bytes
  className?: string
  children?: React.ReactNode
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ 
    className, 
    onFileChange, 
    onFileRemove, 
    multiple = false, 
    accept, 
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB default
    children,
    ...props 
  }, ref) => {
    const [files, setFiles] = React.useState<File[]>([])
    const [dragActive, setDragActive] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFiles = React.useCallback((fileList: FileList | null) => {
      if (!fileList) return

      const newFiles = Array.from(fileList)
      const validFiles = newFiles.filter(file => {
        // Check file size
        if (file.size > maxSize) {
          console.warn(`File ${file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB`)
          return false
        }
        return true
      })

      if (multiple) {
        setFiles(prev => {
          const combined = [...prev, ...validFiles]
          return combined.slice(0, maxFiles)
        })
      } else {
        setFiles(validFiles.slice(0, 1))
      }

      onFileChange?.(fileList)
    }, [multiple, maxFiles, maxSize, onFileChange])

    const handleDrag = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }, [])

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    }, [handleFiles])

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    }, [handleFiles])

    const removeFile = React.useCallback((index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index))
      onFileRemove?.(index)
    }, [onFileRemove])

    const openFileDialog = React.useCallback(() => {
      inputRef.current?.click()
    }, [])

    return (
      <div className={cn("w-full", className)}>
        <div
          className={cn(
            "relative flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            "bg-muted/25 hover:bg-muted/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            {...props}
          />
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IconUpload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            {children || (
              <p className="text-xs text-muted-foreground">
                {accept ? `Accepted formats: ${accept}` : "Any file type"} 
                {maxSize && ` (Max ${maxSize / 1024 / 1024}MB)`}
              </p>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Selected Files:</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

FileInput.displayName = "FileInput"

export { FileInput } 