import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, X } from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { toast } from "sonner";
import { Post } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

// Mock data for editing (same as AdminPosts)
const mockPosts: Post[] = [
  {
    id: '1',
    title: '2024년 1분기 전사 워크숍 안내',
    content: `올해 1분기 전사 워크숍을 3월 첫째 주에 진행할 예정입니다.

**일정:** 2024년 3월 4일(월) ~ 3월 5일(화)
**장소:** 강원도 평창 리조트
**참가 대상:** 전 직원
**주요 프로그램:**
- 팀빌딩 활동
- 바베큐 파티
- 스키/스노우보드 체험
- 온천 이용

자세한 일정과 준비물은 추후 별도 공지드리겠습니다.
많은 참여 부탁드립니다!`,
    authorId: '1',
    authorName: '홍인사',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-20T10:00:00Z',
    views: 156,
    likes: 12,
    commentsCount: 3,
  },
  {
    id: '2',
    title: '카페테리아 메뉴 변경 안내',
    content: `다음 주부터 카페테리아 메뉴가 변경됩니다.

**변경 일정:** 2024년 1월 25일(목)부터
**주요 변경사항:**
- 한식 메뉴 확대
- 샐러드바 신설
- 건강식 옵션 추가

새로운 메뉴를 확인해보시고 많은 이용 부탁드립니다.`,
    authorId: '2',
    authorName: '김총무',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-19T15:30:00Z',
    views: 89,
    likes: 5,
    commentsCount: 2,
  },
  {
    id: '3',
    title: '부적절한 게시글 신고됨',
    content: `이 게시글은 신고되어 관리자 검토가 필요합니다.

부적절한 내용이 포함되어 있어 신고되었습니다.
관리자의 빠른 검토와 조치가 필요한 상황입니다.`,
    authorId: '3',
    authorName: '악성사용자',
    categoryId: '2',
    categoryName: '일반',
    createdAt: '2024-01-18T09:15:00Z',
    views: 67,
    likes: 0,
    commentsCount: 1,
  },
  {
    id: '4',
    title: '신입사원 환영 파티',
    content: `새로 입사한 신입사원들을 위한 환영파티를 개최합니다.

**일시:** 2024년 1월 26일(금) 18:00
**장소:** 회사 카페테리아
**대상:** 전 직원

신입사원들과 함께하는 즐거운 시간이 되길 바랍니다!`,
    authorId: '4',
    authorName: '이기획',
    categoryId: '3',
    categoryName: '이벤트',
    createdAt: '2024-01-17T14:00:00Z',
    views: 134,
    likes: 18,
    commentsCount: 5,
  },
  {
    id: '5',
    title: '스팸성 광고 게시글',
    content: `부적절한 광고성 내용이 포함된 게시글입니다.

이 게시글은 스팸성 광고로 분류되어 신고되었습니다.
적절한 조치가 필요합니다.`,
    authorId: '5',
    authorName: '스팸사용자',
    categoryId: '2',
    categoryName: '일반',
    createdAt: '2024-01-16T12:30:00Z',
    views: 12,
    likes: 0,
    commentsCount: 0,
  },
];

export function PostCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    isNotice: false,
    isPinned: false,
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

  // 편집 모드 확인
  const isEditMode = Boolean(id);
  const isAdminMode = location.pathname.includes('/admin/');

  // 뒤로가기 경로 결정
  const getBackPath = () => {
    if (isAdminMode) {
      return '/admin/posts';
    }
    return '/board';
  };

  // 편집할 게시글 데이터 로드
  useEffect(() => {
    if (isEditMode && id) {
      const post = mockPosts.find(p => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          category: post.categoryName,
          isNotice: post.categoryName === '공지사항',
          isPinned: false, // Mock data doesn't have this field
          tags: [], // Mock data doesn't have tags
        });
      } else {
        toast.error('편집할 게시글을 찾을 수 없습니다.');
        navigate(getBackPath());
      }
    }
  }, [isEditMode, id, navigate]);

  // 편집 모드에서 게시글이 로드되지 않은 경우
  if (isEditMode && !formData.title && !formData.content) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(getBackPath())}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">게시글을 불러오는 중...</h1>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    '공지사항',
    '자유게시판',
    '업무공유',
    '질문답변',
    '제안',
    '행사안내',
    '교육자료',
    '기타'
  ];

  // HTML 태그를 제거하고 텍스트만 추출하는 함수
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('게시글 제목을 입력해주세요.');
      return;
    }
    
    // Quill 에디터의 내용이 비어있는지 확인 (HTML 태그 제거 후 검증)
    const textContent = stripHtml(formData.content).trim();
    if (!textContent || textContent === '') {
      toast.error('게시글 내용을 입력해주세요.');
      return;
    }
    
    if (!formData.category) {
      toast.error('카테고리를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      if (isEditMode) {
        console.log('게시글 수정:', {
          id,
          ...formData,
          attachments,
          updatedAt: new Date().toISOString(),
        });
        toast.success('게시글이 성공적으로 수정되었습니다.');
      } else {
        console.log('새 게시글 작성:', {
          ...formData,
          attachments,
          createdAt: new Date().toISOString(),
          authorId: '1',
          authorName: '김그룹웨어',
          views: 0,
          likes: 0,
          comments: 0,
        });
        toast.success('게시글이 성공적으로 작성되었습니다.');
      }
      
      navigate(getBackPath());
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
          onClick={() => navigate(getBackPath())}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isEditMode ? '게시글 편집' : '게시글 작성'}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isEditMode ? '게시글을 수정합니다.' : '새로운 게시글을 작성합니다.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? '게시글 수정' : '게시글 정보'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="게시글 제목을 입력하세요"
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
              <Label htmlFor="content">내용 *</Label>
              <div className="quill-editor-wrapper quill-post">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="게시글 내용을 입력하세요..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notice"
                    checked={formData.isNotice}
                    onCheckedChange={(checked) => setFormData({ ...formData, isNotice: checked })}
                  />
                  <Label htmlFor="notice">공지사항</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="pinned"
                    checked={formData.isPinned}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked })}
                  />
                  <Label htmlFor="pinned">상단고정</Label>
                </div>
              </div>

              {/* 관리자 전용 옵션 */}
              {isAdminMode && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">관리자 전용 설정</h4>
                  <div className="text-sm text-orange-600 space-y-2">
                    <p>• 모든 카테고리에 게시글을 작성할 수 있습니다.</p>
                    <p>• 다른 사용자의 게시글을 수정할 수 있습니다.</p>
                    <p>• 신고된 게시글의 내용을 수정하여 문제를 해결할 수 있습니다.</p>
                  </div>
                </div>
              )}

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
                  최대 10개의 태그를 추가할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 첨부파일 */}
        <Card>
          <CardHeader>
            <CardTitle>첨부파일</CardTitle>
          </CardHeader>
          <CardContent>
            <FileDropzone
              onFilesChange={handleFilesChange}
              files={attachments}
              maxFiles={5}
              maxFileSize={10 * 1024 * 1024} // 10MB
              acceptedTypes={[
                'image/',
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
              title="파일 첨부"
              description="최대 5개 파일을 업로드할 수 있습니다. 이미지, 문서, 압축파일 등을 첨부하세요."
            />
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(getBackPath())}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting 
              ? (isEditMode ? '수정 중...' : '작성 중...')
              : (isEditMode ? '게시글 수정' : '게시글 작성')
            }
          </Button>
        </div>
      </form>
    </div>
  );
}