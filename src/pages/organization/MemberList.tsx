import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Mail, Calendar, Users } from 'lucide-react';
import { Member } from '../../types';
import { useIsMobile } from '../../components/ui/use-mobile';

const mockMembers: Member[] = [
  { id: '1', name: '김대표', email: 'ceo@coev1.com', department: '경영진', position: '대표이사', joinDate: '2020-01-01', status: 'active' },
  { id: '2', name: '박개발', email: 'park@coev1.com', department: '개발팀', position: '팀장', joinDate: '2021-03-15', status: 'active' },
  { id: '3', name: '이프론트', email: 'lee@coev1.com', department: '개발팀', position: '선임개발자', joinDate: '2022-01-10', status: 'active' },
  { id: '4', name: '최백엔드', email: 'choi@coev1.com', department: '개발팀', position: '선임개발자', joinDate: '2021-08-20', status: 'active' },
  { id: '5', name: '김디자인', email: 'kim.d@coev1.com', department: '디자인팀', position: '팀장', joinDate: '2021-06-01', status: 'active' },
  { id: '6', name: '한마케팅', email: 'han@coev1.com', department: '마케팅팀', position: '팀장', joinDate: '2021-09-15', status: 'active' },
  { id: '7', name: '정디지털', email: 'jung@coev1.com', department: '마케팅팀', position: '매니저', joinDate: '2022-05-01', status: 'active' },
  { id: '8', name: '홍인사', email: 'hong@coev1.com', department: '인사팀', position: '팀장', joinDate: '2020-12-01', status: 'active' },
  { id: '9', name: '김영업', email: 'kim.s@coev1.com', department: '영업팀', position: '팀장', joinDate: '2021-04-01', status: 'active' },
  { id: '10', name: '윤개발', email: 'yoon@coev1.com', department: '개발팀', position: '개발자', joinDate: '2023-02-15', status: 'active' },
  { id: '11', name: '송디자인', email: 'song@coev1.com', department: '디자인팀', position: '디자이너', joinDate: '2023-06-01', status: 'active' },
  { id: '12', name: '임마케팅', email: 'lim@coev1.com', department: '마케팅팀', position: '사원', joinDate: '2023-03-20', status: 'active' },
  { id: '13', name: '오인사', email: 'oh@coev1.com', department: '인사팀', position: '대리', joinDate: '2022-11-01', status: 'active' },
  { id: '14', name: '신영업', email: 'shin@coev1.com', department: '영업팀', position: '과장', joinDate: '2022-01-15', status: 'active' },
  { id: '15', name: '배개발', email: 'bae@coev1.com', department: '개발팀', position: '인턴', joinDate: '2024-01-01', status: 'active' },
];

export function MemberList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const departments = Array.from(new Set(mockMembers.map(member => member.department)));
  const positions = Array.from(new Set(mockMembers.map(member => member.position)));

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesPosition = positionFilter === 'all' || member.position === positionFilter;
    
    return matchesSearch && matchesDepartment && matchesPosition;
  });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
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

  // 모바일용 카드 렌더링 함수
  const renderMobileCard = (member: Member) => (
    <div
      key={member.id}
      className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => handleMemberClick(member)}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.profileImage} alt={member.name} />
          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium truncate">{member.name}</h3>
            <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
              {member.status === 'active' ? '재직중' : '휴직중'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{member.department} · {member.position}</p>
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>{member.email}</div>
        <div className="flex justify-between">
          <span>입사: {formatJoinDate(member.joinDate)}</span>
          <span>근속: {calculateWorkYears(member.joinDate)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">직원 현황</h1>
          <p className="text-muted-foreground text-sm sm:text-base">전체 직원 목록을 조회하고 상세 정보를 확인합니다.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <Users className="h-4 w-4" />
          <span>총 {mockMembers.length}명</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 이메일, 부서, 직급으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="부서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="직급" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 직급</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isMobile ? (
            <div className="space-y-3">
              {filteredMembers.map(renderMobileCard)}
              {filteredMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  조건에 맞는 직원이 없습니다.
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>직원</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직급</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>입사일</TableHead>
                    <TableHead>근속기간</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleMemberClick(member)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.profileImage} alt={member.name} />
                            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell className="text-muted-foreground">{member.email}</TableCell>
                      <TableCell>{formatJoinDate(member.joinDate)}</TableCell>
                      <TableCell>{calculateWorkYears(member.joinDate)}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status === 'active' ? '재직중' : '휴직중'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        조건에 맞는 직원이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 직원 상세 정보 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>직원 상세 정보</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.profileImage} alt={selectedMember.name} />
                  <AvatarFallback className="text-lg">{selectedMember.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.department} · {selectedMember.position}</p>
                  <Badge variant={selectedMember.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {selectedMember.status === 'active' ? '재직중' : '휴직중'}
                  </Badge>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">연락처 정보</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedMember.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">근무 정보</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">부서</span>
                        <span>{selectedMember.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">직급</span>
                        <span>{selectedMember.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">입사일</span>
                        <span>{formatJoinDate(selectedMember.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">근속기간</span>
                        <span>{calculateWorkYears(selectedMember.joinDate)}</span>
                      </div>
                    </div>
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