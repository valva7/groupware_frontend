import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { ScrollArea } from "../../ui/scroll-area";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Code,
  Database,
  Tag,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// 공통코드 데이터 타입
interface CodeGroup {
  id: string;
  groupCode: string;
  groupName: string;
  description: string;
  useYn: boolean;
  codeCount: number;
}

interface CodeItem {
  id: string;
  groupCode: string;
  code: string;
  codeName: string;
  description: string;
  sortOrder: number;
  useYn: boolean;
}

// 초기 데이터
const initialCodeGroups: CodeGroup[] = [
  { id: "1", groupCode: "DEPT", groupName: "부서코드", description: "조직 부서 분류", useYn: true, codeCount: 8 },
  { id: "2", groupCode: "POSITION", groupName: "직급코드", description: "직원 직급 분류", useYn: true, codeCount: 6 },
  { id: "3", groupCode: "VACATION", groupName: "휴가유형", description: "휴가 종류 분류", useYn: true, codeCount: 5 },
  { id: "4", groupCode: "PROJECT_STATUS", groupName: "프로젝트상태", description: "프로젝트 진행 상태", useYn: true, codeCount: 4 },
  { id: "5", groupCode: "APPROVAL_STATUS", groupName: "결재상태", description: "전자결재 승인 상태", useYn: true, codeCount: 4 },
  { id: "6", groupCode: "BOARD_CATEGORY", groupName: "게시판카테고리", description: "게시판 분류 카테고리", useYn: true, codeCount: 7 }
];

const initialCodeItems: CodeItem[] = [
  // 부서코드
  { id: "1", groupCode: "DEPT", code: "D001", codeName: "경영지원팀", description: "경영 관련 업무 지원", sortOrder: 1, useYn: true },
  { id: "2", groupCode: "DEPT", code: "D002", codeName: "인사팀", description: "인사 관련 업무", sortOrder: 2, useYn: true },
  { id: "3", groupCode: "DEPT", code: "D003", codeName: "재무팀", description: "재무 관련 업무", sortOrder: 3, useYn: true },
  { id: "4", groupCode: "DEPT", code: "D004", codeName: "개발팀", description: "소프트웨어 개발", sortOrder: 4, useYn: true },
  { id: "5", groupCode: "DEPT", code: "D005", codeName: "디자인팀", description: "UI/UX 디자인", sortOrder: 5, useYn: true },
  { id: "6", groupCode: "DEPT", code: "D006", codeName: "영업팀", description: "영업 및 마케팅", sortOrder: 6, useYn: true },
  { id: "7", groupCode: "DEPT", code: "D007", codeName: "품질보증팀", description: "품질 관리 및 테스트", sortOrder: 7, useYn: true },
  { id: "8", groupCode: "DEPT", code: "D008", codeName: "고객지원팀", description: "고객 서비스 및 지원", sortOrder: 8, useYn: true },
  
  // 직급코드
  { id: "9", groupCode: "POSITION", code: "P001", codeName: "사원", description: "일반 사원", sortOrder: 1, useYn: true },
  { id: "10", groupCode: "POSITION", code: "P002", codeName: "주임", description: "주임급", sortOrder: 2, useYn: true },
  { id: "11", groupCode: "POSITION", code: "P003", codeName: "대리", description: "대리급", sortOrder: 3, useYn: true },
  { id: "12", groupCode: "POSITION", code: "P004", codeName: "과장", description: "과장급", sortOrder: 4, useYn: true },
  { id: "13", groupCode: "POSITION", code: "P005", codeName: "차장", description: "차장급", sortOrder: 5, useYn: true },
  { id: "14", groupCode: "POSITION", code: "P006", codeName: "부장", description: "부장급", sortOrder: 6, useYn: true },
  
  // 휴가유형
  { id: "15", groupCode: "VACATION", code: "V001", codeName: "연차", description: "연간 유급휴가", sortOrder: 1, useYn: true },
  { id: "16", groupCode: "VACATION", code: "V002", codeName: "반차", description: "반일 휴가", sortOrder: 2, useYn: true },
  { id: "17", groupCode: "VACATION", code: "V003", codeName: "병가", description: "질병으로 인한 휴가", sortOrder: 3, useYn: true },
  { id: "18", groupCode: "VACATION", code: "V004", codeName: "경조사", description: "경조사 휴가", sortOrder: 4, useYn: true },
  { id: "19", groupCode: "VACATION", code: "V005", codeName: "출산휴가", description: "출산 관련 휴가", sortOrder: 5, useYn: true },
  
  // 프로젝트상태
  { id: "20", groupCode: "PROJECT_STATUS", code: "PS001", codeName: "기획", description: "프로젝트 기획 단계", sortOrder: 1, useYn: true },
  { id: "21", groupCode: "PROJECT_STATUS", code: "PS002", codeName: "진행중", description: "프로젝트 진행 중", sortOrder: 2, useYn: true },
  { id: "22", groupCode: "PROJECT_STATUS", code: "PS003", codeName: "완료", description: "프로젝트 완료", sortOrder: 3, useYn: true },
  { id: "23", groupCode: "PROJECT_STATUS", code: "PS004", codeName: "중단", description: "프로젝트 중단", sortOrder: 4, useYn: true }
];

export function AdminCommonCodePage() {
  const [codeGroups, setCodeGroups] = useState<CodeGroup[]>(initialCodeGroups);
  const [codeItems, setCodeItems] = useState<CodeItem[]>(initialCodeItems);
  const [selectedGroup, setSelectedGroup] = useState<string>("DEPT");
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CodeGroup | null>(null);
  const [editingItem, setEditingItem] = useState<CodeItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'group' | 'item', id: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUseYn, setFilterUseYn] = useState<"all" | "Y" | "N">("all");
  const [copiedCode, setCopiedCode] = useState<string>("");

  // 그룹 폼 상태
  const [groupForm, setGroupForm] = useState({
    groupCode: "",
    groupName: "",
    description: "",
    useYn: true
  });

  // 아이템 폼 상태
  const [itemForm, setItemForm] = useState({
    code: "",
    codeName: "",
    description: "",
    sortOrder: 1,
    useYn: true
  });

  // 선택된 그룹의 코드 아이템들
  const selectedGroupItems = codeItems
    .filter(item => item.groupCode === selectedGroup)
    .filter(item => filterUseYn === "all" || (filterUseYn === "Y" ? item.useYn : !item.useYn))
    .filter(item => 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // 필터링된 그룹 목록
  const filteredGroups = codeGroups.filter(group =>
    group.groupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 그룹 생성/수정 핸들러
  const handleGroupSubmit = () => {
    if (!groupForm.groupCode || !groupForm.groupName) {
      toast.error("필수 항목을 입력해주세요.");
      return;
    }

    if (editingGroup) {
      const updatedGroups = codeGroups.map(group =>
        group.id === editingGroup.id ? { ...group, ...groupForm } : group
      );
      setCodeGroups(updatedGroups);
      toast.success("코드그룹이 수정되었습니다.");
    } else {
      const newGroup: CodeGroup = {
        id: Date.now().toString(),
        ...groupForm,
        codeCount: 0
      };
      setCodeGroups([...codeGroups, newGroup]);
      toast.success("새 코드그룹이 생성되었습니다.");
    }
    resetGroupForm();
  };

  // 코드 아이템 생성/수정 핸들러
  const handleItemSubmit = () => {
    if (!itemForm.code || !itemForm.codeName) {
      toast.error("필수 항목을 입력해주세요.");
      return;
    }

    if (editingItem) {
      const updatedItems = codeItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...itemForm, groupCode: selectedGroup }
          : item
      );
      setCodeItems(updatedItems);
      toast.success("코드가 수정되었습니다.");
    } else {
      const newItem: CodeItem = {
        id: Date.now().toString(),
        ...itemForm,
        groupCode: selectedGroup
      };
      setCodeItems([...codeItems, newItem]);
      
      // 그룹의 코드 개수 업데이트
      const updatedGroups = codeGroups.map(group =>
        group.groupCode === selectedGroup
          ? { ...group, codeCount: group.codeCount + 1 }
          : group
      );
      setCodeGroups(updatedGroups);
      
      toast.success("새 코드가 생성되었습니다.");
    }
    resetItemForm();
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'group') {
      setCodeGroups(codeGroups.filter(group => group.id !== deleteTarget.id));
      const targetGroup = codeGroups.find(group => group.id === deleteTarget.id);
      if (targetGroup) {
        setCodeItems(codeItems.filter(item => item.groupCode !== targetGroup.groupCode));
        if (selectedGroup === targetGroup.groupCode) {
          setSelectedGroup(codeGroups[0]?.groupCode || "");
        }
      }
      toast.success("코드그룹이 삭제되었습니다.");
    } else {
      const deletedItem = codeItems.find(item => item.id === deleteTarget.id);
      setCodeItems(codeItems.filter(item => item.id !== deleteTarget.id));
      
      if (deletedItem) {
        const updatedGroups = codeGroups.map(group =>
          group.groupCode === deletedItem.groupCode
            ? { ...group, codeCount: Math.max(0, group.codeCount - 1) }
            : group
        );
        setCodeGroups(updatedGroups);
      }
      
      toast.success("코드가 삭제되었습니다.");
    }

    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // 폼 리셋
  const resetGroupForm = () => {
    setGroupForm({ groupCode: "", groupName: "", description: "", useYn: true });
    setEditingGroup(null);
    setIsGroupDialogOpen(false);
  };

  const resetItemForm = () => {
    setItemForm({ code: "", codeName: "", description: "", sortOrder: 1, useYn: true });
    setEditingItem(null);
    setIsItemDialogOpen(false);
  };

  // 코드 복사
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("코드가 복사되었습니다.");
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // 그룹 편집
  const handleEditGroup = (group: CodeGroup) => {
    setEditingGroup(group);
    setGroupForm({
      groupCode: group.groupCode,
      groupName: group.groupName,
      description: group.description,
      useYn: group.useYn
    });
    setIsGroupDialogOpen(true);
  };

  // 아이템 편집
  const handleEditItem = (item: CodeItem) => {
    setEditingItem(item);
    setItemForm({
      code: item.code,
      codeName: item.codeName,
      description: item.description,
      sortOrder: item.sortOrder,
      useYn: item.useYn
    });
    setIsItemDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground">공통 코드 관리</h1>
          <p className="text-muted-foreground mt-1">시스템에서 사용되는 공통 코드를 관리할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            가져오기
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="코드 또는 코드명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterUseYn} onValueChange={(value: "all" | "Y" | "N") => setFilterUseYn(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="Y">사용중</SelectItem>
                  <SelectItem value="N">미사용</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 코드 그룹 목록 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                코드 그룹
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  resetGroupForm();
                  setIsGroupDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-0 space-y-2">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedGroup === group.groupCode
                          ? "bg-pastel-blue-100 border-pastel-blue-300"
                          : "hover:bg-muted border-border"
                      }`}
                      onClick={() => setSelectedGroup(group.groupCode)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-pastel-blue-600" />
                          <span className="font-medium">{group.groupCode}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(group);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget({ type: 'group', id: group.id });
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{group.groupName}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {group.codeCount}개
                        </Badge>
                        <Badge variant={group.useYn ? "default" : "secondary"} className="text-xs">
                          {group.useYn ? "사용중" : "미사용"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 코드 아이템 목록 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                코드 목록
                {selectedGroup && (
                  <Badge variant="outline">
                    {codeGroups.find(g => g.groupCode === selectedGroup)?.groupName}
                  </Badge>
                )}
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  resetItemForm();
                  setIsItemDialogOpen(true);
                }}
                disabled={!selectedGroup}
              >
                <Plus className="h-4 w-4 mr-2" />
                코드 추가
              </Button>
            </CardHeader>
            <CardContent>
              {selectedGroup ? (
                <div className="space-y-4">
                  {/* 데스크톱: 테이블 */}
                  <div className="hidden md:block rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">코드</TableHead>
                          <TableHead>코드명</TableHead>
                          <TableHead>설명</TableHead>
                          <TableHead className="w-[80px]">순서</TableHead>
                          <TableHead className="w-[80px]">상태</TableHead>
                          <TableHead className="w-[100px]">작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedGroupItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                  {item.code}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleCopyCode(item.code)}
                                >
                                  {copiedCode === item.code ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.codeName}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {item.description || "-"}
                            </TableCell>
                            <TableCell>{item.sortOrder}</TableCell>
                            <TableCell>
                              <Badge variant={item.useYn ? "default" : "secondary"} className="text-xs">
                                {item.useYn ? "사용중" : "미사용"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    setDeleteTarget({ type: 'item', id: item.id });
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 모바일: 카드 */}
                  <div className="md:hidden space-y-3">
                    {selectedGroupItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {item.code}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleCopyCode(item.code)}
                            >
                              {copiedCode === item.code ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                              onClick={() => {
                                setDeleteTarget({ type: 'item', id: item.id });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">{item.codeName}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">순서: {item.sortOrder}</span>
                            <Badge variant={item.useYn ? "default" : "secondary"} className="text-xs">
                              {item.useYn ? "사용중" : "미사용"}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                    
                  {selectedGroupItems.length === 0 && (
                    <div className="text-center py-8">
                      <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">코드가 없습니다</h3>
                      <p className="text-sm text-muted-foreground">새로운 코드를 추가해보세요.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">그룹을 선택해주세요</h3>
                  <p className="text-sm text-muted-foreground">왼쪽에서 코드 그룹을 선택하면 해당 코드 목록을 확인할 수 있습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 코드 그룹 생성/편집 다이얼로그 */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "코드 그룹 수정" : "새 코드 그룹 생성"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup ? "코드 그룹 정보를 수정해주세요." : "새로운 코드 그룹을 생성해주세요."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-code">그룹 코드 *</Label>
              <Input
                id="group-code"
                placeholder="예: DEPT"
                value={groupForm.groupCode}
                onChange={(e) => setGroupForm({...groupForm, groupCode: e.target.value.toUpperCase()})}
                disabled={!!editingGroup}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group-name">그룹명 *</Label>
              <Input
                id="group-name"
                placeholder="예: 부서코드"
                value={groupForm.groupName}
                onChange={(e) => setGroupForm({...groupForm, groupName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group-description">설명</Label>
              <Textarea
                id="group-description"
                placeholder="그룹에 대한 설명을 입력하세요..."
                value={groupForm.description}
                onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="group-use-yn"
                checked={groupForm.useYn}
                onCheckedChange={(checked) => setGroupForm({...groupForm, useYn: checked})}
              />
              <Label htmlFor="group-use-yn">사용 여부</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetGroupForm}>
              취소
            </Button>
            <Button onClick={handleGroupSubmit}>
              {editingGroup ? "수정" : "생성"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 코드 아이템 생성/편집 다이얼로그 */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "코드 수정" : "새 코드 생성"}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "코드 정보를 수정해주세요." : "새로운 코드를 생성해주세요."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-code">코드 *</Label>
              <Input
                id="item-code"
                placeholder="예: D001"
                value={itemForm.code}
                onChange={(e) => setItemForm({...itemForm, code: e.target.value.toUpperCase()})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-name">코드명 *</Label>
              <Input
                id="item-name"
                placeholder="예: 개발팀"
                value={itemForm.codeName}
                onChange={(e) => setItemForm({...itemForm, codeName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-description">설명</Label>
              <Textarea
                id="item-description"
                placeholder="코드에 대한 설명을 입력하세요..."
                value={itemForm.description}
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-sort-order">순서</Label>
              <Input
                id="item-sort-order"
                type="number"
                min="1"
                value={itemForm.sortOrder}
                onChange={(e) => setItemForm({...itemForm, sortOrder: parseInt(e.target.value) || 1})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="item-use-yn"
                checked={itemForm.useYn}
                onCheckedChange={(checked) => setItemForm({...itemForm, useYn: checked})}
              />
              <Label htmlFor="item-use-yn">사용 여부</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetItemForm}>
              취소
            </Button>
            <Button onClick={handleItemSubmit}>
              {editingItem ? "수정" : "생성"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'group' 
                ? "이 코드 그룹을 삭제하시겠습니까? 그룹에 속한 모든 코드도 함께 삭제됩니다."
                : "이 코드를 삭제하시겠습니까?"
              }
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}