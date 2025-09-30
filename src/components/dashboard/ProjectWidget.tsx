import { Folder, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';

const mockProjects: Project[] = [
  {
    id: '1',
    name: '웹사이트 리뉴얼 프로젝트',
    description: '회사 홈페이지 및 관리자 시스템 리뉴얼',
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
    description: '고객용 모바일 애플리케이션 개발',
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
    description: '기존 내부 시스템 성능 개선 및 UI/UX 개선',
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
    description: '고객 서비스용 AI 챗봇 시스템 구축',
    status: 'on-hold',
    startDate: '2024-01-20',
    endDate: '2024-06-30',
    managerId: '4',
    managerName: '최인공지능',
    members: ['4', '9'],
    progress: 25,
  },
];

const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-100 text-blue-800' },
  active: { label: '진행중', color: 'bg-green-100 text-green-800' },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
  'on-hold': { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
};

export function ProjectWidget() {
  const navigate = useNavigate();

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">프로젝트 현황</CardTitle>
        <Folder className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {mockProjects.slice(0, 4).map((project) => {
            const config = statusConfig[project.status];
            const daysLeft = calculateDaysLeft(project.endDate);
            
            return (
              <div
                key={project.id}
                className="p-3 sm:p-4 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleProjectClick(project)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 truncate">{project.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`text-xs sm:ml-2 ${config.color} shrink-0 self-start`}>
                    {config.label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-xs text-muted-foreground space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.members.length}명
                    </span>
                    <span className="truncate">PM: {project.managerName}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {daysLeft > 0 ? `${daysLeft}일 남음` : 
                       daysLeft === 0 ? '오늘 마감' : `${Math.abs(daysLeft)}일 지남`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {mockProjects.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              진행중인 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}