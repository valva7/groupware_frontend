import { MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types';

const mockPosts: Post[] = [
  {
    id: '1',
    title: '2024년 1분기 회사 워크숍 안내',
    content: '올해 1분기 회사 워크숍을 3월 첫째 주에 진행할 예정입니다.',
    authorId: '1',
    authorName: '홍인사',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-20T10:00:00Z',
    views: 45,
  },
  {
    id: '2',
    title: '카페테리아 메뉴 변경 안내',
    content: '다음 주부터 카페테리아 메뉴가 변경됩니다.',
    authorId: '2',
    authorName: '김총무',
    categoryId: '2',
    categoryName: '일반',
    createdAt: '2024-01-19T15:30:00Z',
    views: 32,
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
    views: 28,
  },
  {
    id: '4',
    title: '신입사원 환영 파티',
    content: '새로 입사한 신입사원들을 위한 환영파티를 개최합니다.',
    authorId: '4',
    authorName: '이기획',
    categoryId: '3',
    categoryName: '이벤트',
    createdAt: '2024-01-17T14:00:00Z',
    views: 67,
  },
];

export function PostWidget() {
  const navigate = useNavigate();

  const handlePostClick = (post: Post) => {
    navigate(`/board/detail/${post.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">최근 게시글</CardTitle>
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                  {post.title}
                </h4>
                <Badge variant="outline" className="text-xs shrink-0">
                  {post.categoryName}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>{post.authorName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </span>
                </div>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          ))}
          
          {mockPosts.length === 0 && (
            <div className="text-center text-muted-foreground py-6">
              최근 게시글이 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}