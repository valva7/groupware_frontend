import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ArrowLeft, Calendar as CalendarIcon, X, Users, Plus, Search, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// Mock members data
const mockMembers = [
  { id: '1', name: '김그룹웨어', department: '개발팀', position: '팀장', email: 'kim@coev1.com' },
  { id: '2', name: '박개발', department: '개발팀', position: '선임개발자', email: 'park@coev1.com' },
  { id: '3', name: '이디자인', department: '디자인팀', position: '디자이너', email: 'lee@coev1.com' },
  { id: '4', name: '최마케팅', department: '마케팅팀', position: '매니저', email: 'choi@coev1.com' },
  { id: '5', name: '한영업', department: '영업팀', position: '과장', email: 'han@coev1.com' },
];

interface Member {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
}

export function ProjectCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    managerId: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('프로젝트명을 입력해주세요.');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('프로젝트 설명을 입력해주세요.');
      return;
    }
    
    if (!formData.managerId) {
      toast.error('프로젝트 매니저를 선택해주세요.');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      toast.error('프로젝트 시작일과 종료일을 설정해주세요.');
      return;
    }
    
    if (formData.startDate >= formData.endDate) {
      toast.error('종료일은 시작일보다 나중이어야 합니다.');
      return;
    }
    
    if (selectedMembers.length === 0) {
      toast.error('최소 1명의 팀원을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      const projectManager = mockMembers.find(m => m.id === formData.managerId);
      console.log('새 프로젝트 생성:', {
        ...formData,
        managerName: projectManager?.name,
        members: selectedMembers.map(m => m.id),
        createdAt: new Date().toISOString(),
      });
      
      toast.success('프로젝트가 성공적으로 생성되었습니다.');
      navigate('/projects');
      setIsSubmitting(false);
    }, 1500);
  };

  const addMember = (member: Member) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const removeMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };

  const availableMembers = mockMembers.filter(
    member => !selectedMembers.find(m => m.id === member.id)
  );

  // 매니저 검색 필터링
  const filteredManagerCandidates = mockMembers.filter(member =>
    member.name.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(managerSearchTerm.toLowerCase())
  );

  // 팀원 검색 필터링
  const filteredMemberCandidates = availableMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  const selectManager = (member: Member) => {
    setFormData({ ...formData, managerId: member.id });
    setManagerDialogOpen(false);
    setManagerSearchTerm('');
  };

  const selectMember = (member: Member) => {
    addMember(member);
    setMemberDialogOpen(false);
    setMemberSearchTerm('');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/projects')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">새 프로젝트 생성</h1>
          <p className="text-muted-foreground text-sm sm:text-base">새로운 프로젝트를 생성하고 팀원을 배정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">프로젝트명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="프로젝트명을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">프로젝트 설명 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="프로젝트에 대한 상세한 설명을 입력하세요"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">프로젝트 상태</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">기획</SelectItem>
                    <SelectItem value="active">진행중</SelectItem>
                    <SelectItem value="on-hold">보류</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">프로젝트 매니저 *</Label>
                <Dialog open={managerDialogOpen} onOpenChange={setManagerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {formData.managerId ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {mockMembers.find(m => m.id === formData.managerId)?.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{mockMembers.find(m => m.id === formData.managerId)?.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({mockMembers.find(m => m.id === formData.managerId)?.department} · {mockMembers.find(m => m.id === formData.managerId)?.position})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-muted-foreground">매니저를 선택하세요</span>
                        </div>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md mx-4 max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>프로젝트 매니저 선택</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* 검색 입력 */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="이름, 부서, 직급으로 검색..."
                          value={managerSearchTerm}
                          onChange={(e) => setManagerSearchTerm(e.target.value)}
                          className="pl-10"
                          autoFocus
                        />
                        {managerSearchTerm && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setManagerSearchTerm('')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      {/* 검색 결과 카운트 */}
                      <div className="text-xs text-muted-foreground px-1">
                        {managerSearchTerm ? 
                          `${filteredManagerCandidates.length}명 검색됨` : 
                          `전체 ${filteredManagerCandidates.length}명`
                        }
                      </div>
                      
                      {/* 매니저 목록 */}
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {filteredManagerCandidates.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>검색 결과가 없습니다.</p>
                          </div>
                        ) : (
                          filteredManagerCandidates.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => selectManager(member)}
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
                              {formData.managerId === member.id && (
                                <Badge variant="default" className="text-xs">선택됨</Badge>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* 일정 및 팀원 */}
          <Card>
            <CardHeader>
              <CardTitle>일정 및 팀원</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시작일 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, 'PPP', { locale: ko }) : '시작일 선택'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>종료일 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, 'PPP', { locale: ko }) : '종료일 선택'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>팀원 추가 *</Label>
                <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span className="text-muted-foreground">팀원을 추가하세요</span>
                      </div>
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
                              onClick={() => selectMember(member)}
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
              </div>

              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>선택된 팀원</Label>
                    <Badge variant="secondary" className="text-xs">
                      {selectedMembers.length}명
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {selectedMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.department} · {member.position}</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/projects')}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? '생성 중...' : '프로젝트 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}