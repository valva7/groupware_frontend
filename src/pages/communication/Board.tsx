import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Plus, Eye, MessageSquare } from 'lucide-react';
import { Post } from '../../types';

const mockPosts: Post[] = [
  {
    id: '1',
    title: '2024년 1분기 전사 워크숍 안내',
    content: '올해 1분기 전사 워크숍을 3월 첫째 주에 진행할 예정입니다. 자세한 일정과 프로그램은 추후 공지드리겠습니다.',
    authorId: '1',
    authorName: '홍인사',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-20T10:00:00Z',
    views: 156,
  },
  {
    id: '2',
    title: '카페테리아 메뉴 변경 안내',
    content: '다음 주부터 카페테리아 메뉴가 변경됩니다. 새로운 메뉴를 확인해보세요.',
    authorId: '2',
    authorName: '김총무',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-19T15:30:00Z',
    views: 89,
  },
  {
    id: '3',
    title: '주차장 이용 수칙 안내',
    content: '사내 주차장 이용 시 주의사항을 안내드립니다.',
    authorId: '3',
    authorName: '박관리',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-18T09:15:00Z',
    views: 67,
  },
  {
    id: '4',
    title: '신입사원 환영 파티',
    content: '새로 입사한 신입사원들을 위한 환영파티를 개최합니다.',
    authorId: '4',
    authorName: '이기획',
    categoryId: '2',
    categoryName: '이벤트',
    createdAt: '2024-01-17T14:00:00Z',
    views: 134,
  },
  {
    id: '5',
    title: '점심시간 배드민턴 동호회 모집',
    content: '점심시간을 활용한 배드민턴 동호회를 새로 만들려고 합니다. 관심있는 분들의 많은 참여 바랍니다.',
    authorId: '5',
    authorName: '최동호',
    categoryId: '3',
    categoryName: '동호회',
    createdAt: '2024-01-16T12:30:00Z',
    views: 78,
  },
  {
    id: '6',
    title: 'IT 장비 교체 일정 안내',
    content: '노후된 IT 장비 교체가 순차적으로 진행됩니다. 해당 부서는 사전에 백업을 완료해주세요.',
    authorId: '6',
    authorName: '김IT',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-15T16:45:00Z',
    views: 92,
  },
  {
    id: '7',
    title: '건의사항: 휴게실 개선 제안',
    content: '직원 휴게실 시설 개선에 대한 의견을 나누고 싶습니다.',
    authorId: '7',
    authorName: '윤직원',
    categoryId: '4',
    categoryName: '건의사항',
    createdAt: '2024-01-14T11:20:00Z',
    views: 45,
  },
  {
    id: '8',
    title: '사내 교육 프로그램 수강 후기',
    content: '지난주에 참석한 React 교육 프로그램 후기를 공유합니다.',
    authorId: '8',
    authorName: '정개발',
    categoryId: '5',
    categoryName: '교육/세미나',
    createdAt: '2024-01-13T18:00:00Z',
    views: 61,
  },
];

const categories = Array.from(new Set(mockPosts.map(post => post.categoryName)));

export function Board() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || post.categoryName === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const handlePostClick = (postId: string) => {
    navigate(`/board/detail/${postId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">게시판</h1>
          <p className="text-muted-foreground">사내 소식과 정보를 공유합니다.</p>
        </div>
        <Button onClick={() => navigate('/board/create')}>
          <Plus className="h-4 w-4 mr-2" />
          게시글 작성
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 작성자, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="w-full">제목</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">조회수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {post.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium line-clamp-1 hover:text-primary transition-colors">
                          {post.title}
                        </span>
                        {isNew(post.createdAt) && (
                          <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                            N
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{post.authorName}</TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      조건에 맞는 게시글이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-3">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handlePostClick(post.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {post.categoryName}
                      </Badge>
                      {isNew(post.createdAt) && (
                        <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                          N
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>{post.authorName}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 게시글이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}