import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, BookOpen, Calendar } from 'lucide-react';
import { Manual as ManualType } from '../../types';

const mockManuals: ManualType[] = [
  {
    id: '1',
    title: '사내 IT 시스템 사용 매뉴얼',
    content: '컴퓨터, 네트워크, 보안 프로그램 등 사내 IT 시스템 전반의 사용법을 안내합니다.',
    category: 'IT/시스템',
    authorId: '1',
    authorName: '김IT',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    version: '2.1',
  },
  {
    id: '2',
    title: '인사 관리 시스템 매뉴얼',
    content: '휴가 신청, 근태 관리, 급여 조회 등 인사 시스템 사용법입니다.',
    category: '인사/급여',
    authorId: '2',
    authorName: '홍인사',
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    version: '1.3',
  },
  {
    id: '3',
    title: '회계 시스템 사용 가이드',
    content: '경비 처리, 예산 관리, 결산 업무 등 회계 시스템 전반의 사용법입니다.',
    category: '회계/재무',
    authorId: '3',
    authorName: '박회계',
    createdAt: '2024-01-08T11:30:00Z',
    version: '1.0',
  },
  {
    id: '4',
    title: '영업 관리 시스템 매뉴얼',
    content: '고객 관리, 계약 관리, 영업 실적 관리 등 영업 시스템 사용법입니다.',
    category: '영업/고객',
    authorId: '4',
    authorName: '김영업',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-16T10:10:00Z',
    version: '1.5',
  },
  {
    id: '5',
    title: '프로젝트 관리 도구 가이드',
    content: '프로젝트 생성, 일정 관리, 팀원 배정 등 프로젝트 관리 시스템 사용법입니다.',
    category: '프로젝트',
    authorId: '5',
    authorName: '이PM',
    createdAt: '2024-01-03T13:00:00Z',
    version: '1.2',
  },
  {
    id: '6',
    title: '화상회의 시스템 사용법',
    content: 'Zoom, Teams 등 화상회의 프로그램 설치 및 사용법을 안내합니다.',
    category: 'IT/시스템',
    authorId: '6',
    authorName: '최IT',
    createdAt: '2024-01-02T09:45:00Z',
    updatedAt: '2024-01-12T15:20:00Z',
    version: '1.1',
  },
];

export function Manual() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // 카테고리 목록 추출
  const categories = Array.from(new Set(mockManuals.map(manual => manual.category)));

  const filteredManuals = mockManuals.filter(manual => {
    const matchesSearch = manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manual.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manual.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manual.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || manual.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const isUpdated = (createdAt: string, updatedAt?: string) => {
    if (!updatedAt) return false;
    return new Date(updatedAt) > new Date(createdAt);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">메뉴얼</h1>
          <p className="text-muted-foreground text-sm sm:text-base">시스템 사용법과 업무 가이드를 확인합니다.</p>
        </div>
        <Button onClick={() => navigate('/manual/create')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          메뉴얼 작성
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 내용, 작성자, 카테고리로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={categoryFilter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('')}
            >
              전체
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredManuals.map((manual) => (
              <Card
                key={manual.id}
                className="cursor-pointer hover:shadow-md transition-shadow h-full"
                onClick={() => navigate(`/manual/detail/${manual.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <BookOpen className="h-5 w-5 text-primary shrink-0" />
                      <Badge variant="outline" className="text-xs shrink-0">
                        {manual.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        v{manual.version}
                      </Badge>
                      {isUpdated(manual.createdAt, manual.updatedAt) && (
                        <Badge variant="destructive" className="text-xs">
                          업데이트됨
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg line-clamp-2 break-words leading-tight">
                    {manual.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                    {manual.content.substring(0, 100)}...
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* 작성자 및 날짜 정보 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <span className="truncate">작성자: {manual.authorName}</span>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Calendar className="h-3 w-3" />
                        <span>작성: {formatDate(manual.createdAt)}</span>
                      </div>
                      {manual.updatedAt && (
                        <div className="mt-1">수정: {formatDate(manual.updatedAt)}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredManuals.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg">조건에 맞는 메뉴얼이 없습니다.</p>
              <p className="text-sm mt-2">다른 검색 조건을 시도해보세요.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}