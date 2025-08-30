import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Textarea } from "../../ui/textarea";
import { ScrollArea } from "../../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Alert, AlertDescription } from "../../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Monitor,
  Laptop,
  Smartphone,
  Printer,
  Wifi,
  Car,
  Home,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Save,
  X,
  Users
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { initialEmployees } from "../../../data/initialData";

interface Asset {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  status: "사용중" | "대기중" | "수리중" | "폐기" | "분실";
  condition: "매우좋음" | "좋음" | "보통" | "나쁨" | "매우나쁨";
  location: string;
  assignedTo?: string;
  assignedEmployee?: string;
  department: string;
  warrantyUntil?: string;
  description: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  profileImage: string;
}

const assetCategories = {
  "IT장비": ["데스크톱", "노트북", "모니터", "프린터", "네트워크장비", "태블릿", "스마트폰"],
  "사무용품": ["책상", "의자", "캐비닛", "화이트보드", "프로젝터"],
  "차량": ["승용차", "화물차", "오토바이"],
  "기타": ["에어컨", "정수기", "냉장고", "전자레인지"]
};

const initialAssets: Asset[] = [
  {
    id: "IT001",
    name: "개발팀 워크스테이션 #1",
    category: "IT장비",
    subcategory: "데스크톱",
    serialNumber: "WS240001",
    model: "OptiPlex 7090",
    manufacturer: "Dell",
    purchaseDate: "2024-01-15",
    purchasePrice: 1500000,
    currentValue: 1200000,
    status: "사용중",
    condition: "좋음",
    location: "5층 A구역",
    assignedTo: "emp001",
    assignedEmployee: "김개발",
    department: "개발팀",
    warrantyUntil: "2027-01-15",
    description: "고성능 개발용 워크스테이션",
    lastMaintenance: "2024-03-01",
    nextMaintenance: "2024-09-01"
  },
  {
    id: "IT002",
    name: "MacBook Pro 16인치 #1",
    category: "IT장비",
    subcategory: "노트북",
    serialNumber: "MBP240001",
    model: "MacBook Pro 16",
    manufacturer: "Apple",
    purchaseDate: "2024-02-20",
    purchasePrice: 3200000,
    currentValue: 2800000,
    status: "사용중",
    condition: "매우좋음",
    location: "5층 B구역",
    assignedTo: "emp002",
    assignedEmployee: "박프론트",
    department: "개발팀",
    warrantyUntil: "2025-02-20",
    description: "프론트엔드 개발용 맥북",
    lastMaintenance: "2024-04-01"
  },
  {
    id: "IT003",
    name: "4K 모니터 27인치",
    category: "IT장비",
    subcategory: "모니터",
    serialNumber: "MON240001",
    model: "U2723QE",
    manufacturer: "Dell",
    purchaseDate: "2024-01-10",
    purchasePrice: 650000,
    currentValue: 550000,
    status: "대기중",
    condition: "좋음",
    location: "창고 1동",
    department: "관리팀",
    warrantyUntil: "2027-01-10",
    description: "예비용 4K 모니터"
  },
  {
    id: "OFF001",
    name: "허먼밀러 에어론 의자",
    category: "사무용품",
    subcategory: "의자",
    serialNumber: "CHAIR001",
    model: "Aeron Size B",
    manufacturer: "Herman Miller",
    purchaseDate: "2023-12-01",
    purchasePrice: 1800000,
    currentValue: 1500000,
    status: "사용중",
    condition: "매우좋음",
    location: "5층 A구역",
    assignedTo: "emp001",
    assignedEmployee: "김개발",
    department: "개발팀",
    description: "인체공학적 고급 사무용 의자"
  },
  {
    id: "CAR001",
    name: "업무용 승용차",
    category: "차량",
    subcategory: "승용차",
    serialNumber: "12가3456",
    model: "아반떼",
    manufacturer: "현대자동차",
    purchaseDate: "2023-06-01",
    purchasePrice: 25000000,
    currentValue: 20000000,
    status: "수리중",
    condition: "보통",
    location: "지하주차장",
    department: "관리팀",
    warrantyUntil: "2026-06-01",
    description: "영업 및 출장용 차량",
    lastMaintenance: "2024-04-01",
    nextMaintenance: "2024-10-01"
  }
];

const statusColors = {
  "사용중": "bg-green-100 text-green-700",
  "대기중": "bg-blue-100 text-blue-700",
  "수리중": "bg-yellow-100 text-yellow-700",
  "폐기": "bg-red-100 text-red-700",
  "분실": "bg-red-100 text-red-700"
};

const conditionColors = {
  "매우좋음": "bg-green-100 text-green-700",
  "좋음": "bg-blue-100 text-blue-700",
  "보통": "bg-yellow-100 text-yellow-700",
  "나쁨": "bg-orange-100 text-orange-700",
  "매우나쁨": "bg-red-100 text-red-700"
};

export function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmployeeSelectDialogOpen, setIsEmployeeSelectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  // 직원 선택 관련 상태
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const [employees] = useState<Employee[]>(initialEmployees);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    serialNumber: "",
    model: "",
    manufacturer: "",
    purchaseDate: "",
    purchasePrice: "",
    currentValue: "",
    status: "대기중",
    condition: "좋음",
    location: "",
    assignedTo: "",
    assignedEmployee: "",
    department: "",
    warrantyUntil: "",
    description: "",
    lastMaintenance: "",
    nextMaintenance: ""
  });

  // 필터링된 자산 목록
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "전체" || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === "전체" || asset.status === selectedStatus;
    
    let matchesTab = true;
    if (activeTab === "assigned") {
      matchesTab = !!asset.assignedTo;
    } else if (activeTab === "maintenance") {
      matchesTab = asset.status === "수리중" || 
                   (asset.nextMaintenance && new Date(asset.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  // 필터링된 직원 목록
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(employeeSearchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "전체" || employee.department === selectedDepartment;
    const isActive = employee.status === "재직중";
    
    return matchesSearch && matchesDepartment && isActive;
  });

  // 부서 목록 추출
  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const getAssetIcon = (category: string, subcategory: string) => {
    if (category === "IT장비") {
      switch (subcategory) {
        case "데스크톱": case "노트북": return <Laptop className="h-4 w-4" />;
        case "모니터": return <Monitor className="h-4 w-4" />;
        case "스마트폰": case "태블릿": return <Smartphone className="h-4 w-4" />;
        case "프린터": return <Printer className="h-4 w-4" />;
        case "네트워크장비": return <Wifi className="h-4 w-4" />;
        default: return <Monitor className="h-4 w-4" />;
      }
    } else if (category === "차량") {
      return <Car className="h-4 w-4" />;
    } else if (category === "사무용품") {
      return <Home className="h-4 w-4" />;
    }
    return <Package className="h-4 w-4" />;
  };

  const handleCreateAsset = async () => {
    if (!formData.name || !formData.category || !formData.subcategory || !formData.serialNumber || !formData.location) {
      toast.error("필수 필드를 모두 입력해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAsset: Asset = {
        id: `NEW${Date.now()}`,
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        serialNumber: formData.serialNumber,
        model: formData.model,
        manufacturer: formData.manufacturer,
        purchaseDate: formData.purchaseDate,
        purchasePrice: parseInt(formData.purchasePrice) || 0,
        currentValue: parseInt(formData.currentValue) || parseInt(formData.purchasePrice) || 0,
        status: formData.status as Asset['status'],
        condition: formData.condition as Asset['condition'],
        location: formData.location,
        assignedTo: formData.assignedTo || undefined,
        assignedEmployee: formData.assignedEmployee || undefined,
        department: formData.department,
        warrantyUntil: formData.warrantyUntil || undefined,
        description: formData.description,
        lastMaintenance: formData.lastMaintenance || undefined,
        nextMaintenance: formData.nextMaintenance || undefined
      };

      setAssets([...assets, newAsset]);
      toast.success("새 자산이 등록되었습니다.");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("자산 등록 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditAsset = async () => {
    if (!selectedAsset || !formData.name || !formData.category || !formData.subcategory || !formData.serialNumber || !formData.location) {
      toast.error("필수 필드를 모두 입력해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedAsset: Asset = {
        ...selectedAsset,
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        serialNumber: formData.serialNumber,
        model: formData.model,
        manufacturer: formData.manufacturer,
        purchaseDate: formData.purchaseDate,
        purchasePrice: parseInt(formData.purchasePrice) || 0,
        currentValue: parseInt(formData.currentValue) || 0,
        status: formData.status as Asset['status'],
        condition: formData.condition as Asset['condition'],
        location: formData.location,
        assignedTo: formData.assignedTo || undefined,
        assignedEmployee: formData.assignedEmployee || undefined,
        department: formData.department,
        warrantyUntil: formData.warrantyUntil || undefined,
        description: formData.description,
        lastMaintenance: formData.lastMaintenance || undefined,
        nextMaintenance: formData.nextMaintenance || undefined
      };

      setAssets(assets.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset));
      toast.success("자산 정보가 수정되었습니다.");
      setIsEditDialogOpen(false);
      setSelectedAsset(null);
      resetForm();
    } catch (error) {
      toast.error("자산 수정 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssets(assets.filter(asset => asset.id !== selectedAsset.id));
      toast.success("자산이 삭제되었습니다.");
      setIsDeleteDialogOpen(false);
      setSelectedAsset(null);
    } catch (error) {
      toast.error("자산 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      subcategory: "",
      serialNumber: "",
      model: "",
      manufacturer: "",
      purchaseDate: "",
      purchasePrice: "",
      currentValue: "",
      status: "대기중",
      condition: "좋음",
      location: "",
      assignedTo: "",
      assignedEmployee: "",
      department: "",
      warrantyUntil: "",
      description: "",
      lastMaintenance: "",
      nextMaintenance: ""
    });
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      subcategory: asset.subcategory,
      serialNumber: asset.serialNumber,
      model: asset.model,
      manufacturer: asset.manufacturer,
      purchaseDate: asset.purchaseDate,
      purchasePrice: asset.purchasePrice.toString(),
      currentValue: asset.currentValue.toString(),
      status: asset.status,
      condition: asset.condition,
      location: asset.location,
      assignedTo: asset.assignedTo || "",
      assignedEmployee: asset.assignedEmployee || "",
      department: asset.department,
      warrantyUntil: asset.warrantyUntil || "",
      description: asset.description,
      lastMaintenance: asset.lastMaintenance || "",
      nextMaintenance: asset.nextMaintenance || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setFormData({
      ...formData,
      assignedTo: `emp${employee.id}`,
      assignedEmployee: employee.name
    });
    setIsEmployeeSelectDialogOpen(false);
    toast.success(`${employee.name}님이 선택되었습니다.`);
  };

  const handleOpenEmployeeSelect = () => {
    setEmployeeSearchTerm("");
    setSelectedDepartment("전체");
    setIsEmployeeSelectDialogOpen(true);
  };

  const getStats = () => {
    const total = assets.length;
    const inUse = assets.filter(a => a.status === "사용중").length;
    const maintenance = assets.filter(a => a.status === "수리중").length;
    const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    return { total, inUse, maintenance, totalValue };
  };

  const { total, inUse, maintenance, totalValue } = getStats();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>비품/자산 관리</h1>
          <p className="text-muted-foreground">
            회사의 모든 비품과 자산을 체계적으로 관리할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          자산 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 자산 수</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{total}</div>
            <p className="text-xs text-muted-foreground">
              등록된 전체 자산
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">사용 중</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{inUse}</div>
            <p className="text-xs text-muted-foreground">
              현재 사용중인 자산
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">점검/수리</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{maintenance}</div>
            <p className="text-xs text-muted-foreground">
              점검 또는 수리 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 자산 가치</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round(totalValue / 100000000)}억</div>
            <p className="text-xs text-muted-foreground">
              현재 가치 기준
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="자산명, 모델명, 제조사, 시리얼번호로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 카테고리</SelectItem>
                {Object.keys(assetCategories).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 상태</SelectItem>
                <SelectItem value="사용중">사용중</SelectItem>
                <SelectItem value="대기중">대기중</SelectItem>
                <SelectItem value="수리중">수리중</SelectItem>
                <SelectItem value="폐기">폐기</SelectItem>
                <SelectItem value="분실">분실</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 탭 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">전체 자산</TabsTrigger>
              <TabsTrigger value="assigned">배정된 자산</TabsTrigger>
              <TabsTrigger value="maintenance">점검 필요</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* 자산 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>자산 목록 ({filteredAssets.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>자산 정보</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>제조사/모델</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>컨디션</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>구매가격</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getAssetIcon(asset.category, asset.subcategory)}
                        </div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {asset.serialNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{asset.category}</div>
                        <div className="text-xs text-muted-foreground">{asset.subcategory}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{asset.manufacturer}</div>
                        <div className="text-xs text-muted-foreground">{asset.model}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[asset.status]}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={conditionColors[asset.condition]}>
                        {asset.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{asset.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {asset.assignedEmployee ? (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{asset.assignedEmployee}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">미배정</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{asset.purchasePrice.toLocaleString()}원</div>
                        <div className="text-xs text-muted-foreground">
                          현재: {asset.currentValue.toLocaleString()}원
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(asset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 자산 등록 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-pastel-blue-600" />
              새 자산 등록
            </DialogTitle>
            <DialogDescription>
              새로운 자산의 정보를 입력하여 관리 시스템에 등록하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">자산명 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="개발팀 워크스테이션 #1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">시리얼번호 <span className="text-red-500">*</span></Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  placeholder="WS240001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 <span className="text-red-500">*</span></Label>
                <Select value={formData.category} onValueChange={(value) => {
                  setFormData({...formData, category: value, subcategory: ""});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(assetCategories).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">세부 분류 <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => setFormData({...formData, subcategory: value})}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="세부 분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && assetCategories[formData.category as keyof typeof assetCategories]?.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">제조사</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  placeholder="Dell"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">모델명</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="OptiPlex 7090"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">구매일</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">구매가격 (원)</Label>
                <Input
                  id="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  placeholder="1500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentValue">현재가치 (원)</Label>
                <Input
                  id="currentValue"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  placeholder="1200000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">상태 <span className="text-red-500">*</span></Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사용중">사용중</SelectItem>
                    <SelectItem value="대기중">대기중</SelectItem>
                    <SelectItem value="수리중">수리중</SelectItem>
                    <SelectItem value="폐기">폐기</SelectItem>
                    <SelectItem value="분실">분실</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">컨디션</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="매우좋음">매우좋음</SelectItem>
                    <SelectItem value="좋음">좋음</SelectItem>
                    <SelectItem value="보통">보통</SelectItem>
                    <SelectItem value="나쁨">나쁨</SelectItem>
                    <SelectItem value="매우나쁨">매우나쁨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">위치 <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="5층 A구역"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">관리부서</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="개발팀"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedEmployee">배정 직원</Label>
                <div className="flex gap-2">
                  <Input
                    id="assignedEmployee"
                    value={formData.assignedEmployee}
                    onChange={(e) => setFormData({...formData, assignedEmployee: e.target.value})}
                    placeholder="직원명"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenEmployeeSelect}
                    className="px-3"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyUntil">보증만료일</Label>
                <Input
                  id="warrantyUntil"
                  type="date"
                  value={formData.warrantyUntil}
                  onChange={(e) => setFormData({...formData, warrantyUntil: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="자산에 대한 상세 설명을 입력하세요..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateAsset}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  등록
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 자산 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-pastel-blue-600" />
              자산 정보 수정
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.name}의 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">자산명 <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="개발팀 워크스테이션 #1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-serialNumber">시리얼번호 <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  placeholder="WS240001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">카테고리 <span className="text-red-500">*</span></Label>
                <Select value={formData.category} onValueChange={(value) => {
                  setFormData({...formData, category: value, subcategory: ""});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(assetCategories).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subcategory">세부 분류 <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => setFormData({...formData, subcategory: value})}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="세부 분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && assetCategories[formData.category as keyof typeof assetCategories]?.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-manufacturer">제조사</Label>
                <Input
                  id="edit-manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  placeholder="Dell"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">모델명</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="OptiPlex 7090"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-purchaseDate">구매일</Label>
                <Input
                  id="edit-purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-purchasePrice">구매가격 (원)</Label>
                <Input
                  id="edit-purchasePrice"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  placeholder="1500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-currentValue">현재가치 (원)</Label>
                <Input
                  id="edit-currentValue"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  placeholder="1200000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">상태 <span className="text-red-500">*</span></Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사용중">사용중</SelectItem>
                    <SelectItem value="대기중">대기중</SelectItem>
                    <SelectItem value="수리중">수리중</SelectItem>
                    <SelectItem value="폐기">폐기</SelectItem>
                    <SelectItem value="분실">분실</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-condition">컨디션</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="매우좋음">매우좋음</SelectItem>
                    <SelectItem value="좋음">좋음</SelectItem>
                    <SelectItem value="보통">보통</SelectItem>
                    <SelectItem value="나쁨">나쁨</SelectItem>
                    <SelectItem value="매우나쁨">매우나쁨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">위치 <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="5층 A구역"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">관리부서</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="개발팀"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-assignedEmployee">배정 직원</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-assignedEmployee"
                    value={formData.assignedEmployee}
                    placeholder="직원명"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenEmployeeSelect}
                    className="px-3"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-warrantyUntil">보증만료일</Label>
                <Input
                  id="edit-warrantyUntil"
                  type="date"
                  value={formData.warrantyUntil}
                  onChange={(e) => setFormData({...formData, warrantyUntil: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lastMaintenance">최종 점검일</Label>
                <Input
                  id="edit-lastMaintenance"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nextMaintenance">다음 점검일</Label>
                <Input
                  id="edit-nextMaintenance"
                  type="date"
                  value={formData.nextMaintenance}
                  onChange={(e) => setFormData({...formData, nextMaintenance: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">설명</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="자산에 대한 상세 설명을 입력하세요..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedAsset(null);
                resetForm();
              }}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handleEditAsset}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  수정 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  수정 완료
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 직원 선택 다이얼로그 */}
      <Dialog open={isEmployeeSelectDialogOpen} onOpenChange={setIsEmployeeSelectDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pastel-blue-600" />
              직원 선택
            </DialogTitle>
            <DialogDescription>
              자산을 배정할 직원을 선택하세요. 부서별로 필터링하거나 이름으로 검색할 수 있습니다.
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
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 부서</SelectItem>
                  {departments.map(dept => (
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
                      onClick={() => handleEmployeeSelect(employee)}
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
              onClick={() => setIsEmployeeSelectDialogOpen(false)}
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 자산 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              자산 삭제 확인
            </DialogTitle>
            <DialogDescription>
              이 작업은 되돌릴 수 없습니다. 정말로 이 자산을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="py-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    {getAssetIcon(selectedAsset.category, selectedAsset.subcategory)}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedAsset.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAsset.serialNumber} • {selectedAsset.manufacturer} {selectedAsset.model}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedAsset(null);
              }}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAsset}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  삭제
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}