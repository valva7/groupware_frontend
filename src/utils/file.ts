export const fileUtils = {
  getFileExtension: (filename: string) =>
      filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2),

  getFileSize: (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  },

  isImage: (filename: string) =>
      /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(filename),

  downloadFile: (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  },
};
