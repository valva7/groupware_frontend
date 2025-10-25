import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Plus, Edit, Trash2, Settings, Code } from 'lucide-react';
import { toast } from "sonner";
import { CommonCode } from '../../types';

const mockCommonCodes: CommonCode[] = [
  {
    id: '1',
    groupCode: 'LEAVE_TYPE',
    groupName: '휴가유형',
    code: 'ANNUAL',
    name: '연차',
    description: '연차 휴가',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    groupCode: 'LEAVE_TYPE',
    groupName: '휴가유형',
    code: 'SICK',
    name: '병가',
    description: '병가 휴가',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    groupCode: 'LEAVE_TYPE',
    groupName: '휴가유형',
    code: 'PERSONAL',
    name: '개인',
    description: '개인사유 휴가',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    groupCode: 'APPROVAL_TYPE',
    groupName: '결재유형',
    code: 'VACATION',
    name: '휴가신청',
    description: '휴가 신청 결재',
    order: 1,
    isActive: true,
  },
  {
    id: '5',
    groupCode: 'APPROVAL_TYPE',
    groupName: '결재유형',
    code: 'PURCHASE',
    name: '구매요청',
    description: '물품 구매 요청 결재',
    order: 2,
    isActive: true,
  },
  {
    id: '6',
    groupCode: 'PROJECT_STATUS',
    groupName: '프로젝트상태',
    code: 'PLANNING',
    name: '기획',
    description: '프로젝트 기획 단계',
    order: 1,
    isActive: true,
  },
  {
    id: '7',
    groupCode: 'PROJECT_STATUS',
    groupName: '프로젝트상태',
    code: 'ACTIVE',
    name: '진행중',
    description: '프로젝트 진행 중',
    order: 2,
    isActive: true,
  },
  {
    id: '8',
    groupCode: 'PROJECT_STATUS',
    groupName: '프로젝트상태',
    code: 'COMPLETED',
    name: '완료',
    description: '프로젝트 완료',
    order: 3,
    isActive: true,
  },
];

export function AdminCommonCodes() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<CommonCode | null>(null);
  const [formData, setFormData] = useState({
    groupCode: '',
    groupName: '',
    code: '',
    name: '',
    description: '',
    order: '',
  });

  // 그룹별로 공통코드 분류
  const groupedCodes = mockCommonCodes.reduce((acc, code) => {
    if (!acc[code.groupCode]) {
      acc[code.groupCode] = {
        groupCode: code.groupCode,
        groupName: code.groupName,
        codes: [],
      };
    }
    acc[code.groupCode].codes.push(code);
    return acc;
  }, {} as Record<string, { groupCode: string; groupName: string; codes: CommonCode[] }>);

  const groups = Object.values(groupedCodes);

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.codes.some(code => 
      code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getSelectedGroupCodes = () => {
    if (!selectedGroup) return [];
    return groupedCodes[selectedGroup]?.codes || [];
  };

  const handleCreateGroup = () => {
    setEditingCode(null);
    setFormData({ groupCode: '', groupName: '', code: '', name: '', description: '', order: '1' });
    setDialogOpen(true);
  };

  const handleCreateCode = () => {
    if (!selectedGroup) {
      toast.error('먼저 그룹을 선택해주세요.');
      return;
    }
    
    setEditingCode(null);
    const group = groupedCodes[selectedGroup];
    setFormData({ 
      groupCode: selectedGroup, 
      groupName: group.groupName, 
      code: '', 
      name: '', 
      description: '', 
      order: (group.codes.length + 1).toString()
    });
    setDialogOpen(true);
  };

  const handleEdit = (code: CommonCode) => {
    setEditingCode(code);
    setFormData({
      groupCode: code.groupCode,
      groupName: code.groupName,
      code: code.code,
      name: code.name,
      description: code.description || '',
      order: code.order.toString(),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.groupCode || !formData.groupName || !formData.code || !formData.name) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const message = editingCode ? '공통코드가 수정되었습니다.' : '새로운 공통코드가 생성되었습니다.';
    toast.success(message);
    setDialogOpen(false);
  };

  const handleDelete = (code: CommonCode) => {
    if (confirm(`'${code.name}' 코드를 삭제하시겠습니까?`)) {
      toast.success('공통코드가 삭제되었습니다.');
    }
  };

  const toggleStatus = (code: CommonCode) => {
    const status = code.isActive ? '비활성화' : '활성화';
    toast.success(`'${code.name}' 코드가 ${status}되었습니다.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">공통 코드 관리</h1>
          <p className="text-muted-foreground">시스템에서 사용하는 공통 코드를 관리합니다.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCreateGroup} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            새 그룹
          </Button>
          <Button onClick={handleCreateCode} disabled={!selectedGroup} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            새 코드
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px] lg:h-[calc(100vh-200px)]">
        {/* 그룹 목록 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              코드 그룹
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="그룹명, 코드명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {filteredGroups.map((group) => (
                <div
                  key={group.groupCode}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedGroup === group.groupCode ? 'bg-accent border border-primary/20' : 'border border-transparent'
                  }`}
                  onClick={() => setSelectedGroup(group.groupCode)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{group.groupName}</div>
                      <div className="text-sm text-muted-foreground truncate">{group.groupCode}</div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0 ml-2">
                      {group.codes.length}개
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 코드 상세 목록 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="truncate">
                {selectedGroup ? groupedCodes[selectedGroup]?.groupName || '코드 목록' : '그룹을 선택하세요'}
              </span>
            </CardTitle>
            {selectedGroup && (
              <div className="lg:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedGroup(null)}
                  className="w-full"
                >
                  ← 그룹 목록으로 돌아가기
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {selectedGroup ? (
              <>
                {/* 데스크톱 테이블 뷰 */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>순서</TableHead>
                        <TableHead>코드</TableHead>
                        <TableHead>코드명</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSelectedGroupCodes()
                        .sort((a, b) => a.order - b.order)
                        .map((code) => (
                        <TableRow key={code.id}>
                          <TableCell>{code.order}</TableCell>
                          <TableCell className="font-mono text-sm">{code.code}</TableCell>
                          <TableCell className="font-medium">{code.name}</TableCell>
                          <TableCell>
                            <Badge variant={code.isActive ? 'default' : 'secondary'}>
                              {code.isActive ? '활성' : '비활성'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStatus(code)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(code)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(code)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {getSelectedGroupCodes().length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            이 그룹에는 코드가 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* 모바일/태블릿 카드 뷰 */}
                <div className="lg:hidden space-y-3">
                  {getSelectedGroupCodes()
                    .sort((a, b) => a.order - b.order)
                    .map((code) => (
                    <Card key={code.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* 코드명과 상태 */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{code.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">{code.code}</div>
                            </div>
                            <Badge variant={code.isActive ? 'default' : 'secondary'} className="shrink-0 ml-2">
                              {code.isActive ? '활성' : '비활성'}
                            </Badge>
                          </div>

                          {/* 순서와 설명 */}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">순서: {code.order}</span>
                            {code.description && (
                              <span className="text-muted-foreground flex-1 truncate">
                                {code.description}
                              </span>
                            )}
                          </div>

                          {/* 작업 버튼들 */}
                          <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStatus(code)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              {code.isActive ? '비활성화' : '활성화'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(code)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              편집
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(code)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              삭제
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getSelectedGroupCodes().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      이 그룹에는 코드가 없습니다.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="hidden lg:block">좌측에서 코드 그룹을 선택하면</p>
                  <p className="lg:hidden">위에서 코드 그룹을 선택하면</p>
                  <p>해당 그룹의 코드 목록을 확인할 수 있습니다.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 코드 생성/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCode ? '공통코드 편집' : '새 공통코드'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupCode">그룹코드 *</Label>
                <Input
                  id="groupCode"
                  placeholder="LEAVE_TYPE"
                  value={formData.groupCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, groupCode: e.target.value.toUpperCase() }))}
                  disabled={!!selectedGroup && !editingCode}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupName">그룹명 *</Label>
                <Input
                  id="groupName"
                  placeholder="휴가유형"
                  value={formData.groupName}
                  onChange={(e) => setFormData(prev => ({ ...prev, groupName: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">코드 *</Label>
                <Input
                  id="code"
                  placeholder="ANNUAL"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order">순서</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="1"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">코드명 *</Label>
              <Input
                id="name"
                placeholder="연차"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="코드에 대한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                취소
              </Button>
              <Button onClick={handleSave} className="w-full sm:w-auto">
                {editingCode ? '수정' : '생성'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}