import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from './ui/utils';
import { toast } from "sonner";

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  fallbackText: string;
  onImageChange: (imageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { avatar: 'h-16 w-16', card: 'w-20 h-20', icon: 'h-4 w-4' },
  md: { avatar: 'h-20 w-20', card: 'w-24 h-24', icon: 'h-5 w-5' },
  lg: { avatar: 'h-24 w-24', card: 'w-28 h-28', icon: 'h-6 w-6' },
  xl: { avatar: 'h-32 w-32', card: 'w-36 h-36', icon: 'h-8 w-8' },
};

export function ProfileImageUpload({
  currentImageUrl,
  fallbackText,
  onImageChange,
  size = 'lg',
  disabled = false,
  className
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = sizeMap[size];

  const validateImage = (file: File): string | null => {
    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return '이미지 파일 크기는 5MB 이하여야 합니다.';
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return '지원하는 형식: JPG, PNG, WebP';
    }

    return null;
  };

  const processImage = useCallback(async (file: File) => {
    const validationError = validateImage(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);

    try {
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);

      // 실제 환경에서는 서버에 업로드
      // 여기서는 mock 업로드 프로세스
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 업로드 완료 후 URL 전달 (실제로는 서버에서 받은 URL)
      const mockUploadedUrl = URL.createObjectURL(file);
      onImageChange(mockUploadedUrl);
      
      toast.success('프로필 이미지가 업데이트되었습니다.');
      setPreviewUrl(null);
    } catch (error) {
      toast.error('이미지 업로드에 실패했습니다.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  }, [onImageChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processImage]);

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

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
    }
  }, [disabled, isUploading, processImage]);

  const openFileDialog = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    onImageChange('');
    setPreviewUrl(null);
    toast.success('프로필 이미지가 제거되었습니다.');
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* 이미지 영역 */}
      <div className="profile-image-upload">
        <div
          className={cn(
            "relative group cursor-pointer transition-all duration-200",
            isDragOver && "profile-image-upload-drag-over",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Avatar className={cn(sizes.avatar, "border-2 border-dashed border-transparent transition-colors duration-200", displayImageUrl && "profile-image-preview")}>
            <AvatarImage 
              src={displayImageUrl} 
              alt="프로필 이미지" 
              className="object-cover"
            />
            <AvatarFallback className="text-xl bg-muted">
              {fallbackText}
            </AvatarFallback>
          </Avatar>

          {/* 오버레이 */}
          <div className={cn(
            "profile-image-upload-overlay",
            isDragOver && "opacity-100 bg-primary/20",
            isUploading && "opacity-100"
          )}>
            {isUploading ? (
              <Loader2 className={cn(sizes.icon, "text-white animate-spin")} />
            ) : isDragOver ? (
              <Upload className={cn(sizes.icon, "text-primary")} />
            ) : (
              <Camera className={cn(sizes.icon, "text-white")} />
            )}
          </div>

          {/* 드래그 오버레이 */}
          {isDragOver && (
            <div className={cn(
              "absolute inset-0 border-2 border-dashed border-primary rounded-full bg-primary/10",
              "flex items-center justify-center"
            )}>
              <div className="text-primary text-center">
                <Upload className={cn(sizes.icon, "mx-auto mb-1")} />
                <p className="text-xs font-medium">이미지 업로드</p>
              </div>
            </div>
          )}
        </div>

        {/* 제거 버튼 */}
        {displayImageUrl && !isUploading && (
          <button
            className="profile-remove-button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
            disabled={disabled}
            aria-label="프로필 이미지 제거"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* 업로드 상태 표시 */}
        {isUploading && (
          <div className="profile-upload-progress">
            업로드 중...
          </div>
        )}
      </div>

      {/* 업로드 버튼들 */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex gap-2">
          <button
            className="profile-upload-button"
            onClick={openFileDialog}
            disabled={disabled || isUploading}
            aria-label="프로필 이미지 선택"
          >
            <Camera className="h-3 w-3" />
            이미지 선택
          </button>
          
          {displayImageUrl && (
            <button
              className="profile-upload-button text-destructive hover:text-destructive"
              onClick={removeImage}
              disabled={disabled || isUploading}
              aria-label="프로필 이미지 제거"
            >
              <X className="h-3 w-3" />
              제거
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-48">
          JPG, PNG, WebP 형식<br />
          최대 5MB까지 업로드 가능
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}