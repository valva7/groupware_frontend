import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { 
  Users, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Edit, 
  X, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  UserPlus,
  UserMinus,
  Search,
  Filter,
  Clock,
  Star,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  User
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ResourcePagesProps {
  currentPage: string;
  employees: any[];
  setEmployees: (employees: any[]) => void;
  departments: any[];
  projects: any[];
  setProjects: (projects: any[]) => void;
}

interface ProjectAssignment {
  id: string;
  projectId: string;
  employeeId: string;
  role: string;
  workload: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "completed";
  notes?: string;
}

export function ResourcePages({
  currentPage,
  employees,
  setEmployees,
  departments,
  projects,
  setProjects
}: ResourcePagesProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const [viewMode, setViewMode] = useState<"projects" | "employees">("projects");

  const [assignmentForm, setAssignmentForm] = useState({
    employeeId: "",
    role: "",
    workload: 40,
    startDate: "",
    endDate: "",
    notes: ""
  });

  // 임시 배정 데이터 (실제로는 상태로 관리)
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([
    {
      id: "1",
      projectId: "1",
      employeeId: "1",
      role: "프론트엔드 개발자",
      workload: 60,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      status: "active"
    },
    {
      id: "2",
      projectId: "1",
      employeeId: "3",
      role: "백엔드 개발자",
      workload: 50,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      status: "active"
    },
    {
      id: "3",
      projectId: "2",
      employeeId: "2",
      role: "UI/UX 디자이너",
      workload: 70,
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      status: "active"
    }
  ]);

  // 직원별 총 업무량 계산
  const getEmployeeTotalWorkload = (employeeId: number) => {
    return assignments
      .filter(a => a.employeeId === employeeId.toString() && a.status === "active")
      .reduce((sum, a) => sum + a.workload, 0);
  };

  // 프로젝트별 배정된 인력 정보
  const getProjectAssignments = (projectId: string) => {
    return assignments.filter(a => a.projectId === projectId && a.status === "active");
  };

  // 필터링된 직원 목록
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "전체" || emp.department === selectedDepartment;
    const isActive = emp.status === "재직중";
    
    return matchesSearch && matchesDepartment && isActive;
  });

  // 직원 상세 정보 표시
  const openEmployeeDetail = (employee: any) => {
    const workload = getEmployeeTotalWorkload(employee.id);
    const employeeAssignments = assignments.filter(a => a.employeeId === employee.id.toString());
    
    setSelectedEmployee({
      ...employee,
      workload,
      assignments: employeeAssignments
    });
    setIsEmployeeDetailOpen(true);
  };

  // 프로젝트에 인력 배정
  const handleAssignEmployee = () => {
    if (!assignmentForm.employeeId || !selectedProject) {
      toast.error("직원을 선택해주세요.");
      return;
    }

    if (!assignmentForm.role) {
      toast.error("역할을 입력해주세요.");
      return;
    }

    const employee = employees.find(emp => emp.id.toString() === assignmentForm.employeeId);
    if (!employee) return;

    // 중복 배정 체크
    const existingAssignment = assignments.find(a => 
      a.projectId === selectedProject.id.toString() && 
      a.employeeId === assignmentForm.employeeId &&
      a.status === "active"
    );

    if (existingAssignment) {
      toast.error("이미 이 프로젝트에 배정된 직원입니다.");
      return;
    }

    // 업무량 체크
    const currentWorkload = getEmployeeTotalWorkload(parseInt(assignmentForm.employeeId));
    if (currentWorkload + assignmentForm.workload > 100) {
      toast.error(`업무량이 초과됩니다. (현재: ${currentWorkload}%, 추가: ${assignmentForm.workload}%)`);
      return;
    }

    const newAssignment: ProjectAssignment = {
      id: Date.now().toString(),
      projectId: selectedProject.id.toString(),
      employeeId: assignmentForm.employeeId,
      role: assignmentForm.role,
      workload: assignmentForm.workload,
      startDate: assignmentForm.startDate,
      endDate: assignmentForm.endDate,
      status: "active",
      notes: assignmentForm.notes
    };

    setAssignments([...assignments, newAssignment]);

    // 프로젝트 멤버 목록 업데이트
    const updatedProjects = projects.map(proj => 
      proj.id === selectedProject.id
        ? { 
            ...proj, 
            members: proj.members?.includes(employee.name) 
              ? proj.members 
              : [...(proj.members || []), employee.name]
          }
        : proj
    );
    setProjects(updatedProjects);

    toast.success(`${employee.name}님이 ${selectedProject.name} 프로젝트에 배정되었습니다.`);
    setIsAssignmentDialogOpen(false);
    resetAssignmentForm();
  };

  // 인력 배정 해제
  const handleRemoveAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const employee = employees.find(emp => emp.id.toString() === assignment.employeeId);
    const project = projects.find(proj => proj.id.toString() === assignment.projectId);

    setAssignments(assignments.filter(a => a.id !== assignmentId));

    // 프로젝트 멤버 목록에서 제거
    if (employee && project) {
      const updatedProjects = projects.map(proj => 
        proj.id.toString() === assignment.projectId
          ? { 
              ...proj, 
              members: proj.members?.filter(name => name !== employee.name) || []
            }
          : proj
      );
      setProjects(updatedProjects);
      toast.success(`${employee.name}님의 배정이 해제되었습니다.`);
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      employeeId: "",
      role: "",
      workload: 40,
      startDate: "",
      endDate: "",
      notes: ""
    });
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "bg-red-500";
    if (workload >= 80) return "bg-orange-500";
    if (workload >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getWorkloadBadgeColor = (workload: number) => {
    if (workload >= 90) return "bg-red-100 text-red-700 border-red-200";
    if (workload >= 80) return "bg-orange-100 text-orange-700 border-orange-200";
    if (workload >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  if (currentPage === "resource-management") {
    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">인력 배정 관리</h1>
            <p className="text-muted-foreground">프로젝트별 인력 배정 및 업무량을 관리할 수 있습니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="projects">프로젝트별</TabsTrigger>
                <TabsTrigger value="employees">직원별</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">총 인력</p>
                  <p className="text-2xl font-bold">{employees.filter(e => e.status === "재직중").length}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">가용 인력</p>
                  <p className="text-2xl font-bold">
                    {employees.filter(e => e.status === "재직중" && getEmployeeTotalWorkload(e.id) < 80).length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">업무 과중</p>
                  <p className="text-2xl font-bold">
                    {employees.filter(e => e.status === "재직중" && getEmployeeTotalWorkload(e.id) >= 90).length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">평균 업무량</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      employees
                        .filter(e => e.status === "재직중")
                        .reduce((sum, emp) => sum + getEmployeeTotalWorkload(emp.id), 0) / 
                      employees.filter(e => e.status === "재직중").length
                    )}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <TabsContent value="projects" className="space-y-6">
            {/* 프로젝트별 뷰 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">프로젝트별 인력 배정</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map(project => {
                  const projectAssignments = getProjectAssignments(project.id.toString());
                  const totalWorkload = projectAssignments.reduce((sum, a) => sum + a.workload, 0);
                  
                  return (
                    <Card key={project.id} className="hover:shadow-sm transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{project.team}</p>
                          </div>
                          <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                            {projectAssignments.length}명 배정
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>진행률: {project.progress}%</span>
                          <span>마감: {project.deadline}</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-pastel-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* 배정된 인력 목록 */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">배정 인력</h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProject(project);
                                resetAssignmentForm();
                                setIsAssignmentDialogOpen(true);
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              추가
                            </Button>
                          </div>
                          
                          {projectAssignments.length > 0 ? (
                            <div className="space-y-2">
                              {projectAssignments.map(assignment => {
                                const employee = employees.find(emp => emp.id.toString() === assignment.employeeId);
                                if (!employee) return null;
                                
                                return (
                                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={employee.profileImage} alt={employee.name} />
                                        <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xs">
                                          {employee.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium text-sm">{employee.name}</p>
                                        <p className="text-xs text-muted-foreground">{assignment.role}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {assignment.workload}%
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleRemoveAssignment(assignment.id)}
                                      >
                                        <UserMinus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                              배정된 인력이 없습니다
                            </div>
                          )}
                        </div>

                        {/* 프로젝트 요구사항 */}
                        <div className="pt-3 border-t">
                          <h4 className="font-medium text-sm mb-2">필요 역할</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.requiredSkills?.map((skill: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            )) || (
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">개발자</Badge>
                                <Badge variant="outline" className="text-xs">디자이너</Badge>
                                <Badge variant="outline" className="text-xs">기획자</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            {/* 직원별 뷰 */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="직원명 또는 직책으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체 부서</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(employee => {
                  const totalWorkload = getEmployeeTotalWorkload(employee.id);
                  const employeeAssignments = assignments.filter(a => a.employeeId === employee.id.toString());
                  
                  return (
                    <Card 
                      key={employee.id} 
                      className="hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => openEmployeeDetail(employee)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={employee.profileImage} alt={employee.name} />
                            <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                              {employee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                            <p className="text-xs text-muted-foreground">{employee.department}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={getWorkloadBadgeColor(totalWorkload)}>
                              {totalWorkload}%
                            </Badge>
                          </div>
                        </div>

                        {/* 업무량 게이지 */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>업무량</span>
                            <span className="font-medium">{totalWorkload}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getWorkloadColor(totalWorkload)}`}
                              style={{ width: `${Math.min(totalWorkload, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* 참여 프로젝트 */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">참여 프로젝트</p>
                          {employeeAssignments.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {employeeAssignments.slice(0, 2).map(assignment => {
                                const project = projects.find(p => p.id.toString() === assignment.projectId);
                                return project ? (
                                  <Badge key={assignment.id} variant="outline" className="text-xs">
                                    {project.name}
                                  </Badge>
                                ) : null;
                              })}
                              {employeeAssignments.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{employeeAssignments.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                              배정 가능
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 인력 배정 다이얼로그 */}
        <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
          <DialogContent className="max-w-2xl" aria-describedby="assignment-dialog-description">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-pastel-blue-600" />
                인력 배정 - {selectedProject?.name}
              </DialogTitle>
              <DialogDescription id="assignment-dialog-description">
                프로젝트에 적합한 인력을 배정해주세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedProject && (
                <div className="p-4 bg-pastel-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedProject.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{selectedProject.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>팀: {selectedProject.team}</span>
                    <span>마감: {selectedProject.deadline}</span>
                    <span>진행률: {selectedProject.progress}%</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>직원 선택 *</Label>
                  <Select 
                    value={assignmentForm.employeeId} 
                    onValueChange={(value) => setAssignmentForm({...assignmentForm, employeeId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="직원 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter(emp => emp.status === "재직중")
                        .map(emp => {
                          const workload = getEmployeeTotalWorkload(emp.id);
                          return (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              <div className="flex items-center justify-between w-full">
                                <span>{emp.name} ({emp.department})</span>
                                <Badge variant="outline" className={`ml-2 text-xs ${getWorkloadBadgeColor(workload)}`}>
                                  {workload}%
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>역할/담당업무 *</Label>
                  <Input
                    placeholder="예: 프론트엔드 개발자, UI 디자이너"
                    value={assignmentForm.role}
                    onChange={(e) => setAssignmentForm({...assignmentForm, role: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>업무 배정율 (%)</Label>
                <div className="px-3">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={assignmentForm.workload}
                    onChange={(e) => setAssignmentForm({...assignmentForm, workload: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>10%</span>
                    <span className="font-medium">{assignmentForm.workload}%</span>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={assignmentForm.startDate}
                    onChange={(e) => setAssignmentForm({...assignmentForm, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    value={assignmentForm.endDate}
                    onChange={(e) => setAssignmentForm({...assignmentForm, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>특이사항</Label>
                <Textarea
                  placeholder="배정 시 고려사항이나 특이사항을 입력하세요"
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm({...assignmentForm, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsAssignmentDialogOpen(false);
                  resetAssignmentForm();
                }}
              >
                취소
              </Button>
              <Button 
                className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={handleAssignEmployee}
              >
                <Save className="h-4 w-4 mr-2" />
                배정
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 직원 상세 정보 다이얼로그 */}
        <Dialog open={isEmployeeDetailOpen} onOpenChange={setIsEmployeeDetailOpen}>
          <DialogContent className="max-w-3xl" aria-describedby="employee-detail-description">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-pastel-blue-600" />
                직원 상세 정보
              </DialogTitle>
              <DialogDescription id="employee-detail-description">
                직원의 현재 업무 배정 현황과 상세 정보를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="flex items-center gap-4 p-4 bg-pastel-blue-50 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedEmployee.profileImage} alt={selectedEmployee.name} />
                    <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-lg">
                      {selectedEmployee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{selectedEmployee.name}</h3>
                    <p className="text-muted-foreground">{selectedEmployee.position}</p>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.department}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getWorkloadBadgeColor(selectedEmployee.workload)}>
                      총 업무량: {selectedEmployee.workload}%
                    </Badge>
                  </div>
                </div>

                {/* 현재 프로젝트 배정 현황 */}
                <div>
                  <h4 className="font-medium mb-4">현재 프로젝트 배정</h4>
                  {selectedEmployee.assignments && selectedEmployee.assignments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEmployee.assignments.map((assignment: any) => {
                        const project = projects.find(p => p.id.toString() === assignment.projectId);
                        if (!project) return null;

                        return (
                          <div key={assignment.id} className="p-4 border border-pastel-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{project.name}</h5>
                              <Badge variant="outline">{assignment.workload}%</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{assignment.role}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>시작: {assignment.startDate}</span>
                              <span>종료: {assignment.endDate}</span>
                              <span>상태: {assignment.status === "active" ? "진행중" : "대기"}</span>
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-muted-foreground mt-2 p-2 bg-gray-50 rounded">
                                {assignment.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      현재 배정된 프로젝트가 없습니다.
                    </div>
                  )}
                </div>

                {/* 스킬 및 경력 */}
                <div>
                  <h4 className="font-medium mb-4">스킬 및 역량</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">보유 스킬</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedEmployee.skills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        )) || (
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">React</Badge>
                            <Badge variant="outline" className="text-xs">TypeScript</Badge>
                            <Badge variant="outline" className="text-xs">Node.js</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">경력</p>
                      <p className="text-sm">{selectedEmployee.experience || "3년 6개월"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEmployeeDetailOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}