import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Building, Users, ChevronRight, Phone, Mail, Calendar } from 'lucide-react';
import { Department, Member } from '../../types';

const mockDepartments: Department[] = [
  {
    id: '1',
    name: '경영진',
    managerId: '1',
    description: '회사 전략 수립 및 의사결정',
    children: [],
  },
  {
    id: '2',
    name: '개발팀',
    managerId: '2',
    description: '소프트웨어 개발 및 유지보수',
    children: [
      {
        id: '2-1',
        name: '프론트엔드팀',
        parentId: '2',
        managerId: '3',
        description: '웹 프론트엔드 개발',
      },
      {
        id: '2-2',
        name: '백엔드팀',
        parentId: '2',
        managerId: '4',
        description: '서버 및 API 개발',
      },
    ],
  },
  {
    id: '3',
    name: '디자인팀',
    managerId: '5',
    description: 'UI/UX 디자인 및 브랜딩',
    children: [],
  },
  {
    id: '4',
    name: '마케팅팀',
    managerId: '6',
    description: '마케팅 전략 수립 및 실행',
    children: [
      {
        id: '4-1',
        name: '디지털마케팅팀',
        parentId: '4',
        managerId: '7',
        description: '온라인 마케팅 및 SNS 관리',
      },
    ],
  },
  {
    id: '5',
    name: '인사팀',
    managerId: '8',
    description: '인사 관리 및 채용',
    children: [],
  },
  {
    id: '6',
    name: '영업팀',
    managerId: '9',
    description: '고객 관리 및 영업 활동',
    children: [],
  },
];

const mockMembers: Member[] = [
  { id: '1', name: '김대표', email: 'ceo@coev1.com', department: '경영진', position: '대표이사', joinDate: '2020-01-01', status: 'active' },
  { id: '2', name: '박개발', email: 'park@coev1.com', department: '개발팀', position: '팀장', joinDate: '2021-03-15', status: 'active' },
  { id: '3', name: '이프론트', email: 'lee@coev1.com', department: '프론트엔드팀', position: '선임개발자', joinDate: '2022-01-10', status: 'active' },
  { id: '4', name: '최백엔드', email: 'choi@coev1.com', department: '백엔드팀', position: '선임개발자', joinDate: '2021-08-20', status: 'active' },
  { id: '5', name: '김디자인', email: 'kim.d@coev1.com', department: '디자인팀', position: '팀장', joinDate: '2021-06-01', status: 'active' },
  { id: '6', name: '한마케팅', email: 'han@coev1.com', department: '마케팅팀', position: '팀장', joinDate: '2021-09-15', status: 'active' },
  { id: '7', name: '정디지털', email: 'jung@coev1.com', department: '디지털마케팅팀', position: '매니저', joinDate: '2022-05-01', status: 'active' },
  { id: '8', name: '홍인사', email: 'hong@coev1.com', department: '인사팀', position: '팀장', joinDate: '2020-12-01', status: 'active' },
  { id: '9', name: '김영업', email: 'kim.s@coev1.com', department: '영업팀', position: '팀장', joinDate: '2021-04-01', status: 'active' },
  { id: '10', name: '윤개발', email: 'yoon@coev1.com', department: '개발팀', position: '개발자', joinDate: '2023-02-15', status: 'active' },
  { id: '11', name: '송프론트', email: 'song@coev1.com', department: '프론트엔드팀', position: '개발자', joinDate: '2023-06-01', status: 'active' },
  { id: '12', name: '임백엔드', email: 'lim@coev1.com', department: '백엔드팀', position: '개발자', joinDate: '2023-03-20', status: 'active' },
];

export function DepartmentList() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  const getDepartmentMembers = (departmentName: string): Member[] => {
    return mockMembers.filter(member => member.department === departmentName);
  };

  const getDepartmentManager = (managerId?: string): Member | null => {
    if (!managerId) return null;
    return mockMembers.find(member => member.id === managerId) || null;
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setMemberDialogOpen(true);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const calculateWorkYears = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    
    let totalMonths = years * 12 + months;
    if (now.getDate() < join.getDate()) {
      totalMonths -= 1;
    }
    
    const workYears = Math.floor(totalMonths / 12);
    const workMonths = totalMonths % 12;
    
    if (workYears > 0) {
      return `${workYears}년 ${workMonths}개월`;
    } else {
      return `${workMonths}개월`;
    }
  };

  const renderDepartmentTree = (departments: Department[], level = 0) => {
    return departments.map((dept) => (
      <div key={dept.id}>
        <div
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
            selectedDepartment?.id === dept.id ? 'bg-accent border border-primary/20' : 'border border-transparent'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => setSelectedDepartment(dept)}
        >
          <Building className="h-4 w-4 text-primary mr-2" />
          <div className="flex-1">
            <div className="font-medium">{dept.name}</div>
            <div className="text-sm text-muted-foreground">{dept.description}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getDepartmentMembers(dept.name).length}명
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {dept.children && renderDepartmentTree(dept.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">부서 목록</h1>
          <p className="text-muted-foreground">조직의 부서 구조와 소속 직원을 확인합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* 부서 목록 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              부서 구조
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {renderDepartmentTree(mockDepartments)}
            </div>
          </CardContent>
        </Card>

        {/* 부서 상세 정보 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedDepartment ? selectedDepartment.name : '부서를 선택하세요'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {selectedDepartment ? (
              <div className="space-y-6">
                {/* 부서 정보 */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-2">부서 정보</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">부서명</span>
                        <span className="font-medium">{selectedDepartment.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">설명</span>
                        <span className="font-medium">{selectedDepartment.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">인원수</span>
                        <span className="font-medium">{getDepartmentMembers(selectedDepartment.name).length}명</span>
                      </div>
                      {selectedDepartment.managerId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">부서장</span>
                          <span className="font-medium">
                            {getDepartmentManager(selectedDepartment.managerId)?.name || '미지정'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 부서 직원 목록 */}
                <div>
                  <h3 className="font-medium mb-3">부서 직원</h3>
                  <div className="space-y-3">
                    {getDepartmentMembers(selectedDepartment.name).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleMemberClick(member)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.profileImage} alt={member.name} />
                          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.position}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-muted-foreground">입사일</div>
                          <div>{formatJoinDate(member.joinDate)}</div>
                        </div>
                      </div>
                    ))}
                    
                    {getDepartmentMembers(selectedDepartment.name).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        소속 직원이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>좌측에서 부서를 선택하면</p>
                  <p>부서 정보와 소속 직원을 확인할 수 있습니다.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 직원 상세 정보 다이얼로그 */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>직원 상세 정보</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.profileImage} alt={selectedMember.name} />
                  <AvatarFallback className="text-lg">{selectedMember.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.department} · {selectedMember.position}</p>
                  <Badge variant={selectedMember.status === 'active' ? 'default' : 'secondary'}>
                    {selectedMember.status === 'active' ? '재직중' : '휴직중'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <div className="text-muted-foreground mb-1">이메일</div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.email}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">입사일</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatJoinDate(selectedMember.joinDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-muted-foreground mb-1">부서</div>
                    <div>{selectedMember.department}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">근속기간</div>
                    <div>{calculateWorkYears(selectedMember.joinDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}