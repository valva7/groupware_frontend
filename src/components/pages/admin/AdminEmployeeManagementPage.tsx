import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ScrollArea } from "../../ui/scroll-area";
import { Switch } from "../../ui/switch";
import { Separator } from "../../ui/separator";
import { 
  Search, 
  Filter,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  Copy,
  Trash2,
  Shield
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// 직원 데이터 타입
interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  status: "active" | "inactive" | "leave";
  profileImage?: string;
  address: string;
  birthDate: string;
  education: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  salary: number;
  annualLeave: {
    total: number;
    used: number;
    remaining: number;
  };
  manager?: string;
  lastLogin?: string;
  role: string;
  permissions: {
    canApprove: boolean;
    canManageProject: boolean;
    canViewReports: boolean;
    canManageUsers: boolean;
  };
}

// 초기 직원 데이터
const initialEmployees: Employee[] = [
  {
    id: "1",
    employeeNumber: "EMP001",
    name: "김철수",
    email: "kim.cs@company.com",
    phone: "010-1234-5678",
    department: "개발팀",
    position: "팀장",
    hireDate: "2020-03-15",
    status: "active",
    address: "서울시 강남구 테헤란로 123",
    birthDate: "1985-07-20",
    education: "서울대학교 컴퓨터공학과",
    emergencyContact: {
      name: "김영희",
      relationship: "배우자",
      phone: "010-9876-5432"
    },
    salary: 6500,
    annualLeave: {
      total: 15,
      used: 8,
      remaining: 7
    },
    lastLogin: "2024-01-20 14:30",
    role: "manager",
    permissions: {
      canApprove: true,
      canManageProject: true,
      canViewReports: true,
      canManageUsers: false
    }
  },
  {
    id: "2",
    employeeNumber: "EMP002",
    name: "이영희",
    email: "lee.yh@company.com",
    phone: "010-2345-6789",
    department: "디자인팀",
    position: "선임",
    hireDate: "2021-06-01",
    status: "active",
    address: "서울시 서초구 서초대로 456",
    birthDate: "1990-11-15",
    education: "홍익대학교 시각디자인과",
    emergencyContact: {
      name: "이준호",
      relationship: "형제",
      phone: "010-8765-4321"
    },
    salary: 5000,
    annualLeave: {
      total: 15,
      used: 5,
      remaining: 10
    },
    manager: "김철수",
    lastLogin: "2024-01-20 16:45",
    role: "user",
    permissions: {
      canApprove: false,
      canManageProject: true,
      canViewReports: true,
      canManageUsers: false
    }
  },
  {
    id: "3",
    employeeNumber: "EMP003",
    name: "박민수",
    email: "park.ms@company.com",
    phone: "010-3456-7890",
    department: "영업팀",
    position: "대리",
    hireDate: "2019-09-10",
    status: "active",
    address: "서울시 마포구 월드컵로 789",
    birthDate: "1987-04-03",
    education: "연세대학교 경영학과",
    emergencyContact: {
      name: "박선영",
      relationship: "모친",
      phone: "010-7654-3210"
    },
    salary: 4800,
    annualLeave: {
      total: 15,
      used: 12,
      remaining: 3
    },
    lastLogin: "2024-01-19 18:20",
    role: "user",
    permissions: {
      canApprove: false,
      canManageProject: false,
      canViewReports: true,
      canManageUsers: false
    }
  },
  {
    id: "4",
    employeeNumber: "EMP004",
    name: "정수진",
    email: "jung.sj@company.com",
    phone: "010-4567-8901",
    department: "인사팀",
    position: "과장",
    hireDate: "2018-01-15",
    status: "active",
    address: "서울시 용산구 한강대로 321",
    birthDate: "1983-12-08",
    education: "고려대학교 심리학과",
    emergencyContact: {
      name: "정민철",
      relationship: "배우자",
      phone: "010-6543-2109"
    },
    salary: 5500,
    annualLeave: {
      total: 15,
      used: 3,
      remaining: 12
    },
    lastLogin: "2024-01-20 09:15",
    role: "hr_admin",
    permissions: {
      canApprove: true,
      canManageProject: false,
      canViewReports: true,
      canManageUsers: true
    }
  },
  {
    id: "5",
    employeeNumber: "EMP005",
    name: "최동욱",
    email: "choi.dw@company.com",
    phone: "010-5678-9012",
    department: "재무팀",
    position: "사원",
    hireDate: "2022-07-01",
    status: "leave",
    address: "서울시 강서구 화곡로 654",
    birthDate: "1992-09-25",
    education: "중앙대학교 회계학과",
    emergencyContact: {
      name: "최은정",
      relationship: "모친",
      phone: "010-5432-1098"
    },
    salary: 3800,
    annualLeave: {
      total: 15,
      used: 0,
      remaining: 15
    },
    lastLogin: "2023-12-15 17:00",
    role: "user",
    permissions: {
      canApprove: false,
      canManageProject: false,
      canViewReports: false,
      canManageUsers: false
    }
  },
  {
    id: "6",  
    employeeNumber: "EMP006",
    name: "한지원",
    email: "han.jw@company.com",
    phone: "010-6789-0123",
    department: "개발팀",
    position: "선임",
    hireDate: "2021-11-01",
    status: "active",
    address: "서울시 송파구 올림픽로 987",
    birthDate: "1989-06-12",
    education: "KAIST 전산학과",
    emergencyContact: {
      name: "한민석",
      relationship: "부친",
      phone: "010-4321-0987"
    },
    salary: 5200,
    annualLeave: {
      total: 15,
      used: 6,
      remaining: 9
    },
    manager: "김철수",
    lastLogin: "2024-01-20 13:20",
    role: "user",
    permissions: {
      canApprove: false,
      canManageProject: true,
      canViewReports: true,
      canManageUsers: false
    }
  }
];

const departments = ["전체", "개발팀", "디자인팀", "영업팀", "인사팀", "재무팀", "경영지원팀"];
const positions = ["전체", "사원", "주임", "대리", "선임", "과장", "차장", "팀장"];
const statuses = ["전체", "재직", "휴직", "퇴사"];

const roles = [
  { id: "user", name: "일반 사용자", description: "기본 권한" },
  { id: "manager", name: "팀 관리자", description: "팀 관리 권한" },
  { id: "hr_admin", name: "인사 관리자", description: "인사 관리 권한" },
  { id: "system_admin", name: "시스템 관리자", description: "시스템 전체 관리 권한" }
];

export function AdminEmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDepartmentMoveDialogOpen, setIsDepartmentMoveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("전체");
  const [filterPosition, setFilterPosition] = useState("전체");
  const [filterStatus, setFilterStatus] = useState("전체");
  
  // 편집 폼 데이터
  const [editForm, setEditForm] = useState<Partial<Employee>>({});
  const [departmentMoveForm, setDepartmentMoveForm] = useState({
    newDepartment: "",
    newPosition: "",
    effectiveDate: "",
    reason: ""
  });

  // 통계 데이터
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === "active").length,
    leave: employees.filter(emp => emp.status === "leave").length,
    inactive: employees.filter(emp => emp.status === "inactive").length
  };

  // 필터링된 직원 목록
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "전체" || employee.department === filterDepartment;
    const matchesPosition = filterPosition === "전체" || employee.position === filterPosition;
    const matchesStatus = filterStatus === "전체" || 
                         (filterStatus === "재직" && employee.status === "active") ||
                         (filterStatus === "휴직" && employee.status === "leave") ||
                         (filterStatus === "퇴사" && employee.status === "inactive");
    
    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
  });

  // 직원 상세보기
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailDialogOpen(true);
  };

  // 직원 편집
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      position: employee.position,
      salary: employee.salary,
      role: employee.role,
      permissions: { ...employee.permissions }
    });
    setIsEditDialogOpen(true);
  };

  // 부서 이동
  const handleDepartmentMove = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDepartmentMoveForm({
      newDepartment: "",
      newPosition: "",
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: ""
    });
    setIsDepartmentMoveDialogOpen(true);
  };

  // 편집 저장
  const handleSaveEdit = () => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map(emp =>
      emp.id === selectedEmployee.id
        ? { ...emp, ...editForm }
        : emp
    );
    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    toast.success("직원 정보가 수정되었습니다.");
  };

  // 부서 이동 저장
  const handleSaveDepartmentMove = () => {
    if (!selectedEmployee || !departmentMoveForm.newDepartment) {
      toast.error("부서를 선택해주세요.");
      return;
    }

    const updatedEmployees = employees.map(emp =>
      emp.id === selectedEmployee.id
        ? {
            ...emp,
            department: departmentMoveForm.newDepartment,
            position: departmentMoveForm.newPosition || emp.position
          }
        : emp
    );
    setEmployees(updatedEmployees);
    setIsDepartmentMoveDialogOpen(false);
    toast.success(`${selectedEmployee.name}님이 ${departmentMoveForm.newDepartment}으로 이동되었습니다.`);
  };

  // 상태 변경
  const handleStatusChange = (employee: Employee, newStatus: "active" | "inactive" | "leave") => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employee.id
        ? { ...emp, status: newStatus }
        : emp
    );
    setEmployees(updatedEmployees);
    
    const statusText = newStatus === "active" ? "재직" : newStatus === "leave" ? "휴직" : "퇴사";
    toast.success(`${employee.name}님의 상태가 ${statusText}로 변경되었습니다.`);
  };

  // 직원 삭제
  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;
    
    setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    setIsDeleteDialogOpen(false);
    toast.success(`${selectedEmployee.name}님의 정보가 삭제되었습니다.`);
  };

  // 권한 변경 핸들러
  const handlePermissionChange = (permission: keyof Employee['permissions'], value: boolean) => {
    setEditForm(prev => ({
      ...prev,
      permissions: { 
        ...prev.permissions!, 
        [permission]: value 
      }
    }));
  };

  // 상태별 스타일
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">재직</Badge>;
      case "leave":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">휴직</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">퇴사</Badge>;
      default:
        return <Badge variant="secondary">미지정</Badge>;
    }
  };

  // 역할 정보 가져오기
  const getSelectedRole = (roleId: string) => {
    return roles.find(r => r.id === roleId);
  };

  // 이름 이니셜 생성
  const getInitials = (name: string) => {
    return name.split('').slice(0, 2).join('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">직원 관리</h1>
          <p className="text-muted-foreground">직원 정보를 조회하고 관리할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            가져오기
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 직원</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재직 중</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">휴직</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.leave}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">퇴사</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="이름, 이메일, 사번으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="부서 선택" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger>
                <SelectValue placeholder="직급 선택" />
              </SelectTrigger>
              <SelectContent>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 직원 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              직원 목록 ({filteredEmployees.length}명)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>직원</TableHead>
                  <TableHead>사번</TableHead>
                  <TableHead>부서/직급</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>권한</TableHead>
                  <TableHead>입사일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>연차</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.profileImage} />
                          <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {employee.employeeNumber}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.department}</p>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{employee.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {getSelectedRole(employee.role)?.name}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {Object.entries(employee.permissions).map(([key, value]) => {
                            if (!value) return null;
                            const labels = {
                              canApprove: "결재",
                              canManageProject: "프로젝트",
                              canViewReports: "리포트",
                              canManageUsers: "사용자"
                            };
                            return (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {labels[key as keyof typeof labels]}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{employee.hireDate}</p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(employee.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{employee.annualLeave.remaining}/{employee.annualLeave.total}</p>
                        <p className="text-muted-foreground">잔여/전체</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDepartmentMove(employee)}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 카드 리스트 */}
          <div className="lg:hidden space-y-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.profileImage} />
                      <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.employeeNumber}</p>
                    </div>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.department} • {employee.position}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>입사: {employee.hireDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>{getSelectedRole(employee.role)?.name}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">연차 </span>
                    <span className="font-medium">{employee.annualLeave.remaining}/{employee.annualLeave.total}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewEmployee(employee)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDepartmentMove(employee)}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">검색 결과가 없습니다</h3>
              <p className="text-sm text-muted-foreground">다른 검색 조건을 사용해보세요.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 직원 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="employee-detail-description">
          <DialogHeader>
            <DialogTitle>직원 상세 정보</DialogTitle>
            <DialogDescription id="employee-detail-description">
              직원의 상세 정보를 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedEmployee.profileImage} />
                  <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-lg">
                    {getInitials(selectedEmployee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-muted-foreground mb-2">{selectedEmployee.employeeNumber}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(selectedEmployee.status)}
                    <Badge variant="outline">{selectedEmployee.department}</Badge>
                    <Badge variant="outline">{selectedEmployee.position}</Badge>
                    <Badge variant="outline">{getSelectedRole(selectedEmployee.role)?.name}</Badge>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="work">근무 정보</TabsTrigger>
                  <TabsTrigger value="permissions">권한 정보</TabsTrigger>
                  <TabsTrigger value="emergency">비상 연락망</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">이메일</Label>
                      <p>{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">전화번호</Label>
                      <p>{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">생년월일</Label>
                      <p>{selectedEmployee.birthDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">학력</Label>
                      <p>{selectedEmployee.education}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">주소</Label>
                      <p>{selectedEmployee.address}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">입사일</Label>
                      <p>{selectedEmployee.hireDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">급여</Label>
                      <p>{selectedEmployee.salary.toLocaleString()}만원</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">직속 상관</Label>
                      <p>{selectedEmployee.manager || "없음"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">최근 로그인</Label>
                      <p>{selectedEmployee.lastLogin || "정보 없음"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">연차 현황</Label>
                      <div className="flex items-center gap-4 mt-1">
                        <span>전체: {selectedEmployee.annualLeave.total}일</span>
                        <span>사용: {selectedEmployee.annualLeave.used}일</span>
                        <span>잔여: {selectedEmployee.annualLeave.remaining}일</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">시스템 역할</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-sm">
                        {getSelectedRole(selectedEmployee.role)?.name}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getSelectedRole(selectedEmployee.role)?.description}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">세부 권한</Label>
                    <div className="mt-2 space-y-3">
                      {Object.entries({
                        canApprove: "결재 승인 권한",
                        canManageProject: "프로젝트 관리 권한",
                        canViewReports: "리포트 조회 권한",
                        canManageUsers: "사용자 관리 권한"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              {key === 'canApprove' && '전자결재 승인/반려 권한'}
                              {key === 'canManageProject' && '프로젝트 생성/수정/삭제 권한'}
                              {key === 'canViewReports' && '각종 보고서 및 통계 조회 권한'}
                              {key === 'canManageUsers' && '직원 정보 관리 권한'}
                            </p>
                          </div>
                          <Badge variant={selectedEmployee.permissions[key as keyof typeof selectedEmployee.permissions] ? "default" : "secondary"}>
                            {selectedEmployee.permissions[key as keyof typeof selectedEmployee.permissions] ? "허용" : "거부"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="emergency" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">이름</Label>
                      <p>{selectedEmployee.emergencyContact.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">관계</Label>
                      <p>{selectedEmployee.emergencyContact.relationship}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">연락처</Label>
                      <p>{selectedEmployee.emergencyContact.phone}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 직원 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="employee-edit-description">
          <DialogHeader>
            <DialogTitle>직원 정보 수정</DialogTitle>
            <DialogDescription id="employee-edit-description">
              직원의 정보와 권한을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="work">근무 정보</TabsTrigger>
                  <TabsTrigger value="permissions">권한 설정</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">이름</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">이메일</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">연락처</Label>
                      <Input
                        id="edit-phone"
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-position">직급</Label>
                      <Select value={editForm.position || ""} onValueChange={(value) => setEditForm({ ...editForm, position: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="직급 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {["사원", "주임", "대리", "선임", "과장", "차장", "팀장"].map(pos => (
                            <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="edit-address">주소</Label>
                      <Input
                        id="edit-address"
                        value={editForm.address || ""}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-salary">급여 (만원)</Label>
                      <Input
                        id="edit-salary"
                        type="number"
                        value={editForm.salary || ""}
                        onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-6">
                  <div className="space-y-2">
                    <Label>시스템 역할</Label>
                    <div className="space-y-3">
                      {roles.map(role => (
                        <div
                          key={role.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            editForm.role === role.id
                              ? 'border-pastel-blue-600 bg-pastel-blue-50'
                              : 'border-muted hover:border-pastel-blue-300'
                          }`}
                          onClick={() => setEditForm({ ...editForm, role: role.id })}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              editForm.role === role.id
                                ? 'border-pastel-blue-600 bg-pastel-blue-600'
                                : 'border-muted'
                            }`}>
                              {editForm.role === role.id && (
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
                            checked={editForm.permissions?.[key as keyof typeof editForm.permissions] || false}
                            onCheckedChange={(value) => handlePermissionChange(key as keyof Employee['permissions'], value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSaveEdit}>
                  저장
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 부서 이동 다이얼로그 */}
      <Dialog open={isDepartmentMoveDialogOpen} onOpenChange={setIsDepartmentMoveDialogOpen}>
        <DialogContent aria-describedby="department-move-description">
          <DialogHeader>
            <DialogTitle>부서 이동</DialogTitle>
            <DialogDescription id="department-move-description">
              직원의 부서와 직급을 변경할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p><strong>{selectedEmployee.name}</strong>님의 부서 이동</p>
                <p className="text-sm text-muted-foreground">
                  현재: {selectedEmployee.department} • {selectedEmployee.position}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-department">새 부서</Label>
                  <Select value={departmentMoveForm.newDepartment} onValueChange={(value) => setDepartmentMoveForm({ ...departmentMoveForm, newDepartment: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(dept => dept !== "전체").map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-position">새 직급 (선택사항)</Label>
                  <Select value={departmentMoveForm.newPosition} onValueChange={(value) => setDepartmentMoveForm({ ...departmentMoveForm, newPosition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="직급 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.filter(pos => pos !== "전체").map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective-date">발령일</Label>
                <Input
                  id="effective-date"
                  type="date"
                  value={departmentMoveForm.effectiveDate}
                  onChange={(e) => setDepartmentMoveForm({ ...departmentMoveForm, effectiveDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="move-reason">이동 사유</Label>
                <Textarea
                  id="move-reason"
                  placeholder="부서 이동 사유를 입력하세요..."
                  value={departmentMoveForm.reason}
                  onChange={(e) => setDepartmentMoveForm({ ...departmentMoveForm, reason: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDepartmentMoveDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSaveDepartmentMove}>
                  이동
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>직원 정보 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 {selectedEmployee?.name}님의 정보를 삭제하시겠습니까? 
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}