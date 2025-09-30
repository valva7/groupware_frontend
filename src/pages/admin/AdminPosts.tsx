import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types';

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

// 신고된 게시글 목록
const reportedPostIds = ['3', '5'];

export function AdminPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const categories = Array.from(new Set(mockPosts.map(post => post.categoryName)));

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || post.categoryName === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'reported' && reportedPostIds.includes(post.id)) ||
                         (statusFilter === 'normal' && !reportedPostIds.includes(post.id));
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (post: Post) => {
    navigate(`/admin/posts/edit/${post.id}`);
  };

  const handleDelete = (post: Post) => {
    if (confirm(`'${post.title}' 게시글을 삭제하시겠습니까?`)) {
      toast.success('게시글이 삭제되었습니다.');
    }
  };

  const handleView = (post: Post) => {
    navigate(`/admin/posts/detail/${post.id}`);
  };

  const handleResolveReport = (post: Post) => {
    if (confirm(`'${post.title}' 게시글의 신고를 해결처리하시겠습니까?`)) {
      toast.success('신고가 해결처리되었습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const isReported = (postId: string) => {
    return reportedPostIds.includes(postId);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">게시물 관리</h1>
          <p className="text-muted-foreground">전체 게시물을 관리하고 신고된 게시물을 처리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-sm">
            신고 대기 {reportedPostIds.length}건
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 작성자, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="normal">정상</SelectItem>
                  <SelectItem value="reported">신고됨</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테��리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상태</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className={isReported(post.id) ? 'bg-red-50' : ''}>
                    <TableCell>
                      {isReported(post.id) ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive" className="text-xs">신고됨</Badge>
                        </div>
                      ) : (
                        <Badge variant="default" className="text-xs">정상</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.categoryName}</Badge>
                    </TableCell>
                    <TableCell>{post.authorName}</TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(post)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {isReported(post.id) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveReport(post)}
                          >
                            해결
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      조건에 맞는 게시물이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 모바일/태블릿 카드 뷰 */}
          <div className="lg:hidden space-y-4">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className={`${isReported(post.id) ? 'border-red-200 bg-red-50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* 상태와 카테고리 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isReported(post.id) ? (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <Badge variant="destructive" className="text-xs">신고됨</Badge>
                          </div>
                        ) : (
                          <Badge variant="default" className="text-xs">정상</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{post.categoryName}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 className="font-medium line-clamp-2">
                      {post.title}
                    </h3>

                    {/* 작성자와 날짜 */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.authorName}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* 작업 버튼들 */}
                    <div className="flex justify-end gap-1 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(post)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        보기
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        편집
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                      {isReported(post.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveReport(post)}
                        >
                          해결
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 게시물이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}