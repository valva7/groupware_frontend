import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { ScrollArea } from "../../ui/scroll-area";
import { Switch } from "../../ui/switch";
import { Alert, AlertDescription } from "../../ui/alert";
import { Separator } from "../../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Settings,
  Calendar,
  AlertTriangle,
  BarChart3,
  Users,
  DollarSign,
  Clipboard,
  Save,
  Copy,
  MoreVertical,
  CheckCircle,
  Clock,
  Zap,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// 전자결재 종류 인터페이스
interface ApprovalType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  isActive: boolean;
  fields: FormField[];
  approvalLevels: number;
  requiredFields: string[];
  icon: string;
  color: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  template: string;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "file" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface CategoryHierarchy {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  types: ApprovalType[];
  isExpanded?: boolean;
}

// 초기 전자결재 종류 데이터
const initialApprovalTypes: ApprovalType[] = [
  {
    id: "vacation",
    name: "휴가신청서",
    code: "VAC",
    description: "연차, 병가, 경조사 등 각종 휴가 신청을 위한 양식",
    category: "인사",
    isActive: true,
    approvalLevels: 2,
    icon: "Calendar",
    color: "bg-blue-100 text-blue-700",
    usageCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
    createdBy: "시스템관리자",
    template: "기본 휴가신청 템플릿",
    requiredFields: ["startDate", "endDate", "reason"],
    fields: [
      { id: "startDate", name: "startDate", label: "시작일", type: "date", required: true },
      { id: "endDate", name: "endDate", label: "종료일", type: "date", required: true },
      { id: "vacationType", name: "vacationType", label: "휴가 유형", type: "select", required: true, options: ["연차", "병가", "경조사", "기타"] },
      { id: "reason", name: "reason", label: "사유", type: "textarea", required: true, placeholder: "휴가 사유를 입력하세요" },
      { id: "emergencyContact", name: "emergencyContact", label: "비상연락처", type: "text", required: false }
    ]
  },
  {
    id: "overtime",
    name: "초과근무신청서",
    code: "OVT",
    description: "야근, 주말 근무 등 초과근무 신청을 위한 양식",
    category: "인사",
    isActive: true,
    approvalLevels: 1,
    icon: "Clock",
    color: "bg-red-100 text-red-700",
    usageCount: 67,
    createdAt: "2024-01-15",
    updatedAt: "2024-04-05",
    createdBy: "인사팀",
    template: "초과근무 표준 양식",
    requiredFields: ["overtimeDate", "startTime", "endTime"],
    fields: [
      { id: "overtimeDate", name: "overtimeDate", label: "근무일", type: "date", required: true },
      { id: "startTime", name: "startTime", label: "시작 시간", type: "text", required: true },
      { id: "endTime", name: "endTime", label: "종료 시간", type: "text", required: true },
      { id: "reason", name: "reason", label: "근무 사유", type: "textarea", required: true },
      { id: "workDescription", name: "workDescription", label: "업무 내용", type: "textarea", required: true },
      { id: "mealProvided", name: "mealProvided", label: "식사 제공", type: "checkbox", required: false }
    ]
  },
  {
    id: "expense",
    name: "경비정산서",
    code: "EXP",
    description: "출장비, 업무 관련 경비 정산을 위한 양식",
    category: "재무",
    isActive: true,
    approvalLevels: 3,
    icon: "DollarSign",
    color: "bg-green-100 text-green-700",
    usageCount: 38,
    createdAt: "2024-01-15",
    updatedAt: "2024-04-01",
    createdBy: "재무팀",
    template: "표준 경비정산 템플릿",
    requiredFields: ["expenseDate", "amount", "category"],
    fields: [
      { id: "expenseDate", name: "expenseDate", label: "지출일", type: "date", required: true },
      { id: "amount", name: "amount", label: "금액", type: "number", required: true, validation: { min: 0 } },
      { id: "category", name: "category", label: "비용 분류", type: "select", required: true, options: ["교통비", "숙박비", "식비", "회의비", "기타"] },
      { id: "description", name: "description", label: "세부 내용", type: "textarea", required: true },
      { id: "receipt", name: "receipt", label: "영수증", type: "file", required: true },
      { id: "purpose", name: "purpose", label: "목적", type: "text", required: true }
    ]
  },
  {
    id: "purchase",
    name: "구매요청서",
    code: "PUR",
    description: "사무용품, 장비 등 구매 요청을 위한 양식",
    category: "구매",
    isActive: true,
    approvalLevels: 2,
    icon: "Clipboard",
    color: "bg-purple-100 text-purple-700",
    usageCount: 22,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-15",
    createdBy: "구매팀",
    template: "표준 구매요청 템플릿",
    requiredFields: ["itemName", "quantity", "estimatedPrice"],
    fields: [
      { id: "itemName", name: "itemName", label: "품목명", type: "text", required: true },
      { id: "quantity", name: "quantity", label: "수량", type: "number", required: true, validation: { min: 1 } },
      { id: "estimatedPrice", name: "estimatedPrice", label: "예상 금액", type: "number", required: true, validation: { min: 0 } },
      { id: "supplier", name: "supplier", label: "공급업체", type: "text", required: false },
      { id: "urgency", name: "urgency", label: "긴급도", type: "select", required: true, options: ["긴급", "보통", "낮음"] },
      { id: "justification", name: "justification", label: "구매 사유", type: "textarea", required: true }
    ]
  },
  {
    id: "budget",
    name: "예산승인서",
    code: "BUD",
    description: "부서별 예산 승인 요청을 위한 양식",
    category: "예산",
    isActive: true,
    approvalLevels: 4,
    icon: "BarChart3",
    color: "bg-orange-100 text-orange-700",
    usageCount: 12,
    createdAt: "2024-01-01",
    updatedAt: "2024-02-28",
    createdBy: "기획팀",
    template: "예산승인 전용 템플릿",
    requiredFields: ["budgetPeriod", "totalAmount", "category"],
    fields: [
      { id: "budgetPeriod", name: "budgetPeriod", label: "예산 기간", type: "text", required: true },
      { id: "totalAmount", name: "totalAmount", label: "총 예산액", type: "number", required: true, validation: { min: 0 } },
      { id: "category", name: "category", label: "예산 분류", type: "select", required: true, options: ["운영비", "마케팅비", "개발비", "인건비", "기타"] },
      { id: "breakdown", name: "breakdown", label: "세부 내역", type: "textarea", required: true },
      { id: "justification", name: "justification", label: "필요성", type: "textarea", required: true },
      { id: "expectedOutcome", name: "expectedOutcome", label: "기대 효과", type: "textarea", required: false }
    ]
  },
  {
    id: "education",
    name: "교육신청서",
    code: "EDU",
    description: "외부 교육, 세미나, 컨퍼런스 참석 신청을 위한 양식",
    category: "교육",
    isActive: false,
    approvalLevels: 2,
    icon: "Users",
    color: "bg-indigo-100 text-indigo-700",
    usageCount: 8,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    createdBy: "교육팀",
    template: "교육신청 표준 양식",
    requiredFields: ["educationName", "educationDate", "cost"],
    fields: [
      { id: "educationName", name: "educationName", label: "교육명", type: "text", required: true },
      { id: "educationDate", name: "educationDate", label: "교육일정", type: "date", required: true },
      { id: "cost", name: "cost", label: "교육비", type: "number", required: true, validation: { min: 0 } },
      { id: "provider", name: "provider", label: "교육기관", type: "text", required: true },
      { id: "expectedBenefit", name: "expectedBenefit", label: "기대 효과", type: "textarea", required: true },
      { id: "applicationDeadline", name: "applicationDeadline", label: "신청 마감일", type: "date", required: false }
    ]
  }
];

const fieldTypes = [
  { value: "text", label: "텍스트" },
  { value: "textarea", label: "긴 텍스트" },
  { value: "number", label: "숫자" },
  { value: "date", label: "날짜" },
  { value: "select", label: "선택박스" },
  { value: "file", label: "파일" },
  { value: "checkbox", label: "체크박스" }
];

export function AdminApprovalManagementPage() {
  const [approvalTypes, setApprovalTypes] = useState<ApprovalType[]>(initialApprovalTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ApprovalType | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["인사", "재무"]));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ApprovalType>>({
    name: "",
    code: "",
    description: "",
    category: "인사",
    isActive: true,
    approvalLevels: 1,
    icon: "FileText",
    color: "bg-blue-100 text-blue-700",
    template: "",
    fields: [],
    requiredFields: []
  });

  const [newField, setNewField] = useState<Partial<FormField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
    placeholder: "",
    options: []
  });

  // 카테고리별로 그룹화된 계층 구조 생성
  const getCategoryHierarchy = (): CategoryHierarchy[] => {
    const categoryMap = new Map<string, CategoryHierarchy>();
    
    // 카테고리 기본 정보 설정
    const categoryInfo = {
      "인사": { icon: "Users", color: "bg-blue-100 text-blue-700", description: "인사 관련 결재 양식" },
      "재무": { icon: "DollarSign", color: "bg-green-100 text-green-700", description: "재무 및 경비 관련 양식" },
      "구매": { icon: "Clipboard", color: "bg-purple-100 text-purple-700", description: "구매 및 조달 관련 양식" },
      "예산": { icon: "BarChart3", color: "bg-orange-100 text-orange-700", description: "예산 관련 양식" },
      "교육": { icon: "Users", color: "bg-indigo-100 text-indigo-700", description: "교육 및 연수 관련 양식" },
      "기타": { icon: "FileText", color: "bg-gray-100 text-gray-700", description: "기타 양식" }
    };

    // 카테고리별로 결재 종류 분류
    approvalTypes.forEach(type => {
      const category = type.category;
      const info = categoryInfo[category as keyof typeof categoryInfo] || categoryInfo["기타"];
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          id: category,
          name: category,
          icon: info.icon,
          color: info.color,
          description: info.description,
          types: [],
          isExpanded: expandedCategories.has(category)
        });
      }
      
      const matchesSearch = searchTerm === "" || 
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (matchesSearch) {
        categoryMap.get(category)!.types.push(type);
      }
    });

    return Array.from(categoryMap.values()).filter(category => category.types.length > 0);
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateType = () => {
    const newType: ApprovalType = {
      ...formData,
      id: `custom_${Date.now()}`,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: "관리자"
    } as ApprovalType;

    setApprovalTypes([...approvalTypes, newType]);
    setIsCreateDialogOpen(false);
    resetFormData();
    toast.success("새로운 전자결재 종류가 추가되었습니다.");
  };

  const handleUpdateType = () => {
    if (!selectedType) return;

    setApprovalTypes(approvalTypes.map(type => 
      type.id === selectedType.id 
        ? { 
            ...type, 
            ...formData,
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : type
    ));
    
    setIsEditDialogOpen(false);
    setSelectedType(null);
    resetFormData();
    toast.success("전자결재 종류가 수정되었습니다.");
  };

  const handleDeleteType = () => {
    if (!selectedType) return;

    setApprovalTypes(approvalTypes.filter(type => type.id !== selectedType.id));
    setIsDeleteDialogOpen(false);
    setSelectedType(null);
    toast.success("전자결재 종류가 삭제되었습니다.");
  };

  const handleToggleActive = (typeId: string) => {
    setApprovalTypes(approvalTypes.map(type => 
      type.id === typeId ? { ...type, isActive: !type.isActive } : type
    ));
    const type = approvalTypes.find(t => t.id === typeId);
    toast.success(`${type?.name}이 ${type?.isActive ? '비활성화' : '활성화'}되었습니다.`);
  };

  const openEditDialog = (type: ApprovalType) => {
    setSelectedType(type);
    setFormData(type);
    setIsEditDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      category: "인사",
      isActive: true,
      approvalLevels: 1,
      icon: "FileText",
      color: "bg-blue-100 text-blue-700",
      template: "",
      fields: [],
      requiredFields: []
    });
  };

  const addField = () => {
    if (!newField.name || !newField.label) {
      toast.error("필드명과 라벨을 입력해주세요.");
      return;
    }

    const field: FormField = {
      id: `field_${Date.now()}`,
      ...newField,
      options: newField.type === "select" ? newField.options : undefined
    } as FormField;

    setFormData({
      ...formData,
      fields: [...(formData.fields || []), field]
    });

    setNewField({
      name: "",
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      options: []
    });

    toast.success("필드가 추가되었습니다.");
  };

  const removeField = (fieldId: string) => {
    setFormData({
      ...formData,
      fields: formData.fields?.filter(field => field.id !== fieldId) || []
    });
  };

  const getStats = () => {
    const total = approvalTypes.length;
    const active = approvalTypes.filter(t => t.isActive).length;
    const inactive = approvalTypes.filter(t => !t.isActive).length;
    const totalUsage = approvalTypes.reduce((sum, type) => sum + type.usageCount, 0);
    const avgApprovalLevels = approvalTypes.reduce((sum, type) => sum + type.approvalLevels, 0) / total;
    
    return { total, active, inactive, totalUsage, avgApprovalLevels };
  };

  const { total, active, inactive, totalUsage, avgApprovalLevels } = getStats();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Calendar, DollarSign, Clipboard, BarChart3, Clock, Users, FileText, Zap
    };
    const IconComponent = icons[iconName] || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  const hierarchyData = getCategoryHierarchy();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>전자결재 종류 관리</h1>
          <p className="text-muted-foreground">
            전자결재 양식과 종류를 카테고리별로 관리하고 새로운 결재 템플릿을 생성할 수 있습니다.
          </p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          새 결재 종류 추가
        </Button>
      </div>

      {/* 통계 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">전체 결재 종류</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{total}</div>
            <p className="text-xs text-muted-foreground">
              활성 {active}개 • 비활성 {inactive}개
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 사용량</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              전체 신청 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">평균 결재 단계</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgApprovalLevels.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              단계
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">카테고리 수</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{hierarchyData.length}</div>
            <p className="text-xs text-muted-foreground">
              활성 카테고리
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 - 좌우 분할 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* 좌측: 카테고리 및 결재 종류 트리 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                결재 종류 분류
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="결재 종류명 또는 코드 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="p-6 space-y-2">
                  {hierarchyData.map((category) => (
                    <div key={category.id} className="space-y-1">
                      {/* 카테고리 헤더 */}
                      <div
                        className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => toggleCategoryExpanded(category.id)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 mr-2"
                        >
                          {category.isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            {getIconComponent(category.icon)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{category.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {category.types.length}개
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 카테고리 내 결재 종류들 */}
                      {category.isExpanded && (
                        <div className="ml-6 space-y-1">
                          {category.types.map((type) => (
                            <div
                              key={type.id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedType?.id === type.id
                                  ? "bg-pastel-blue-100 border border-pastel-blue-300"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setSelectedType(type)}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2 rounded-lg ${type.color}`}>
                                  {getIconComponent(type.icon)}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{type.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {type.code}
                                    </Badge>
                                    {!type.isActive && (
                                      <Badge variant="destructive" className="text-xs">비활성</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.approvalLevels}단계 • {type.usageCount}회 사용
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {hierarchyData.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>검색 결과가 없습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 선택된 결재 종류 상세 정보 */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>결재 종류 상세 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedType ? (
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info">기본 정보</TabsTrigger>
                      <TabsTrigger value="fields">필드 구성</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="space-y-6 mt-6">
                      {/* 기본 정보 헤더 */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-lg ${selectedType.color}`}>
                            {getIconComponent(selectedType.icon)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{selectedType.name}</h3>
                            <p className="text-muted-foreground">{selectedType.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{selectedType.code}</Badge>
                          <Badge variant="secondary">{selectedType.category}</Badge>
                          {selectedType.isActive ? (
                            <Badge className="bg-green-100 text-green-700">활성</Badge>
                          ) : (
                            <Badge variant="destructive">비활성</Badge>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* 통계 정보 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="text-sm text-muted-foreground">결재 단계</p>
                              <p className="text-2xl font-medium">{selectedType.approvalLevels}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="text-sm text-muted-foreground">사용량</p>
                              <p className="text-2xl font-medium">{selectedType.usageCount}</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-green-500" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="text-sm text-muted-foreground">필드 수</p>
                              <p className="text-2xl font-medium">{selectedType.fields.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-purple-500" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="text-sm text-muted-foreground">필수 필드</p>
                              <p className="text-2xl font-medium">{selectedType.requiredFields.length}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                          </CardContent>
                        </Card>
                      </div>

                      <Separator />

                      {/* 메타 정보 */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label>생성 정보</Label>
                          <div className="mt-2 space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">생성일: </span>
                              {selectedType.createdAt}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">생성자: </span>
                              {selectedType.createdBy}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>수정 정보</Label>
                          <div className="mt-2 space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">최종 수정일: </span>
                              {selectedType.updatedAt}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 템플릿 정보 */}
                      <div>
                        <Label>템플릿 정보</Label>
                        <div className="mt-2 p-4 bg-muted rounded-lg">
                          <p>{selectedType.template}</p>
                        </div>
                      </div>

                      {/* 관리 버튼 */}
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => openEditDialog(selectedType)}>
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleToggleActive(selectedType.id)}
                        >
                          {selectedType.isActive ? "비활성화" : "활성화"}
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="fields" className="space-y-4 mt-6">
                      <div>
                        <Label>필수 필드</Label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {selectedType.requiredFields.map((fieldName, index) => (
                            <Badge key={index} className="bg-red-100 text-red-700">
                              {selectedType.fields.find(f => f.name === fieldName)?.label || fieldName}
                            </Badge>
                          ))}
                          {selectedType.requiredFields.length === 0 && (
                            <span className="text-sm text-muted-foreground">필수 필드가 없습니다.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>필드 목록 ({selectedType.fields.length}개)</Label>
                        <div className="mt-2 space-y-3">
                          {selectedType.fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{field.label}</span>
                                    <Badge variant="outline" className="text-xs">{field.type}</Badge>
                                    {field.required && (
                                      <Badge className="bg-red-100 text-red-700 text-xs">필수</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    필드명: {field.name}
                                    {field.placeholder && ` • 플레이스홀더: ${field.placeholder}`}
                                  </div>
                                  {field.options && field.options.length > 0 && (
                                    <div className="mt-2">
                                      <span className="text-sm text-muted-foreground">선택 옵션: </span>
                                      {field.options.map((option, optIndex) => (
                                        <Badge key={optIndex} variant="secondary" className="mr-1 text-xs">
                                          {option}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {selectedType.fields.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>등록된 필드가 없습니다.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              ) : (
                <div className="h-[calc(100vh-350px)] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">결재 종류를 선택하세요</h3>
                    <p className="text-muted-foreground">
                      좌측 카테고리에서 결재 종류를 클릭하면<br />
                      상세 정보가 여기에 표시됩니다.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 결재 종류 생성/수정 다이얼로그 */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-4xl" aria-describedby="form-type-description">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? "새 결재 종류 추가" : "결재 종류 수정"}
            </DialogTitle>
            <DialogDescription id="form-type-description">
              결재 종류의 기본 정보와 필드를 설정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">기본 정보</TabsTrigger>
              <TabsTrigger value="fields">필드 설정</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">결재 종류명</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 휴가신청서"
                  />
                </div>
                <div>
                  <Label htmlFor="code">코드</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="예: VAC"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="결재 종류에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["인사", "재무", "구매", "예산", "교육", "기타"].map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="approvalLevels">결재 단계</Label>
                  <Select 
                    value={formData.approvalLevels?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, approvalLevels: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(level => (
                        <SelectItem key={level} value={level.toString()}>{level}단계</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="template">템플릿 정보</Label>
                <Input
                  id="template"
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  placeholder="템플릿 설명을 입력하세요"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">활성화</Label>
              </div>
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="mb-4">새 필드 추가</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="fieldName">필드명</Label>
                    <Input
                      id="fieldName"
                      value={newField.name}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      placeholder="startDate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldLabel">라벨</Label>
                    <Input
                      id="fieldLabel"
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="시작일"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="fieldType">타입</Label>
                    <Select 
                      value={newField.type} 
                      onValueChange={(value) => setNewField({ ...newField, type: value as FormField['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fieldPlaceholder">플레이스홀더</Label>
                    <Input
                      id="fieldPlaceholder"
                      value={newField.placeholder}
                      onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                      placeholder="입력 안내 텍스트"
                    />
                  </div>
                </div>

                {newField.type === "select" && (
                  <div className="mb-4">
                    <Label htmlFor="fieldOptions">선택 옵션 (쉼표로 구분)</Label>
                    <Input
                      id="fieldOptions"
                      value={newField.options?.join(", ") || ""}
                      onChange={(e) => setNewField({ 
                        ...newField, 
                        options: e.target.value.split(",").map(opt => opt.trim()).filter(opt => opt) 
                      })}
                      placeholder="옵션1, 옵션2, 옵션3"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fieldRequired"
                      checked={newField.required}
                      onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                    />
                    <Label htmlFor="fieldRequired">필수 필드</Label>
                  </div>
                  <Button onClick={addField} className="gap-2">
                    <Plus className="h-4 w-4" />
                    필드 추가
                  </Button>
                </div>
              </div>

              <div>
                <Label>필드 목록 ({formData.fields?.length || 0}개)</Label>
                <div className="mt-2 space-y-2">
                  {formData.fields?.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.label}</span>
                          <Badge variant="outline" className="text-xs">{field.type}</Badge>
                          {field.required && (
                            <Badge className="bg-red-100 text-red-700 text-xs">필수</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {field.name}
                          {field.placeholder && ` • ${field.placeholder}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )) || []}
                  {(!formData.fields || formData.fields.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>추가된 필드가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              resetFormData();
            }}>
              취소
            </Button>
            <Button onClick={isCreateDialogOpen ? handleCreateType : handleUpdateType}>
              <Save className="h-4 w-4 mr-2" />
              {isCreateDialogOpen ? "생성" : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="delete-type-description">
          <DialogHeader>
            <DialogTitle>결재 종류 삭제 확인</DialogTitle>
            <DialogDescription id="delete-type-description">
              선택한 결재 종류를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          {selectedType && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{selectedType.name} ({selectedType.code})</strong><br />
                카테고리: {selectedType.category}<br />
                사용량: {selectedType.usageCount}건
                {selectedType.usageCount > 0 && (
                  <><br /><span className="text-red-600">⚠️ 이미 사용 중인 결재 종류입니다.</span></>
                )}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteType}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}