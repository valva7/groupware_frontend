import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { ArrowLeft, Calendar as CalendarIcon, X, Plus } from 'lucide-react';
import { toast } from "sonner";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function VoteCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'single',
    isAnonymous: false,
    allowMultiple: false,
    endDate: undefined as Date | undefined,
    targetDepartments: [] as string[],
  });
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ['전체', '개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '경영진'];
  const categories = ['일반', '의사결정', '만족도조사', '제안', '행사'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('투표 제목을 입력해주세요.');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('투표 설명을 입력해주세요.');
      return;
    }
    
    if (!formData.category) {
      toast.error('투표 카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.endDate) {
      toast.error('투표 종료일을 설정해주세요.');
      return;
    }
    
    if (formData.endDate <= new Date()) {
      toast.error('투표 종료일은 현재 시간보다 나중이어야 합니다.');
      return;
    }
    
    const validOptions = options.filter(option => option.trim());
    if (validOptions.length < 2) {
      toast.error('최소 2개의 선택지를 입력해주세요.');
      return;
    }
    
    if (formData.targetDepartments.length === 0) {
      toast.error('투표 대상 부서를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('새 투표 생성:', {
        ...formData,
        options: validOptions,
        createdAt: new Date().toISOString(),
        status: 'active',
      });
      
      toast.success('투표가 성공적으로 생성되었습니다.');
      navigate('/votes');
      setIsSubmitting(false);
    }, 1500);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const toggleDepartment = (department: string) => {
    if (department === '전체') {
      if (formData.targetDepartments.includes('전체')) {
        setFormData({ ...formData, targetDepartments: [] });
      } else {
        setFormData({ ...formData, targetDepartments: ['전체'] });
      }
    } else {
      const newDepartments = formData.targetDepartments.filter(d => d !== '전체');
      if (newDepartments.includes(department)) {
        setFormData({ 
          ...formData, 
          targetDepartments: newDepartments.filter(d => d !== department)
        });
      } else {
        setFormData({ 
          ...formData, 
          targetDepartments: [...newDepartments, department]
        });
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/votes')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">새 투표 만들기</h1>
          <p className="text-muted-foreground text-sm sm:text-base">새로운 투표를 생성하고 설정합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">투표 제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="투표 제목을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">투표 설명 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="투표에 대한 상세한 설명을 입력하세요"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>투표 종료일 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, 'PPP', { locale: ko }) : '종료일 선택'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({ ...formData, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* 투표 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>투표 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">투표 유형</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">단일 선택</SelectItem>
                    <SelectItem value="multiple">복수 선택</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked })}
                />
                <Label htmlFor="anonymous">익명 투표</Label>
              </div>

              <div className="space-y-2">
                <Label>투표 대상 부서 *</Label>
                <div className="space-y-2">
                  {departments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <Checkbox
                        id={department}
                        checked={formData.targetDepartments.includes(department)}
                        onCheckedChange={() => toggleDepartment(department)}
                      />
                      <Label htmlFor={department} className="text-sm">{department}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 선택지 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>선택지 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`선택지 ${index + 1}`}
                    required
                  />
                </div>
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="h-10 w-10 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                선택지 추가
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/votes')}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? '생성 중...' : '투표 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}