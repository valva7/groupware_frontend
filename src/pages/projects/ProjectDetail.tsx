import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Calendar, Users, Plus, Search, X, UserMinus, Shield } from 'lucide-react';
import { toast } from "sonner";
import { Project, Member } from '../../types';

const mockProject: Project = {
  id: '1',
  name: '웹사이트 리뉴얼 프로젝트',
  description: '회사 홈페이지 및 관리자 시스템 전면 리뉴얼을 통한 사용자 경험 개선 및 관리 효율성 향상',
  status: 'active',
  startDate: '2024-01-10',
  endDate: '2024-03-31',
  managerId: '1',
  managerName: '김프로젝트',
  members: ['1', '2', '3', '4'],
  progress: 65,
};

const mockMembers: Member[] = [
  { id: '1', name: '김프로젝트', email: 'kim@coev1.com', department: '개발팀', position: 'PM', joinDate: '2023-01-15', status: 'active' },
  { id: '2', name: '박개발', email: 'park@coev1.com', department: '개발팀', position: '선임연구원', joinDate: '2023-03-20', status: 'active' },
  { id: '3', name: '이디자인', email: 'lee@coev1.com', department: '디자인팀', position: '선임디자이너', joinDate: '2023-02-10', status: 'active' },
  { id: '4', name: '최마케팅', email: 'choi@coev1.com', department: '마케팅팀', position: '매니저', joinDate: '2023-04-05', status: 'active' },
];



const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-100 text-blue-800' },
  active: { label: '진행중', color: 'bg-green-100 text-green-800' },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
  'on-hold': { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
};



export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [projectMembers, setProjectMembers] = useState<Member[]>(
    mockMembers.filter(member => mockProject.members.includes(member.id))
  );

  // 현재 로그인한 사용자 (실제 환경에서는 auth store에서 가져옴)
  const currentUserId = '1'; // Mock 데이터
  const canManageMembers = currentUserId === mockProject.managerId; // 프로젝트 매니저 여부

  // 추가 가능한 팀원 필터링 (이미 프로젝트에 속한 팀원 제외)
  const availableMembers = mockMembers.filter(member => 
    !projectMembers.find(pm => pm.id === member.id)
  );

  // 팀원 검색 필터링
  const filteredMemberCandidates = availableMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  // 팀원 추가
  const addMember = (member: Member) => {
    setProjectMembers(prev => [...prev, member]);
    setMemberDialogOpen(false);
    setMemberSearchTerm('');
    toast.success(`${member.name}님이 프로젝트에 추가되었습니다.`);
    // 실제 환경에서는 여기서 API 호출
    console.log('팀원 추가:', member.name);
  };

  // 팀원 삭제
  const removeMember = (memberId: string) => {
    // 프로젝트 매니저는 삭제할 수 없음
    if (memberId === mockProject.managerId) {
      toast.error('프로젝트 매니저는 제거할 수 없습니다.');
      return;
    }
    
    const removedMember = projectMembers.find(m => m.id === memberId);
    
    // 확인 다이얼로그
    const confirmed = window.confirm(`${removedMember?.name}님을 프로젝트에서 제거하시겠습니까?`);
    if (!confirmed) return;
    
    setProjectMembers(prev => prev.filter(member => member.id !== memberId));
    toast.success(`${removedMember?.name}님이 프로젝트에서 제거되었습니다.`);
    // 실제 환경에서는 여기서 API 호출
    console.log('팀원 삭제:', removedMember?.name);
  };



  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  const daysLeft = calculateDaysLeft(mockProject.endDate);
  const config = statusConfig[mockProject.status];

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </div>

        {/* 프로젝트 개요 */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className={config.color}>
                    {config.label}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(mockProject.startDate).toLocaleDateString()} ~ {new Date(mockProject.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {projectMembers.length}명
                    </span>
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl mb-4 break-words">
                  {mockProject.name}
                </CardTitle>
                <p className="text-muted-foreground mb-4">{mockProject.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>프로젝트 매니저: <strong>{mockProject.managerName}</strong></span>
                  <span className={daysLeft <= 7 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                    {daysLeft > 0 ? `${daysLeft}일 남음` : 
                     daysLeft === 0 ? '오늘 마감' : `${Math.abs(daysLeft)}일 지남`}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mockProject.progress}%
                </div>
                <div className="text-sm text-muted-foreground">진행률</div>
                <Progress value={mockProject.progress} className="w-24 mt-2" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 팀원 관리 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              프로젝트 팀원 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 팀원 관리 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">팀원 목록</h3>
                <Badge variant="secondary" className="text-xs">
                  {projectMembers.length}명
                </Badge>
                {!canManageMembers && (
                  <Badge variant="outline" className="text-xs ml-2">
                    읽기 전용
                  </Badge>
                )}
              </div>
              
              {/* 팀원 추가 버튼 */}
              {canManageMembers && (
                <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      팀원 추가
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-md mx-4 max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>팀원 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* 검색 입력 */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="이름, 부서, 직급으로 검색..."
                        value={memberSearchTerm}
                        onChange={(e) => setMemberSearchTerm(e.target.value)}
                        className="pl-10"
                        autoFocus
                      />
                      {memberSearchTerm && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setMemberSearchTerm('')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    {/* 검색 결과 카운트 */}
                    <div className="text-xs text-muted-foreground px-1">
                      {memberSearchTerm ? 
                        `${filteredMemberCandidates.length}명 검색됨` : 
                        `추가 가능한 ${filteredMemberCandidates.length}명`
                      }
                    </div>
                    
                    {/* 팀원 목록 */}
                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {filteredMemberCandidates.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>
                            {memberSearchTerm ? '검색 결과가 없습니다.' : '추가할 수 있는 팀원이 없습니다.'}
                          </p>
                        </div>
                      ) : (
                        filteredMemberCandidates.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => addMember(member)}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.department} · {member.position}
                              </div>
                              <div className="text-xs text-muted-foreground">{member.email}</div>
                            </div>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              )}
            </div>

            {/* 팀원 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectMembers.map((member) => {
                const isManager = member.id === mockProject.managerId;
                
                return (
                  <Card key={member.id} className="relative group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.profileImage} alt={member.name} />
                            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          {isManager && (
                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                              <Shield className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{member.name}</h4>
                            {isManager && (
                              <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                PM
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {member.department} · {member.position}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </p>
                        </div>
                        
                        {/* 삭제 버튼 (매니저가 아니고 권한이 있는 경우만) */}
                        {!isManager && canManageMembers && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="팀원 제거"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {projectMembers.length === 0 && (
                <div className="col-span-full">
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="h-16 w-16 mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2 text-muted-foreground">팀원이 없습니다</h3>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        {canManageMembers ? 
                          '프로젝트에 참여할 팀원을 추가해보세요.' :
                          '아직 프로젝트에 팀원이 배정되지 않았습니다.'
                        }
                      </p>
                      {canManageMembers && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setMemberDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          첫 번째 팀원 추가
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


    </>
  );
}