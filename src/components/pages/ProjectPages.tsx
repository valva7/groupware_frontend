import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FolderPlus, ArrowLeft, Edit, Save, Paperclip, Upload, X, Download, Users, BarChart3, Eye, UserPlus, Trash2, FileText, Image, Archive } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { getFileIcon, formatFileSize } from "../../utils/helpers";

interface ProjectPagesProps {
  currentPage: string;
  projects: any[];
  setProjects: (projects: any[]) => void;
  employees: any[];
  departments: any[];
  selectedProject: any;
  setSelectedProject: (project: any) => void;
  setCurrentPage: (page: string) => void;
  projectForm: any;
  setProjectForm: (form: any) => void;
}

export function ProjectPages({
  currentPage,
  projects,
  setProjects,
  employees,
  departments,
  selectedProject,
  setSelectedProject,
  setCurrentPage,
  projectForm,
  setProjectForm
}: ProjectPagesProps) {
  // 팝업 상태 관리
  const [isMemberManagementOpen, setIsMemberManagementOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // 프로젝트 멤버 업데이트
  const updateProjectMembers = (newMembers: string[]) => {
    if (selectedProject) {
      const updatedProject = { ...selectedProject, members: newMembers };
      setSelectedProject(updatedProject);
      const updatedProjects = projects.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      );
      setProjects(updatedProjects);
    }
  };

  // 프로젝트 파일 업데이트
  const updateProjectFiles = (newFiles: any[]) => {
    if (selectedProject) {
      const updatedProject = { ...selectedProject, files: [...(selectedProject.files || []), ...newFiles] };
      setSelectedProject(updatedProject);
      const updatedProjects = projects.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      );
      setProjects(updatedProjects);
    }
  };

  // 드래그앤드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(prev => [...prev, ...files]);
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMemberManagement = () => {
    setSelectedMembers(selectedProject?.members || []);
    setIsMemberManagementOpen(true);
  };

  const handleFileUpload = () => {
    setUploadFiles([]);
    setIsFileUploadOpen(true);
  };

  const saveMemberChanges = () => {
    updateProjectMembers(selectedMembers);
    setIsMemberManagementOpen(false);
    toast.success("팀 멤버가 업데이트되었습니다.");
  };

  const saveFileUploads = () => {
    const newFiles = uploadFiles.map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0]
    }));
    
    updateProjectFiles(newFiles);
    setUploadFiles([]);
    setIsFileUploadOpen(false);
    toast.success(`${newFiles.length}개 파일이 업로드되었습니다.`);
  };

  if (currentPage === "project-create") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">프로젝트 생성</h1>
            <p className="text-muted-foreground">새로운 프로젝트를 생성하고 관리할 수 있습니다.</p>
          </div>
          <Button 
            className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
            onClick={() => {
              setProjectForm({
                name: "", description: "", template: "", manager: "", 
                team: "", startDate: "", endDate: "", budget: "", files: []
              });
              setCurrentPage("project-create-form");
            }}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            새 프로젝트 생성
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">프로젝트 템플릿</h3>
            <div className="space-y-3">
              <div 
                className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setProjectForm({
                    name: "", description: "웹사이트 및 웹 애플리케이션 개발 프로젝트", 
                    template: "web", manager: "", team: "개발팀", 
                    startDate: "", endDate: "", budget: "", files: []
                  });
                  setCurrentPage("project-create-form");
                }}
              >
                <h4 className="font-medium">웹 개발 프로젝트</h4>
                <p className="text-sm text-muted-foreground">웹사이트 및 웹 애플리케이션 개발</p>
              </div>
              <div 
                className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setProjectForm({
                    name: "", description: "마케팅 활동 및 홍보 캠페인 프로젝트", 
                    template: "marketing", manager: "", team: "마케팅팀", 
                    startDate: "", endDate: "", budget: "", files: []
                  });
                  setCurrentPage("project-create-form");
                }}
              >
                <h4 className="font-medium">마케팅 캠페인</h4>
                <p className="text-sm text-muted-foreground">마케팅 활동 및 홍보 캠페인</p>
              </div>
              <div 
                className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setProjectForm({
                    name: "", description: "신제품 기획 및 개발 프로젝트", 
                    template: "product", manager: "", team: "기획팀", 
                    startDate: "", endDate: "", budget: "", files: []
                  });
                  setCurrentPage("project-create-form");
                }}
              >
                <h4 className="font-medium">제품 개발</h4>
                <p className="text-sm text-muted-foreground">신제품 기획 및 개발</p>
              </div>
              <div 
                className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setProjectForm({
                    name: "", description: "사용자 정의 프로젝트", 
                    template: "custom", manager: "", team: "", 
                    startDate: "", endDate: "", budget: "", files: []
                  });
                  setCurrentPage("project-create-form");
                }}
              >
                <h4 className="font-medium">사용자 정의</h4>
                <p className="text-sm text-muted-foreground">직접 설정하는 프로젝트</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">최근 생성된 프로젝트</h3>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div 
                  key={project.id}
                  className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedProject(project);
                    setCurrentPage("project-detail");
                  }}
                >
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">진행률: {project.progress}% • 마감: {project.deadline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "project-create-form") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">프로젝트 생성</h1>
            <p className="text-muted-foreground">
              {projectForm.template === "web" ? "웹 개발 프로젝트" :
               projectForm.template === "marketing" ? "마케팅 캠페인 프로젝트" :
               projectForm.template === "product" ? "제품 개발 프로젝트" :
               "새 프로젝트"} 정보를 입력해주세요.
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage("project-create")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로 가기
          </Button>
        </div>

        <div className="max-w-4xl">
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">프로젝트 명</Label>
                  <Input
                    id="project-name"
                    placeholder="프로젝트 이름을 입력하세요"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-template">템플릿</Label>
                  <Select value={projectForm.template} onValueChange={(value) => setProjectForm({...projectForm, template: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="템플릿 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">웹 개발</SelectItem>
                      <SelectItem value="marketing">마케팅 캠페인</SelectItem>
                      <SelectItem value="product">제품 개발</SelectItem>
                      <SelectItem value="custom">사용자 정의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">프로젝트 설명</Label>
                <Textarea
                  id="project-description"
                  placeholder="프로젝트에 대한 설명을 입력하세요"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-manager">프로젝트 매니저</Label>
                  <Select value={projectForm.manager} onValueChange={(value) => setProjectForm({...projectForm, manager: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="매니저 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter(emp => emp.position.includes("팀장")).map(emp => (
                        <SelectItem key={emp.id} value={emp.name}>{emp.name} ({emp.department})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-team">담당 팀</Label>
                  <Select value={projectForm.team} onValueChange={(value) => setProjectForm({...projectForm, team: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="팀 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-start">시작일</Label>
                  <Input
                    id="project-start"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-end">종료일</Label>
                  <Input
                    id="project-end"
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-budget">예산</Label>
                  <Input
                    id="project-budget"
                    placeholder="예산 (만원)"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                  />
                </div>
              </div>

              {/* 파일 첨부 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-pastel-blue-600" />
                  <Label>프로젝트 관련 파일</Label>
                </div>
                
                <div className="border-2 border-dashed border-pastel-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-pastel-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      파일을 드래그하거나 클릭해서 업로드하세요
                    </p>
                    <Input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setProjectForm({...projectForm, files: [...projectForm.files, ...files]});
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      파일 선택
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, DOC, XLS, PPT, 이미지 파일 지원 (최대 10MB)
                    </p>
                  </div>
                </div>

                {/* 업로드된 파일 목록 */}
                {projectForm.files.length > 0 && (
                  <div className="space-y-2">
                    <Label>업로드된 파일 ({projectForm.files.length}개)</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {projectForm.files.map((file: File, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-white border border-pastel-blue-200 rounded-lg">
                          {getFileIcon(file.name)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFiles = projectForm.files.filter((_: File, i: number) => i !== index);
                              setProjectForm({...projectForm, files: newFiles});
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setProjectForm({
                      name: "", description: "", template: "", manager: "", 
                      team: "", startDate: "", endDate: "", budget: "", files: []
                    });
                    setCurrentPage("project-create");
                  }}
                >
                  취소
                </Button>
                <Button 
                  className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  onClick={() => {
                    if (!projectForm.name) {
                      toast.error("프로젝트 이름을 입력해주세요.");
                      return;
                    }
                    
                    // 새 프로젝트 생성
                    const newProject = {
                      id: projects.length + 1,
                      name: projectForm.name,
                      description: projectForm.description,
                      status: "진행 중",
                      progress: 0,
                      team: projectForm.team,
                      manager: projectForm.manager,
                      deadline: projectForm.endDate,
                      startDate: projectForm.startDate,
                      budget: projectForm.budget + (projectForm.budget ? "만원" : ""),
                      members: [projectForm.manager].filter(Boolean),
                      tasks: [],
                      files: projectForm.files.map((file: File) => ({
                        name: file.name,
                        size: formatFileSize(file.size),
                        type: file.type,
                        uploadDate: new Date().toISOString().split('T')[0]
                      }))
                    };
                    
                    setProjects([...projects, newProject]);
                    toast.success(`"${projectForm.name}" 프로젝트가 생성되었습니다!`);
                    
                    // 생성된 프로젝트 상세 페이지로 이동
                    setSelectedProject(newProject);
                    setCurrentPage("project-detail");
                    
                    // 폼 초기화
                    setProjectForm({
                      name: "", description: "", template: "", manager: "", 
                      team: "", startDate: "", endDate: "", budget: "", files: []
                    });
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  프로젝트 생성
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "project-status") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">프로젝트 현황</h1>
            <p className="text-muted-foreground">모든 프로젝트의 진행 상황을 확인할 수 있습니다.</p>
          </div>
          <Button 
            className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
            onClick={() => setCurrentPage("project-create")}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            새 프로젝트 생성
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 프로젝트</CardTitle>
              <FolderPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{projects.length}</div>
              <p className="text-xs text-muted-foreground">전체 프로젝트 수</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행 중</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{projects.filter(p => p.status === "진행 중").length}</div>
              <p className="text-xs text-muted-foreground">활발히 진행 중인 프로젝트</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">지연된 프로젝트</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-700 h-4 w-4 rounded-full p-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{projects.filter(p => p.status === "지연").length}</div>
              <p className="text-xs text-muted-foreground">일정이 지연된 프로젝트</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 진행률</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
              </div>
              <p className="text-xs text-muted-foreground">전체 프로젝트 평균</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedProject(project);
                setCurrentPage("project-detail");
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{project.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={
                        project.status === "진행 중" ? "bg-green-100 text-green-700" :
                        project.status === "지연" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>팀: {project.team}</span>
                    <span>매니저: {project.manager}</span>
                    <span>마감: {project.deadline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium text-pastel-blue-600 mb-1">{project.progress}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pastel-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {project.members && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">팀 멤버:</span>
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member: string, idx: number) => (
                      <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xs">
                          {member.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{project.members.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentPage === "project-detail" && selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{selectedProject?.name}</h1>
            <p className="text-muted-foreground">{selectedProject?.description}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setCurrentPage("project-status")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
            <Button 
              className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
              onClick={() => {
                toast.info("프로젝트 수정 기능은 개발 중입니다.");
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              수정
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 프로젝트 개요 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">프로젝트 개요</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">담당팀</Label>
                    <p className="font-medium">{selectedProject.team}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">프로젝트 매니저</Label>
                    <p className="font-medium">{selectedProject.manager}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">예산</Label>
                    <p className="font-medium">{selectedProject.budget}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">시작일</Label>
                    <p className="font-medium">{selectedProject.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">마감일</Label>
                    <p className="font-medium">{selectedProject.deadline}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">진행률</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pastel-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{selectedProject.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 팀 멤버 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">팀 멤버</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMemberManagement}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  멤버 관리
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedProject.members?.map((memberName: string, index: number) => {
                  const member = employees.find(emp => emp.name === memberName);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-pastel-blue-200">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member?.profileImage} alt={memberName} />
                        <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                          {memberName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{memberName}</p>
                        <p className="text-sm text-muted-foreground">{member?.position}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 작업 목록 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">작업 목록</h3>
              <div className="space-y-2">
                {selectedProject.tasks?.length > 0 ? (
                  selectedProject.tasks.map((task: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-pastel-blue-200">
                      <input type="checkbox" className="rounded" />
                      <span>{task}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">등록된 작업이 없습니다.</p>
                )}
              </div>
            </div>

            {/* 프로젝트 파일 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">프로젝트 파일</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFileUpload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  파일 업로드
                </Button>
              </div>
              <div className="space-y-2">
                {selectedProject.files?.length > 0 ? (
                  selectedProject.files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-pastel-blue-200">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size} • {file.uploadDate}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">업로드된 파일이 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 상태 카드 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">프로젝트 상태</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge 
                    variant="outline" 
                    className={
                      selectedProject.status === "진행 중" ? "bg-green-100 text-green-700" :
                      selectedProject.status === "지연" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {selectedProject.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border border-pastel-blue-200">
                    <p className="text-sm text-muted-foreground">완료율</p>
                    <p className="text-lg font-medium text-pastel-blue-600">{selectedProject.progress}%</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-pastel-blue-200">
                    <p className="text-sm text-muted-foreground">남은 일수</p>
                    <p className="text-lg font-medium text-orange-600">
                      {Math.max(0, Math.ceil((new Date(selectedProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}일
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-pastel-blue-200">
                    <p className="text-sm text-muted-foreground">팀 멤버</p>
                    <p className="text-lg font-medium text-purple-600">{selectedProject.members?.length || 0}명</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">빠른 액션</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  진행률 업데이트
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  보고서 생성
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  프로젝트 아카이브
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 멤버 관리 팝업 */}
        <Dialog open={isMemberManagementOpen} onOpenChange={setIsMemberManagementOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-pastel-blue-600" />
                팀 멤버 관리
              </DialogTitle>
              <DialogDescription>
                프로젝트에 참여할 팀 멤버를 선택하세요.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {employees.map(employee => (
                  <div key={employee.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Checkbox
                      checked={selectedMembers.includes(employee.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMembers([...selectedMembers, employee.name]);
                        } else {
                          setSelectedMembers(selectedMembers.filter(name => name !== employee.name));
                        }
                      }}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.profileImage} alt={employee.name} />
                      <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                        {employee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.department} • {employee.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMemberManagementOpen(false)}>
                취소
              </Button>
              <Button onClick={saveMemberChanges} className="gap-2">
                <Save className="h-4 w-4" />
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 파일 업로드 팝업 */}
        <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-pastel-blue-600" />
                파일 업로드
              </DialogTitle>
              <DialogDescription>
                프로젝트 관련 파일을 업로드하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-pastel-blue-500 bg-pastel-blue-50' : 'border-pastel-blue-200'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-pastel-blue-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  파일을 드래그하거나 클릭해서 업로드하세요
                </p>
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload-dialog"
                  onChange={handleFileSelect}
                />
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('file-upload-dialog')?.click()}
                >
                  파일 선택
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF, DOC, XLS, PPT, 이미지 파일 지원 (최대 10MB)
                </p>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>선택된 파일 ({uploadFiles.length}개)</Label>
                  <ScrollArea className="h-[200px] border rounded-lg">
                    <div className="p-4 space-y-2">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                          {getFileIcon(file.name)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFileUploadOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={saveFileUploads}
                disabled={uploadFiles.length === 0}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                업로드
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // 기본 페이지
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">프로젝트 관리</h1>
        <p className="text-muted-foreground">프로젝트를 생성하고 관리할 수 있습니다.</p>
      </div>
    </div>
  );
}