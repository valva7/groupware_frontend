import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Search, Users, Plus, X, Calendar, Folder } from 'lucide-react';
import { toast } from "sonner";
import { Project, Member } from '../../types';

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
    description: '기존 내부 시스템 성능 개선',
    status: 'planning',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    managerId: '3',
    managerName: '박시스템',
    members: ['3', '7', '8'],
    progress: 15,
  },
];

const mockMembers: Member[] = [
  { id: '1', name: '김개발', email: 'kim@coev1.com', department: '개발팀', position: '선임연구원', joinDate: '2023-01-15', status: 'active' },
  { id: '2', name: '박개발', email: 'park@coev1.com', department: '개발팀', position: '연구원', joinDate: '2023-03-20', status: 'active' },
  { id: '3', name: '이디자인', email: 'lee@coev1.com', department: '디자인팀', position: '선임디자이너', joinDate: '2023-02-10', status: 'active' },
  { id: '4', name: '최마케팅', email: 'choi@coev1.com', department: '마케팅팀', position: '매니저', joinDate: '2023-04-05', status: 'active' },
  { id: '5', name: '홍영업', email: 'hong@coev1.com', department: '영업팀', position: '과장', joinDate: '2022-12-01', status: 'active' },
  { id: '6', name: '김기획', email: 'kim2@coev1.com', department: '기획팀', position: '팀장', joinDate: '2022-08-15', status: 'active' },
  { id: '7', name: '박인사', email: 'park2@coev1.com', department: '인사팀', position: '과장', joinDate: '2023-06-01', status: 'active' },
  { id: '8', name: '이회계', email: 'lee2@coev1.com', department: '회계팀', position: '대리', joinDate: '2023-09-10', status: 'active' },
];

const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-100 text-blue-800' },
  active: { label: '진행중', color: 'bg-green-100 text-green-800' },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
  'on-hold': { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
};

export function ProjectResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<{ [key: string]: string[] }>({
    '1': ['1', '2', '3', '4'],
    '2': ['2', '5', '6'],
    '3': ['3', '7', '8'],
  });

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.managerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProjectMembers = (projectId: string): Member[] => {
    const memberIds = projectMembers[projectId] || [];
    return mockMembers.filter(member => memberIds.includes(member.id));
  };

  const getAvailableMembers = (projectId: string): Member[] => {
    const assignedMemberIds = projectMembers[projectId] || [];
    return mockMembers.filter(member => !assignedMemberIds.includes(member.id));
  };

  const assignMember = (projectId: string, memberId: string) => {
    setProjectMembers(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), memberId],
    }));
    setMemberDialogOpen(false);
    toast.success('팀원이 배정되었습니다.');
  };

  const removeMember = (projectId: string, memberId: string) => {
    setProjectMembers(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(id => id !== memberId),
    }));
    toast.success('팀원 배정이 해제되었습니다.');
  };

  const openMemberDialog = (project: Project) => {
    setSelectedProject(project);
    setMemberDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <h1>인력 배정</h1>
        <p className="text-muted-foreground">프로젝트별 인력을 배정하고 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트명 또는 관리자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {filteredProjects.map((project) => {
              const config = statusConfig[project.status];
              const assignedMembers = getProjectMembers(project.id);
              const daysLeft = calculateDaysLeft(project.endDate);
              
              return (
                <Card key={project.id} className="p-3 sm:p-4">
                  <div className="space-y-4">
                    {/* 프로젝트 정보 헤더 */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Folder className="h-5 w-5 text-primary shrink-0" />
                              <h3 className="font-semibold break-words">{project.name}</h3>
                            </div>
                            <Badge variant="secondary" className={`text-xs w-fit ${config.color}`}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openMemberDialog(project)}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          인력 배정
                        </Button>
                      </div>
                      
                      {/* 프로젝트 상세 정보 */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                        <span className="shrink-0">PM: {project.managerName}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span className="break-all">
                            {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                          </span>
                        </span>
                        {project.status !== 'completed' && (
                          <span className={`shrink-0 ${daysLeft <= 7 ? 'text-red-600' : ''}`}>
                            {daysLeft > 0 ? `${daysLeft}일 남음` : 
                             daysLeft === 0 ? '오늘 마감' : `${Math.abs(daysLeft)}일 지남`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 배정된 팀원 목록 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">배정된 팀원 ({assignedMembers.length}명)</span>
                      </div>
                      
                      {assignedMembers.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                          배정된 팀원이 없습니다. 인력을 배정해주세요.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {assignedMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors min-w-0"
                            >
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={member.profileImage} alt={member.name} />
                                <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{member.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {member.department} · {member.position}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 h-8 w-8 p-0"
                                onClick={() => removeMember(project.id, member.id)}
                                title="팀원 제거"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>조건에 맞는 프로젝트가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 팀원 선택 다이얼로그 */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>팀원 배정</DialogTitle>
            <p className="text-sm text-muted-foreground break-words">
              {selectedProject?.name}에 배정할 팀원을 선택하세요.
            </p>
          </DialogHeader>
          
          {selectedProject && (
            <Command className="max-h-[400px]">
              <CommandInput placeholder="이름 또는 부서로 검색..." />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty>사용 가능한 팀원이 없습니다.</CommandEmpty>
                <CommandGroup>
                  {getAvailableMembers(selectedProject.id).map((member) => (
                    <CommandItem
                      key={member.id}
                      onSelect={() => assignMember(selectedProject.id, member.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={member.profileImage} alt={member.name} />
                          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{member.name}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {member.department} · {member.position}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}