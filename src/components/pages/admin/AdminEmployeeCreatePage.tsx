import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Switch } from "../../ui/switch";
import { Alert, AlertDescription } from "../../ui/alert";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Calendar, 
  IdCard,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Users,
  Bell
} from "lucide-react";
import { toast } from "sonner@2.0.3";

const departments = [
  { id: "dev", name: "개발팀", manager: "김개발" },
  { id: "design", name: "디자인팀", manager: "박디자인" },
  { id: "marketing", name: "마케팅팀", manager: "이마케팅" },
  { id: "sales", name: "영업팀", manager: "최영업" },
  { id: "hr", name: "인사팀", manager: "정인사" },
  { id: "finance", name: "재무팀", manager: "한재무" },
  { id: "admin", name: "관리팀", manager: "관리자" }
];

const positions = [
  "인턴", "사원", "주임", "대리", "과장", "차장", "부장", "이사", "상무", "전무", "부사장", "사장"
];

const roles = [
  { id: "user", name: "일반 사용자", description: "기본 권한" },
  { id: "manager", name: "팀 관리자", description: "팀 관리 권한" },
  { id: "hr_admin", name: "인사 관리자", description: "인사 관리 권한" },
  { id: "system_admin", name: "시스템 관리자", description: "시스템 전체 관리 권한" }
];

interface EmployeeForm {
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
  role: string;
  startDate: string;
  salary: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  notificationEmail: string;
  notes: string;
  isActive: boolean;
  permissions: {
    canApprove: boolean;
    canManageProject: boolean;
    canViewReports: boolean;
    canManageUsers: boolean;
  };
}

const initialForm: EmployeeForm = {
  name: "",
  email: "",
  phone: "",
  employeeId: "",
  department: "",
  position: "",
  role: "user",
  startDate: "",
  salary: "",
  address: "",
  emergencyContact: "",
  emergencyPhone: "",
  notificationEmail: "",
  notes: "",
  isActive: true,
  permissions: {
    canApprove: false,
    canManageProject: false,
    canViewReports: false,
    canManageUsers: false
  }
};

export function AdminEmployeeCreatePage() {
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof EmployeeForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission: keyof EmployeeForm['permissions'], value: boolean) => {
    setForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: value }
    }));
  };

  const generateEmployeeId = () => {
    const dept = departments.find(d => d.id === form.department);
    if (dept) {
      const prefix = dept.name.substring(0, 2);
      const random = Math.floor(Math.random() * 9000) + 1000;
      const employeeId = `${prefix}${random}`;
      handleInputChange('employeeId', employeeId);
      toast.success("사번이 자동 생성되었습니다.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 유효성 검사
    if (!form.name || !form.email || !form.department || !form.position || !form.notificationEmail) {
      toast.error("필수 항목을 모두 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("새 직원이 성공적으로 등록되었습니다.");
      setForm(initialForm);
      setStep(1);
    } catch (error) {
      toast.error("직원 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedDepartment = () => {
    return departments.find(d => d.id === form.department);
  };

  const getSelectedRole = () => {
    return roles.find(r => r.id === form.role);
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return form.name && form.email && form.phone && form.employeeId && form.notificationEmail;
      case 2:
        return form.department && form.position && form.startDate;
      case 3:
        return form.role;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 - 모바일 반응형 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl">직원 생성</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            새로운 직원을 등록하고 권한을 설정할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-end">
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Users className="h-3 w-3" />
            총 직원 수: 47명
          </Badge>
        </div>
      </div>

      {/* 진행 단계 - 모바일 반응형 */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* 데스크톱 버전 */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm
                    ${step >= stepNumber 
                      ? 'bg-pastel-blue-600 text-white' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`
                      w-16 h-1 mx-2
                      ${step > stepNumber ? 'bg-pastel-blue-600' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 모바일 버전 */}
          <div className="sm:hidden mb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${step >= stepNumber 
                      ? 'bg-pastel-blue-600 text-white' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {step > stepNumber ? <CheckCircle className="h-3 w-3" /> : stepNumber}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-sm sm:text-base">
              {step === 1 && "기본 정보"}
              {step === 2 && "조직 정보"}
              {step === 3 && "권한 설정"}
              {step === 4 && "최종 확인"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {step}/4 단계
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 폼 내용 - 모바일 반응형 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 메인 폼 */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                직원 정보 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
              {/* 1단계: 기본 정보 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">이름 *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="홍길동"
                          value={form.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">이메일 *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="hong@company.com"
                          value={form.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">연락처 *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="010-1234-5678"
                          value={form.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-sm">사번 *</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="employeeId"
                            placeholder="개발1001"
                            value={form.employeeId}
                            onChange={(e) => handleInputChange('employeeId', e.target.value)}
                            className="pl-10 h-10"
                          />
                        </div>
                        <Button variant="outline" onClick={generateEmployeeId} className="h-10 px-3 text-xs sm:text-sm sm:px-4">
                          <span className="hidden sm:inline">자동생성</span>
                          <span className="sm:hidden">생성</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">주소</Label>
                    <Input
                      id="address"
                      placeholder="서울시 강남구..."
                      value={form.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact" className="text-sm">비상연락처 (이름)</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="홍길동 (배우자)"
                        value={form.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-sm">비상연락처 (전화번호)</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="010-1234-5678"
                        value={form.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail" className="text-sm">계정 생성 알림 이메일 *</Label>
                    <div className="relative">
                      <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="notificationEmail"
                        type="email"
                        placeholder="notification@company.com"
                        value={form.notificationEmail}
                        onChange={(e) => handleInputChange('notificationEmail', e.target.value)}
                        className="pl-10 h-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      계정 생성 완료 시 임시 비밀번호와 계정 정보가 발송될 이메일 주소입니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 2단계: 조직 정보 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">소속 부서 *</Label>
                      <Select value={form.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} (팀장: {dept.manager})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">직급 *</Label>
                      <Select value={form.position} onValueChange={(value) => handleInputChange('position', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="직급 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map(position => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">입사일 *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          value={form.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salary">급여 정보</Label>
                      <Input
                        id="salary"
                        placeholder="3,500,000"
                        value={form.salary}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">특이사항</Label>
                    <Textarea
                      id="notes"
                      placeholder="추가 메모사항이나 특별한 요구사항을 입력하세요..."
                      value={form.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* 3단계: 권한 설정 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>시스템 역할 *</Label>
                    <div className="space-y-3">
                      {roles.map(role => (
                        <div
                          key={role.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            form.role === role.id
                              ? 'border-pastel-blue-600 bg-pastel-blue-50'
                              : 'border-muted hover:border-pastel-blue-300'
                          }`}
                          onClick={() => handleInputChange('role', role.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              form.role === role.id
                                ? 'border-pastel-blue-600 bg-pastel-blue-600'
                                : 'border-muted'
                            }`}>
                              {form.role === role.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50" />
                              )}
                            </div>
                            <div>
                              <div>{role.name}</div>
                              <div className="text-sm text-muted-foreground">{role.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>세부 권한 설정</Label>
                    <div className="space-y-4">
                      {Object.entries({
                        canApprove: "결재 승인 권한",
                        canManageProject: "프로젝트 관리 권한",
                        canViewReports: "리포트 조회 권한",
                        canManageUsers: "사용자 관리 권한"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <Label htmlFor={key}>{label}</Label>
                            <p className="text-sm text-muted-foreground">
                              {key === 'canApprove' && '전자결재 승인/반려 권한'}
                              {key === 'canManageProject' && '프로젝트 생성/수정/삭제 권한'}
                              {key === 'canViewReports' && '각종 보고서 및 통계 조회 권한'}
                              {key === 'canManageUsers' && '직원 정보 관리 권한'}
                            </p>
                          </div>
                          <Switch
                            id={key}
                            checked={form.permissions[key as keyof typeof form.permissions]}
                            onCheckedChange={(value) => handlePermissionChange(key as keyof typeof form.permissions, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4단계: 최종 확인 */}
              {step === 4 && (
                <div className="space-y-6">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      입력하신 정보를 확인하고 직원 등록을 완료하세요.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4>기본 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">이름:</span>
                          <span>{form.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">이메일:</span>
                          <span>{form.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">연락처:</span>
                          <span>{form.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">사번:</span>
                          <span>{form.employeeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">알림 이메일:</span>
                          <span>{form.notificationEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4>조직 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">부서:</span>
                          <span>{getSelectedDepartment()?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">직급:</span>
                          <span>{form.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">입사일:</span>
                          <span>{form.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">역할:</span>
                          <span>{getSelectedRole()?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 네비게이션 버튼 - 모바일 반응형 */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="w-full sm:w-auto h-10"
                >
                  이전 단계
                </Button>
                
                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!isStepValid(step)}
                    className="w-full sm:w-auto h-10 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  >
                    다음 단계
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="gap-2 w-full sm:w-auto h-10 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        등록 중...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        직원 등록
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 - 미리보기 */}
        <div className="space-y-6 xl:block hidden">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">직원 정보 미리보기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">
                    {form.name ? form.name.charAt(0) : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4>{form.name || '이름 없음'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {form.position} • {getSelectedDepartment()?.name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{form.email || '이메일 없음'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{form.phone || '연락처 없음'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>{form.employeeId || '사번 없음'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{getSelectedDepartment()?.name || '부서 미선택'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{getSelectedRole()?.name || '역할 미선택'}</span>
                </div>
                {form.notificationEmail && (
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>{form.notificationEmail}</span>
                  </div>
                )}
              </div>

              {form.role && (
                <>
                  <Separator />
                  <div>
                    <h5 className="text-sm font-medium mb-2">설정된 권한</h5>
                    <div className="space-y-1">
                      {Object.entries(form.permissions).map(([key, value]) => {
                        const labels = {
                          canApprove: "결재 승인",
                          canManageProject: "프로젝트 관리",
                          canViewReports: "리포트 조회",
                          canManageUsers: "사용자 관리"
                        };
                        return value ? (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {labels[key as keyof typeof labels]}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">등록 가이드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-pastel-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">필수 정보 입력</p>
                  <p className="text-muted-foreground">이름, 이메일, 연락처, 사번, 부서, 직급, 입사일, 알림 이메일은 필수 항목입니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-pastel-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">계정 생성 알림</p>
                  <p className="text-muted-foreground">알림 이메일로 임시 비밀번호와 계정 정보가 발송됩니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-pastel-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">권한 설정 주의</p>
                  <p className="text-muted-foreground">시스템 관리자 권한은 신중하게 부여해주세요.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}