import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Search, Plus, Settings, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ApprovalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const mockTemplates: ApprovalTemplate[] = [
  {
    id: '1',
    name: '휴가신청서',
    description: '연차, 병가, 개인사유 휴가 신청을 위한 양식',
    category: '인사',
    fields: ['휴가종류', '시작일', '종료일', '사유', '긴급연락처'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: '구매요청서',
    description: '업무용 물품 및 장비 구매 요청 양식',
    category: '총무',
    fields: ['품목명', '수량', '예상가격', '구매사유', '사용부서'],
    isActive: true,
    createdAt: '2024-01-10T16:00:00Z',
  },
  {
    id: '3',
    name: '출장신청서',
    description: '국내외 출장 신청을 위한 양식',
    category: '인사',
    fields: ['출장지', '출장기간', '출장목적', '예상비용', '동행자'],
    isActive: true,
    createdAt: '2024-01-08T11:30:00Z',
  },
  {
    id: '4',
    name: '교육신청서',
    description: '외부 교육 및 세미나 참석 신청 양식',
    category: '인사',
    fields: ['교육명', '교육기관', '교육기간', '교육비용', '교육목적'],
    isActive: false,
    createdAt: '2024-01-05T14:20:00Z',
  },
];

export function AdminApproval() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ApprovalTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    fields: '',
  });

  const filteredTemplates = mockTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', category: '', fields: '' });
    setDialogOpen(true);
  };

  const handleEdit = (template: ApprovalTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      fields: template.fields.join(', '),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || !formData.category) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const message = editingTemplate ? '전자결재 양식이 수정되었습니다.' : '새로운 전자결재 양식이 생성되었습니다.';
    toast.success(message);
    setDialogOpen(false);
  };

  const handleDelete = (template: ApprovalTemplate) => {
    if (confirm(`'${template.name}' 양식을 삭제하시겠습니까?`)) {
      toast.success('전자결재 양식이 삭제되었습니다.');
    }
  };

  const toggleStatus = (template: ApprovalTemplate) => {
    const status = template.isActive ? '비활성화' : '활성화';
    toast.success(`'${template.name}' 양식이 ${status}되었습니다.`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">전자결재 관리</h1>
          <p className="text-muted-foreground">전자결재 양식을 생성하고 관리합니다.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          새 양식 만들기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="양식명, 설명, 카테고리로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>양식명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>필드 수</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{template.description}</TableCell>
                  <TableCell>{template.fields.length}개</TableCell>
                  <TableCell>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? '활성' : '비활성'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(template.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(template)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTemplates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    조건에 맞는 전자결재 양식이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 양식 생성/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? '전자결재 양식 편집' : '새 전자결재 양식'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">양식명 *</Label>
              <Input
                id="name"
                placeholder="양식명을 입력하세요"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Input
                id="category"
                placeholder="카테고리를 입력하세요"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                placeholder="양식에 대한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fields">필드 목록</Label>
              <Textarea
                id="fields"
                placeholder="필드명을 쉼표로 구분하여 입력하세요 (예: 제목, 내용, 첨부파일)"
                value={formData.fields}
                onChange={(e) => setFormData(prev => ({ ...prev, fields: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSave}>
                {editingTemplate ? '수정' : '생성'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}