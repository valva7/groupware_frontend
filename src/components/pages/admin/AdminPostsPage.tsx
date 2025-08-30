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
import { Switch } from "../../ui/switch";
import { Alert, AlertDescription } from "../../ui/alert";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical,
  Tag,
  FileText,
  BarChart3,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Settings,
  Hash
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
  isDefault: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

const colorOptions = [
  { value: "blue", label: "파랑", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "green", label: "초록", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "purple", label: "보라", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "orange", label: "주황", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "red", label: "빨강", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "yellow", label: "노랑", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "gray", label: "회색", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { value: "indigo", label: "남색", color: "bg-indigo-100 text-indigo-700 border-indigo-200" }
];

const iconOptions = [
  { value: "tag", label: "태그", icon: Tag },
  { value: "filetext", label: "문서", icon: FileText },
  { value: "hash", label: "해시", icon: Hash },
  { value: "settings", label: "설정", icon: Settings },
  { value: "barchart", label: "차트", icon: BarChart3 }
];

const initialCategories: Category[] = [
  {
    id: "all",
    name: "전체",
    description: "모든 게시물을 표시하는 기본 카테고리",
    color: "gray",
    icon: "tag",
    order: 0,
    isActive: true,
    isDefault: true,
    postCount: 127,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "notice",
    name: "공지사항",
    description: "중요한 공지 및 안내사항",
    color: "red",
    icon: "filetext",
    order: 1,
    isActive: true,
    isDefault: true,
    postCount: 15,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15"
  },
  {
    id: "event",
    name: "행사",
    description: "회사 행사 및 이벤트 관련",
    color: "purple",
    icon: "tag",
    order: 2,
    isActive: true,
    isDefault: false,
    postCount: 8,
    createdAt: "2024-01-01",
    updatedAt: "2024-02-20"
  },
  {
    id: "work",
    name: "업무",
    description: "업무 관련 게시물",
    color: "blue",
    icon: "barchart",
    order: 3,
    isActive: true,
    isDefault: false,
    postCount: 42,
    createdAt: "2024-01-01",
    updatedAt: "2024-04-01"
  },
  {
    id: "general",
    name: "일반",
    description: "일반적인 정보 공유",
    color: "green",
    icon: "tag",
    order: 4,
    isActive: true,
    isDefault: false,
    postCount: 35,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-20"
  },
  {
    id: "question",
    name: "질문",
    description: "질문 및 문의사항",
    color: "yellow",
    icon: "hash",
    order: 5,
    isActive: true,
    isDefault: false,
    postCount: 18,
    createdAt: "2024-01-01",
    updatedAt: "2024-04-05"
  },
  {
    id: "suggestion",
    name: "건의사항",
    description: "개선 제안 및 건의사항",
    color: "orange",
    icon: "settings",
    order: 6,
    isActive: true,
    isDefault: false,
    postCount: 9,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-10"
  }
];

export function AdminPostsPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue",
    icon: "tag"
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "blue",
      icon: "tag"
    });
  };

  const handleCreateCategory = () => {
    if (!formData.name.trim()) {
      toast.error("카테고리명을 입력해주세요.");
      return;
    }

    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: formData.icon,
      order: categories.length,
      isActive: true,
      isDefault: false,
      postCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setCategories([...categories, newCategory]);
    toast.success("새 카테고리가 생성되었습니다.");
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditCategory = () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error("카테고리명을 입력해주세요.");
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id 
        ? {
            ...cat,
            name: formData.name,
            description: formData.description,
            color: formData.color,
            icon: formData.icon,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : cat
    ));

    toast.success("카테고리가 수정되었습니다.");
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
    resetForm();
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    if (selectedCategory.isDefault) {
      toast.error("기본 카테고리는 삭제할 수 없습니다.");
      return;
    }

    setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    toast.success("카테고리가 삭제되었습니다.");
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleToggleActive = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category?.isDefault) {
      toast.error("기본 카테고리는 비활성화할 수 없습니다.");
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isActive: !cat.isActive }
        : cat
    ));

    const updatedCategory = categories.find(cat => cat.id === categoryId);
    toast.success(`카테고리가 ${updatedCategory?.isActive ? '비활성화' : '활성화'}되었습니다.`);
  };

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return;

    const newIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const newCategories = [...categories];
    [newCategories[categoryIndex], newCategories[newIndex]] = [newCategories[newIndex], newCategories[categoryIndex]];
    
    // 순서 재정렬
    const reorderedCategories = newCategories.map((cat, index) => ({ ...cat, order: index }));
    
    setCategories(reorderedCategories);
    toast.success("카테고리 순서가 변경되었습니다.");
  };

  const getColorClass = (color: string) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption?.color || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    const IconComponent = iconOption?.icon || Tag;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStats = () => {
    const total = categories.length;
    const active = categories.filter(cat => cat.isActive).length;
    const totalPosts = categories.reduce((sum, cat) => sum + cat.postCount, 0);
    const avgPosts = totalPosts / categories.filter(cat => cat.id !== 'all').length || 0;
    
    return { total, active, totalPosts, avgPosts: Math.round(avgPosts * 10) / 10 };
  };

  const { total, active, totalPosts, avgPosts } = getStats();

  return (
    <div className="space-y-6">
      {/* 헤더 - 모바일 반응형 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl">게시물 카테고리 관리</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            게시판의 카테고리를 생성, 수정, 삭제하고 순서를 관리할 수 있습니다.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)} 
          className="gap-2 w-full sm:w-auto h-10 sm:h-9"
        >
          <Plus className="h-4 w-4" />
          <span className="sm:inline">카테고리 추가</span>
        </Button>
      </div>

      {/* 통계 카드 - 모바일 반응형 그리드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">총 카테고리</CardTitle>
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-semibold">{total}</div>
            <p className="text-xs text-muted-foreground">
              등록된 카테고리
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">활성 카테고리</CardTitle>
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-semibold">{active}</div>
            <p className="text-xs text-muted-foreground">
              사용 가능한 카테고리
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">총 게시물</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-semibold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              전체 게시물 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">평균 게시물</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-semibold">{avgPosts}</div>
            <p className="text-xs text-muted-foreground">
              카테고리별 평균
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리 목록 - 반응형 레이아웃 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">카테고리 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {/* 데스크톱: 테이블 레이아웃 */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">순서</TableHead>
                    <TableHead>카테고리 정보</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>게시물 수</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>최종 수정일</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories
                    .sort((a, b) => a.order - b.order)
                    .map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="text-sm">{category.order + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getColorClass(category.color)}`}>
                            {getIconComponent(category.icon)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{category.name}</span>
                              {category.isDefault && (
                                <Badge variant="outline" className="text-xs">기본</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {category.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-xs">
                          {category.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{category.postCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {category.isActive ? "활성" : "비활성"}
                          </Badge>
                          <Switch
                            checked={category.isActive}
                            onCheckedChange={() => handleToggleActive(category.id)}
                            disabled={category.isDefault}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{category.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveCategory(category.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveCategory(category.id, 'down')}
                            disabled={index === categories.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setFormData({
                                name: category.name,
                                description: category.description,
                                color: category.color,
                                icon: category.icon
                              });
                              setIsEditDialogOpen(true);
                            }}
                            disabled={category.isDefault}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={category.isDefault}
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
          </div>

          {/* 모바일/태블릿: 카드 레이아웃 */}
          <div className="lg:hidden">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((category, index) => (
                  <Card key={category.id} className="border border-muted">
                    <CardContent className="p-4">
                      {/* 카테고리 헤더 */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{category.order + 1}</span>
                          </div>
                          <div className={`p-2 rounded-lg border ${getColorClass(category.color)} flex-shrink-0`}>
                            {getIconComponent(category.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium truncate">{category.name}</span>
                              {category.isDefault && (
                                <Badge variant="outline" className="text-xs flex-shrink-0">기본</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {category.id}
                            </div>
                          </div>
                        </div>
                        
                        {/* 상태 스위치 */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`text-xs ${category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {category.isActive ? "활성" : "비활성"}
                          </Badge>
                          <Switch
                            size="sm"
                            checked={category.isActive}
                            onCheckedChange={() => handleToggleActive(category.id)}
                            disabled={category.isDefault}
                          />
                        </div>
                      </div>

                      {/* 카테고리 정보 */}
                      <div className="space-y-2 mb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>게시물 {category.postCount}개</span>
                          </div>
                          <span>수정: {category.updatedAt}</span>
                        </div>
                      </div>

                      {/* 관리 버튼들 */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveCategory(category.id, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveCategory(category.id, 'down')}
                            disabled={index === categories.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setFormData({
                                name: category.name,
                                description: category.description,
                                color: category.color,
                                icon: category.icon
                              });
                              setIsEditDialogOpen(true);
                            }}
                            disabled={category.isDefault}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={category.isDefault}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 생성 다이얼로그 - 모바일 반응형 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent 
          className="w-[95vw] sm:w-[90vw] max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col" 
          aria-describedby="create-category-description"
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-base sm:text-lg">새 카테고리 생성</DialogTitle>
            <DialogDescription id="create-category-description" className="text-sm">
              새로운 게시물 카테고리를 생성하세요.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">카테고리명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="예: 공지사항"
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="카테고리에 대한 설명을 입력하세요..."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm">색상</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.color.split(' ')[0]}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-sm">아이콘</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => {
                        const IconComponent = icon.icon;
                        return (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 미리보기 */}
              <div className="space-y-2">
                <Label className="text-sm">미리보기</Label>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                  <div className={`p-2 rounded-lg border ${getColorClass(formData.color)}`}>
                    {getIconComponent(formData.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{formData.name || '카테고리명'}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {formData.description || '설명'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1 h-10"
              >
                취소
              </Button>
              <Button 
                onClick={handleCreateCategory}
                className="flex-1 h-10 bg-pastel-blue-500 hover:bg-pastel-blue-600"
              >
                생성
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카테고리 수정 다이얼로그 - 모바일 반응형 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="w-[95vw] sm:w-[90vw] max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col" 
          aria-describedby="edit-category-description"
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-base sm:text-lg">카테고리 수정</DialogTitle>
            <DialogDescription id="edit-category-description" className="text-sm">
              선택한 카테고리의 정보를 수정하세요.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm">카테고리명 *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm">설명</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-color" className="text-sm">색상</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.color.split(' ')[0]}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-icon" className="text-sm">아이콘</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => {
                        const IconComponent = icon.icon;
                        return (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 미리보기 */}
              <div className="space-y-2">
                <Label className="text-sm">미리보기</Label>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                  <div className={`p-2 rounded-lg border ${getColorClass(formData.color)}`}>
                    {getIconComponent(formData.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{formData.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {formData.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 h-10"
              >
                취소
              </Button>
              <Button 
                onClick={handleEditCategory}
                className="flex-1 h-10 bg-pastel-blue-500 hover:bg-pastel-blue-600"
              >
                수정
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카테고리 삭제 다이얼로그 - 모바일 반응형 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent 
          className="w-[95vw] sm:w-[90vw] max-w-md mx-auto" 
          aria-describedby="delete-category-description"
        >
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">카테고리 삭제 확인</DialogTitle>
            <DialogDescription id="delete-category-description" className="text-sm">
              선택한 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCategory && (
            <Alert className="my-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>{selectedCategory.name}</strong> 카테고리를 삭제합니다.<br />
                현재 이 카테고리에는 {selectedCategory.postCount}개의 게시물이 있습니다.<br />
                삭제 후 해당 게시물들은 '일반' 카테고리로 이동됩니다.
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 h-10"
              >
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteCategory}
                className="flex-1 h-10"
              >
                삭제
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}