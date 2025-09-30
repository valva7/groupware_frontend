import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Eye, MessageSquare, Heart, Share2, ThumbsUp, Reply, ChevronRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Post, Comment } from '../../types';

// Board.tsx와 동일한 mockPosts 데이터
const mockPosts: Post[] = [
  {
    id: '1',
    title: '2024년 1분기 전사 워크숍 안내',
    content: `올해 1분기 전사 워크숍을 3월 첫째 주에 진행할 예정입니다.

**일정:** 2024년 3월 4일(월) ~ 2024년 3월 5일(화)
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
    title: '주차장 이용 수칙 안내',
    content: `사내 주차장 이용 시 주의사항을 안내드립니다.

**이용 시간:** 평일 08:00 ~ 19:00
**주의사항:**
- 지정된 구역에만 주차
- 방문차량은 1층 방문자 구역 이용
- 장기간 방치 차량은 견인 조치

협조 부탁드립니다.`,
    authorId: '3',
    authorName: '박관리',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-18T09:15:00Z',
    views: 67,
    likes: 3,
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
    categoryId: '2',
    categoryName: '이벤트',
    createdAt: '2024-01-17T14:00:00Z',
    views: 134,
    likes: 18,
    commentsCount: 5,
  },
  {
    id: '5',
    title: '점심시간 배드민턴 동호회 모집',
    content: `점심시간을 활용한 배드민턴 동호회를 새로 만들려고 합니다.

**활동 시간:** 점심시간 (12:00~13:00)
**활동 장소:** 지하 1층 체육관
**모집 인원:** 8명

관심있는 분들의 많은 참여 바랍니다!`,
    authorId: '5',
    authorName: '최동호',
    categoryId: '3',
    categoryName: '동호회',
    createdAt: '2024-01-16T12:30:00Z',
    views: 78,
    likes: 7,
    commentsCount: 3,
  },
  {
    id: '6',
    title: 'IT 장비 교체 일정 안내',
    content: `노후된 IT 장비 교체가 순차적으로 진행됩니다.

**교체 기간:** 2024년 2월 5일 ~ 2월 16일
**대상 부서:** 개발팀, 디자인팀
**주의사항:** 해당 부서는 사전에 백업을 완료해주세요

업무에 차질이 없도록 미리 준비 부탁드립니다.`,
    authorId: '6',
    authorName: '김IT',
    categoryId: '1',
    categoryName: '공지사항',
    createdAt: '2024-01-15T16:45:00Z',
    views: 92,
    likes: 4,
    commentsCount: 2,
  },
  {
    id: '7',
    title: '건의사항: 휴게실 개선 제안',
    content: `직원 휴게실 시설 개선에 대한 의견을 나누고 싶습니다.

현재 휴게실이 너무 좁고 의자가 부족한 것 같습니다.
다음과 같은 개선사항을 제안합니다:

1. 휴게실 공간 확장
2. 편안한 소파 추가
3. 정수기 교체
4. 간단한 음료 자판기 설치

다른 직원분들의 의견도 듣고 싶습니다.`,
    authorId: '7',
    authorName: '윤직원',
    categoryId: '4',
    categoryName: '건의사항',
    createdAt: '2024-01-14T11:20:00Z',
    views: 45,
    likes: 8,
    commentsCount: 6,
  },
  {
    id: '8',
    title: '사내 교육 프로그램 수강 후기',
    content: `지난주에 참석한 React 교육 프로그램 후기를 공유합니다.

**교육 내용:**
- React 18의 새로운 기능
- 성능 최적화 기법
- 실무 프로젝트 적용 방법

매우 유익한 교육이었습니다. 다음 교육 프로그램도 기대됩니다!`,
    authorId: '8',
    authorName: '정개발',
    categoryId: '5',
    categoryName: '교육/세미나',
    createdAt: '2024-01-13T18:00:00Z',
    views: 61,
    likes: 9,
    commentsCount: 4,
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    authorId: '2',
    authorName: '김개발',
    content: '정말 기대됩니다! 스키 처음 타보는데 재밌을 것 같아요.',
    createdAt: '2024-01-20T11:30:00Z',
    likes: 2,
  },
  {
    id: '2',
    postId: '1',
    authorId: '3',
    authorName: '이디자인',
    content: '바베큐 파티가 가장 기대되네요 ㅎㅎ',
    createdAt: '2024-01-20T14:15:00Z',
    likes: 1,
  },
  {
    id: '3',
    postId: '1',
    authorId: '4',
    authorName: '최마케팅',
    content: '온천도 있다니 너무 좋네요! 미리 예약 가능한가요?',
    createdAt: '2024-01-20T16:45:00Z',
    likes: 0,
  },
  {
    id: '4',
    postId: '1',
    parentId: '1',
    authorId: '5',
    authorName: '홍인사',
    content: '스키 장비는 현지에서 대여할 수 있습니다. 초보자용 강습도 준비되어 있어요!',
    createdAt: '2024-01-20T12:15:00Z',
    likes: 3,
  },
  {
    id: '5',
    postId: '1',
    parentId: '3',
    authorId: '1',
    authorName: '김그룹웨어',
    content: '온천 예약은 별도로 필요하지 않습니다. 자유 이용 가능해요.',
    createdAt: '2024-01-20T17:00:00Z',
    likes: 1,
  },
  {
    id: '6',
    postId: '1',
    parentId: '4',
    authorId: '2',
    authorName: '김개발',
    content: '감사합니다! 그럼 장비 걱정은 안 해도 되겠네요.',
    createdAt: '2024-01-20T12:45:00Z',
    likes: 1,
  },
];

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  depth?: number;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  isLiked: boolean;
  isReplying: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onReplySubmit: () => void;
  onReplyCancel: () => void;
}

function CommentItem({
  comment,
  replies = [],
  depth = 0,
  onLike,
  onReply,
  isLiked,
  isReplying,
  replyText,
  onReplyTextChange,
  onReplySubmit,
  onReplyCancel
}: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maxDepth = 2; // 최대 답글 깊이 제한

  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-8 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="" alt={comment.authorName} />
            <AvatarFallback>{comment.authorName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {depth > 0 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  답글
                </Badge>
              )}
            </div>
            <p className="text-sm break-words mb-2">{comment.content}</p>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-auto p-0 text-xs ${isLiked ? 'text-primary' : ''}`}
                onClick={() => onLike(comment.id)}
              >
                <ThumbsUp className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                좋아요 {(comment.likes + (isLiked ? 1 : 0)) > 0 && `(${comment.likes + (isLiked ? 1 : 0)})`}
              </Button>
              {depth < maxDepth && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs"
                  onClick={() => onReply(comment.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  답글
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 답글 작성 폼 */}
        {isReplying && (
          <div className="ml-11 space-y-2">
            <Textarea
              placeholder={`${comment.authorName}님에게 답글 작성...`}
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onReplySubmit}>
                답글 등록
              </Button>
              <Button variant="outline" size="sm" onClick={onReplyCancel}>
                취소
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 답글 목록 */}
      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onLike={onLike}
              onReply={onReply}
              isLiked={false} // 실제로는 상태 관리가 필요
              isReplying={false}
              replyText=""
              onReplyTextChange={() => {}}
              onReplySubmit={() => {}}
              onReplyCancel={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [postLiked, setPostLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // 댓글을 계층 구조로 정리
  const organizedComments = useMemo(() => {
    const commentMap = new Map<string, Comment[]>();
    const rootComments: Comment[] = [];

    // 현재 게시글의 댓글만 필터링
    const postComments = comments.filter(comment => comment.postId === id);

    // 댓글들을 parentId별로 그룹화
    postComments.forEach(comment => {
      if (!comment.parentId) {
        rootComments.push(comment);
      } else {
        if (!commentMap.has(comment.parentId)) {
          commentMap.set(comment.parentId, []);
        }
        commentMap.get(comment.parentId)!.push(comment);
      }
    });

    // 각 댓글의 답글을 정렬
    commentMap.forEach(replies => {
      replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    // 루트 댓글을 정렬
    rootComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { rootComments, commentMap };
  }, [comments, id]);

  // 현재 경로에 따라 돌아갈 페이지 결정
  const getBackPath = () => {
    if (location.pathname.includes('/admin/posts/detail/')) {
      return '/admin/posts';
    }
    return '/board';
  };

  const getBackLabel = () => {
    if (location.pathname.includes('/admin/posts/detail/')) {
      return '관리 목록으로';
    }
    return '목록으로';
  };

  // URL 파라미터에 따라 해당 게시글 찾기
  const post = mockPosts.find(p => p.id === id);

  // 게시글이 없으면 404 처리
  if (!post) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(getBackPath())}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getBackLabel()}
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">게시글을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              요청하신 게시글이 존재하지 않거나 삭제되었습니다.
            </p>
            <Button onClick={() => navigate(getBackPath())}>
              {location.pathname.includes('/admin/posts/detail/') ? '관리 목록으로 돌아가기' : '게시판으로 돌아가기'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePostLike = () => {
    setPostLiked(!postLiked);
    toast.success(postLiked ? '좋아요를 취소했습니다.' : '좋아요를 눌렀습니다.');
  };

  const handleCommentLike = (commentId: string) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    
    const isLiked = commentLikes[commentId];
    toast.success(isLiked ? '좋아요를 취소했습니다.' : '좋아요를 눌렀습니다.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('링크가 복사되었습니다.');
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    const comment: Comment = {
      id: String(Date.now()),
      postId: id || '1',
      authorId: '1',
      authorName: '김그룹웨어',
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('댓글이 등록되었습니다.');
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) {
      toast.error('답글 내용을 입력해주세요.');
      return;
    }

    const reply: Comment = {
      id: String(Date.now()),
      postId: id || '1',
      parentId,
      authorId: '1',
      authorName: '김그룹웨어',
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments([...comments, reply]);
    setReplyText('');
    setReplyingTo(null);
    toast.success('답글이 등록되었습니다.');
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalComments = comments.filter(comment => comment.postId === id).length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(getBackPath())}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {getBackLabel()}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">{post.categoryName}</Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {postLiked ? (post.likes || 0) + 1 : (post.likes || 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {totalComments}
                  </span>
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl mb-4 break-words">
                {post.title}
              </CardTitle>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={post.authorName} />
                  <AvatarFallback>{post.authorName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{post.authorName}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant={postLiked ? "default" : "outline"}
                size="sm"
                onClick={handlePostLike}
              >
                <Heart className={`h-4 w-4 mr-1 ${postLiked ? 'fill-current' : ''}`} />
                좋아요 {postLiked ? (post.likes || 0) + 1 : (post.likes || 0)}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                공유
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap break-words">
              {post.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 ({totalComments})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 댓글 작성 */}
          <div className="space-y-3">
            <Textarea
              placeholder="댓글을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit}>
                댓글 등록
              </Button>
            </div>
          </div>

          <Separator />

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {organizedComments.rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={organizedComments.commentMap.get(comment.id) || []}
                onLike={handleCommentLike}
                onReply={(commentId) => setReplyingTo(commentId)}
                isLiked={commentLikes[comment.id] || false}
                isReplying={replyingTo === comment.id}
                replyText={replyText}
                onReplyTextChange={setReplyText}
                onReplySubmit={() => handleReplySubmit(comment.id)}
                onReplyCancel={handleReplyCancel}
              />
            ))}
            
            {totalComments === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}