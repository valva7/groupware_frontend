import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, X, BookOpen, Upload, FileText, Image, File, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export function WikiCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    parentPage: 'none',
    summary: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Quill 에디터 설정
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image',
    'blockquote', 'code-block'
  ];

  // HTML 태그를 제거하고 텍스트만 추출하는 함수
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const categories = [
    '업무 가이드',
    '시스템 매뉴얼',
    '프로세스',
    '정책 및 규정',
    '기술 문서',
    '회사 소개',
    '교육 자료',
    'FAQ',
    '기타'
  ];

  const parentPages = [
    'none',
    '메인 페이지',
    '개발 가이드',
    '디자인 가이드',
    '마케팅 가이드',
    '운영 가이드',
    '인사 규정',
    '보안 정책'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('위키 제목을 입력해주세요.');
      return;
    }
    
    // Quill 에디터의 내용이 비어있는지 확인 (HTML 태그 제거 후 검증)
    const textContent = stripHtml(formData.content).trim();
    if (!textContent || textContent === '') {
      toast.error('위키 내용을 입력해주세요.');
      return;
    }
    
    if (!formData.category) {
      toast.error('카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.summary.trim()) {
      toast.error('요약을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('새 위키 문서 생성:', {
        ...formData,
        parentPage: formData.parentPage === 'none' ? '' : formData.parentPage,
        attachedFiles: attachedFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type
        })),
        createdAt: new Date().toISOString(),
        authorId: '1',
        authorName: '김그룹웨어',
        version: 1,
        lastModified: new Date().toISOString(),
        views: 0,
      });
      
      // 메모리 정리
      attachedFiles.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
      
      toast.success(`위키 문서가 성공적으로 생성되었습니다.${attachedFiles.length > 0 ? ` (첨부파일 ${attachedFiles.length}개 포함)` : ''}`);
      navigate('/wiki');
      setIsSubmitting(false);
    }, 1500);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    processFiles(Array.from(files));
  };

  const processFiles = (files: File[]) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    const validFiles: AttachedFile[] = [];

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`파일 크기가 너무 큽니다: ${file.name} (최대 10MB)`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`지원하지 않는 파일 형식입니다: ${file.name}`);
        continue;
      }

      // 중복 파일 체크
      const isDuplicate = attachedFiles.some(attached => 
        attached.name === file.name && attached.size === file.size
      );

      if (isDuplicate) {
        toast.error(`이미 첨부된 파일입니다: ${file.name}`);
        continue;
      }

      const attachedFile: AttachedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };

      validFiles.push(attachedFile);
    }

    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length}개의 파일이 첨부되었습니다.`);
    }

    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
    toast.success('파일이 제거되었습니다.');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/wiki')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">위키 문서 작성</h1>
          <p className="text-muted-foreground text-sm sm:text-base">새로운 위키 문서를 작성합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              문서 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">문서 제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="위키 문서 제목을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPage">상위 페이지</Label>
              <Select value={formData.parentPage} onValueChange={(value) => setFormData({ ...formData, parentPage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="상위 페이지를 선택하세요 (선택사항)" />
                </SelectTrigger>
                <SelectContent>
                  {parentPages.map((page, index) => (
                    <SelectItem key={index} value={page}>
                      {page === 'none' ? '없음' : page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">요약 *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="문서의 핵심 내용을 간단히 요약해주세요"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">문서 내용 *</Label>
              <div className="quill-editor-wrapper quill-wiki">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="위키 문서 내용을 작성하세요..."
                />
              </div>
              <div className="text-xs text-muted-foreground">
                리치 텍스트 에디터를 사용하여 문서를 작성하세요.
                <span className="ml-2">
                  제목, 굵게, 기울임, 목록, 링크, 이미지 등을 사용할 수 있습니다.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>태그</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="태그를 입력하고 엔터를 누르세요"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  추가
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                최대 10개의 태그를 추가할 수 있습니다. 검색과 분류에 도움이 됩니다.
              </p>
            </div>

            {/* 파일 첨부 섹션 */}
            <div className="space-y-2">
              <Label>파일 첨부</Label>
              
              {/* 파일 드래그 앤 드롭 영역 */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  파일을 여기로 드래그하거나 클릭하여 선택하세요
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  파일 선택
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
              </div>

              {/* 파일 지원 형식 안내 */}
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">지원 형식: 이미지(JPG, PNG, GIF, WebP), 문서(PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT)</p>
                <p>최대 파일 크기: 10MB</p>
              </div>

              {/* 첨부된 파일 목록 */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">첨부된 파일 ({attachedFiles.length}개)</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {file.url && file.type.startsWith('image/') && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                              title="미리보기"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            title="파일 제거"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 미리보기 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3>{formData.title || '문서 제목'}</h3>
              <p className="text-muted-foreground italic">
                {formData.summary || '요약이 여기에 표시됩니다.'}
              </p>
              {formData.category && (
                <Badge variant="outline" className="mb-2">
                  {formData.category}
                </Badge>
              )}
              <div className="whitespace-pre-wrap">
                {formData.content || '문서 내용이 여기에 표시됩니다.'}
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {attachedFiles.length > 0 && (
                <div className="mt-4 p-3 border rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-2">첨부파일 ({attachedFiles.length}개)</p>
                  <div className="space-y-1">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getFileIcon(file.type)}
                        <span className="truncate">{file.name}</span>
                        <span>({formatFileSize(file.size)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/wiki')}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? '생성 중...' : '위키 문서 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}