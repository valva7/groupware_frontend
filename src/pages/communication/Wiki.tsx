import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, BookOpen, Tag } from 'lucide-react';
import { Wiki as WikiType } from '../../types';

const mockWikis: WikiType[] = [
  {
    id: '1',
    title: '신입사원 온보딩 가이드',
    content: '신입사원이 알아야 할 회사 규정, 시설 이용 방법, 업무 프로세스에 대한 종합 가이드입니다.',
    authorId: '1',
    authorName: '홍인사',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    tags: ['신입사원', '온보딩', '가이드'],
  },
  {
    id: '2',
    title: 'Git 사용법 및 협업 가이드',
    content: '개발팀에서 사용하는 Git 워크플로우와 코드 리뷰 프로세스에 대한 설명입니다.',
    authorId: '2',
    authorName: '박개발',
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    tags: ['Git', '개발', '협업', '코드리뷰'],
  },
  {
    id: '3',
    title: '디자인 시스템 가이드라인',
    content: '회사 제품의 일관된 디자인을 위한 컬러 팔레트, 타이포그래피, 컴포넌트 가이드입니다.',
    authorId: '3',
    authorName: '김디자인',
    createdAt: '2024-01-10T11:30:00Z',
    updatedAt: '2024-01-17T15:45:00Z',
    tags: ['디자인', '시스템', '가이드라인', 'UI'],
  },
  {
    id: '4',
    title: 'API 문서 및 사용법',
    content: '백엔드 API 엔드포인트, 인증 방법, 요청/응답 형식에 대한 상세 문서입니다.',
    authorId: '4',
    authorName: '최백엔드',
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-16T10:10:00Z',
    tags: ['API', '백엔드', '개발', '문서'],
  },
  {
    id: '5',
    title: '마케팅 캠페인 기획 프로세스',
    content: '효과적인 마케팅 캠페인을 기획하고 실행하기 위한 단계별 프로세스입니다.',
    authorId: '5',
    authorName: '한마케팅',
    createdAt: '2024-01-05T13:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    tags: ['마케팅', '캠페인', '기획', '프로세스'],
  },
  {
    id: '6',
    title: '보안 정책 및 개인정보 보호',
    content: '회사의 보안 정책과 개인정보 보호를 위한 필수 준수사항입니다.',
    authorId: '6',
    authorName: '이보안',
    createdAt: '2024-01-03T09:45:00Z',
    updatedAt: '2024-01-20T11:20:00Z',
    tags: ['보안', '개인정보', '정책', '컴플라이언스'],
  },
  {
    id: '7',
    title: '회의실 예약 및 사용 규칙',
    content: '회의실 예약 시스템 사용법과 회의실 이용 에티켓에 대한 안내입니다.',
    authorId: '7',
    authorName: '김총무',
    createdAt: '2024-01-02T15:15:00Z',
    tags: ['회의실', '예약', '사용법', '에티켓'],
  },
  {
    id: '8',
    title: '비용 처리 및 경비 정산 가이드',
    content: '업무상 발생한 비용의 처리 방법과 경비 정산 프로세스입니다.',
    authorId: '8',
    authorName: '박회계',
    createdAt: '2023-12-28T10:30:00Z',
    updatedAt: '2024-01-11T14:00:00Z',
    tags: ['경비', '정산', '회계', '비용처리'],
  },
];

export function Wiki() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // 모든 태그 추출
  const allTags = Array.from(new Set(mockWikis.flatMap(wiki => wiki.tags)));

  const filteredWikis = mockWikis.filter(wiki => {
    const matchesSearch = wiki.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wiki.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wiki.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wiki.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || wiki.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const isUpdated = (createdAt: string, updatedAt?: string) => {
    if (!updatedAt) return false;
    return new Date(updatedAt) > new Date(createdAt);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">사내 위키</h1>
          <p className="text-muted-foreground text-sm sm:text-base">업무에 필요한 지식과 정보를 공유합니다.</p>
        </div>
        <Button onClick={() => navigate('/wiki/create')} className="w-full sm:w-auto shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          위키 작성
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 내용, 작성자, 태그로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 태그 필터 */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag('')}
                className="text-xs sm:text-sm"
              >
                전체
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="text-xs sm:text-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredWikis.map((wiki) => (
              <Card
                key={wiki.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/wiki/detail/${wiki.id}`)}
              >
                <CardHeader className="pb-3 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className="h-5 w-5 text-primary shrink-0" />
                    {isUpdated(wiki.createdAt, wiki.updatedAt) && (
                      <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                        업데이트됨
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base sm:text-lg line-clamp-2 leading-tight">{wiki.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {wiki.content}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-0">
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1">
                    {wiki.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {wiki.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{wiki.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* 작성자 및 날짜 정보 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground pt-2 border-t space-y-1 sm:space-y-0">
                    <span className="truncate">작성자: {wiki.authorName}</span>
                    <div className="text-left sm:text-right">
                      <div>작성: {formatDate(wiki.createdAt)}</div>
                      {wiki.updatedAt && (
                        <div>수정: {formatDate(wiki.updatedAt)}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredWikis.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">조건에 맞는 위키 문서가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}