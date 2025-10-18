import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, Plus, Users, UserPlus, User, Mail, Phone, Calendar, Building, Shield, MapPin, UserCheck, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { DepartmentPositionSelector } from '../../components/DepartmentPositionSelector';

export function AdminMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(1);

  // 샘플 직원 데이터
  const [members, setMembers] = useState([
    {
      id: 1,
      name: '김철수',
      email: 'kim.cheolsu@coev1.com',
      phone: '010-1234-5678',
      department: '개발팀',
      position: '선임연구원',
      joinDate: '2023-03-15',
      status: 'active',
      role: 'member',
      permissions: {
        approval: true, project: true, vote: false, board: false,
        wiki: true, organization: false, admin: false, assets: false,
      },
      avatar: null,
      lastLogin: '2024-09-30 09:30:00'
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee.younghee@coev1.com',
      phone: '010-2345-6789',
      department: '디자인팀',
      position: '주임연구원',
      joinDate: '2023-06-01',
      status: 'active',
      role: 'member',
      permissions: {
        approval: false, project: true, vote: false, board: true,
        wiki: true, organization: false, admin: false, assets: false,
      },
      avatar: null,
      lastLogin: '2024-09-30 08:45:00'
    },
    {
      id: 3,
      name: '박민수',
      email: 'park.minsu@coev1.com',
      phone: '010-3456-7890',
      department: '마케팅팀',
      position: '팀장',
      joinDate: '2022-01-10',
      status: 'active',
      role: 'manager',
      permissions: {
        approval: true, project: true, vote: true, board: true,
        wiki: true, organization: true, admin: false, assets: true,
      },
      avatar: null,
      lastLogin: '2024-09-29 18:20:00'
    },
    {
      id: 4,
      name: '정수진',
      email: 'jung.sujin@coev1.com',
      phone: '010-4567-8901',
      department: '인사팀',
      position: '과장',
      joinDate: '2021-09-20',
      status: 'inactive',
      role: 'manager',
      permissions: {
        approval: true, project: false, vote: true, board: true,
        wiki: false, organization: true, admin: true, assets: true,
      },
      avatar: null,
      lastLogin: '2024-09-25 15:10:00'
    },
    {
      id: 5,
      name: '최동욱',
      email: 'choi.dongwook@coev1.com',
      phone: '010-5678-9012',
      department: '개발팀',
      position: '연구원',
      joinDate: '2024-02-01',
      status: 'active',
      role: 'member',
      permissions: {
        approval: false, project: true, vote: false, board: false,
        wiki: true, organization: false, admin: false, assets: false,
      },
      avatar: null,
      lastLogin: '2024-09-30 10:15:00'
    },
  ]);
  const [formData, setFormData] = useState({
    // 1단계: 기본 정보
    name: '',
    email: '',
    phone: '',

    // 2단계: 근무 정보
    department: '',
    position: '',
    joinDate: '',
    
    // 3단계: 계정 정보
    password: '',
    confirmPassword: '',
    role: 'member',
    
    // 4단계: 권한 설정 및 추가 정보
    permissions: {
      approval: false,        // 전자결재 권한
      project: false,         // 프로젝트 관리 권한
      vote: false,           // 투표 관리 권한
      board: false,          // 게시판 관리 권한
      wiki: false,           // 위키 편집 권한
      organization: false,   // 조직 관리 권한
      admin: false,          // 시스템 관리 권한
      assets: false,         // 자산 관리 권한
    },
  });

  const steps = [
    { number: 1, title: '기본 정보', description: '성명, 이메일, 연락처 등' },
    { number: 2, title: '근무 정보', description: '부서, 직급, 입사일 등' },
    { number: 3, title: '권한 설정', description: '세부 권한 및 추가 정보' },
  ];

  const permissionList = [
    { key: 'project', label: '프로젝트 관리 권한', description: '프로젝트 생성, 수정, 삭제' },
  ];

  const handleNext = () => {
    // 각 단계별 유효성 검사
    if (currentStep === 1) {
      if (!formData.name || !formData.email) {
        toast.error('필수 항목을 모두 입력해주세요.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.department || !formData.position || !formData.joinDate) {
        toast.error('필수 항목을 모두 입력해주세요.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.password || formData.password !== formData.confirmPassword) {
        toast.error('계정 정보를 올바르게 입력해주세요.');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast.success('새로운 직원이 등록되었습니다.');
    // 폼 초기화
    setFormData({
      name: '', email: '', phone: '',
      department: '', position: '', joinDate: '',
      password: '', confirmPassword: '', role: 'member',
      permissions: {
        approval: false, project: false, vote: false, board: false,
        wiki: false, organization: false, admin: false, assets: false,
      },
    });
    setCurrentStep(1);
  };

  const handlePermissionChange = (permission: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: enabled
      }
    }));
  };

  // 직원 목록 필터링
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || member.department === departmentFilter;
    const matchesStatus = !statusFilter || member.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // 직원 상태 변경
  const handleStatusChange = (memberId: number, newStatus: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, status: newStatus }
        : member
    ));
    toast.success(`직원 상태가 ${newStatus === 'active' ? '활성' : '비활성'}으로 변경되었습니다.`);
  };

  // 직원 수정 시작
  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setEditFormData({ ...member });
  };

  // 직원 수정 저장
  const handleSaveEdit = () => {
    setMembers(prev => prev.map(member => 
      member.id === editingMember.id 
        ? { ...editFormData }
        : member
    ));
    setEditingMember(null);
    toast.success('직원 정보가 수정되었습니다.');
  };

  // 직원 삭제
  const handleDeleteMember = (memberId: number) => {
    if (confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
      setSelectedMember(null);
      toast.success('직원이 삭제되었습니다.');
    }
  };

  // 직원 목록 렌더링
  const renderMembersList = () => {
    if (filteredMembers.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>검색 조건에 맞는 직원이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          총 {filteredMembers.length}명의 직원
        </div>
        
        {/* 데스크톱 테이블 뷰 */}
        <div className="hidden lg:block border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">직원 정보</th>
                <th className="text-left p-3 font-medium">부서/직급</th>
                <th className="text-left p-3 font-medium">연락처</th>
                <th className="text-left p-3 font-medium">상태</th>
                <th className="text-left p-3 font-medium">권한</th>
                <th className="text-left p-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} className="border-t hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{member.department}</div>
                    <div className="text-sm text-muted-foreground">{member.position}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      입사: {member.joinDate}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status === 'active' ? '활성' : '비활성'}
                      </Badge>
                      <Badge variant={
                        member.role === 'admin' ? 'destructive' : 
                        member.role === 'manager' ? 'default' : 'outline'
                      }>
                        {member.role === 'admin' ? '관리자' : 
                         member.role === 'manager' ? '팀장' : '일반'}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-xs space-y-1">
                      {Object.entries(member.permissions)
                        .filter(([_, enabled]) => enabled)
                        .slice(0, 3)
                        .map(([key, _]) => (
                          <div key={key} className="text-muted-foreground">
                            {permissionList.find(p => p.key === key)?.label}
                          </div>
                        ))}
                      {Object.values(member.permissions).filter(Boolean).length > 3 && (
                        <div className="text-muted-foreground">
                          +{Object.values(member.permissions).filter(Boolean).length - 3}개 더
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        상세
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(
                          member.id, 
                          member.status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        {member.status === 'active' ? '비활성화' : '활성화'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 뷰 */}
        <div className="lg:hidden space-y-3">
          {filteredMembers.map(member => (
            <Card key={member.id} className="p-4">
              <div className="space-y-3">
                {/* 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-base">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.department} • {member.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {member.status === 'active' ? '활성' : '비활성'}
                    </Badge>
                  </div>
                </div>

                {/* 기본 정보 */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>입사: {member.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      member.role === 'admin' ? 'destructive' : 
                      member.role === 'manager' ? 'default' : 'outline'
                    } className="text-xs">
                      {member.role === 'admin' ? '관리자' : 
                       member.role === 'manager' ? '팀장' : '일반'}
                    </Badge>
                  </div>
                </div>

                {/* 권한 정보 */}
                {Object.values(member.permissions).some(Boolean) && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">보유 권한</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(member.permissions)
                        .filter(([_, enabled]) => enabled)
                        .slice(0, 4)
                        .map(([key, _]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {permissionList.find(p => p.key === key)?.label}
                          </Badge>
                        ))}
                      {Object.values(member.permissions).filter(Boolean).length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{Object.values(member.permissions).filter(Boolean).length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedMember(member)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    상세
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditMember(member)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>
                  <Button
                    variant={member.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(
                      member.id, 
                      member.status === 'active' ? 'inactive' : 'active'
                    )}
                  >
                    {member.status === 'active' ? '비활성화' : '활성화'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    const enabledPermissions = Object.entries(formData.permissions)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => permissionList.find(p => p.key === key)?.label)
      .filter(Boolean);

    return (
      <Card className="h-fit lg:sticky lg:top-6">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <UserCheck className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">직원 정보 미리보기</span>
            <span className="sm:hidden">미리보기</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
          {/* 기본 정보 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg bg-muted/30">
              <User className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-sm md:text-base truncate">{formData.name || '이름을 입력하세요'}</div>
                <div className="text-xs md:text-sm text-muted-foreground truncate">{formData.position || '직급'} • {formData.department || '부서'}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{formData.email || '이메일을 입력하세요'}</span>
              </div>
              {formData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{formData.phone}</span>
                </div>
              )}
              {formData.joinDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">입사일: {formData.joinDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* 세부 권한 */}
          {enabledPermissions.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2">세부 권한</h4>
              <div className="flex flex-wrap gap-1">
                {enabledPermissions.map((permission, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 직원 상세 정보 렌더링
  const renderMemberDetail = () => {
    if (!selectedMember) return null;

    const enabledPermissions = Object.entries(selectedMember.permissions)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => permissionList.find(p => p.key === key)?.label)
      .filter(Boolean);

    return (
      <div className="space-y-6">
        {/* 기본 정보 */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
            <p className="text-muted-foreground">{selectedMember.position} • {selectedMember.department}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={selectedMember.status === 'active' ? 'default' : 'secondary'}>
                {selectedMember.status === 'active' ? '활성' : '비활성'}
              </Badge>
              <Badge variant={
                selectedMember.role === 'admin' ? 'destructive' : 
                selectedMember.role === 'manager' ? 'default' : 'outline'
              }>
                {selectedMember.role === 'admin' ? '관리자' : 
                 selectedMember.role === 'manager' ? '팀장' : '일반 직원'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditMember(selectedMember)}
            >
              수정
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteMember(selectedMember.id)}
            >
              삭제
            </Button>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-2">개인 정보</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{selectedMember.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{selectedMember.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium border-b pb-2">근무 정보</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>부서: {selectedMember.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>직급: {selectedMember.position}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>입사일: {selectedMember.joinDate}</span>
              </div>
              <div className="text-muted-foreground">
                최근 로그인: {selectedMember.lastLogin}
              </div>
            </div>
          </div>
        </div>

        {/* 권한 정보 */}
        <div className="space-y-4">
          <h4 className="font-medium border-b pb-2">권한 정보</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissionList.map(permission => (
              <div key={permission.key} className="flex items-start justify-between p-3 border rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{permission.label}</div>
                  <div className="text-xs text-muted-foreground break-words">{permission.description}</div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedMember.permissions[permission.key] ? 'bg-primary' : 'bg-muted'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 직원 수정 모달 렌더링
  const renderMemberEdit = () => {
    if (!editingMember) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">성명 *</label>
            <Input
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">이메일 *</label>
            <Input
              type="email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">연락처</label>
            <Input
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">부서</label>
            <DepartmentPositionSelector
              type="department"
              value={editFormData.department || ''}
              onSelect={(value) => setEditFormData(prev => ({ ...prev, department: value }))}
              placeholder="부서를 선택하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">직급</label>
            <DepartmentPositionSelector
              type="position"
              value={editFormData.position || ''}
              onSelect={(value) => setEditFormData(prev => ({ ...prev, position: value }))}
              placeholder="직급을 선택하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">상태</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              value={editFormData.status || 'active'}
              onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">기본 권한</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              value={editFormData.role || 'member'}
              onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="member">일반 직원</option>
              <option value="manager">팀장</option>
              <option value="admin">관리자</option>
            </select>
          </div>
        </div>

        {/* 권한 설정 */}
        <div className="space-y-4">
          <label className="text-sm font-medium">세부 권한</label>
          <div className="grid grid-cols-1 gap-3">
            {permissionList.map(permission => (
              <div key={permission.key} className="flex items-start justify-between p-3 border rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{permission.label}</div>
                  <div className="text-xs text-muted-foreground break-words">{permission.description}</div>
                </div>
                <div className="flex-shrink-0">
                  <Switch
                    checked={editFormData.permissions?.[permission.key] || false}
                    onCheckedChange={(checked) => 
                      setEditFormData(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          [permission.key]: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setEditingMember(null)}>
            취소
          </Button>
          <Button onClick={handleSaveEdit}>
            저장
          </Button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="admin-members-form-section space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">성명 *</label>
                <Input
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">이메일 *</label>
                <Input
                  type="email"
                  placeholder="hong@coev1.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">연락처</label>
                <Input
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">부서 *</label>
                <DepartmentPositionSelector
                  type="department"
                  value={formData.department}
                  onSelect={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  placeholder="부서를 선택하세요"
                />
                <p className="text-xs text-muted-foreground">
                  버튼을 클릭하여 부서를 검색하고 선택할 수 있습니다.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">직급 *</label>
                <DepartmentPositionSelector
                  type="position"
                  value={formData.position}
                  onSelect={(value) => setFormData(prev => ({ ...prev, position: value }))}
                  placeholder="직급을 선택하세요"
                />
                <p className="text-xs text-muted-foreground">
                  버튼을 클릭하여 직급을 검색하고 선택할 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">입사일 *</label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  실제 입사일을 정확히 입력해주세요.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            {/* 권한 설정 섹션 */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">기본 권한</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <select
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="member">일반 직원</option>
                      <option value="admin">관리자</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-medium">세부 권한 설정</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {permissionList.map((permission) => (
                  <div key={permission.key} className="flex items-start justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-sm">{permission.label}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </div>
                    <Switch
                      checked={formData.permissions[permission.key as keyof typeof formData.permissions]}
                      onCheckedChange={(checked) => handlePermissionChange(permission.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-members-container p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="admin-members-header flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">직원 생성/관리</h1>
          <p className="text-sm md:text-base text-muted-foreground">새로운 직원을 등록하고 기존 직원 정보를 관리합니다.</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="admin-members-tabs w-full">
        <TabsList className="tabs-list grid w-full grid-cols-2">
          <TabsTrigger value="create" className="tabs-trigger">
            <UserPlus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">직원 등록</span>
            <span className="sm:hidden">등록</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="tabs-trigger">
            <Users className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">직원 관리</span>
            <span className="sm:hidden">관리</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          {/* 좌/우 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* 왼쪽: 폼 영역 */}
            <div className="lg:col-span-2">
              <Card className="admin-members-form-card">
                <CardHeader className="card-header p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <UserPlus className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">새 직원 등록 - 3단계 프로세스</span>
                    <span className="sm:hidden">직원 등록</span>
                  </CardTitle>
                  
                  {/* 진행 상태 표시 - 데스크톱 */}
                  <div className="hidden md:flex items-center justify-between mt-4">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          currentStep >= step.number 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-muted-foreground text-muted-foreground'
                        }`}>
                          {step.number}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`h-0.5 w-20 mx-2 ${
                            currentStep > step.number ? 'bg-primary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* 진행 상태 표시 - 모바일 */}
                  <div className="md:hidden mt-4">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      {steps.map((step) => (
                        <div key={step.number} className={`w-3 h-3 rounded-full ${
                          currentStep >= step.number ? 'bg-primary' : 'bg-muted'
                        }`} />
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">
                        {currentStep} / {steps.length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-2">
                    <h3 className="font-medium text-sm md:text-base">{steps[currentStep - 1].title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="card-content p-4 md:p-6">
                  <div className="min-h-[300px] md:min-h-[400px] mb-4 md:mb-6">
                    {renderStep()}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className="order-2 sm:order-1"
                    >
                      이전
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button onClick={handleNext} className="order-1 sm:order-2">
                        다음
                      </Button>
                    ) : (
                      <Button onClick={handleComplete} className="order-1 sm:order-2">
                        등록 완료
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 미리보기 영역 */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="admin-members-preview-card">
                {renderPreview()}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <Card className="admin-members-member-list">
            <CardHeader className="card-header">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                직원 목록 관리
              </CardTitle>
              
              <div className="space-y-4 mt-4">
                {/* 검색바 */}
                <div className="relative">
                  <Search className="admin-members-search-icon absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="직원명, 이메일, 부서로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-members-search-input pl-10"
                  />
                </div>
                
                {/* 필터 - 데스크톱 */}
                <div className="hidden md:flex items-center gap-4">
                  <select
                    className="px-3 py-2 border border-border rounded-md bg-background min-w-32"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">전체 부서</option>
                    <option value="개발팀">개발팀</option>
                    <option value="디자인팀">디자인팀</option>
                    <option value="마케팅팀">마케팅팀</option>
                    <option value="인사팀">인사팀</option>
                    <option value="경영지원팀">경영지원팀</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-border rounded-md bg-background min-w-32"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">전체 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
                
                {/* 필터 - 모바일 */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                  <select
                    className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">전체 부서</option>
                    <option value="개발팀">개발팀</option>
                    <option value="디자인팀">디자인팀</option>
                    <option value="마케팅팀">마케팅팀</option>
                    <option value="인사팀">인사팀</option>
                    <option value="경영지원팀">경영지원팀</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">전체 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="card-content">
              {renderMembersList()}
            </CardContent>
          </Card>
          
          {/* 직원 상세 정보 모달 */}
          {selectedMember && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMember(null)}>
              <div className="admin-members-modal bg-card rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">직원 상세 정보</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                    ✕
                  </Button>
                </div>
                {renderMemberDetail()}
              </div>
            </div>
          )}
          
          {/* 직원 수정 모달 */}
          {editingMember && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingMember(null)}>
              <div className="admin-members-modal bg-card rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">직원 정보 수정</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditingMember(null)}>
                    ✕
                  </Button>
                </div>
                {renderMemberEdit()}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}