import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Progress } from "../../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Calendar,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  FolderPlus,
  Settings,
  Download,
  TrendingUp,
  PieChart,
  Activity,
  Save
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "계획" | "진행중" | "완료" | "지연" | "중단";
  priority: "높음" | "보통" | "낮음";
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  actualBudget: number;
  manager: string;
  team: string;
  department: string;
  teamMembers: Array<{
    id: number;
    name: string;
    role: string;
    allocation: number;
    department: string;
  }>;
  milestones: Array<{
    id: number;
    name: string;
    date: string;
    status: "완료" | "진행중" | "예정" | "지연";
    description: string;
  }>;
  tasks: Array<{
    id: number;
    name: string;
    assignee: string;
    progress: number;
    dueDate: string;
    priority: "높음" | "보통" | "낮음";
    status: "완료" | "진행중" | "대기" | "지연";
  }>;
  createdAt: string;
  updatedAt: string;
}

interface AdminProjectManagementPageProps {
  appState?: any;
}

export function AdminProjectManagementPage({ appState }: AdminProjectManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [isManagerSelectOpen, setIsManagerSelectOpen] = useState(false);
  
  // 직원 선택 관련 상태
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("전체");

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    status: "계획" as const,
    priority: "보통" as const,
    startDate: "",
    endDate: "",
    budget: "",
    manager: "",
    team: "",
    department: ""
  });

  // 기본 직원 데이터 (appState에서 가져오거나 기본값 사용)
  const employees = appState?.employees || [
    { id: 1, name: "김철수", department: "개발팀", position: "팀장", status: "재직중", profileImage: "" },
    { id: 2, name: "이영희", department: "개발팀", position: "선임연구원", status: "재직중", profileImage: "" },
    { id: 3, name: "박민수", department: "디자인팀", position: "팀장", status: "재직중", profileImage: "" },
    { id: 4, name: "정현아", department: "마케팅팀", position: "팀장", status: "재직중", profileImage: "" },
    { id: 5, name: "한소연", department: "IT팀", position: "팀장", status: "재직중", profileImage: "" },
    { id: 6, name: "오태현", department: "개발팀", position: "주니어", status: "재직중", profileImage: "" },
    { id: 7, name: "임수진", department: "개발팀", position: "시니어", status: "재직중", profileImage: "" },
    { id: 8, name: "조민호", department: "디자인팀", position: "시니어", status: "재직중", profileImage: "" },
    { id: 9, name: "신예린", department: "마케팅팀", position: "주니어", status: "재직중", profileImage: "" },
    { id: 10, name: "최동욱", department: "IT팀", position: "시니어", status: "재직중", profileImage: "" }
  ];

  // 필터링된 직원 목록
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearchTerm.toLowerCase());
    
    const matchesDepartment = selectedDeptFilter === "전체" || employee.department === selectedDeptFilter;
    const isActive = employee.status === "재직중";
    
    return matchesSearch && matchesDepartment && isActive;
  });

  // 부서 목록 추출
  const departmentNames = Array.from(new Set(employees.map(emp => emp.department)));

  // 프로젝트 목록 데이터
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "모바일 앱 리뉴얼",
      description: "기존 모바일 앱의 UI/UX를 개선하고 새로운 기능을 추가하는 프로젝트입니다.",
      status: "진행중",
      priority: "높음",
      progress: 75,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      budget: 50000000,
      actualBudget: 35000000,
      manager: "김철수",
      team: "모바일개발팀",
      department: "개발팀",
      teamMembers: [
        { id: 1, name: "김철수", role: "프로젝트 매니저", allocation: 100, department: "개발팀" },
        { id: 2, name: "임수진", role: "시니어 개발자", allocation: 80, department: "개발팀" },
        { id: 3, name: "오태현", role: "주니어 개발자", allocation: 90, department: "개발팀" },
        { id: 4, name: "한소연", role: "UI/UX 디자이너", allocation: 60, department: "디자인팀" }
      ],
      milestones: [
        { id: 1, name: "요구사항 분석 완료", date: "2024-02-01", status: "완료", description: "사용자 요구사항 분석 및 기능 정의 완료" },
        { id: 2, name: "UI/UX 디자인 완료", date: "2024-02-28", status: "완료", description: "새로운 디자인 시스템 적용 및 화면 설계 완료" },
        { id: 3, name: "개발 75% 완료", date: "2024-03-25", status: "완료", description: "핵심 기능 개발 및 테스트 진행 중" },
        { id: 4, name: "베타 테스트", date: "2024-04-05", status: "진행중", description: "내부 베타 테스트 및 버그 수정" }
      ],
      tasks: [
        { id: 1, name: "로그인 화면 개발", assignee: "임수진", progress: 100, dueDate: "2024-03-01", priority: "높음", status: "완료" },
        { id: 2, name: "메인 화면 개발", assignee: "오태현", progress: 85, dueDate: "2024-03-15", priority: "높음", status: "진행중" },
        { id: 3, name: "설정 화면 개발", assignee: "임수진", progress: 60, dueDate: "2024-03-30", priority: "보통", status: "진행중" },
        { id: 4, name: "푸시 알림 기능", assignee: "오태현", progress: 30, dueDate: "2024-04-10", priority: "보통", status: "진행중" }
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-03-25"
    },
    {
      id: 2,
      name: "ERP 시스템 구축",
      description: "회사 전체의 업무 프로세스를 통합 관리하는 ERP 시스템을 구축하는 프로젝트입니다.",
      status: "계획",
      priority: "높음",
      progress: 15,
      startDate: "2024-04-01",
      endDate: "2024-10-31",
      budget: 100000000,
      actualBudget: 8000000,
      manager: "이영희",
      team: "시스템개발팀",
      department: "개발팀",
      teamMembers: [
        { id: 5, name: "이영희", role: "프로젝트 매니저", allocation: 100, department: "개발팀" },
        { id: 6, name: "박민수", role: "시스템 아키텍트", allocation: 70, department: "개발팀" },
        { id: 7, name: "정현아", role: "백엔드 개발자", allocation: 80, department: "개발팀" }
      ],
      milestones: [
        { id: 5, name: "요구사항 정의", date: "2024-04-15", status: "진행중", description: "각 부서별 요구사항 수집 및 정의" },
        { id: 6, name: "시스템 설계", date: "2024-05-15", status: "예정", description: "시스템 아키텍처 및 DB 설계" },
        { id: 7, name: "개발 단계", date: "2024-08-31", status: "예정", description: "핵심 모듈 개발" },
        { id: 8, name: "테스트 및 배포", date: "2024-10-15", status: "예정", description: "통합 테스트 및 운영 배포" }
      ],
      tasks: [
        { id: 5, name: "요구사항 문서 작성", assignee: "이영희", progress: 80, dueDate: "2024-04-10", priority: "높음", status: "진행중" },
        { id: 6, name: "기술 스택 선정", assignee: "박민수", progress: 50, dueDate: "2024-04-05", priority: "높음", status: "진행중" },
        { id: 7, name: "프로토타입 개발", assignee: "정현아", progress: 20, dueDate: "2024-04-20", priority: "보통", status: "진행중" }
      ],
      createdAt: "2024-03-15",
      updatedAt: "2024-03-28"
    },
    {
      id: 3,
      name: "웹사이트 개편",
      description: "회사 홈페이지의 전체적인 리뉴얼 및 반응형 웹 적용 프로젝트입니다.",
      status: "진행중",
      priority: "보통",
      progress: 60,
      startDate: "2024-01-20",
      endDate: "2024-04-30",
      budget: 40000000,
      actualBudget: 28000000,
      manager: "한소연",
      team: "웹개발팀",
      department: "디자인팀",
      teamMembers: [
        { id: 8, name: "한소연", role: "프로젝트 매니저", allocation: 80, department: "디자인팀" },
        { id: 9, name: "조민호", role: "프론트엔드 개발자", allocation: 100, department: "개발팀" },
        { id: 10, name: "신예린", role: "웹 디자이너", allocation: 70, department: "디자인팀" }
      ],
      milestones: [
        { id: 9, name: "디자인 시스템 구축", date: "2024-02-15", status: "완료", description: "웹사이트 디자인 가이드라인 완성" },
        { id: 10, name: "주요 페이지 개발", date: "2024-03-31", status: "진행중", description: "메인 페이지 및 주요 서브 페이지 개발" },
        { id: 11, name: "반응형 적용", date: "2024-04-15", status: "예정", description: "모바일/태블릿 반응형 웹 적용" },
        { id: 12, name: "성능 최적화", date: "2024-04-25", status: "예정", description: "웹사이트 성능 최적화 및 SEO 적용" }
      ],
      tasks: [
        { id: 8, name: "메인 페이지 디자인", assignee: "신예린", progress: 100, dueDate: "2024-02-28", priority: "높음", status: "완료" },
        { id: 9, name: "메인 페이지 개발", assignee: "조민호", progress: 90, dueDate: "2024-03-15", priority: "높음", status: "진행중" },
        { id: 10, name: "서브 페이지 개발", assignee: "조민호", progress: 45, dueDate: "2024-03-31", priority: "보통", status: "진행중" },
        { id: 11, name: "관리자 페이지", assignee: "조민호", progress: 20, dueDate: "2024-04-10", priority: "낮음", status: "대기" }
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-03-20"
    }
  ]);

  // 부서 목록
  const departments = ["전체", "개발팀", "디자인팀", "IT팀", "마케팅팀", "영업팀"];

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "계획": return "bg-gray-100 text-gray-700";
      case "진행중": return "bg-blue-100 text-blue-700"; 
      case "완료": return "bg-green-100 text-green-700";
      case "지연": return "bg-red-100 text-red-700";
      case "중단": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음": return "bg-red-100 text-red-700";
      case "보통": return "bg-yellow-100 text-yellow-700";
      case "낮음": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "완료": return "bg-green-100 text-green-700";
      case "진행중": return "bg-blue-100 text-blue-700";
      case "대기": return "bg-gray-100 text-gray-700";
      case "지연": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "완료": return "bg-green-100 text-green-700";
      case "진행중": return "bg-blue-100 text-blue-700";
      case "예정": return "bg-gray-100 text-gray-700";
      case "지연": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // 필터링된 프로젝트 목록
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "전체" || project.status === selectedStatus;
    const matchesDepartment = selectedDepartment === "전체" || project.department === selectedDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // 통계 데이터
  const statistics = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === "진행중").length,
    completed: projects.filter(p => p.status === "완료").length,
    delayed: projects.filter(p => p.status === "지연").length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    usedBudget: projects.reduce((sum, p) => sum + p.actualBudget, 0),
    avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };

  const handleCreateProject = () => {
    if (!projectForm.name || !projectForm.startDate || !projectForm.endDate) {
      toast.error("필수 항목을 입력해주세요.");
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      ...projectForm,
      progress: 0,
      budget: parseInt(projectForm.budget) || 0,
      actualBudget: 0,
      teamMembers: [],
      milestones: [],
      tasks: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, newProject]);
    setIsCreateProjectOpen(false);
    setProjectForm({
      name: "",
      description: "",
      status: "계획",
      priority: "보통",
      startDate: "",
      endDate: "",
      budget: "",
      manager: "",
      team: "",
      department: ""
    });
    toast.success("프로젝트가 생성되었습니다.");
  };

  const handleEditProject = () => {
    if (!selectedProject) return;

    if (!projectForm.name || !projectForm.manager) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id 
        ? { 
            ...p, 
            ...projectForm,
            budget: parseInt(projectForm.budget) || p.budget,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : p
    );

    setProjects(updatedProjects);
    setIsEditProjectOpen(false);
    setSelectedProject(null);
    toast.success("프로젝트가 수정되었습니다.");
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success("프로젝트가 삭제되었습니다.");
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget.toString(),
      manager: project.manager,
      team: project.team,
      department: project.department
    });
    setIsEditProjectOpen(true);
  };

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setIsProjectDetailOpen(true);
  };

  // 매니저 선택 처리
  const handleManagerSelect = (employee: any) => {
    setProjectForm({
      ...projectForm,
      manager: employee.name
    });
    setIsManagerSelectOpen(false);
    toast.success(`${employee.name}님이 프로젝트 매니저로 선택되었습니다.`);
  };

  // 매니저 선택 팝업 열기
  const handleOpenManagerSelect = () => {
    setEmployeeSearchTerm("");
    setSelectedDeptFilter("전체");
    setIsManagerSelectOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">프로젝트 관리</h1>
          <p className="text-muted-foreground">전체 프로젝트를 생성, 수정, 삭제하고 진행 상황을 관리할 수 있습니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button 
            onClick={() => setIsCreateProjectOpen(true)}
            className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            프로젝트 생성
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pastel-blue-100 rounded-lg">
                <FolderPlus className="h-5 w-5 text-pastel-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 프로젝트</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">진행중</p>
                <p className="text-2xl font-bold">{statistics.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">완료</p>
                <p className="text-2xl font-bold">{statistics.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">지연</p>
                <p className="text-2xl font-bold">{statistics.delayed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="프로젝트명, 설명, 담당자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 상태</SelectItem>
                  <SelectItem value="계획">계획</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                  <SelectItem value="지연">지연</SelectItem>
                  <SelectItem value="중단">중단</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "전체" ? "전체 부서" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 목록 */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 
                      className="font-semibold cursor-pointer hover:text-pastel-blue-600 transition-colors"
                      onClick={() => openProjectDetail(project)}
                    >
                      {project.name}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>팀장: {project.manager}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{project.startDate} ~ {project.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span>예산: {(project.budget / 10000).toLocaleString()}만원</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3 text-muted-foreground" />
                      <span>팀원: {project.teamMembers.length}명</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-right mr-4">
                    <div className="text-2xl font-bold text-pastel-blue-600">
                      {project.progress}%
                    </div>
                    <div className="text-xs text-muted-foreground">진행률</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>프로젝트 진행률</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">
                프로젝트가 없습니다
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                검색 조건에 맞는 프로젝트가 없습니다.
              </p>
              <Button onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 프로젝트 생성하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 프로젝트 생성 다이얼로그 */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-pastel-blue-600" />
              새 프로젝트 생성
            </DialogTitle>
            <DialogDescription>
              새로운 프로젝트의 기본 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">프로젝트명 *</Label>
                <Input
                  id="project-name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  placeholder="프로젝트 이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-manager">프로젝트 매니저</Label>
                <Input
                  id="project-manager"
                  value={projectForm.manager}
                  onChange={(e) => setProjectForm({...projectForm, manager: e.target.value})}
                  placeholder="담당자 이름"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">프로젝트 설명</Label>
              <Textarea
                id="project-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-status">상태</Label>
                <Select 
                  value={projectForm.status} 
                  onValueChange={(value: any) => setProjectForm({...projectForm, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="계획">계획</SelectItem>
                    <SelectItem value="진행중">진행중</SelectItem>
                    <SelectItem value="완료">완료</SelectItem>
                    <SelectItem value="지연">지연</SelectItem>
                    <SelectItem value="중단">중단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-priority">우선순위</Label>
                <Select 
                  value={projectForm.priority} 
                  onValueChange={(value: any) => setProjectForm({...projectForm, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="높음">높음</SelectItem>
                    <SelectItem value="보통">보통</SelectItem>
                    <SelectItem value="낮음">낮음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-department">부서</Label>
                <Select 
                  value={projectForm.department} 
                  onValueChange={(value) => setProjectForm({...projectForm, department: value})}
                >
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-startDate">시작일 *</Label>
                <Input
                  id="project-startDate"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-endDate">종료일 *</Label>
                <Input
                  id="project-endDate"
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-budget">예산 (원)</Label>
                <Input
                  id="project-budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                  placeholder="예산을 입력하세요"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateProject}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 수정 다이얼로그 */}
      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-pastel-blue-600" />
              프로젝트 수정
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.name}의 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">프로젝트명 *</Label>
                <Input
                  id="edit-name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  placeholder="프로젝트 이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">상태</Label>
                <Select value={projectForm.status} onValueChange={(value: any) => setProjectForm({...projectForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="계획">계획</SelectItem>
                    <SelectItem value="진행중">진행중</SelectItem>
                    <SelectItem value="완료">완료</SelectItem>
                    <SelectItem value="지연">지연</SelectItem>
                    <SelectItem value="중단">중단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">프로젝트 설명</Label>
              <Textarea
                id="edit-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                placeholder="프로젝트에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-manager">프로젝트 매니저 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-manager"
                    value={projectForm.manager}
                    placeholder="매니저명"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenManagerSelect}
                    className="px-3"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-team">담당 팀</Label>
                <Input
                  id="edit-team"
                  value={projectForm.team}
                  onChange={(e) => setProjectForm({...projectForm, team: e.target.value})}
                  placeholder="팀명을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">시작일</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">마감일</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">예산 (원)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                  placeholder="예산을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">우선순위</Label>
                <Select value={projectForm.priority} onValueChange={(value: any) => setProjectForm({...projectForm, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="우선순위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="높음">높음</SelectItem>
                    <SelectItem value="보통">보통</SelectItem>
                    <SelectItem value="낮음">낮음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">부서</Label>
                <Select value={projectForm.department} onValueChange={(value) => setProjectForm({...projectForm, department: value})}>
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
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProjectOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleEditProject}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 매니저 선택 다이얼로그 */}
      <Dialog open={isManagerSelectOpen} onOpenChange={setIsManagerSelectOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pastel-blue-600" />
              프로젝트 매니저 선택
            </DialogTitle>
            <DialogDescription>
              프로젝트를 담당할 매니저를 선택하세요. 부서별로 필터링하거나 이름으로 검색할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 검색 및 필터 */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="직원 이름, 부서, 직급으로 검색..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDeptFilter} onValueChange={setSelectedDeptFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 부서</SelectItem>
                  {departmentNames.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 직원 목록 */}
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="p-4 space-y-2">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>검색 조건에 맞는 직원이 없습니다.</p>
                  </div>
                ) : (
                  filteredEmployees.map(employee => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleManagerSelect(employee)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.profileImage} alt={employee.name} />
                          <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                            {employee.name.slice(-2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.department} • {employee.position}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {employee.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="text-sm text-muted-foreground">
              총 {filteredEmployees.length}명의 직원이 검색되었습니다.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsManagerSelectOpen(false)}
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 상세 다이얼로그 (기존 코드와 동일) */}
      <Dialog open={isProjectDetailOpen} onOpenChange={setIsProjectDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-pastel-blue-600" />
              {selectedProject?.name}
            </DialogTitle>
            <DialogDescription>
              프로젝트의 상세 정보와 진행 상황을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            {selectedProject && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">개요</TabsTrigger>
                  <TabsTrigger value="team">팀 멤버</TabsTrigger>
                  <TabsTrigger value="tasks">작업</TabsTrigger>
                  <TabsTrigger value="milestones">마일스톤</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>프로젝트 정보</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">설명</Label>
                          <p className="mt-1">{selectedProject.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">상태</Label>
                            <div className="mt-1">
                              <Badge className={getStatusColor(selectedProject.status)}>
                                {selectedProject.status}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">우선순위</Label>
                            <div className="mt-1">
                              <Badge className={getPriorityColor(selectedProject.priority)}>
                                {selectedProject.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">시작일</Label>
                            <p className="mt-1">{selectedProject.startDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">종료일</Label>
                            <p className="mt-1">{selectedProject.endDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>진행 현황</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm text-muted-foreground">전체 진행률</Label>
                            <span className="font-medium">{selectedProject.progress}%</span>
                          </div>
                          <Progress value={selectedProject.progress} className="h-3" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">예산</Label>
                            <p className="mt-1 font-medium">{(selectedProject.budget / 10000).toLocaleString()}만원</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">사용 예산</Label>
                            <p className="mt-1 font-medium">{(selectedProject.actualBudget / 10000).toLocaleString()}만원</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">매니저</Label>
                          <p className="mt-1 font-medium">{selectedProject.manager}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.teamMembers.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                              <p className="text-sm text-muted-foreground">{member.department}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{member.allocation}%</p>
                              <p className="text-xs text-muted-foreground">할당률</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <div className="space-y-3">
                    {selectedProject.tasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{task.name}</h4>
                              <p className="text-sm text-muted-foreground">담당자: {task.assignee}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getTaskStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>진행률</span>
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">마감일: {task.dueDate}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4">
                  <div className="space-y-4">
                    {selectedProject.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-pastel-blue-500"></div>
                          {index < selectedProject.milestones.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <Card className="flex-1">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{milestone.name}</h4>
                              <Badge className={getMilestoneStatusColor(milestone.status)}>
                                {milestone.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                            <p className="text-xs text-muted-foreground">예정일: {milestone.date}</p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectDetailOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}