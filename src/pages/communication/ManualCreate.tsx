import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { ArrowLeft, X, FileText, Download } from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { toast } from 'sonner@2.0.3';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

export function ManualCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    targetDepartment: '',
    version: '1.0',
    isPublic: true,
    difficulty: 'beginner',
    estimatedTime: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    '시스템 사용법',
    '업무 프로세스',
    '개발 가이드',
    '디자인 가이드',
    '마케팅 가이드',
    '영업 매뉴얼',
    '인사 규정',
    '보안 수칙',
    '장비 사용법',
    '기타'
  ];

  const departments = [
    '전체',
    '개발팀',
    '디자인팀',
    '마케팅팀',
    '영업팀',
    '인사팀',
    '경영진'
  ];

  const difficulties = [
    { value: 'beginner', label: '초급' },
    { value: 'intermediate', label: '중급' },
    { value: 'advanced', label: '고급' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('매뉴얼 제목을 입력해주세요.');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('매뉴얼 설명을 입력해주세요.');
      return;
    }
    
    // Quill 에디터의 내용이 비어있는지 확인 (HTML 태그 제거 후 검증)
    const textContent = stripHtml(formData.content).trim();
    if (!textContent || textContent === '') {
      toast.error('매뉴얼 내용을 입력해주세요.');
      return;
    }
    
    if (!formData.category) {
      toast.error('카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.targetDepartment) {
      toast.error('대상 부서를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('새 매뉴얼 생성:', {
        ...formData,
        attachments,
        createdAt: new Date().toISOString(),
        authorId: '1',
        authorName: '김그룹웨어',
        lastModified: new Date().toISOString(),
        views: 0,
        downloads: 0,
      });
      
      toast.success('매뉴얼이 성공적으로 생성되었습니다.');
      navigate('/manual');
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

  const handleFilesChange = (files: Attachment[]) => {
    setAttachments(files);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/manual')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">매뉴얼 작성</h1>
          <p className="text-muted-foreground text-sm sm:text-base">새로운 매뉴얼을 작성합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              매뉴얼 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">매뉴얼 제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="매뉴얼 제목을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">버전</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="1.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">매뉴얼 설명 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="매뉴얼에 대한 간단한 설명을 입력하세요"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
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

              <div className="space-y-2">
                <Label htmlFor="targetDepartment">대상 부서 *</Label>
                <Select value={formData.targetDepartment} onValueChange={(value) => setFormData({ ...formData, targetDepartment: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="대상 부서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">난이도</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">예상 소요시간</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="예: 30분, 1시간"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <Label htmlFor="public">전체 공개</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>매뉴얼 내용</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">상세 내용 *</Label>
              <div className="quill-editor-wrapper quill-manual">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="매뉴얼의 상세 내용을 작성하세요. 단계별로 구체적으로 설명해주세요..."
                />
              </div>
              <div className="text-xs text-muted-foreground">
                리치 텍스트 에디터를 사용하여 매뉴얼을 작성하세요. 단계별 설명, 주의사항, 예시 등을 포함해주세요.
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
            </div>
          </CardContent>
        </Card>

        {/* 첨부파일 */}
        <Card>
          <CardHeader>
            <CardTitle>첨부파일 및 자료</CardTitle>
          </CardHeader>
          <CardContent>
            <FileDropzone
              onFilesChange={handleFilesChange}
              files={attachments}
              maxFiles={10}
              maxFileSize={50 * 1024 * 1024} // 50MB
              acceptedTypes={[
                'image/',
                'video/',
                'audio/',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/',
                'application/zip',
                'application/x-rar'
              ]}
              title="파일 및 자료 첨부"
              description="최대 10개 파일을 업로드할 수 있습니다. 매뉴얼 관련 이미지, 문서, 동영상 등을 첨부하세요."
            />
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/manual')}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? '생성 중...' : '매뉴얼 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}