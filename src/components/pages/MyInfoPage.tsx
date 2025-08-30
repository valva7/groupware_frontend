import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { 
  User, 
  Edit, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Camera, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  FolderOpen,
  Users,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MyInfoPageProps {
  currentPage: string;
  currentUser: any;
  setCurrentUser?: (user: any) => void;
}

interface MyProject {
  id: number;
  name: string;
  description: string;
  role: string;
  allocation: number; // 투입률 (%)
  progress: number;
  status: "진행중" | "완료" | "지연" | "예정";
  startDate: string;
  endDate: string;
  team: string;
  manager: string;
  budget: string;
  tasks: Array<{
    name: string;
    progress: number;
    dueDate: string;
    priority: "높음" | "보통" | "낮음";
  }>;
  milestones: Array<{
    name: string;
    date: string;
    status: "완료" | "진행중" | "예정";
    description: string;
  }>;
  teamMembers: Array<{
    name: string;
    role: string;
    department: string;
  }>;
}

export function MyInfoPage({
  currentPage,
  currentUser,
  setCurrentUser
}: MyInfoPageProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MyProject | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address || "",
    emergencyContact: currentUser.emergencyContact || "",
    birthday: currentUser.birthday || ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "ko",
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false
  });

  // 내가 참여중인 프로젝트 목록
  const myProjects: MyProject[] = [
    {
      id: 1,
      name: "모바일 앱 리뉴얼",
      description: "기존 모바일 앱의 UI/UX를 개선하고 새로운 기능을 추가하는 프로젝트입니다.",
      role: "프로젝트 매니저",
      allocation: 50,
      progress: 75,
      status: "진행중",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      team: "개발팀",
      manager: "김철수",
      budget: "5,000만원",
      tasks: [
        {
          name: "프로젝트 관리",
          progress: 80,
          dueDate: "2024-04-15",
          priority: "높음"
        },
        {
          name: "기술 리뷰",
          progress: 70,
          dueDate: "2024-04-10",
          priority: "보통"
        },
        {
          name: "품질 관리",
          progress: 60,
          dueDate: "2024-04-12",
          priority: "보통"
        }
      ],
      milestones: [
        {
          name: "요구사항 분석 완료",
          date: "2024-02-01",
          status: "완료",
          description: "사용자 요구사항 분석 및 기능 정의 완료"
        },
        {
          name: "UI/UX 디자인 완료",
          date: "2024-02-28",
          status: "완료",
          description: "새로운 디자인 시스템 적용 및 화면 설계 완료"
        },
        {
          name: "개발 75% 완료",
          date: "2024-03-25",
          status: "진행중",
          description: "핵심 기능 개발 및 테스트 진행 중"
        },
        {
          name: "베타 테스트",
          date: "2024-04-05",
          status: "예정",
          description: "내부 베타 테스트 및 버그 수정"
        }
      ],
      teamMembers: [
        { name: "김철수", role: "프로젝트 매니저", department: "개발팀" },
        { name: "임수진", role: "시니어 개발자", department: "개발팀" },
        { name: "오태현", role: "주니어 개발자", department: "개발팀" }
      ]
    },
    {
      id: 4,
      name: "웹사이트 개편",
      description: "회사 홈페이지의 전체적인 리뉴얼 프로젝트입니다.",
      role: "팀원",
      allocation: 30,
      progress: 60,
      status: "진행중",
      startDate: "2024-01-20",
      endDate: "2024-04-30",
      team: "디자인팀",
      manager: "이영희",
      budget: "4,000만원",
      tasks: [
        {
          name: "프로젝트 지원",
          progress: 65,
          dueDate: "2024-04-30",
          priority: "보통"
        },
        {
          name: "품질 검수",
          progress: 40,
          dueDate: "2024-04-25",
          priority: "보통"
        }
      ],
      milestones: [
        {
          name: "웹사이트 기획 완료",
          date: "2024-02-15",
          status: "완료",
          description: "사이트맵 및 와이어프레임 완료"
        },
        {
          name: "디자인 시스템 구축",
          date: "2024-03-15",
          status: "완료",
          description: "컬러, 타이포그래피, 컴포넌트 정의"
        },
        {
          name: "주요 페이지 디자인",
          date: "2024-04-10",
          status: "진행중",
          description: "메인 페이지 및 서브 페이지 디자인 진행"
        },
        {
          name: "반응형 최적화",
          date: "2024-04-25",
          status: "예정",
          description: "모바일 및 태블릿 최적화"
        }
      ],
      teamMembers: [
        { name: "이영희", role: "디자인 팀장", department: "디자인팀" },
        { name: "한소연", role: "UI/UX 디자이너", department: "디자인팀" }
      ]
    }
  ];

  const handleProjectClick = (project: MyProject) => {
    setSelectedProject(project);
    setIsProjectDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중": return "bg-blue-100 text-blue-700";
      case "완료": return "bg-green-100 text-green-700";
      case "지연": return "bg-red-100 text-red-700";
      case "예정": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "완료": return "bg-green-100 text-green-700";
      case "진행중": return "bg-blue-100 text-blue-700";
      case "예정": return "bg-gray-100 text-gray-700";
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

  if (currentPage === "my-info") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">내 정보</h1>
            <p className="text-muted-foreground">개인 정보와 계정 설정을 관리할 수 있습니다.</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="projects">내 프로젝트</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="preferences">환경설정</TabsTrigger>
          </TabsList>

          {/* 프로필 탭 */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  기본 정보
                </CardTitle>
                <CardDescription>
                  프로필 사진과 기본 정보를 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 프로필 사진 섹션 */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
                      <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-2xl">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      onClick={() => {
                        toast.success("프로필 사진을 변경했습니다.");
                      }}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-medium">{currentUser.name}</h3>
                    <p className="text-muted-foreground">{currentUser.department} • {currentUser.position}</p>
                    <Badge variant="outline" className="mt-2 bg-green-100 text-green-700">
                      {currentUser.status}
                    </Badge>
                  </div>
                  <div className="flex-1 sm:flex sm:justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setProfileForm({
                          name: currentUser.name,
                          email: currentUser.email,
                          phone: currentUser.phone,
                          address: currentUser.address || "",
                          emergencyContact: currentUser.emergencyContact || "",
                          birthday: currentUser.birthday || ""
                        });
                        setIsEditProfileOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      프로필 수정
                    </Button>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">이메일</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">전화번호</p>
                        <p className="font-medium">{currentUser.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">주소</p>
                        <p className="font-medium">{currentUser.address || "주소가 등록되지 않았습니다."}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">입사일</p>
                        <p className="font-medium">{currentUser.joinDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">근무 년차</p>
                        <p className="font-medium">{new Date().getFullYear() - new Date(currentUser.joinDate).getFullYear() + 1}년차</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">비상연락처</p>
                        <p className="font-medium">{currentUser.emergencyContact || "등록되지 않았습니다."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 내 프로젝트 탭 */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  참여 중인 프로젝트
                  <Badge variant="outline" className="ml-2">
                    {myProjects.length}개
                  </Badge>
                </CardTitle>
                <CardDescription>
                  현재 참여하고 있는 프로젝트 목록과 진행 상황을 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myProjects.map((project) => (
                    <div 
                      key={project.id}
                      className="p-4 bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium group-hover:text-pastel-blue-600 transition-colors">
                              {project.name}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{project.team}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              <span>{project.role}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>{project.allocation}% 투입</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-pastel-blue-600 mb-1">
                            {project.progress}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            진행률
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">프로젝트 진행률</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-3 pt-3 border-t border-pastel-blue-200">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{project.startDate} ~ {project.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>PM: {project.manager}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {myProjects.length === 0 && (
                    <div className="text-center py-12">
                      <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">
                        참여 중인 프로젝트가 없습니다
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        새로운 프로젝트에 참여하시면 여기에 표시됩니다.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 보안 탭 */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  계정 보안
                </CardTitle>
                <CardDescription>
                  비밀번호 변경 및 계정 보안을 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">비밀번호</h4>
                    <p className="text-sm text-muted-foreground">마지막 변경: 30일 전</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    비밀번호 변경
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">2단계 인증</h4>
                    <p className="text-sm text-muted-foreground">계정 보안을 강화하세요</p>
                  </div>
                  <Button variant="outline">
                    설정
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">로그인 기록</h4>
                    <p className="text-sm text-muted-foreground">최근 로그인 활동을 확인하세요</p>
                  </div>
                  <Button variant="outline">
                    확인
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 알림 탭 */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  알림 설정
                </CardTitle>
                <CardDescription>
                  받고 싶은 알림 유형을 선택할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">이메일 알림</h4>
                      <p className="text-sm text-muted-foreground">중요한 업데이트를 이메일로 받습니다</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">푸시 알림</h4>
                      <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">사운드 알림</h4>
                      <p className="text-sm text-muted-foreground">알림 시 사운드를 재생합니다</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.soundNotifications}
                      onChange={(e) => setPreferences({...preferences, soundNotifications: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <Button 
                  className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  onClick={() => {
                    toast.success("알림 설정이 저장되었습니다.");
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  설정 저장
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 환경설정 탭 */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  환경 설정
                </CardTitle>
                <CardDescription>
                  개인 맞춤 설정을 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">테마</h4>
                      <p className="text-sm text-muted-foreground">라이트/다크 모드를 선택하세요</p>
                    </div>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                      className="px-3 py-1 border rounded"
                    >
                      <option value="light">라이트</option>
                      <option value="dark">다크</option>
                      <option value="auto">자동</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">언어</h4>
                      <p className="text-sm text-muted-foreground">시스템 언어를 선택하세요</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                        className="px-3 py-1 border rounded"
                      >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2">계정 통계</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">가입일:</span>
                        <span className="ml-2 font-medium">{currentUser.joinDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">마지막 로그인:</span>
                        <span className="ml-2 font-medium">방금 전</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  onClick={() => {
                    toast.success("환경 설정이 저장되었습니다.");
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  설정 저장
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 프로젝트 상세보기 팝업 */}
        <Dialog open={isProjectDetailOpen} onOpenChange={setIsProjectDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-pastel-blue-600" />
                프로젝트 상세 정보
              </DialogTitle>
              <DialogDescription>
                선택된 프로젝트의 상세 정보와 진행 상황을 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6">
                {/* 프로젝트 기본 정보 */}
                <div className="p-4 bg-pastel-blue-50 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
                        <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
                          {selectedProject.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-white">
                          {selectedProject.team}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {selectedProject.budget}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {selectedProject.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>시작: {selectedProject.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>완료 예정: {selectedProject.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{selectedProject.description}</p>

                  {/* 투입률 및 진행률 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">내 투입률</span>
                        <span className="text-sm font-medium">{selectedProject.allocation}%</span>
                      </div>
                      <Progress value={selectedProject.allocation} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">전체 진행률</span>
                        <span className="text-sm font-medium">{selectedProject.progress}%</span>
                      </div>
                      <Progress value={selectedProject.progress} className="h-2" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 팀 구성원 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-pastel-blue-600" />
                    <h4 className="font-medium">팀 구성원</h4>
                    <Badge variant="outline">
                      {selectedProject.teamMembers.length}명
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white border border-pastel-blue-200 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{member.name}</span>
                            {member.name === currentUser.name && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                나
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.department} · {member.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 마일스톤 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-pastel-blue-600" />
                    <h4 className="font-medium">마일스톤</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedProject.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white border border-pastel-blue-200 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-pastel-blue-100 text-pastel-blue-700 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{milestone.name}</span>
                            <Badge variant="outline" className={getMilestoneStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{milestone.description}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{milestone.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 내 담당 업무 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-pastel-blue-600" />
                    <h4 className="font-medium">내 담당 업무</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedProject.tasks.map((task, index) => (
                      <div key={index} className="p-3 bg-white border border-pastel-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{task.name}</span>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>마감: {task.dueDate}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">진행률</span>
                            <span className="text-sm font-medium">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 프로필 편집 팝업 */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-pastel-blue-600" />
                프로필 수정
              </DialogTitle>
              <DialogDescription>
                개인 정보를 수정해주세요.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">이름</Label>
                  <Input
                    id="profile-name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">이메일</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">전화번호</Label>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-emergency">비상연락처</Label>
                  <Input
                    id="profile-emergency"
                    value={profileForm.emergencyContact}
                    onChange={(e) => setProfileForm({...profileForm, emergencyContact: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-address">주소</Label>
                <Input
                  id="profile-address"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-birthday">생년월일</Label>
                <Input
                  id="profile-birthday"
                  type="date"
                  value={profileForm.birthday}
                  onChange={(e) => setProfileForm({...profileForm, birthday: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsEditProfileOpen(false)}
              >
                취소
              </Button>
              <Button 
                className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  if (setCurrentUser) {
                    setCurrentUser({
                      ...currentUser,
                      ...profileForm
                    });
                  }
                  toast.success("프로필이 업데이트되었습니다!");
                  setIsEditProfileOpen(false);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 비밀번호 변경 팝업 */}
        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-pastel-blue-600" />
                비밀번호 변경
              </DialogTitle>
              <DialogDescription>
                새로운 비밀번호를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
              >
                취소
              </Button>
              <Button 
                className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
                    toast.error("모든 필드를 입력해주세요.");
                    return;
                  }
                  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    toast.error("새 비밀번호가 일치하지 않습니다.");
                    return;
                  }
                  
                  toast.success("비밀번호가 변경되었습니다!");
                  setIsChangePasswordOpen(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                변경
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}