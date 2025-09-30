import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command';
import { Search, Plus, Edit, Trash2, Users, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ApprovalLine {
  id: string;
  name: string;
  description: string;
  approvers: ApprovalLineApprover[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

interface ApprovalLineApprover {
  id: string;
  memberId: string;
  memberName: string;
  department: string;
  position: string;
  order: number;
}

const mockMembers = [
  { id: '1', name: '김팀장', department: '개발팀', position: '팀장' },
  { id: '2', name: '이부장', department: '개발팀', position: '부장' },
  { id: '3', name: '박상무', department: '경영진', position: '상무' },
  { id: '4', name: '최대표', department: '경영진', position: '대표이사' },
  { id: '5', name: '홍인사', department: '인사팀', position: '팀장' },
];

const mockApprovalLines: ApprovalLine[] = [
  {
    id: '1',
    name: '일반 결재선',
    description: '일반적인 업무 결재를 위한 기본 결재선',
    approvers: [
      { id: '1', memberId: '1', memberName: '김팀장', department: '개발팀', position: '팀장', order: 1 },
      { id: '2', memberId: '2', memberName: '이부장', department: '개발팀', position: '부장', order: 2 },
    ],
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: '휴가 결재선',
    description: '휴가 신청을 위한 전용 결재선',
    approvers: [
      { id: '3', memberId: '1', memberName: '김팀장', department: '개발팀', position: '팀장', order: 1 },
      { id: '4', memberId: '5', memberName: '홍인사', department: '인사팀', position: '팀장', order: 2 },
    ],
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: '고액 구매 결재선',
    description: '100만원 이상 구매 요청을 위한 결재선',
    approvers: [
      { id: '5', memberId: '1', memberName: '김팀장', department: '개발팀', position: '팀장', order: 1 },
      { id: '6', memberId: '2', memberName: '이부장', department: '개발팀', position: '부장', order: 2 },
      { id: '7', memberId: '3', memberName: '박상무', department: '경영진', position: '상무', order: 3 },
    ],
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-08T09:20:00Z',
  },
];

export function AdminApprovalLines() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<ApprovalLine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isDefault: false,
  });
  const [approvers, setApprovers] = useState<ApprovalLineApprover[]>([]);

  const filteredLines = mockApprovalLines.filter(line =>
    line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    line.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingLine(null);
    setFormData({ name: '', description: '', isDefault: false });
    setApprovers([]);
    setDialogOpen(true);
  };

  const handleEdit = (line: ApprovalLine) => {
    setEditingLine(line);
    setFormData({
      name: line.name,
      description: line.description,
      isDefault: line.isDefault,
    });
    setApprovers([...line.approvers]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || approvers.length === 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const message = editingLine ? '결재선이 수정되었습니다.' : '새로운 결재선이 생성되었습니다.';
    toast.success(message);
    setDialogOpen(false);
  };

  const handleDelete = (line: ApprovalLine) => {
    if (line.isDefault) {
      toast.error('기본 결재선은 삭제할 수 없습니다.');
      return;
    }

    if (confirm(`'${line.name}' 결재선을 삭제하시겠습니까?`)) {
      toast.success('결재선이 삭제되었습니다.');
    }
  };

  const addApprover = (member: any) => {
    if (approvers.find(a => a.memberId === member.id)) {
      toast.error('이미 추가된 결재자입니다.');
      return;
    }

    const newApprover: ApprovalLineApprover = {
      id: Date.now().toString(),
      memberId: member.id,
      memberName: member.name,
      department: member.department,
      position: member.position,
      order: approvers.length + 1,
    };

    setApprovers(prev => [...prev, newApprover]);
    setMemberDialogOpen(false);
  };

  const removeApprover = (approverId: string) => {
    setApprovers(prev => {
      const filtered = prev.filter(a => a.id !== approverId);
      return filtered.map((approver, index) => ({ ...approver, order: index + 1 }));
    });
  };

  const moveApprover = (index: number, direction: 'up' | 'down') => {
    const newApprovers = [...approvers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newApprovers.length) {
      [newApprovers[index], newApprovers[targetIndex]] = [newApprovers[targetIndex], newApprovers[index]];
      // 순서 재정렬
      newApprovers.forEach((approver, idx) => {
        approver.order = idx + 1;
      });
      setApprovers(newApprovers);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">결재선 관리</h1>
          <p className="text-muted-foreground">전자결재에 사용할 결재선을 등록하고 관리합니다.</p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          새 결재선 만들기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="결재선명, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>결재선명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>결재자</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {line.name}
                        {line.isDefault && (
                          <Badge variant="default" className="text-xs">기본</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{line.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{line.approvers.length}명</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={line.isActive ? 'default' : 'secondary'}>
                        {line.isActive ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(line.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(line)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(line)}
                          disabled={line.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      조건에 맞는 결재선이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 모바일/태블릿 카드 뷰 */}
          <div className="lg:hidden space-y-4">
            {filteredLines.map((line) => (
              <Card key={line.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* 결재선명과 상태 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-medium truncate">{line.name}</span>
                        {line.isDefault && (
                          <Badge variant="default" className="text-xs shrink-0">기본</Badge>
                        )}
                      </div>
                      <Badge variant={line.isActive ? 'default' : 'secondary'} className="shrink-0 ml-2">
                        {line.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>

                    {/* 설명 */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {line.description}
                    </p>

                    {/* 결재자 정보와 생성일 */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{line.approvers.length}명</span>
                      </div>
                      <div className="text-muted-foreground">
                        {formatDate(line.createdAt)}
                      </div>
                    </div>

                    {/* 결재자 목록 */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">결재 순서:</div>
                      <div className="flex flex-wrap gap-1">
                        {line.approvers.map((approver, index) => (
                          <Badge key={approver.id} variant="outline" className="text-xs">
                            {index + 1}. {approver.memberName}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 작업 버튼들 */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(line)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        편집
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(line)}
                        disabled={line.isDefault}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredLines.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 결재선이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 결재선 생성/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLine ? '결재선 편집' : '새 결재선'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">결재선명 *</Label>
                <Input
                  id="name"
                  placeholder="결재선명을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>기본 결재선</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded border border-border"
                  />
                  <label htmlFor="isDefault" className="text-sm">기본 결재선으로 설정</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">설명 *</Label>
              <textarea
                id="description"
                placeholder="결재선에 대한 설명을 입력하세요"
                className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* 결재자 목록 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Label>결재자 목록 *</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMemberDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  결재자 추가
                </Button>
              </div>
              
              {approvers.length === 0 ? (
                <div className="text-center text-muted-foreground py-6 border-2 border-dashed rounded-lg">
                  결재자를 추가해주세요
                </div>
              ) : (
                <div className="space-y-2">
                  {approvers.map((approver, index) => (
                    <div key={approver.id} className="flex items-center gap-2 p-3 border rounded-lg">
                      <div className="hidden sm:flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 p-0"
                          onClick={() => moveApprover(index, 'up')}
                          disabled={index === 0}
                        >
                          ▲
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 p-0"
                          onClick={() => moveApprover(index, 'down')}
                          disabled={index === approvers.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                      <GripVertical className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{approver.memberName}</div>
                        <div className="text-xs text-muted-foreground">
                          {approver.department} · {approver.position}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {index + 1}차
                      </Badge>
                      <div className="flex sm:hidden flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 p-1"
                          onClick={() => moveApprover(index, 'up')}
                          disabled={index === 0}
                        >
                          ▲
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 p-1"
                          onClick={() => moveApprover(index, 'down')}
                          disabled={index === approvers.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApprover(approver.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                취소
              </Button>
              <Button onClick={handleSave} className="w-full sm:w-auto">
                {editingLine ? '수정' : '생성'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 구성원 선택 다이얼로그 */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>결재자 선택</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="이름 또는 부서로 검색..." />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {mockMembers.map((member) => (
                  <CommandItem
                    key={member.id}
                    onSelect={() => addApprover(member)}
                    className="cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.department} · {member.position}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}