import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, Image, Video, Music, Archive, File } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { cn } from './ui/utils';
import { toast } from 'sonner@2.0.3';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  progress?: number;
  status?: 'uploading' | 'completed' | 'error';
}

interface FileDropzoneProps {
  onFilesChange: (files: FileItem[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  files: FileItem[];
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function FileDropzone({
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = [],
  files = [],
  disabled = false,
  className,
  title = "파일 업로드",
  description = `최대 ${maxFiles}개 파일을 업로드할 수 있습니다.`
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4 text-green-500" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) {
      return <Archive className="h-4 w-4 text-yellow-500" />;
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const validateFile = (file: File): string | null => {
    // 파일 크기 검증
    if (file.size > maxFileSize) {
      return `파일 크기가 ${formatFileSize(maxFileSize)}를 초과합니다.`;
    }

    // 빈 파일 검증
    if (file.size === 0) {
      return `빈 파일은 업로드할 수 없습니다.`;
    }

    // 파일 타입 검증
    if (acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/')) {
          return file.type.startsWith(type);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        return `지원하지 않는 파일 형식입니다. (${file.type})`;
      }
    }

    // 파일명 검증 (특수문자 제한)
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name)) {
      return `파일명에 특수문자가 포함되어 있습니다.`;
    }

    return null;
  };

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: FileItem[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach(file => {
      if (files.length + newFiles.length >= maxFiles) {
        errors.push(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      // 중복 파일 체크
      if (files.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`'${file.name}' 파일이 이미 추가되어 있습니다.`);
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`'${file.name}': ${validationError}`);
        return;
      }

      const fileItem: FileItem = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        status: 'completed'
      };

      newFiles.push(fileItem);
    });

    if (errors.length > 0) {
      // 에러가 있으면 toast로 표시
      errors.forEach(error => {
        toast.error(error);
      });
    }

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
      toast.success(`${newFiles.length}개의 파일이 추가되었습니다.`);
    }
  }, [files, maxFiles, maxFileSize, acceptedTypes, onFilesChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [disabled, processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const removeFile = useCallback((fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
  }, [files, onFilesChange]);

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label>{title}</Label>
        
        {/* Drop zone */}
        <Card
          className={cn(
            "file-dropzone relative border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragOver 
              ? "drag-over border-primary bg-primary/5 ring-2 ring-primary/20" 
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="file-dropzone-content flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200",
              isDragOver 
                ? "bg-primary text-primary-foreground scale-110" 
                : "bg-muted text-muted-foreground"
            )}>
              <Upload className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragOver ? "파일을 여기에 놓으세요" : "파일을 드래그하거나 클릭하세요"}
              </p>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
              {maxFileSize && (
                <p className="text-xs text-muted-foreground">
                  파일 크기 제한: {formatFileSize(maxFileSize)}
                </p>
              )}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || files.length >= maxFiles}
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              파일 선택
            </Button>
          </CardContent>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={acceptedTypes.length > 0 ? acceptedTypes.join(',') : undefined}
          disabled={disabled}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label>첨부된 파일 ({files.length}/{maxFiles})</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="file-item flex items-center justify-between p-3 border rounded-lg bg-card transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.status === 'uploading' && (
                        <>
                          <span>•</span>
                          <span>업로드 중...</span>
                        </>
                      )}
                      {file.status === 'error' && (
                        <>
                          <span>•</span>
                          <span className="text-destructive">오류</span>
                        </>
                      )}
                    </div>
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <Progress value={file.progress} className="mt-1 h-1" />
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="file-remove-btn h-8 w-8 p-0 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}