import { FileText, File, Image } from "lucide-react";

// 알림 타입별 색상
export const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case "vote": return "bg-blue-50 border-blue-200";
    case "approval": return "bg-green-50 border-green-200";
    case "vacation": return "bg-purple-50 border-purple-200";
    case "post": return "bg-orange-50 border-orange-200";
    case "system": return "bg-red-50 border-red-200";
    default: return "bg-gray-50 border-gray-200";
  }
};

// 파일 아이콘을 가져오는 함수
export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <Image className="h-5 w-5 text-purple-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

// 파일 크기를 포맷하는 함수
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};