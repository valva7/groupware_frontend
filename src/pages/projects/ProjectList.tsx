import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Search, Plus, Calendar, Users, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';

const mockProjects: Project[] = [
  {
    id: '1',
    name: '웹사이트 리뉴얼 프로젝트',
    description: '회사 홈페이지 및 관리자 시스템 전면 리뉴얼 작업을 진행합니다. 사용자 경험 개선과 성능 최적화를 목표로 합니다.',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-03-31',
    managerId: '1',
    managerName: '김프로젝트',
    members: ['1', '2', '3', '4'],
    progress: 65,
  },
  {
    id: '2',
    name: '모바일 앱 개발',
    description: '고객용 모바일 애플리케이션을 개발합니다. iOS와 Android 플랫폼을 지원하며, React Native를 사용합니다.',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    managerId: '2',
    managerName: '이모바일',
    members: ['2', '5', '6'],
    progress: 35,
  },
  {
    id: '3',
    name: '내부 시스템 최적화',
    description: '기존 내부 시스템의 성능 개선 및 UI/UX 개선 작업을 진행합니다.',
    status: 'planning',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    managerId: '3',
    managerName: '박시스템',
    members: ['3', '7', '8'],
    progress: 15,
  },
  {
    id: '4',
    name: 'AI 챗봇 도입',
    description: '고객 서비스 개선을 위한 AI 챗봇 시스템을 구축합니다.',
    status: 'on-hold',
    startDate: '2024-01-20',
    endDate: '2024-06-30',
    managerId: '4',
    managerName: '최인공지능',
    members: ['4', '9'],
    progress: 25,
  },
  {
    id: '5',
    name: '데이터베이스 마이그레이션',
    description: '기존 데이터베이스를 최신 버전으로 마이그레이션하고 성능을 최적화합니다.',
    status: 'completed',
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    managerId: '5',
    managerName: '김데이터',
    members: ['5', '10', '11'],
    progress: 100,
  },
  {
    id: '6',
    name: '보안 시스템 강화',
    description: '전사 보안 시스템을 강화하고 보안 정책을 수립합니다.',
    status: 'planning',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    managerId: '6',
    managerName: '이보안',
    members: ['6', '12'],
    progress: 5,
  },
];

const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-100 text-blue-800' },
  active: { label: '진행중', color: 'bg-green-100 text-green-800' },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
  'on-hold': { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
};

export function ProjectList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/detail/${project.id}`);
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">프로젝트 관리</h1>
          <p className="text-muted-foreground text-sm sm:text-base">진행중인 프로젝트들을 관리합니다.</p>
        </div>
        <Button onClick={() => navigate('/projects/create')} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          새 프로젝트
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트명, 관리자, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="planning">기획</SelectItem>
                <SelectItem value="active">진행중</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="on-hold">보류</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProjects.map((project) => {
              const config = statusConfig[project.status];
              const daysLeft = calculateDaysLeft(project.endDate);
              
              return (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">프로젝트</span>
                      </div>
                      <Badge variant="secondary" className={`text-xs ${config.color}`}>
                        {config.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg line-clamp-2">{project.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                      {project.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">진행률</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">PM</span>
                        <span className="font-medium truncate ml-2">{project.managerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          팀원
                        </span>
                        <span className="font-medium">{project.members.length}명</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          기간
                        </span>
                        <span className="font-medium text-right truncate ml-2 text-xs">
                          {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                        </span>
                      </div>
                      {project.status !== 'completed' && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">남은 기간</span>
                          <span className={`font-medium ${daysLeft <= 7 ? 'text-red-600' : ''}`}>
                            {daysLeft > 0 ? `${daysLeft}일 남음` : 
                             daysLeft === 0 ? '오늘 마감' : `${Math.abs(daysLeft)}일 지남`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Folder className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">조건에 맞는 프로젝트가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}