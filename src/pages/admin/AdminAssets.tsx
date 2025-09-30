import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Asset } from '../../types';

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'MacBook Pro 16인치',
    type: 'equipment',
    category: 'IT장비',
    serialNumber: 'MBP2024001',
    purchaseDate: '2024-01-15',
    purchasePrice: 3500000,
    currentValue: 3200000,
    location: '개발팀',
    assignedTo: '김개발',
    status: 'in-use',
  },
  {
    id: '2',
    name: '사무용 의자',
    type: 'furniture',
    category: '의자',
    serialNumber: 'CHAIR001',
    purchaseDate: '2023-12-01',
    purchasePrice: 450000,
    currentValue: 400000,
    location: '2층 사무실',
    status: 'available',
  },
  {
    id: '3',
    name: 'HP 레이저젯 프린터',
    type: 'equipment',
    category: 'IT장비',
    serialNumber: 'HP2024001',
    purchaseDate: '2024-01-10',
    purchasePrice: 800000,
    currentValue: 750000,
    location: '공용 사무공간',
    status: 'in-use',
  },
  {
    id: '4',
    name: '회의실 프로젝터',
    type: 'equipment',
    category: 'AV장비',
    serialNumber: 'PROJ001',
    purchaseDate: '2023-11-20',
    purchasePrice: 1200000,
    currentValue: 1000000,
    location: '대회의실',
    status: 'maintenance',
  },
];

const typeLabels = {
  equipment: '장비',
  supplies: '소모품',
  furniture: '가구',
  vehicle: '차량',
};

const statusLabels = {
  available: '사용가능',
  'in-use': '사용중',
  maintenance: '수리중',
  disposed: '폐기',
};

const statusColors = {
  available: 'bg-green-100 text-green-800',
  'in-use': 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  disposed: 'bg-red-100 text-red-800',
};

// 자산 유형별 카테고리 목록
const categoryOptions = {
  equipment: [
    'IT장비',
    'AV장비',
    '통신장비',
    '측정장비',
    '제조장비',
    '의료장비',
    '기타장비'
  ],
  supplies: [
    '사무용품',
    'IT용품',
    '청소용품',
    '포장용품',
    '인쇄용품',
    '기타소모품'
  ],
  furniture: [
    '책상',
    '의자',
    '수납장',
    '회의테이블',
    '소파',
    '기타가구'
  ],
  vehicle: [
    '승용차',
    '화물차',
    '승합차',
    '특수차량',
    '이륜차',
    '기타차량'
  ]
};

export function AdminAssets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'equipment' as Asset['type'],
    category: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    location: '',
    assignedTo: '',
    status: 'available' as Asset['status'],
  });

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreate = () => {
    setEditingAsset(null);
    setFormData({
      name: '', type: 'equipment', category: '', serialNumber: '',
      purchaseDate: '', purchasePrice: '', location: '', assignedTo: '', status: 'available'
    });
    setDialogOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      category: asset.category,
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate,
      purchasePrice: asset.purchasePrice.toString(),
      location: asset.location,
      assignedTo: asset.assignedTo || '',
      status: asset.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.purchaseDate || !formData.purchasePrice) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const message = editingAsset ? '자산 정보가 수정되었습니다.' : '새로운 자산이 등록되었습니다.';
    toast.success(message);
    setDialogOpen(false);
  };

  const handleDelete = (asset: Asset) => {
    if (confirm(`'${asset.name}' 자산을 삭제하시겠습니까?`)) {
      toast.success('자산이 삭제되었습니다.');
    }
  };

  // 자산 유형이 변경될 때 카테고리 초기화
  const handleTypeChange = (newType: Asset['type']) => {
    setFormData(prev => ({ 
      ...prev, 
      type: newType, 
      category: '' // 유형 변경 시 카테고리 초기화
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">비품/자산 관리</h1>
          <p className="text-muted-foreground">회사 자산을 등록하고 관리합니다.</p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          새 자산 등록
        </Button>
      </div>

      {/* 자산 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">전체 자산</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockAssets.length}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">사용중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockAssets.filter(a => a.status === 'in-use').length}개
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">사용가능</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockAssets.filter(a => a.status === 'available').length}개
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">총 자산가치</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="자산명, 카테고리, 시리얼번호, 위치로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="equipment">장비</SelectItem>
                  <SelectItem value="supplies">소모품</SelectItem>
                  <SelectItem value="furniture">가구</SelectItem>
                  <SelectItem value="vehicle">차량</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="available">사용가능</SelectItem>
                  <SelectItem value="in-use">사용중</SelectItem>
                  <SelectItem value="maintenance">수리중</SelectItem>
                  <SelectItem value="disposed">폐기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>자산명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>시리얼번호</TableHead>
                  <TableHead>현재가치</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[asset.type]}</Badge>
                    </TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell className="font-mono text-sm">{asset.serialNumber || '-'}</TableCell>
                    <TableCell>{formatPrice(asset.currentValue)}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[asset.status]}>
                        {statusLabels[asset.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(asset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(asset)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAssets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      조건에 맞는 자산이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 모바일/태블릿 카드 뷰 */}
          <div className="lg:hidden space-y-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* 자산명과 상태 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Package className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium truncate">{asset.name}</span>
                      </div>
                      <Badge variant="secondary" className={`${statusColors[asset.status]} shrink-0 ml-2`}>
                        {statusLabels[asset.status]}
                      </Badge>
                    </div>

                    {/* 유형과 카테고리 */}
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{typeLabels[asset.type]}</Badge>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{asset.category}</span>
                    </div>

                    {/* 시리얼번호 */}
                    {asset.serialNumber && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-mono">{asset.serialNumber}</span>
                      </div>
                    )}

                    {/* 가격과 위치 */}
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{formatPrice(asset.currentValue)}</span>
                      </div>
                      <div className="text-muted-foreground">
                        📍 {asset.location}
                      </div>
                    </div>

                    {/* 할당자 정보 */}
                    {asset.assignedTo && (
                      <div className="text-sm text-muted-foreground">
                        사용자: {asset.assignedTo}
                      </div>
                    )}

                    {/* 작업 버튼들 */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(asset)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        편집
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(asset)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 자산이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 자산 등록/편집 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAsset ? '자산 정보 수정' : '새 자산 등록'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">자산명 *</Label>
              <Input
                id="name"
                placeholder="자산명을 입력하세요"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">유형 *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">장비</SelectItem>
                  <SelectItem value="supplies">소모품</SelectItem>
                  <SelectItem value="furniture">가구</SelectItem>
                  <SelectItem value="vehicle">차량</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions[formData.type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {typeLabels[formData.type]} 유형의 카테고리를 선택하세요
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serialNumber">시리얼번호</Label>
              <Input
                id="serialNumber"
                placeholder="시리얼번호를 입력하세요"
                value={formData.serialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">구매일 *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">구매가격 *</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="구매가격을 입력하세요"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">위치 *</Label>
              <Input
                id="location"
                placeholder="위치를 입력하세요"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select value={formData.status} onValueChange={(value: Asset['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">사용가능</SelectItem>
                  <SelectItem value="in-use">사용중</SelectItem>
                  <SelectItem value="maintenance">수리중</SelectItem>
                  <SelectItem value="disposed">폐기</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="assignedTo">할당자</Label>
              <Input
                id="assignedTo"
                placeholder="사용자를 입력하세요 (선택사항)"
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
              취소
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              {editingAsset ? '수정' : '등록'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}