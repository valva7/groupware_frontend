import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, Building, Users, ChevronRight, Check } from 'lucide-react';
import { cn } from './ui/utils';

interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

interface Position {
  id: string;
  name: string;
  level: number;
  description?: string;
  departmentIds?: string[];
  isActive: boolean;
}

interface DepartmentPositionSelectorProps {
  type: 'department' | 'position';
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Mock 데이터
const mockDepartments: Department[] = [
  { id: '1', name: '개발팀', description: '소프트웨어 개발 및 시스템 구축', isActive: true },
  { id: '2', name: '프론트엔드팀', description: '사용자 인터페이스 개발', parentId: '1', isActive: true },
  { id: '3', name: '백엔드팀', description: '서버 및 API 개발', parentId: '1', isActive: true },
  { id: '4', name: '디자인팀', description: 'UI/UX 디자인 및 브랜딩', isActive: true },
  { id: '5', name: 'UX팀', description: '사용자 경험 설계', parentId: '4', isActive: true },
  { id: '6', name: 'UI팀', description: '사용자 인터페이스 디자인', parentId: '4', isActive: true },
  { id: '7', name: '마케팅팀', description: '제품 마케팅 및 홍보', isActive: true },
  { id: '8', name: '디지털마케팅팀', description: '온라인 마케팅 및 SNS 관리', parentId: '7', isActive: true },
  { id: '9', name: '인사팀', description: '인사관리 및 채용', isActive: true },
  { id: '10', name: '총무팀', description: '총무 및 사무관리', isActive: true },
  { id: '11', name: '재무팀', description: '회계 및 재무관리', isActive: true },
  { id: '12', name: '영업팀', description: '고객 관리 및 영업', isActive: true },
  { id: '13', name: '고객지원팀', description: '고객 서비스 및 기술지원', isActive: true },
  { id: '14', name: 'QA팀', description: '품질관리 및 테스트', parentId: '1', isActive: true },
  { id: '15', name: '기획팀', description: '사업 기획 및 전략 수립', isActive: true },
];

const mockPositions: Position[] = [
  { id: '1', name: '인턴', level: 1, description: '수습 단계', isActive: true },
  { id: '2', name: '사원', level: 2, description: '신입 직원', isActive: true },
  { id: '3', name: '주임', level: 3, description: '업무 숙련자', isActive: true },
  { id: '4', name: '대리', level: 4, description: '업무 전문가', isActive: true },
  { id: '5', name: '과장', level: 5, description: '팀 리더', isActive: true },
  { id: '6', name: '차장', level: 6, description: '부서 관리자', isActive: true },
  { id: '7', name: '부장', level: 7, description: '부서 책임자', isActive: true },
  { id: '8', name: '이사', level: 8, description: '임원진', isActive: true },
  { id: '9', name: '상무', level: 9, description: '고위 임원', isActive: true },
  { id: '10', name: '전무', level: 10, description: '최고 경영진', isActive: true },
  { id: '11', name: '연구원', level: 3, description: '기술 연구', departmentIds: ['1'], isActive: true },
  { id: '12', name: '선임연구원', level: 4, description: '선임 기술 연구', departmentIds: ['1'], isActive: true },
  { id: '13', name: '책임연구원', level: 5, description: '책임 기술 연구', departmentIds: ['1'], isActive: true },
  { id: '14', name: '수석연구원', level: 6, description: '수석 기술 연구', departmentIds: ['1'], isActive: true },
  { id: '15', name: '디자이너', level: 3, description: '디자인 전문가', departmentIds: ['4'], isActive: true },
  { id: '16', name: '선임디자이너', level: 4, description: '선임 디자인 전문가', departmentIds: ['4'], isActive: true },
  { id: '17', name: '팀장', level: 5, description: '팀 관리자', isActive: true },
  { id: '18', name: '실장', level: 6, description: '실무 책임자', isActive: true },
];

export function DepartmentPositionSelector({
  type,
  value,
  onSelect,
  placeholder,
  disabled = false,
  className
}: DepartmentPositionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const data = type === 'department' ? mockDepartments : mockPositions;
  const icon = type === 'department' ? Building : Users;
  const Icon = icon;

  // 데이터 필터링
  const filteredData = data.filter(item => {
    if (!item.isActive) return false;
    
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (type === 'department') {
      if (selectedCategory === 'all') return matchesSearch;
      if (selectedCategory === 'parent') return matchesSearch && !(item as Department).parentId;
      if (selectedCategory === 'sub') return matchesSearch && (item as Department).parentId;
    } else {
      if (selectedCategory === 'all') return matchesSearch;
      if (selectedCategory === 'general') return matchesSearch && (item as Position).level <= 7;
      if (selectedCategory === 'executive') return matchesSearch && (item as Position).level > 7;
      if (selectedCategory === 'technical') return matchesSearch && (item as Position).departmentIds?.includes('1');
      if (selectedCategory === 'design') return matchesSearch && (item as Position).departmentIds?.includes('4');
    }
    
    return matchesSearch;
  });

  // 부서의 경우 계층 구조로 정렬
  const sortedData = type === 'department' 
    ? [...filteredData].sort((a, b) => {
        const deptA = a as Department;
        const deptB = b as Department;
        
        // 상위 부서가 먼저 오도록
        if (!deptA.parentId && deptB.parentId) return -1;
        if (deptA.parentId && !deptB.parentId) return 1;
        
        // 같은 레벨이면 이름순
        return deptA.name.localeCompare(deptB.name);
      })
    : [...filteredData].sort((a, b) => {
        const posA = a as Position;
        const posB = b as Position;
        
        // 레벨순, 같은 레벨이면 이름순
        if (posA.level !== posB.level) return posA.level - posB.level;
        return posA.name.localeCompare(posB.name);
      });

  const handleSelect = (item: Department | Position) => {
    onSelect(item.name);
    setOpen(false);
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const departmentCategories = [
    { id: 'all', label: '전체' },
    { id: 'parent', label: '본부서' },
    { id: 'sub', label: '하위부서' },
  ];

  const positionCategories = [
    { id: 'all', label: '전체' },
    { id: 'general', label: '일반직' },
    { id: 'executive', label: '임원진' },
    { id: 'technical', label: '기술직' },
    { id: 'design', label: '디자인직' },
  ];

  const categories = type === 'department' ? departmentCategories : positionCategories;

  const selectedItem = data.find(item => item.name === value);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "dept-pos-selector-trigger w-full",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="truncate">
              {value || placeholder || `${type === 'department' ? '부서' : '직급'}를 선택하세요`}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        </button>
      </DialogTrigger>
      
      <DialogContent className="dept-pos-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {type === 'department' ? '부서 선택' : '직급 선택'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 검색 */}
          <div className="dept-pos-search">
            <Search className="dept-pos-search-icon h-4 w-4" />
            <Input
              placeholder={`${type === 'department' ? '부서명' : '직급명'}으로 검색...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
          </div>
          
          {/* 카테고리 필터 */}
          <div className="dept-pos-categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={cn(
                  "dept-pos-category",
                  selectedCategory === category.id && "active"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* 목록 */}
          <div className="dept-pos-list">
            {sortedData.length === 0 ? (
              <div className="dept-pos-empty">
                <Icon className="dept-pos-empty-icon" />
                <p>검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sortedData.map(item => {
                  const isDepartment = type === 'department';
                  const isParent = isDepartment && !(item as Department).parentId;
                  const isSelected = item.name === value;
                  
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "dept-pos-item",
                        isSelected && "selected",
                        isDepartment && !isParent && "sub-item"
                      )}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="dept-pos-item-icon">
                          {isDepartment ? (
                            <Building className="h-4 w-4" />
                          ) : (
                            <span>{(item as Position).level}</span>
                          )}
                        </div>
                        
                        <div className="dept-pos-item-content">
                          <div className="dept-pos-item-title">
                            <span className="truncate">{item.name}</span>
                            <div className="dept-pos-item-badges">
                              {isDepartment && (item as Department).parentId && (
                                <Badge variant="outline" className="text-xs">
                                  하위부서
                                </Badge>
                              )}
                              {!isDepartment && (item as Position).departmentIds && (
                                <Badge variant="secondary" className="text-xs">
                                  전문직
                                </Badge>
                              )}
                            </div>
                          </div>
                          {item.description && (
                            <div className="dept-pos-item-description">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <Check className="dept-pos-item-check" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* 선택된 항목 정보 */}
          {selectedItem && (
            <div className="dept-pos-selected-info">
              <div className="dept-pos-selected-header">
                <Icon className="h-4 w-4" />
                <span>선택된 {type === 'department' ? '부서' : '직급'}</span>
              </div>
              <div className="dept-pos-selected-content">
                <div className="dept-pos-selected-title">{selectedItem.name}</div>
                {selectedItem.description && (
                  <div className="dept-pos-selected-description">{selectedItem.description}</div>
                )}
                {type === 'position' && (
                  <div className="dept-pos-selected-level">
                    레벨 {(selectedItem as Position).level}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}