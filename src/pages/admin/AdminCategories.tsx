import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Plus, Edit, Trash2, Folder } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Category } from '../../types';

const mockCategories: Category[] = [
  {
    id: '1',
    name: '공지사항',
    description: '회사 공지 및 중요 안내사항',
    type: 'board',
  },
  {
    id: '2',
    name: '일반',
    description: '자유로운 소통과 정보 공유',
    type: 'board',
  },
  {
    id: '3',
    name: '이벤트',
    description: '사내 이벤트 및 행사 관련',
    type: 'board',
  },
  {
    id: '4',
    name: '건의사항',
    description: '업무 개선 및 제안사항',
    type: 'board',
  },
  {
    id: '5',
    name: '교육/세미나',
    description: '교육 프로그램 및 세미나 정보',
    type: 'board',
  },
  {
    id: '6',
    name: '휴가신청',
    description: '연차, 병가 등 휴가 관련 결재',
    type: 'approval',
  },
  {
    id: '7',
    name: '구매요청',
    description: '물품 및 장비 구매 관련 결재',
    type: 'approval',
  },
  {
    id: '8',
    name: '출장신청',
    description: '국내외 출장 관련 결재',
    type: 'approval',
  },
  {
    id: '9',
    name: '웹 개발',
    description: '웹사이트 및 웹 애플리케이션 개발',
    type: 'project',
  },
  {
    id: '10',
    name: '모바일 개발',
    description: '모바일 앱 개발 프로젝트',
    type: 'project',
  },
];

const typeLabels = {
  board: '게시판',
  approval: '전자결재',
  project: '프로젝트',
};

export function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'board' as Category['type'],
  });

  const filteredCategories = mockCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || category.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', type: 'board' });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      type: category.type,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error('카테고리명을 입력해주세요.');
      return;
    }

    const message = editingCategory ? '카테고리가 수정되었습니다.' : '새로운 카테고리가 생성되었습니다.';
    toast.success(message);
    setDialogOpen(false);
  };

  const handleDelete = (category: Category) => {
    if (confirm(`'${category.name}' 카테고리를 삭제하시겠습니까?`)) {
      toast.success('카테고리가 삭제되었습니다.');
    }
  };

  const getCategoryCount = (type: Category['type']) => {
    return mockCategories.filter(category => category.type === type).length;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">카테고리 관리</h1>
          <p className="text-muted-foreground">게시판, 전자결재, 프로젝트 카테고리를 관리합니다.</p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          새 카테고리
        </Button>
      </div>

      {/* 카테고리 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">게시판 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{getCategoryCount('board')}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">전자결재 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{getCategoryCount('approval')}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">프로젝트 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{getCategoryCount('project')}개</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="카테고리명, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="board">게시판</SelectItem>
                <SelectItem value="approval">전자결재</SelectItem>
                <SelectItem value="project">프로젝트</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>유형</TableHead>
                  <TableHead>카테고리명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[category.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-primary" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      조건에 맞는 카테고리가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-4">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* 카테고리명과 유형 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Folder className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium truncate">{category.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 ml-2">
                        {typeLabels[category.type]}
                      </Badge>
                    </div>

                    {/* 설명 */}
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* 작업 버튼들 */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        편집
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredCategories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 카테고리가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 생성/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? '카테고리 편집' : '새 카테고리'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">유형 *</Label>
              <Select value={formData.type} onValueChange={(value: Category['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="board">게시판</SelectItem>
                  <SelectItem value="approval">전자결재</SelectItem>
                  <SelectItem value="project">프로젝트</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">카테고리명 *</Label>
              <Input
                id="name"
                placeholder="카테고리명을 입력하세요"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="카테고리에 대한 설명을 입력하세요"
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
                {editingCategory ? '수정' : '생성'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}