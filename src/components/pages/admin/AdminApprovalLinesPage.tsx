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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { Alert, AlertDescription } from "../../ui/alert";
import { 
  GitBranch, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { 
  ApprovalLine, 
  ApprovalStep, 
  approvers, 
  initialApprovalLines, 
  approvalCategories, 
  approvalTypes 
} from "../../../data/adminData";

export function AdminApprovalLinesPage() {
  const [approvalLines, setApprovalLines] = useState<ApprovalLine[]>(initialApprovalLines);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedLine, setSelectedLine] = useState<ApprovalLine | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStepsDialogOpen, setIsStepsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    steps: [] as ApprovalStep[]
  });

  const [stepForm, setStepForm] = useState({
    approverId: "",
    approvalType: "승인",
    isRequired: true
  });

  // 필터링된 승인라인 목록
  const filteredLines = approvalLines.filter(line => {
    const matchesSearch = 
      line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "전체" || line.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddStep = () => {
    if (!stepForm.approverId) {
      toast.error("승인자를 선택해주세요.");
      return;
    }

    const approver = approvers.find(a => a.id === stepForm.approverId);
    if (!approver) return;

    const newStep: ApprovalStep = {
      id: `step_${Date.now()}`,
      order: formData.steps.length + 1,
      approverId: stepForm.approverId,
      approverName: approver.name,
      approverPosition: approver.position,
      department: approver.department,
      approvalType: stepForm.approvalType as ApprovalStep['approvalType'],
      isRequired: stepForm.isRequired
    };

    setFormData({
      ...formData,
      steps: [...formData.steps, newStep]
    });

    setStepForm({
      approverId: "",
      approvalType: "승인",
      isRequired: true
    });

    toast.success("승인 단계가 추가되었습니다.");
  };

  const handleRemoveStep = (stepId: string) => {
    const updatedSteps = formData.steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index + 1 }));
    
    setFormData({ ...formData, steps: updatedSteps });
    toast.success("승인 단계가 제거되었습니다.");
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = formData.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (newIndex < 0 || newIndex >= formData.steps.length) return;

    const newSteps = [...formData.steps];
    [newSteps[stepIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[stepIndex]];
    
    // 순서 재정렬
    const reorderedSteps = newSteps.map((step, index) => ({ ...step, order: index + 1 }));
    
    setFormData({ ...formData, steps: reorderedSteps });
    toast.success("승인 단계 순서가 변경되었습니다.");
  };

  const handleCreateLine = () => {
    if (!formData.name || !formData.code || formData.steps.length === 0) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newLine: ApprovalLine = {
      id: `line_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      category: formData.category,
      steps: formData.steps,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: "관리자"
    };

    setApprovalLines([...approvalLines, newLine]);
    toast.success("새 승인라인이 생성되었습니다.");
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleCopyLine = (line: ApprovalLine) => {
    setFormData({
      name: `${line.name} (복사본)`,
      code: `${line.code}_COPY`,
      description: line.description,
      category: line.category,
      steps: line.steps.map(step => ({
        ...step,
        id: `step_${Date.now()}_${step.order}`
      }))
    });
    setIsCreateDialogOpen(true);
    toast.success("승인라인이 복사되었습니다.");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      category: "",
      steps: []
    });
    setStepForm({
      approverId: "",
      approvalType: "승인",
      isRequired: true
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "승인": return "bg-blue-100 text-blue-700";
      case "합의": return "bg-yellow-100 text-yellow-700";
      case "참조": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStats = () => {
    const total = approvalLines.length;
    const active = approvalLines.filter(line => line.isActive).length;
    const totalUsage = approvalLines.reduce((sum, line) => sum + line.usageCount, 0);
    const avgSteps = approvalLines.reduce((sum, line) => sum + line.steps.length, 0) / total || 0;
    
    return { total, active, totalUsage, avgSteps: Math.round(avgSteps * 10) / 10 };
  };

  const { total, active, totalUsage, avgSteps } = getStats();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1>결재선 관리</h1>
          <p className="text-muted-foreground">
            전자결재에 사용할 승인라인을 생성하고 관리할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="sm:inline">승인라인 생성</span>
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 승인라인</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{total}</div>
            <p className="text-xs text-muted-foreground">등록된 승인라인</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">활성 승인라인</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{active}</div>
            <p className="text-xs text-muted-foreground">사용 가능한 라인</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 사용횟수</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">누적 사용 횟수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">평균 단계수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgSteps}</div>
            <p className="text-xs text-muted-foreground">승인 단계 평균</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="승인라인명, 코드, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {approvalCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 승인라인 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>승인라인 목록 ({filteredLines.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>승인라인 정보</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>승인 단계</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>사용횟수</TableHead>
                    <TableHead>최종 수정일</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{line.name}</div>
                          <div className="text-sm text-muted-foreground">{line.code}</div>
                          <div className="text-xs text-muted-foreground mt-1">{line.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{line.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{line.steps.length}단계</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLine(line);
                              setIsStepsDialogOpen(true);
                            }}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={line.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {line.isActive ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell>{line.usageCount}</TableCell>
                      <TableCell>{line.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLine(line)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLine(line);
                              setFormData({
                                name: line.name,
                                code: line.code,
                                description: line.description,
                                category: line.category,
                                steps: line.steps
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLine(line);
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
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {filteredLines.map((line) => (
                  <Card key={line.id} className="p-4">
                    <div className="space-y-3">
                      {/* 상단: 제목 및 상태 */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{line.name}</h4>
                          <p className="text-sm text-muted-foreground">{line.code}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <Badge className={line.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {line.isActive ? "활성" : "비활성"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{line.category}</Badge>
                        </div>
                      </div>

                      {/* 설명 */}
                      {line.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{line.description}</p>
                      )}

                      {/* 정보 행 */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">단계:</span>
                            <span>{line.steps.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">사용:</span>
                            <span>{line.usageCount}회</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLine(line);
                            setIsStepsDialogOpen(true);
                          }}
                          className="h-8 px-2"
                        >
                          <ArrowRight className="h-3 w-3" />
                          상세
                        </Button>
                      </div>

                      {/* 하단: 관리 버튼들 */}
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-xs text-muted-foreground">{line.updatedAt}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLine(line)}
                            className="h-8 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLine(line);
                              setFormData({
                                name: line.name,
                                code: line.code,
                                description: line.description,
                                category: line.category,
                                steps: line.steps
                              });
                              setIsEditDialogOpen(true);
                            }}
                            className="h-8 px-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLine(line);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {filteredLines.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <GitBranch className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>등록된 승인라인이 없습니다.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* 승인라인 생성 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" aria-describedby="create-line-description">
          <DialogHeader>
            <DialogTitle>새 승인라인 생성</DialogTitle>
            <DialogDescription id="create-line-description">
              새로운 승인라인의 정보와 승인 단계를 설정하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h4 className="text-base">기본 정보</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">승인라인명 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="일반 휴가 승인라인"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">라인 코드 *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="VACATION_GENERAL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvalCategories.filter(cat => cat !== "전체").map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="승인라인에 대한 설명을 입력하세요..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* 승인 단계 설정 */}
            <div className="space-y-4">
              <h4 className="text-base">승인 단계 설정</h4>
              
              {/* 단계 추가 폼 */}
              <div className="p-3 lg:p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>승인자 *</Label>
                    <Select value={stepForm.approverId} onValueChange={(value) => setStepForm({...stepForm, approverId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="승인자 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvers.map(approver => (
                          <SelectItem key={approver.id} value={approver.id}>
                            {approver.name} ({approver.position})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>승인 유형</Label>
                    <Select value={stepForm.approvalType} onValueChange={(value) => setStepForm({...stepForm, approvalType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {approvalTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAddStep} className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  승인 단계 추가
                </Button>
              </div>

              {/* 추가된 단계 목록 */}
              <div className="space-y-2">
                <Label>승인 단계 ({formData.steps.length}개)</Label>
                <ScrollArea className="h-48 lg:h-48 border rounded-lg p-2">
                  <div className="space-y-2">
                    {formData.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{step.order}단계:</span>
                            <span className="text-sm truncate">{step.approverName}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`${getTypeColor(step.approvalType)} text-xs`}>
                              {step.approvalType}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {step.approverPosition} • {step.department}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveStep(step.id, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveStep(step.id, 'down')}
                            disabled={index === formData.steps.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStep(step.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateLine}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 승인 단계 상세보기 다이얼로그 */}
      <Dialog open={isStepsDialogOpen} onOpenChange={setIsStepsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="steps-detail-description">
          <DialogHeader>
            <DialogTitle>승인 단계 상세</DialogTitle>
            <DialogDescription id="steps-detail-description">
              {selectedLine?.name}의 승인 단계를 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLine && (
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedLine.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-8 h-8 bg-pastel-blue-100 text-pastel-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {step.order}
                      </div>
                      {index < selectedLine.steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start sm:items-center gap-2 mb-1 flex-wrap">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {step.approverName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate">{step.approverName}</span>
                        <Badge variant="outline" className={`${getTypeColor(step.approvalType)} text-xs flex-shrink-0`}>
                          {step.approvalType}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {step.approverPosition} • {step.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStepsDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="delete-line-description">
          <DialogHeader>
            <DialogTitle>승인라인 삭제 확인</DialogTitle>
            <DialogDescription id="delete-line-description">
              선택한 승인라인을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          {selectedLine && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{selectedLine.name}</strong><br />
                사용횟수: {selectedLine.usageCount}회<br />
                삭제 후 관련된 전자결재가 영향을 받을 수 있습니다.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedLine) {
                  setApprovalLines(approvalLines.filter(line => line.id !== selectedLine.id));
                  toast.success("승인라인이 삭제되었습니다.");
                  setIsDeleteDialogOpen(false);
                  setSelectedLine(null);
                }
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}