import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Calendar,
  DollarSign,
  Clipboard,
  BarChart3,
  Clock,
  Users,
  FileText,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  ArrowLeft,
  Save,
  Search,
  Plus,
  X,
  GripVertical,
  UserPlus,
  Eye,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Trash2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 전자결재 종류 인터페이스 (AdminApprovalManagementPage와 동일)
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

interface ApprovalMember {
  id: string;
  type: 'approver' | 'referrer';
  employee: {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    avatar?: string;
  };
  order: number;
  isRequired: boolean;
}

// 활성화된 전자결재 종류만 필터링 (사용자용)
const approvalTypes: ApprovalType[] = [
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
  }
];

interface ApprovalRequestPageProps {
  employees: any[];
  departments: any[];
  currentUser: any;
  onBack: () => void;
}

// 드래그 가능한 결재선 항목 컴포넌트
function DraggableApprovalItem({ 
  member, 
  index, 
  moveItem, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast 
}: {
  member: ApprovalMember;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'approval-item',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'approval-item',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-4 bg-card border rounded-lg transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-sm'
      }`}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pastel-blue-500 text-white text-sm">
        {member.type === 'approver' ? index + 1 : <Eye className="h-4 w-4" />}
      </div>

      <Avatar className="h-10 w-10">
        <AvatarImage src={member.employee.avatar} />
        <AvatarFallback>{member.employee.name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{member.employee.name}</span>
          <Badge variant={member.type === 'approver' ? 'default' : 'secondary'}>
            {member.type === 'approver' ? '결재자' : '참조자'}
          </Badge>
          {member.isRequired && (
            <Badge variant="destructive" className="text-xs">필수</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {member.employee.position} • {member.employee.department}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {member.type === 'approver' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="h-8 w-8 p-0"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="h-8 w-8 p-0"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(member.id)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ApprovalRequestPage({ employees, departments, currentUser, onBack }: ApprovalRequestPageProps) {
  const [selectedType, setSelectedType] = useState<ApprovalType | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["인사", "재무"]));
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [approvalMembers, setApprovalMembers] = useState<ApprovalMember[]>([]);
  
  // 직원 검색 다이얼로그 상태
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  const [selectedMemberType, setSelectedMemberType] = useState<'approver' | 'referrer'>('approver');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

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

    // 카테고리별로 결재 종류 분류 (활성화된 것만)
    approvalTypes.filter(type => type.isActive).forEach(type => {
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

  const handleTypeSelect = (type: ApprovalType) => {
    setSelectedType(type);
    // 기존 폼 데이터 초기화
    setFormData({});
    setApprovalMembers([]);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // 직원 검색 필터링
  const getFilteredEmployees = () => {
    return employees
      .filter(emp => emp.id !== currentUser?.id)
      .filter(emp => {
        const matchesSearch = employeeSearchTerm === "" ||
          emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(employeeSearchTerm.toLowerCase());
        
        const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment;
        
        return matchesSearch && matchesDepartment;
      })
      .filter(emp => !approvalMembers.some(member => member.employee.id === emp.id));
  };

  // 직원 추가
  const handleAddEmployee = (employee: any) => {
    const nextOrder = approvalMembers.filter(m => m.type === selectedMemberType).length + 1;
    
    const newMember: ApprovalMember = {
      id: `${selectedMemberType}_${employee.id}_${Date.now()}`,
      type: selectedMemberType,
      employee: {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        department: employee.department,
        email: employee.email,
        avatar: employee.avatar
      },
      order: nextOrder,
      isRequired: selectedMemberType === 'approver'
    };

    setApprovalMembers(prev => [...prev, newMember]);
    toast.success(`${selectedMemberType === 'approver' ? '결재자' : '참조자'}가 추가되었습니다.`);
  };

  // 결재선 순서 변경
  const moveApprovalItem = (dragIndex: number, hoverIndex: number) => {
    const approvers = approvalMembers.filter(m => m.type === 'approver');
    const referrers = approvalMembers.filter(m => m.type === 'referrer');
    
    if (dragIndex < approvers.length && hoverIndex < approvers.length) {
      // 결재자 순서 변경
      const updatedApprovers = [...approvers];
      const [draggedItem] = updatedApprovers.splice(dragIndex, 1);
      updatedApprovers.splice(hoverIndex, 0, draggedItem);
      
      // 순서 업데이트
      updatedApprovers.forEach((item, index) => {
        item.order = index + 1;
      });
      
      setApprovalMembers([...updatedApprovers, ...referrers]);
    }
  };

  // 멤버 제거
  const removeMember = (id: string) => {
    setApprovalMembers(prev => {
      const updated = prev.filter(member => member.id !== id);
      // 순서 재정렬
      const approvers = updated.filter(m => m.type === 'approver');
      const referrers = updated.filter(m => m.type === 'referrer');
      
      approvers.forEach((member, index) => {
        member.order = index + 1;
      });
      
      return [...approvers, ...referrers];
    });
  };

  // 순서 이동
  const moveUp = (index: number) => {
    if (index > 0) {
      moveApprovalItem(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    const approvers = approvalMembers.filter(m => m.type === 'approver');
    if (index < approvers.length - 1) {
      moveApprovalItem(index, index + 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedType) {
      toast.error("결재 유형을 선택해주세요.");
      return;
    }

    // 필수 필드 검증
    const missingFields = selectedType.requiredFields.filter(fieldName => {
      const fieldValue = formData[fieldName];
      return !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
    });

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(fieldName => {
        const field = selectedType.fields.find(f => f.name === fieldName);
        return field?.label || fieldName;
      });
      toast.error(`다음 필수 항목을 입력해주세요: ${missingLabels.join(', ')}`);
      return;
    }

    const approvers = approvalMembers.filter(m => m.type === 'approver');
    if (approvers.length === 0) {
      toast.error("최소 1명의 결재자를 선택해주세요.");
      return;
    }

    // 결재 요청 제출
    toast.success("결재 요청이 제출되었습니다.");
    onBack();
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Calendar, DollarSign, Clipboard, BarChart3, Clock, Users, FileText
    };
    const IconComponent = icons[iconName] || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  const renderFormField = (field: FormField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(newValue) => handleFieldChange(field.name, newValue)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "선택하세요"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => handleFieldChange(field.name, e.target.files?.[0])}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  const hierarchyData = getCategoryHierarchy();
  const approvers = approvalMembers.filter(m => m.type === 'approver');
  const referrers = approvalMembers.filter(m => m.type === 'referrer');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-2">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="gap-2 px-4 py-2 h-10 bg-white hover:bg-pastel-blue-50 border-pastel-blue-200 hover:border-pastel-blue-300 text-pastel-blue-700 hover:text-pastel-blue-800 transition-all duration-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">결재 요청</h1>
            <p className="text-muted-foreground mt-1">
              필요한 결재 유형을 선택하고 신청서를 작성해주세요.
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 - 좌우 분할 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* 좌측: 결재 유형 선택 */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  결재 유형 선택
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="결재 유형 검색..."
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
                                onClick={() => handleTypeSelect(type)}
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
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {type.approvalLevels}단계 결재
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

          {/* 우측: 선택된 결재 유형 폼 */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {selectedType ? `${selectedType.name} 작성` : "결재 유형을 선택하세요"}
                </CardTitle>
                {selectedType && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedType.code}</Badge>
                    <Badge variant="secondary">{selectedType.category}</Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {selectedType.approvalLevels}단계 결재
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {selectedType ? (
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-6">
                      {/* 기본 정보 */}
                      <div>
                        <h3 className="mb-4">기본 정보</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>신청자</Label>
                            <Input value={currentUser?.name || ""} disabled />
                          </div>
                          <div>
                            <Label>부서</Label>
                            <Input value={currentUser?.department || ""} disabled />
                          </div>
                          <div>
                            <Label>신청일</Label>
                            <Input value={new Date().toISOString().split('T')[0]} disabled />
                          </div>
                          <div>
                            <Label>문서 유형</Label>
                            <Input value={selectedType.name} disabled />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* 동적 폼 필드들 */}
                      <div>
                        <h3 className="mb-4">신청 내용</h3>
                        <div className="space-y-4">
                          {selectedType.fields.map((field) => (
                            <div key={field.id}>
                              <Label htmlFor={field.name}>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              <div className="mt-1">
                                {field.type === 'checkbox' ? (
                                  renderFormField(field)
                                ) : (
                                  renderFormField(field)
                                )}
                              </div>
                              {field.placeholder && field.type !== 'checkbox' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {field.placeholder}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* 개선된 결재선 설정 */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3>결재선 설정</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMemberType('approver');
                                setIsEmployeeSearchOpen(true);
                              }}
                              className="gap-2"
                            >
                              <UserPlus className="h-4 w-4" />
                              결재자 추가
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMemberType('referrer');
                                setIsEmployeeSearchOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              참조자 추가
                            </Button>
                          </div>
                        </div>

                        {/* 결재자 목록 */}
                        {approvers.length > 0 && (
                          <div className="mb-6">
                            <Label className="mb-3 block">결재자 ({approvers.length}명)</Label>
                            <div className="space-y-2">
                              {approvers.map((member, index) => (
                                <DraggableApprovalItem
                                  key={member.id}
                                  member={member}
                                  index={index}
                                  moveItem={moveApprovalItem}
                                  onRemove={removeMember}
                                  onMoveUp={moveUp}
                                  onMoveDown={moveDown}
                                  isFirst={index === 0}
                                  isLast={index === approvers.length - 1}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 참조자 목록 */}
                        {referrers.length > 0 && (
                          <div className="mb-6">
                            <Label className="mb-3 block">참조자 ({referrers.length}명)</Label>
                            <div className="space-y-2">
                              {referrers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-3 p-4 bg-card border rounded-lg"
                                >
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 text-white text-sm">
                                    <Eye className="h-4 w-4" />
                                  </div>

                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.employee.avatar} />
                                    <AvatarFallback>{member.employee.name.slice(0, 2)}</AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{member.employee.name}</span>
                                      <Badge variant="secondary">참조자</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {member.employee.position} • {member.employee.department}
                                    </div>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMember(member.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 결재선 없을 때 안내 */}
                        {approvers.length === 0 && referrers.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>결재자 또는 참조자를 추가해주세요.</p>
                            <p className="text-sm">최소 1명의 결재자가 필요합니다.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[calc(100vh-400px)] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">결재 유형을 선택하세요</h3>
                      <p className="text-muted-foreground">
                        좌측에서 필요한 결재 유형을 선택하면<br />
                        해당 양식이 여기에 표시됩니다.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {selectedType && (
                <div className="p-6 border-t">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onBack}>
                      취소
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2">
                      <Save className="h-4 w-4" />
                      결재 요청
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* 직원 검색 다이얼로그 */}
        <Dialog open={isEmployeeSearchOpen} onOpenChange={setIsEmployeeSearchOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedMemberType === 'approver' ? '결재자' : '참조자'} 검색
              </DialogTitle>
              <DialogDescription>
                {selectedMemberType === 'approver' ? '결재를 담당할' : '결재 진행 상황을 참조할'} 직원을 검색하고 선택하세요.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* 검색 필터 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>직원 검색</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="이름, 부서, 직급 검색..."
                      value={employeeSearchTerm}
                      onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>부서 필터</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 부서</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 직원 목록 */}
              <div>
                <Label>직원 목록 ({getFilteredEmployees().length}명)</Label>
                <ScrollArea className="h-80 mt-2 border rounded-lg">
                  <div className="p-4 space-y-2">
                    {getFilteredEmployees().map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleAddEmployee(employee)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>{employee.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.position} • {employee.department}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          추가
                        </Button>
                      </div>
                    ))}
                    {getFilteredEmployees().length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>검색 결과가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmployeeSearchOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}