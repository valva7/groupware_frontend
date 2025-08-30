import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Building2, 
  Users, 
  UserCheck, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  BarChart3,
  Clock,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Filter,
  Eye,
  X,
  Crown,
  DollarSign,
  TrendingUp
} from "lucide-react";

// 부서 인터페이스
interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId: string;
  managerName: string;
  parentId?: string;
  level: number;
  memberCount: number;
  budget: number;
  location: string;
  phone: string;
  email: string;
  isActive: boolean;
  children?: Department[];
  establishedDate: string;
}

// 직원 인터페이스
interface Employee {
  id: string;
  name: string;
  position: string;
  departmentId: string;
  email: string;
  phone: string;
  joinDate: string;
  isManager: boolean;
  avatar?: string;
  employeeId: string;
  level: string;
  status: string;
  skills: string[];
  currentProjects: string[];
  performance: number;
  experience: number;
}

// 초기 부서 데이터 (계층 구조)
const initialDepartments: Department[] = [
  {
    id: "company",
    name: "테크이노베이션",
    code: "COMP",
    description: "회사 전체를 총괄하는 최상위 조직",
    managerId: "ceo001",
    managerName: "최대표",
    level: 0,
    memberCount: 52,
    budget: 1000000000,
    location: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "info@company.com",
    isActive: true,
    establishedDate: "2020-01-01",
    children: [
      {
        id: "dev",
        name: "개발본부",
        code: "DEV",
        description: "소프트웨어 개발 및 기술 혁신을 담당하는 핵심 부서",
        managerId: "dev001",
        managerName: "김개발",
        parentId: "company",
        level: 1,
        memberCount: 22,
        budget: 300000000,
        location: "서울시 강남구 테헤란로 123, 5층",
        phone: "02-1234-5679",
        email: "dev@company.com",
        isActive: true,
        establishedDate: "2020-03-01",
        children: [
          {
            id: "frontend",
            name: "프론트엔드팀",
            code: "FE",
            description: "웹 및 모바일 사용자 인터페이스 개발",
            managerId: "fe001",
            managerName: "박프론트",
            parentId: "dev",
            level: 2,
            memberCount: 8,
            budget: 120000000,
            location: "서울시 강남구 테헤란로 123, 5층 A구역",
            phone: "02-1234-5680",
            email: "frontend@company.com",
            isActive: true,
            establishedDate: "2020-06-01"
          },
          {
            id: "backend",
            name: "백엔드팀",
            code: "BE",
            description: "서버 개발 및 데이터베이스 관리",
            managerId: "be001",
            managerName: "이백엔드",
            parentId: "dev",
            level: 2,
            memberCount: 8,
            budget: 130000000,
            location: "서울시 강남구 테헤란로 123, 5층 B구역",
            phone: "02-1234-5681",
            email: "backend@company.com",
            isActive: true,
            establishedDate: "2020-06-01"
          },
          {
            id: "mobile",
            name: "모바일팀",
            code: "MOB",
            description: "iOS, Android 네이티브 앱 개발",
            managerId: "mob001",
            managerName: "최모바일",
            parentId: "dev",
            level: 2,
            memberCount: 6,
            budget: 50000000,
            location: "서울시 강남구 테헤란로 123, 5층 C구역",
            phone: "02-1234-5682",
            email: "mobile@company.com",
            isActive: true,
            establishedDate: "2021-01-01"
          }
        ]
      },
      {
        id: "design",
        name: "디자인팀",
        code: "DES",
        description: "UI/UX 디자인, 브랜딩 및 시각 디자인",
        managerId: "des001",
        managerName: "박디자인",
        parentId: "company",
        level: 1,
        memberCount: 7,
        budget: 80000000,
        location: "서울시 강남구 테헤란로 123, 6층",
        phone: "02-1234-5683",
        email: "design@company.com",
        isActive: true,
        establishedDate: "2020-04-01"
      },
      {
        id: "marketing",
        name: "마케팅팀",
        code: "MKT",
        description: "디지털 마케팅, 브랜드 관리 및 고객 획득",
        managerId: "mkt001",
        managerName: "이마케팅",
        parentId: "company",
        level: 1,
        memberCount: 9,
        budget: 150000000,
        location: "서울시 강남구 테헤란로 123, 7층",
        phone: "02-1234-5684",
        email: "marketing@company.com",
        isActive: true,
        establishedDate: "2020-05-01"
      },
      {
        id: "sales",
        name: "영업팀",
        code: "SALES",
        description: "고객 관계 관리 및 매출 확대",
        managerId: "sales001",
        managerName: "최영업",
        parentId: "company",
        level: 1,
        memberCount: 8,
        budget: 200000000,
        location: "서울시 강남구 테헤란로 123, 8층",
        phone: "02-1234-5685",
        email: "sales@company.com",
        isActive: true,
        establishedDate: "2020-02-01"
      },
      {
        id: "admin",
        name: "관리팀",
        code: "ADMIN",
        description: "인사, 총무, 재무, 법무 업무 총괄",
        managerId: "admin001",
        managerName: "정관리",
        parentId: "company",
        level: 1,
        memberCount: 6,
        budget: 100000000,
        location: "서울시 강남구 테헤란로 123, 9층",
        phone: "02-1234-5686",
        email: "admin@company.com",
        isActive: true,
        establishedDate: "2020-01-15"
      }
    ]
  }
];

// 확장된 직원 데이터
const employees: Employee[] = [
  // 경영진
  { 
    id: "ceo001", 
    name: "최대표", 
    position: "대표이사", 
    departmentId: "company", 
    email: "ceo@company.com", 
    phone: "010-1234-0001", 
    joinDate: "2020-01-01", 
    isManager: true,
    employeeId: "EMP001",
    level: "임원",
    status: "재직",
    skills: ["경영전략", "리더십", "사업개발"],
    currentProjects: ["회사 비전 2025"],
    performance: 95,
    experience: 15
  },

  // 개발본부
  { 
    id: "dev001", 
    name: "김개발", 
    position: "개발본부장", 
    departmentId: "dev", 
    email: "kim.dev@company.com", 
    phone: "010-1234-0002", 
    joinDate: "2020-03-01", 
    isManager: true,
    employeeId: "EMP002",
    level: "부장",
    status: "재직",
    skills: ["기술전략", "아키텍처", "팀리딩"],
    currentProjects: ["플랫폼 혁신", "개발 표준화"],
    performance: 92,
    experience: 12
  },

  // 프론트엔드팀
  { 
    id: "fe001", 
    name: "박프론트", 
    position: "프론트엔드팀장", 
    departmentId: "frontend", 
    email: "park.fe@company.com", 
    phone: "010-1234-0003", 
    joinDate: "2020-06-01", 
    isManager: true,
    employeeId: "EMP003",
    level: "차장",
    status: "재직",
    skills: ["React", "TypeScript", "Next.js"],
    currentProjects: ["신규 웹앱", "컴포넌트 시스템"],
    performance: 88,
    experience: 8
  },
  { 
    id: "fe002", 
    name: "이리액트", 
    position: "선임개발자", 
    departmentId: "frontend", 
    email: "lee.react@company.com", 
    phone: "010-1234-0011", 
    joinDate: "2021-03-15", 
    isManager: false,
    employeeId: "EMP011",
    level: "선임",
    status: "재직",
    skills: ["React", "Vue.js", "CSS"],
    currentProjects: ["관리자 대시보드", "UI 라이브러리"],
    performance: 85,
    experience: 5
  },
  { 
    id: "fe003", 
    name: "정자바스크립트", 
    position: "주임개발자", 
    departmentId: "frontend", 
    email: "jung.js@company.com", 
    phone: "010-1234-0012", 
    joinDate: "2021-09-01", 
    isManager: false,
    employeeId: "EMP012",
    level: "주임",
    status: "재직",
    skills: ["JavaScript", "HTML/CSS", "Webpack"],
    currentProjects: ["모바일 웹", "성능 최적화"],
    performance: 82,
    experience: 3
  },

  // 백엔드팀
  { 
    id: "be001", 
    name: "이백엔드", 
    position: "백엔드팀장", 
    departmentId: "backend", 
    email: "lee.be@company.com", 
    phone: "010-1234-0004", 
    joinDate: "2020-06-01", 
    isManager: true,
    employeeId: "EMP004",
    level: "차장",
    status: "재직",
    skills: ["Node.js", "Python", "AWS"],
    currentProjects: ["마이크로서비스", "DB 최적화"],
    performance: 90,
    experience: 9
  },

  // 모바일팀
  { 
    id: "mob001", 
    name: "최모바일", 
    position: "모바일팀장", 
    departmentId: "mobile", 
    email: "choi.mob@company.com", 
    phone: "010-1234-0005", 
    joinDate: "2021-01-01", 
    isManager: true,
    employeeId: "EMP005",
    level: "차장",
    status: "재직",
    skills: ["React Native", "Swift", "Kotlin"],
    currentProjects: ["모바일 앱 v2", "크로스 플랫폼"],
    performance: 91,
    experience: 7
  },

  // 디자인팀
  { 
    id: "des001", 
    name: "박디자인", 
    position: "디자인팀장", 
    departmentId: "design", 
    email: "park.design@company.com", 
    phone: "010-1234-0006", 
    joinDate: "2020-04-01", 
    isManager: true,
    employeeId: "EMP006",
    level: "차장",
    status: "재직",
    skills: ["UI/UX", "Figma", "Adobe Creative"],
    currentProjects: ["브랜드 리뉴얼", "디자인 시스템"],
    performance: 89,
    experience: 8
  },

  // 마케팅팀
  { 
    id: "mkt001", 
    name: "이마케팅", 
    position: "마케팅팀장", 
    departmentId: "marketing", 
    email: "lee.mkt@company.com", 
    phone: "010-1234-0007", 
    joinDate: "2020-05-01", 
    isManager: true,
    employeeId: "EMP007",
    level: "차장",
    status: "재직",
    skills: ["디지털마케팅", "SNS", "데이터분석"],
    currentProjects: ["브랜드 캠페인", "고객 확보"],
    performance: 86,
    experience: 7
  },

  // 영업팀
  { 
    id: "sales001", 
    name: "최영업", 
    position: "영업팀장", 
    departmentId: "sales", 
    email: "choi.sales@company.com", 
    phone: "010-1234-0008", 
    joinDate: "2020-02-01", 
    isManager: true,
    employeeId: "EMP008",
    level: "차장",
    status: "재직",
    skills: ["영업전략", "고객관리", "협상"],
    currentProjects: ["신규 고객", "매출 확대"],
    performance: 88,
    experience: 10
  },

  // 관리팀
  { 
    id: "admin001", 
    name: "정관리", 
    position: "관리팀장", 
    departmentId: "admin", 
    email: "jung.admin@company.com", 
    phone: "010-1234-0009", 
    joinDate: "2020-01-15", 
    isManager: true,
    employeeId: "EMP009",
    level: "차장",
    status: "재직",
    skills: ["인사관리", "재무", "법무"],
    currentProjects: ["조직 개편", "제도 개선"],
    performance: 84,
    experience: 12
  }
];

interface OrganizationPagesProps {
  currentPage: string;
  departments: any[];
  setDepartments: (departments: any[]) => void;
  employees: any[];
  setEmployees: (employees: any[]) => void;
  selectedDepartmentFilter: string;
  setSelectedDepartmentFilter: (filter: string) => void;
  selectedDepartment: any;
  setSelectedDepartment: (department: any) => void;
  selectedEmployee: any;
  setSelectedEmployee: (employee: any) => void;
  departmentForm: any;
  setDepartmentForm: (form: any) => void;
  employeeForm: any;
  setEmployeeForm: (form: any) => void;
  currentUser: any;
}

export function OrganizationPages({ currentPage }: OrganizationPagesProps) {
  const [departments] = useState<Department[]>(initialDepartments);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["company", "dev"]));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("전체");

  // 부서 선택 처리
  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
  };

  // 부서별 직원 수 계산
  const getDepartmentEmployeeCount = (deptId: string): number => {
    return employees.filter(emp => emp.departmentId === deptId).length;
  };

  // 부서 토글
  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  // 계층구조 렌더링 함수
  const renderDepartmentTree = (depts: Department[], level: number = 0) => {
    return depts.map((dept) => {
      const isExpanded = expandedDepts.has(dept.id);
      const hasChildren = dept.children && dept.children.length > 0;
      const employeeCount = getDepartmentEmployeeCount(dept.id);
      const indentClass = level > 0 ? `ml-${level * 6}` : "";
      const isSelected = selectedDepartment?.id === dept.id;

      return (
        <div key={dept.id} className="w-full">
          <div 
            className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
              dept.level === 0 ? 'bg-gradient-to-r from-pastel-blue-50 to-white' : 'bg-white'
            } ${
              isSelected ? 'ring-2 ring-pastel-blue-500 bg-pastel-blue-50' : ''
            } ${indentClass}`}
            onClick={() => handleDepartmentClick(dept)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDepartment(dept.id);
                    }}
                    className="p-1 h-6 w-6"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${dept.level === 0 ? 'bg-pastel-blue-100' : dept.level === 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Building2 className={`h-5 w-5 ${dept.level === 0 ? 'text-pastel-blue-600' : dept.level === 1 ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium transition-colors ${isSelected ? 'text-pastel-blue-600' : 'group-hover:text-pastel-blue-600'}`}>
                        {dept.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {dept.code}
                      </Badge>
                      {dept.level > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          활성
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{employeeCount}명</div>
                  <div className="text-xs text-muted-foreground">직원</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{dept.managerName}</div>
                  <div className="text-xs text-muted-foreground">팀장</div>
                </div>
              </div>
            </div>
          </div>

          {/* 하위 부서 렌더링 */}
          {hasChildren && isExpanded && (
            <div className="mt-2 space-y-2">
              {renderDepartmentTree(dept.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // 부서 목록 화면
  if (currentPage === "department-list") {
    // 검색 필터링
    const filterDepartments = (depts: Department[]): Department[] => {
      return depts.filter(dept => {
        const matchesSearch = searchTerm === "" || 
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.managerName.toLowerCase().includes(searchTerm.toLowerCase());

        if (matchesSearch && dept.children) {
          const filteredChildren = filterDepartments(dept.children);
          return matchesSearch || filteredChildren.length > 0;
        }
        
        return matchesSearch;
      });
    };

    const filteredDepartments = filterDepartments(departments);

    // 전체 통계 계산
    const getAllDepartments = (depts: Department[]): Department[] => {
      let allDepts: Department[] = [];
      depts.forEach(dept => {
        allDepts.push(dept);
        if (dept.children) {
          allDepts = [...allDepts, ...getAllDepartments(dept.children)];
        }
      });
      return allDepts;
    };

    const allDepartments = getAllDepartments(departments);
    const activeDepartments = allDepartments.filter(dept => dept.level > 0);

    // 선택된 부서의 직원 목록
    const departmentEmployees = selectedDepartment 
      ? employees.filter(emp => emp.departmentId === selectedDepartment.id)
      : [];

    const getLevelBadgeColor = (level: string) => {
      switch (level) {
        case "임원": return "bg-red-100 text-red-700";
        case "부장": return "bg-purple-100 text-purple-700";
        case "차장": return "bg-blue-100 text-blue-700";
        case "선임": return "bg-green-100 text-green-700";
        case "주임": return "bg-yellow-100 text-yellow-700";
        case "사원": return "bg-gray-100 text-gray-700";
        case "인턴": return "bg-orange-100 text-orange-700";
        default: return "bg-gray-100 text-gray-700";
      }
    };

    const getPerformanceLevel = (score: number) => {
      if (score >= 90) return { level: "우수", color: "bg-green-100 text-green-700" };
      if (score >= 80) return { level: "양호", color: "bg-blue-100 text-blue-700" };
      if (score >= 70) return { level: "보통", color: "bg-yellow-100 text-yellow-700" };
      return { level: "미흡", color: "bg-red-100 text-red-700" };
    };

    const getExperienceText = (years: number) => {
      if (years === 0) return "신입";
      if (years < 1) return "1년 미만";
      return `${years}년`;
    };

    const handleEmployeeClick = (employee: Employee) => {
      setSelectedEmployee(employee);
      setIsEmployeeDetailOpen(true);
    };

    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1>부서 목록</h1>
            <p className="text-muted-foreground">
              회사의 조직 구조와 각 부서의 정보를 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">전체 부서</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{activeDepartments.length}</div>
              <p className="text-xs text-muted-foreground">
                활성 부서 수
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">총 직원</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{employees.length}</div>
              <p className="text-xs text-muted-foreground">
                전체 재직 인원
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">관리자</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{employees.filter(e => e.isManager).length}</div>
              <p className="text-xs text-muted-foreground">
                팀장급 이상
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">총 예산</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {Math.round(allDepartments.reduce((sum, dept) => sum + dept.budget, 0) / 100000000)}억
              </div>
              <p className="text-xs text-muted-foreground">
                전체 부서 예산
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 검색 */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="부서명, 부서코드, 설명, 팀장명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* 메인 콘텐츠 - 좌우 분할 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 좌측: 부서 트리 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>조직 구조</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {renderDepartmentTree(filteredDepartments)}
                  </div>
                  
                  {filteredDepartments.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">
                        검색 결과가 없습니다
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        다른 검색어를 사용해보세요.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 우측: 부서 상세 정보 */}
          <div className="lg:col-span-3">
            {selectedDepartment ? (
              <div className="space-y-6">
                {/* 부서 기본 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-pastel-blue-600" />
                      {selectedDepartment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">개요</TabsTrigger>
                        <TabsTrigger value="contact">연락처</TabsTrigger>
                        <TabsTrigger value="stats">통계</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">부서코드</Label>
                            <p className="font-medium">{selectedDepartment.code}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">설립일</Label>
                            <p className="font-medium">{selectedDepartment.establishedDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">부서장</Label>
                            <p className="font-medium">{selectedDepartment.managerName}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">예산</Label>
                            <p className="font-medium">{(selectedDepartment.budget / 10000).toLocaleString()}만원</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">설명</Label>
                          <p className="mt-1">{selectedDepartment.description}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="contact" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">위치</Label>
                              <p className="font-medium">{selectedDepartment.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">전화번호</Label>
                              <p className="font-medium">{selectedDepartment.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">이메일</Label>
                              <p className="font-medium">{selectedDepartment.email}</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="stats" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-pastel-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-pastel-blue-600">
                              {getDepartmentEmployeeCount(selectedDepartment.id)}
                            </div>
                            <p className="text-sm text-muted-foreground">구성원</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {employees.filter(emp => emp.departmentId === selectedDepartment.id && emp.isManager).length}
                            </div>
                            <p className="text-sm text-muted-foreground">관리자</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {(() => {
                                const deptEmployees = employees.filter(emp => emp.departmentId === selectedDepartment.id);
                                if (deptEmployees.length === 0) return 0;
                                return Math.round(deptEmployees.reduce((sum, emp) => sum + emp.experience, 0) / deptEmployees.length);
                              })()}
                            </div>
                            <p className="text-sm text-muted-foreground">평균 경력</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {(() => {
                                const deptEmployees = employees.filter(emp => emp.departmentId === selectedDepartment.id);
                                if (deptEmployees.length === 0) return 0;
                                return Math.round(deptEmployees.reduce((sum, emp) => sum + emp.performance, 0) / deptEmployees.length);
                              })()}
                            </div>
                            <p className="text-sm text-muted-foreground">평균 성과</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* 부서 직원 목록 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-pastel-blue-600" />
                      부서 구성원 ({departmentEmployees.length}명)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {departmentEmployees.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {departmentEmployees.map((employee) => {
                            const performance = getPerformanceLevel(employee.performance);
                            
                            return (
                              <div
                                key={employee.id}
                                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group bg-white"
                                onClick={() => handleEmployeeClick(employee)}
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={employee.avatar} alt={employee.name} />
                                    <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                                      {employee.name.slice(-2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium truncate group-hover:text-pastel-blue-600 transition-colors">
                                        {employee.name}
                                      </h4>
                                      {employee.isManager && (
                                        <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                      )}
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mb-1 truncate">
                                      {employee.position}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className={getLevelBadgeColor(employee.level)}>
                                        {employee.level}
                                      </Badge>
                                      <Badge variant="outline" className={performance.color}>
                                        {performance.level}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span>경력 {getExperienceText(employee.experience)}</span>
                                      <span>{employee.performance}점</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium text-muted-foreground mb-2">
                            구성원이 없습니다
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            아직 이 부서에 배정된 직원이 없습니다.
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">
                    부서를 선택해주세요
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    좌측에서 부서를 클릭하면 상세 정보와 구성원을 확인할 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 직원 상세 정보 팝업 */}
        <Dialog open={isEmployeeDetailOpen} onOpenChange={setIsEmployeeDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-pastel-blue-600" />
                직원 상세 정보
              </DialogTitle>
              <DialogDescription>
                {selectedEmployee?.name}님의 상세 정보를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-pastel-blue-50 to-white rounded-lg">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                    <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xl">
                      {selectedEmployee.name.slice(-2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-medium">{selectedEmployee.name}</h2>
                      {selectedEmployee.isManager && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Crown className="h-3 w-3 mr-1" />
                          관리자
                        </Badge>
                      )}
                      <Badge variant="outline" className={getLevelBadgeColor(selectedEmployee.level)}>
                        {selectedEmployee.level}
                      </Badge>
                    </div>
                    
                    <p className="text-lg text-muted-foreground mb-2">{selectedEmployee.position}</p>
                    <p className="text-muted-foreground">{selectedDepartment?.name}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 세부 정보 탭 */}
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">프로필</TabsTrigger>
                    <TabsTrigger value="skills">기술/프로젝트</TabsTrigger>
                    <TabsTrigger value="performance">성과</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>기본 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-sm text-muted-foreground">사번</Label>
                            <p className="font-medium">{selectedEmployee.employeeId}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">입사일</Label>
                            <p className="font-medium">{selectedEmployee.joinDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">근무 경력</Label>
                            <p className="font-medium">{getExperienceText(selectedEmployee.experience)}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">재직 상태</Label>
                            <Badge className="bg-green-100 text-green-700">{selectedEmployee.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>연락처</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">이메일</Label>
                              <p className="font-medium">{selectedEmployee.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">전화번호</Label>
                              <p className="font-medium">{selectedEmployee.phone}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>보유 기술</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedEmployee.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>참여 프로젝트</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedEmployee.currentProjects.map((project, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-pastel-blue-500 rounded-full"></div>
                                <span className="text-sm">{project}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>성과 지표</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-pastel-blue-600 mb-2">
                              {selectedEmployee.performance}
                            </div>
                            <Label className="text-sm text-muted-foreground">종합 성과 점수</Label>
                            <p className="text-xs text-muted-foreground mt-1">100점 만점</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {selectedEmployee.experience}
                            </div>
                            <Label className="text-sm text-muted-foreground">경력 년수</Label>
                            <p className="text-xs text-muted-foreground mt-1">총 경력</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              {selectedEmployee.currentProjects.length}
                            </div>
                            <Label className="text-sm text-muted-foreground">참여 프로젝트</Label>
                            <p className="text-xs text-muted-foreground mt-1">현재 진행 중</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmployeeDetailOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // 직원 현황 화면
  if (currentPage === "employee-status") {
    // 필터링된 직원 목록
    const filteredEmployees = employees.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(employeeSearchTerm.toLowerCase());
      
      const matchesDepartment = selectedDeptFilter === "전체" || 
        getDepartmentName(employee.departmentId).includes(selectedDeptFilter);
      
      return matchesSearch && matchesDepartment;
    });

    // 부서명 가져오기 함수
    function getDepartmentName(deptId: string): string {
      const findDept = (depts: Department[]): string => {
        for (const dept of depts) {
          if (dept.id === deptId) return dept.name;
          if (dept.children) {
            const found = findDept(dept.children);
            if (found) return found;
          }
        }
        return "";
      };
      return findDept(departments);
    }

    // 모든 부서 목록 생성
    const getAllDepartments = (): string[] => {
      const deptNames: string[] = [];
      const traverse = (depts: Department[]) => {
        depts.forEach(dept => {
          if (dept.level > 0) deptNames.push(dept.name);
          if (dept.children) traverse(dept.children);
        });
      };
      traverse(departments);
      return deptNames;
    };

    const allDepartments = getAllDepartments();

    const getPerformanceLevel = (score: number) => {
      if (score >= 90) return { level: "우수", color: "bg-green-100 text-green-700" };
      if (score >= 80) return { level: "양호", color: "bg-blue-100 text-blue-700" };
      if (score >= 70) return { level: "보통", color: "bg-yellow-100 text-yellow-700" };
      return { level: "미흡", color: "bg-red-100 text-red-700" };
    };

    const getLevelBadgeColor = (level: string) => {
      switch (level) {
        case "임원": return "bg-red-100 text-red-700";
        case "부장": return "bg-purple-100 text-purple-700";
        case "차장": return "bg-blue-100 text-blue-700";
        case "선임": return "bg-green-100 text-green-700";
        case "주임": return "bg-yellow-100 text-yellow-700";
        case "사원": return "bg-gray-100 text-gray-700";
        case "인턴": return "bg-orange-100 text-orange-700";
        default: return "bg-gray-100 text-gray-700";
      }
    };

    const handleEmployeeClick = (employee: Employee) => {
      setSelectedEmployee(employee);
      setIsEmployeeDetailOpen(true);
    };

    const getExperienceText = (years: number) => {
      if (years === 0) return "신입";
      if (years < 1) return "1년 미만";
      return `${years}년`;
    };

    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1>직원 현황</h1>
            <p className="text-muted-foreground">
              전체 직원의 정보를 확인하고 검색할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">총 직원 수</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{employees.length}</div>
              <p className="text-xs text-muted-foreground">
                전체 재직 인원
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">관리자</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{employees.filter(e => e.isManager).length}</div>
              <p className="text-xs text-muted-foreground">
                팀장급 이상
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">평균 경력</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {Math.round(employees.reduce((sum, e) => sum + e.experience, 0) / employees.length)}년
              </div>
              <p className="text-xs text-muted-foreground">
                전체 평균
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">평균 성과</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {Math.round(employees.reduce((sum, e) => sum + e.performance, 0) / employees.length)}점
              </div>
              <p className="text-xs text-muted-foreground">
                100점 만점
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="직원명, 직급, 이메일, 사번으로 검색..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDeptFilter} onValueChange={setSelectedDeptFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 부서</SelectItem>
                  {allDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 직원 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>직원 목록 ({filteredEmployees.length}명)</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map((employee) => {
                  const performance = getPerformanceLevel(employee.performance);
                  const departmentName = getDepartmentName(employee.departmentId);
                  
                  return (
                    <div
                      key={employee.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group bg-white"
                      onClick={() => handleEmployeeClick(employee)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                            {employee.name.slice(-2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate group-hover:text-pastel-blue-600 transition-colors">
                              {employee.name}
                            </h4>
                            {employee.isManager && (
                              <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-1 truncate">
                            {employee.position}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mb-2 truncate">
                            {departmentName}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getLevelBadgeColor(employee.level)}>
                              {employee.level}
                            </Badge>
                            <Badge variant="outline" className={performance.color}>
                              {performance.level}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>경력 {getExperienceText(employee.experience)}</span>
                            <span>{employee.performance}점</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    다른 검색어나 필터를 사용해보세요.
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 직원 상세 정보 팝업 */}
        <Dialog open={isEmployeeDetailOpen} onOpenChange={setIsEmployeeDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-pastel-blue-600" />
                직원 상세 정보
              </DialogTitle>
              <DialogDescription>
                {selectedEmployee?.name}님의 상세 정보를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-pastel-blue-50 to-white rounded-lg">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                    <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xl">
                      {selectedEmployee.name.slice(-2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-medium">{selectedEmployee.name}</h2>
                      {selectedEmployee.isManager && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Crown className="h-3 w-3 mr-1" />
                          관리자
                        </Badge>
                      )}
                      <Badge variant="outline" className={getLevelBadgeColor(selectedEmployee.level)}>
                        {selectedEmployee.level}
                      </Badge>
                    </div>
                    
                    <p className="text-lg text-muted-foreground mb-2">{selectedEmployee.position}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 세부 정보 탭 */}
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">프로필</TabsTrigger>
                    <TabsTrigger value="skills">기술/프로젝트</TabsTrigger>
                    <TabsTrigger value="performance">성과</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>기본 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-sm text-muted-foreground">사번</Label>
                            <p className="font-medium">{selectedEmployee.employeeId}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">입사일</Label>
                            <p className="font-medium">{selectedEmployee.joinDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">근무 경력</Label>
                            <p className="font-medium">{getExperienceText(selectedEmployee.experience)}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">재직 상태</Label>
                            <Badge className="bg-green-100 text-green-700">{selectedEmployee.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>연락처</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">이메일</Label>
                              <p className="font-medium">{selectedEmployee.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm text-muted-foreground">전화번호</Label>
                              <p className="font-medium">{selectedEmployee.phone}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>보유 기술</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedEmployee.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>참여 프로젝트</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedEmployee.currentProjects.map((project, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-pastel-blue-500 rounded-full"></div>
                                <span className="text-sm">{project}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>성과 지표</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-pastel-blue-600 mb-2">
                              {selectedEmployee.performance}
                            </div>
                            <Label className="text-sm text-muted-foreground">종합 성과 점수</Label>
                            <p className="text-xs text-muted-foreground mt-1">100점 만점</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {selectedEmployee.experience}
                            </div>
                            <Label className="text-sm text-muted-foreground">경력 년수</Label>
                            <p className="text-xs text-muted-foreground mt-1">총 경력</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              {selectedEmployee.currentProjects.length}
                            </div>
                            <Label className="text-sm text-muted-foreground">참여 프로젝트</Label>
                            <p className="text-xs text-muted-foreground mt-1">현재 진행 중</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmployeeDetailOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // 기본 화면
  return (
    <div className="space-y-6">
      <div>
        <h1>조직도</h1>
        <p className="text-muted-foreground">조직 구조와 직원 정보를 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}