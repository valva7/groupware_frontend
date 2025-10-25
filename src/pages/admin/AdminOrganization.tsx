import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Building, Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from "sonner";

interface DepartmentNode {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  memberCount: number;
  children?: DepartmentNode[];
}

const mockOrganization: DepartmentNode[] = [
  {
    id: '1',
    name: '경영진',
    description: '회사 전략 수립 및 의사결정',
    managerId: '1',
    managerName: '김대표',
    memberCount: 1,
    children: [],
  },
  {
    id: '2',
    name: '개발팀',
    description: '소프트웨어 개발 및 유지보수',
    managerId: '2',
    managerName: '박팀장',
    memberCount: 5,
    children: [
      {
        id: '2-1',
        name: '프론트엔드팀',
        description: '웹 프론트엔드 개발',
        managerId: '3',
        managerName: '이선임',
        memberCount: 3,
      },
      {
        id: '2-2',
        name: '백엔드팀',
        description: '서버 및 API 개발',
        managerId: '4',
        managerName: '최선임',
        memberCount: 2,
      },
    ],
  },
  {
    id: '3',
    name: '디자인팀',
    description: 'UI/UX 디자인 및 브랜딩',
    managerId: '5',
    managerName: '김팀장',
    memberCount: 2,
    children: [],
  },
];

export function AdminOrganization() {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentNode | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentNode | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
  });

  const handleCreate = (parentId?: string) => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '', parentId: parentId || '' });
    setDialogOpen(true);
  };

  const handleEdit = (department: DepartmentNode) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      parentId: '', // 부모 부서 ID는 별도 로직 필요
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error('부서명을 입력해주세요.');
      return;
    }

    const message = editingDepartment ? '부서 정보가 수정되었습니다.' : '새로운 부서가 생성되었습니다.';
    toast.success(message);
    setDialogOpen(false);
  };

  const handleDelete = (department: DepartmentNode) => {
    if (department.children && department.children.length > 0) {
      toast.error('하위 부서가 있는 부서는 삭제할 수 없습니다.');
      return;
    }
    
    if (department.memberCount > 0) {
      toast.error('소속 직원이 있는 부서는 삭제할 수 없습니다.');
      return;
    }

    if (confirm(`'${department.name}' 부서를 삭제하시겠습니까?`)) {
      toast.success('부서가 삭제되었습니다.');
    }
  };

  const renderDepartmentTree = (departments: DepartmentNode[], level = 0) => {
    return departments.map((dept) => (
      <div key={dept.id}>
        <div
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
            selectedDepartment?.id === dept.id ? 'bg-accent border border-primary/20' : 'border border-transparent'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => setSelectedDepartment(dept)}
        >
          <Building className="h-4 w-4 text-primary mr-2" />
          <div className="flex-1">
            <div className="font-medium">{dept.name}</div>
            <div className="text-sm text-muted-foreground">{dept.description}</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{dept.memberCount}명</span>
          </div>
        </div>
        {dept.children && renderDepartmentTree(dept.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">조직 관리</h1>
          <p className="text-muted-foreground">부서 구조를 생성하고 관리합니다.</p>
        </div>
        <Button onClick={() => handleCreate()}>
          <Plus className="h-4 w-4 mr-2" />
          새 부서 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* 조직도 트리 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              조직 구조
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {renderDepartmentTree(mockOrganization)}
            </div>
          </CardContent>
        </Card>

        {/* 부서 상세 정보 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {selectedDepartment ? selectedDepartment.name : '부서를 선택하세요'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {selectedDepartment ? (
              <div className="space-y-6">
                {/* 부서 정보 */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-2">부서 정보</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">부서명</span>
                        <span className="font-medium">{selectedDepartment.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">설명</span>
                        <span className="font-medium">{selectedDepartment.description || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">부서장</span>
                        <span className="font-medium">{selectedDepartment.managerName || '미지정'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">소속 인원</span>
                        <span className="font-medium">{selectedDepartment.memberCount}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">하위 부서</span>
                        <span className="font-medium">{selectedDepartment.children?.length || 0}개</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 관리 버튼 */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCreate(selectedDepartment.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    하위 부서 추가
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEdit(selectedDepartment)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    부서 정보 수정
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDelete(selectedDepartment)}
                    disabled={selectedDepartment.memberCount > 0 || (selectedDepartment.children && selectedDepartment.children.length > 0)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    부서 삭제
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>좌측에서 부서를 선택하면</p>
                  <p>상세 정보와 관리 옵션을 확인할 수 있습니다.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 부서 생성/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? '부서 정보 수정' : '새 부서 추가'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">부서명 *</Label>
              <Input
                id="name"
                placeholder="부서명을 입력하세요"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="부서에 대한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSave}>
                {editingDepartment ? '수정' : '추가'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}