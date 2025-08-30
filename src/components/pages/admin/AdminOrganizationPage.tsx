import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { Textarea } from "../../ui/textarea";
import { ScrollArea } from "../../ui/scroll-area";
import { Alert, AlertDescription } from "../../ui/alert";
import { 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  BarChart3,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Settings,
  MapPin
} from "lucide-react";
import { toast } from "sonner@2.0.3";

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
}

interface Employee {
  id: string;
  name: string;
  position: string;
  departmentId: string;
  email: string;
  phone: string;
  isManager: boolean;
}

const initialDepartments: Department[] = [
  {
    id: "company",
    name: "테크이노베이션",
    code: "COMP",
    description: "회사 전체",
    managerId: "ceo001",
    managerName: "최대표",
    level: 0,
    memberCount: 47,
    budget: 1000000000,
    location: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "info@company.com",
    isActive: true,
    children: [
      {
        id: "dev",
        name: "개발본부",
        code: "DEV",
        description: "소프트웨어 개발 및 기술 혁신을 담당하는 부서",
        managerId: "dev001",
        managerName: "김개발",
        parentId: "company",
        level: 1,
        memberCount: 18,
        budget: 300000000,
        location: "서울시 강남구 테헤란로 123, 5층",
        phone: "02-1234-5679",
        email: "dev@company.com",
        isActive: true,
        children: [
          {
            id: "frontend",
            name: "프론트엔드팀",
            code: "FE",
            description: "웹 프론트엔드 개발",
            managerId: "fe001",
            managerName: "박프론트",
            parentId: "dev",
            level: 2,
            memberCount: 8,
            budget: 120000000,
            location: "서울시 강남구 테헤란로 123, 5층 A구역",
            phone: "02-1234-5680",
            email: "frontend@company.com",
            isActive: true
          },
          {
            id: "backend",
            name: "백엔드팀",
            code: "BE",
            description: "서버 백엔드 개발",
            managerId: "be001",
            managerName: "이백엔드",
            parentId: "dev",
            level: 2,
            memberCount: 7,
            budget: 130000000,
            location: "서울시 강남구 테헤란로 123, 5층 B구역",
            phone: "02-1234-5681",
            email: "backend@company.com",
            isActive: true
          },
          {
            id: "mobile",
            name: "모바일팀",
            code: "MOB",
            description: "모바일 앱 개발",
            managerId: "mob001",
            managerName: "최모바일",
            parentId: "dev",
            level: 2,
            memberCount: 3,
            budget: 50000000,
            location: "서울시 강남구 테헤란로 123, 5층 C구역",
            phone: "02-1234-5682",
            email: "mobile@company.com",
            isActive: true
          }
        ]
      },
      {
        id: "design",
        name: "디자인팀",
        code: "DES",
        description: "UI/UX 디자인 및 브랜딩",
        managerId: "des001",
        managerName: "박디자인",
        parentId: "company",
        level: 1,
        memberCount: 6,
        budget: 80000000,
        location: "서울시 강남구 테헤란로 123, 6층",
        phone: "02-1234-5683",
        email: "design@company.com",
        isActive: true
      },
      {
        id: "marketing",
        name: "마케팅팀",
        code: "MKT",
        description: "마케팅 및 홍보",
        managerId: "mkt001",
        managerName: "이마케팅",
        parentId: "company",
        level: 1,
        memberCount: 8,
        budget: 150000000,
        location: "서울시 강남구 테헤란로 123, 7층",
        phone: "02-1234-5684",
        email: "marketing@company.com",
        isActive: true
      },
      {
        id: "sales",
        name: "영업팀",
        code: "SALES",
        description: "영업 및 고객 관리",
        managerId: "sales001",
        managerName: "최영업",
        parentId: "company",
        level: 1,
        memberCount: 10,
        budget: 200000000,
        location: "서울시 강남구 테헤란로 123, 8층",
        phone: "02-1234-5685",
        email: "sales@company.com",
        isActive: true
      },
      {
        id: "admin",
        name: "관리팀",
        code: "ADMIN",
        description: "인사, 총무, 재무 업무",
        managerId: "admin001",
        managerName: "정관리",
        parentId: "company",
        level: 1,
        memberCount: 5,
        budget: 100000000,
        location: "서울시 강남구 테헤란로 123, 9층",
        phone: "02-1234-5686",
        email: "admin@company.com",
        isActive: true
      }
    ]
  }
];

const employees: Employee[] = [
  { id: "ceo001", name: "최대표", position: "대표이사", departmentId: "company", email: "ceo@company.com", phone: "010-1234-0001", isManager: true },
  { id: "dev001", name: "김개발", position: "개발본부장", departmentId: "dev", email: "kim.dev@company.com", phone: "010-1234-0002", isManager: true },
  { id: "fe001", name: "박프론트", position: "프론트엔드팀장", departmentId: "frontend", email: "park.fe@company.com", phone: "010-1234-0003", isManager: true },
  { id: "be001", name: "이백엔드", position: "백엔드팀장", departmentId: "backend", email: "lee.be@company.com", phone: "010-1234-0004", isManager: true },
  { id: "mob001", name: "최모바일", position: "모바일팀장", departmentId: "mobile", email: "choi.mob@company.com", phone: "010-1234-0005", isManager: true },
];

export function AdminOrganizationPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["company", "dev"]));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    managerId: "",
    parentId: "",
    budget: "",
    location: "",
    phone: "",
    email: ""
  });

  const toggleExpanded = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const renderDepartmentTree = (dept: Department, level: number = 0) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedDepts.has(dept.id);

    return (
      <div key={dept.id} className="space-y-1">
        <div
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
            selectedDepartment?.id === dept.id
              ? "bg-pastel-blue-100 border border-pastel-blue-300"
              : "hover:bg-muted"
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => setSelectedDepartment(dept)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mr-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(dept.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-lg ${
              dept.level === 0 ? "bg-red-100" :
              dept.level === 1 ? "bg-blue-100" :
              "bg-green-100"
            }`}>
              <Building2 className={`h-4 w-4 ${
                dept.level === 0 ? "text-red-600" :
                dept.level === 1 ? "text-blue-600" :
                "text-green-600"
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{dept.name}</span>
                <Badge variant="outline" className="text-xs">
                  {dept.code}
                </Badge>
                {!dept.isActive && (
                  <Badge variant="destructive" className="text-xs">비활성</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {dept.managerName} • {dept.memberCount}명
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDepartment(dept);
                  setFormData({
                    name: dept.name,
                    code: dept.code,
                    description: dept.description,
                    managerId: dept.managerId,
                    parentId: dept.parentId || "",
                    budget: dept.budget.toString(),
                    location: dept.location,
                    phone: dept.phone,
                    email: dept.email
                  });
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {dept.id !== "company" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDepartment(dept);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {dept.children!.map(child => renderDepartmentTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleCreateDepartment = () => {
    // 실제로는 API 호출
    const newDept: Department = {
      id: `dept_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      managerId: formData.managerId,
      managerName: employees.find(emp => emp.id === formData.managerId)?.name || "미정",
      parentId: formData.parentId || undefined,
      level: formData.parentId ? 2 : 1,
      memberCount: 0,
      budget: parseInt(formData.budget) || 0,
      location: formData.location,
      phone: formData.phone,
      email: formData.email,
      isActive: true
    };

    toast.success("새 부서가 생성되었습니다.");
    setIsCreateDialogOpen(false);
    setFormData({
      name: "",
      code: "",
      description: "",
      managerId: "",
      parentId: "",
      budget: "",
      location: "",
      phone: "",
      email: ""
    });
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment) return;
    
    toast.success("부서 정보가 수정되었습니다.");
    setIsEditDialogOpen(false);
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;
    
    toast.success("부서가 삭제되었습니다.");
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const getTotalStats = () => {
    const countMembers = (dept: Department): number => {
      let total = dept.memberCount;
      if (dept.children) {
        total += dept.children.reduce((sum, child) => sum + countMembers(child), 0);
      }
      return total;
    };

    const totalMembers = departments.reduce((total, dept) => total + countMembers(dept), 0);
    const totalDepartments = departments.reduce((total, dept) => {
      const countDepts = (d: Department): number => {
        let count = 1;
        if (d.children) {
          count += d.children.reduce((sum, child) => sum + countDepts(child), 0);
        }
        return count;
      };
      return total + countDepts(dept);
    }, 0);

    return { totalMembers, totalDepartments };
  };

  const { totalMembers, totalDepartments } = getTotalStats();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>조직 관리</h1>
          <p className="text-muted-foreground">
            회사의 조직도를 관리하고 부서별 정보를 설정할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          부서 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 부서 수</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              활성 부서 기준
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 직원 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              전체 조직 인원
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">관리자</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{employees.filter(emp => emp.isManager).length}</div>
            <p className="text-xs text-muted-foreground">
              부서장급 이상
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">예산 총액</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">10억</div>
            <p className="text-xs text-muted-foreground">
              연간 운영예산
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 조직도 트리 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                조직도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {departments.map(dept => renderDepartmentTree(dept))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 부서 상세 정보 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>부서 상세 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDepartment ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      selectedDepartment.level === 0 ? "bg-red-100" :
                      selectedDepartment.level === 1 ? "bg-blue-100" :
                      "bg-green-100"
                    }`}>
                      <Building2 className={`h-6 w-6 ${
                        selectedDepartment.level === 0 ? "text-red-600" :
                        selectedDepartment.level === 1 ? "text-blue-600" :
                        "text-green-600"
                      }`} />
                    </div>
                    <div>
                      <h3>{selectedDepartment.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedDepartment.code}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">부서 설명</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedDepartment.description}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm">부서장</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {selectedDepartment.managerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedDepartment.managerName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">인원 수</Label>
                        <p className="text-sm text-muted-foreground">{selectedDepartment.memberCount}명</p>
                      </div>
                      <div>
                        <Label className="text-sm">예산</Label>
                        <p className="text-sm text-muted-foreground">
                          {(selectedDepartment.budget / 100000000).toFixed(1)}억원
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">위치</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {selectedDepartment.location}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">연락처</Label>
                      <div className="space-y-1 mt-1">
                        <p className="text-sm text-muted-foreground">
                          📞 {selectedDepartment.phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ✉️ {selectedDepartment.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">상태</Label>
                      <Badge variant={selectedDepartment.isActive ? "default" : "destructive"}>
                        {selectedDepartment.isActive ? "활성" : "비활성"}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setFormData({
                          name: selectedDepartment.name,
                          code: selectedDepartment.code,
                          description: selectedDepartment.description,
                          managerId: selectedDepartment.managerId,
                          parentId: selectedDepartment.parentId || "",
                          budget: selectedDepartment.budget.toString(),
                          location: selectedDepartment.location,
                          phone: selectedDepartment.phone,
                          email: selectedDepartment.email
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                    {selectedDepartment.id !== "company" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    조직도에서 부서를 선택하세요
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 부서 생성 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md" aria-describedby="create-department-description">
          <DialogHeader>
            <DialogTitle>새 부서 생성</DialogTitle>
            <DialogDescription id="create-department-description">
              새로운 부서의 정보를 입력하여 조직도에 추가하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">부서명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="개발팀"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">부서코드 *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="DEV"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">부서 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="부서의 역할과 업무를 설명하세요"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">상위 부서</Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData({...formData, parentId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="상위 부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">테크이노베이션 (최상위)</SelectItem>
                  <SelectItem value="dev">개발본부</SelectItem>
                  <SelectItem value="design">디자인팀</SelectItem>
                  <SelectItem value="marketing">마케팅팀</SelectItem>
                  <SelectItem value="sales">영업팀</SelectItem>
                  <SelectItem value="admin">관리팀</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerId">부서장</Label>
              <Select value={formData.managerId} onValueChange={(value) => setFormData({...formData, managerId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="부서장 선택" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="budget">연간 예산 (원)</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  placeholder="100000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">대표 전화</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="02-1234-5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">사무실 위치</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="서울시 강남구 테헤란로 123, 5층"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">부서 이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="team@company.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateDepartment}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 부서 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md" aria-describedby="edit-department-description">
          <DialogHeader>
            <DialogTitle>부서 정보 수정</DialogTitle>
            <DialogDescription id="edit-department-description">
              선택한 부서의 정보를 수정하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* 수정 폼 - 생성 폼과 동일한 구조 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-name">부서명 *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">부서코드 *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">부서 설명</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-budget">연간 예산 (원)</Label>
              <Input
                id="edit-budget"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">사무실 위치</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditDepartment}>
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 부서 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="delete-department-description">
          <DialogHeader>
            <DialogTitle>부서 삭제 확인</DialogTitle>
            <DialogDescription id="delete-department-description">
              선택한 부서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{selectedDepartment.name}</strong> 부서와 하위 조직이 모두 삭제됩니다.<br />
                현재 소속 직원: {selectedDepartment.memberCount}명
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}