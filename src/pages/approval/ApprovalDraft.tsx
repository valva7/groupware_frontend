import { useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { Check, ChevronsUpDown, X, Plus, GripVertical, CalendarIcon, Upload, File, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { cn } from '../../components/ui/utils';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface Member {
  id: string;
  name: string;
  department: string;
  position: string;
}

interface VacationSchedule {
  id: string;
  date: Date | undefined;
  type: 'full' | 'half_morning' | 'half_afternoon' | 'hours';
  startTime?: string;
  endTime?: string;
  reason?: string;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface DraggableApproverProps {
  approver: Member;
  index: number;
  moveApprover: (dragIndex: number, hoverIndex: number) => void;
  removeMember: (memberId: string, type: 'approver' | 'reference') => void;
}

const DraggableApprover = ({ approver, index, moveApprover, removeMember }: DraggableApproverProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'APPROVER',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'APPROVER',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveApprover(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        drag(drop(node));
        preview(node);
      }}
      className={cn(
        "flex items-center gap-2 p-3 border rounded-lg bg-card cursor-move transition-all",
        isDragging ? "opacity-50 scale-95" : "hover:shadow-sm",
        "touch-manipulation select-none"
      )}
      style={{ touchAction: 'none' }}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{approver.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          {approver.department} · {approver.position}
        </div>
      </div>
      <Badge variant="outline" className="text-xs flex-shrink-0">
        {index + 1}차
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeMember(approver.id, 'approver')}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface DraggableReferenceProps {
  reference: Member;
  index: number;
  moveReference: (dragIndex: number, hoverIndex: number) => void;
  removeMember: (memberId: string, type: 'approver' | 'reference') => void;
}

const DraggableReference = ({ reference, index, moveReference, removeMember }: DraggableReferenceProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'REFERENCE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'REFERENCE',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveReference(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        drag(drop(node));
        preview(node);
      }}
      className={cn(
        "flex items-center gap-2 p-3 border rounded-lg bg-card cursor-move transition-all",
        isDragging ? "opacity-50 scale-95" : "hover:shadow-sm",
        "touch-manipulation select-none"
      )}
      style={{ touchAction: 'none' }}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{reference.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          {reference.department} · {reference.position}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeMember(reference.id, 'reference')}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const mockMembers: Member[] = [
  { id: '1', name: '김팀장', department: '개발팀', position: '팀장' },
  { id: '2', name: '이부장', department: '개발팀', position: '부장' },
  { id: '3', name: '박상무', department: '경영진', position: '상무' },
  { id: '4', name: '최대표', department: '경영진', position: '대표이사' },
  { id: '5', name: '홍인사', department: '인사팀', position: '팀장' },
  { id: '6', name: '김경리', department: '경리팀', position: '과장' },
];

const approvalTypes = [
  { value: 'vacation', label: '휴가신청서' },
  { value: 'purchase', label: '구매요청서' },
  { value: 'business_trip', label: '출장신청서' },
  { value: 'education', label: '교육신청서' },
  { value: 'overtime', label: '연장근무신청서' },
  { value: 'expense', label: '지출결의서' },
];

// 날짜 포맷 함수
const formatDate = (date: Date | undefined) => {
  if (!date) return "날짜를 선택하세요";
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}년 ${month}월 ${day}일`;
};

// 모바일 감지 함수
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

export function ApprovalDraft() {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    content: '',
    urgency: 'normal',
    // 휴가신청서 필드
    vacationType: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    // 출장신청서 필드
    destination: '',
    tripPurpose: '',
    estimatedCost: '',
    // 지출결의서 필드
    expenseCategory: '',
    amount: '',
    vendor: '',
    // 구매요청서 필드
    itemName: '',
    quantity: '',
    unitPrice: '',
    // 교육신청서 필드
    educationName: '',
    educationDate: undefined as Date | undefined,
    educationCost: '',
    // 연장근무신청서 필드
    overtimeDate: undefined as Date | undefined,
    overtimeStartTime: '',
    overtimeEndTime: '',
  });
  const [approvers, setApprovers] = useState<Member[]>([]);
  const [references, setReferences] = useState<Member[]>([]);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'approver' | 'reference'>('approver');
  const [openCalendar, setOpenCalendar] = useState<{[key: string]: boolean}>({});
  const [vacationSchedules, setVacationSchedules] = useState<VacationSchedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const handleSubmit = (action: 'draft' | 'submit') => {
    if (!formData.type || !formData.title || !formData.content) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (action === 'submit' && approvers.length === 0) {
      toast.error('결재자를 선택해주세요.');
      return;
    }

    // 구매요청서의 경우 필수 필드 추가 검증
    if (formData.type === 'purchase') {
      if (!formData.itemName || !formData.quantity || !formData.unitPrice) {
        toast.error('구매 품목, 수량, 단가를 모두 입력해주세요.');
        return;
      }
    }

    // 첨부파일이 있는 경우 파일 정보도 포함
    const submissionData = {
      ...formData,
      approvers,
      references,
      attachedFiles: attachedFiles.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type
      }))
    };

    const message = action === 'draft' ? 
      `임시저장되었습니다.${attachedFiles.length > 0 ? ` (첨부파일 ${attachedFiles.length}개 포함)` : ''}` : 
      `결재 요청이 제출되었습니다.${attachedFiles.length > 0 ? ` (첨부파일 ${attachedFiles.length}개 포함)` : ''}`;
    
    toast.success(message);
    
    // 실제 환경에서는 여기서 서버로 submissionData를 전송
    console.log('제출 데이터:', submissionData);
  };

  const addMember = (member: Member, type: 'approver' | 'reference') => {
    if (type === 'approver') {
      if (!approvers.find(a => a.id === member.id)) {
        setApprovers(prev => [...prev, member]);
      }
    } else {
      if (!references.find(r => r.id === member.id)) {
        setReferences(prev => [...prev, member]);
      }
    }
    setMemberDialogOpen(false);
  };

  const removeMember = (memberId: string, type: 'approver' | 'reference') => {
    if (type === 'approver') {
      setApprovers(prev => prev.filter(a => a.id !== memberId));
    } else {
      setReferences(prev => prev.filter(r => r.id !== memberId));
    }
  };

  const moveApprover = useCallback((dragIndex: number, hoverIndex: number) => {
    setApprovers((prevApprovers) => {
      const newApprovers = [...prevApprovers];
      const draggedItem = newApprovers[dragIndex];
      
      // 아이템을 새 위치로 이동
      newApprovers.splice(dragIndex, 1);
      newApprovers.splice(hoverIndex, 0, draggedItem);
      
      return newApprovers;
    });
  }, []);

  const moveReference = useCallback((dragIndex: number, hoverIndex: number) => {
    setReferences((prevReferences) => {
      const newReferences = [...prevReferences];
      const draggedItem = newReferences[dragIndex];
      
      // 아이템을 새 위치로 이동
      newReferences.splice(dragIndex, 1);
      newReferences.splice(hoverIndex, 0, draggedItem);
      
      return newReferences;
    });
  }, []);

  const openMemberDialog = (type: 'approver' | 'reference') => {
    setSelectingFor(type);
    setSearchTerm('');
    setMemberDialogOpen(true);
  };

  const handleDateSelect = (date: Date | undefined, field: string) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    setOpenCalendar(prev => ({ ...prev, [field]: false }));
  };

  const toggleCalendar = (field: string, open: boolean) => {
    setOpenCalendar(prev => ({ ...prev, [field]: open }));
  };

  const addVacationSchedule = () => {
    const newSchedule: VacationSchedule = {
      id: Date.now().toString(),
      date: undefined,
      type: 'full',
      startTime: '',
      endTime: '',
      reason: ''
    };
    setVacationSchedules(prev => [...prev, newSchedule]);
  };

  const updateVacationSchedule = (id: string, updates: Partial<VacationSchedule>) => {
    setVacationSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, ...updates } : schedule
      )
    );
  };

  const removeVacationSchedule = (id: string) => {
    setVacationSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  // 파일 첨부 관련 함수들
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}은(는) 파일 크기가 10MB를 초과합니다.`);
        return;
      }

      // 중복 파일 체크
      if (attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
        toast.error(`${file.name}은(는) 이미 첨부된 파일입니다.`);
        return;
      }

      const attachedFile: AttachedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type
      };

      setAttachedFiles(prev => [...prev, attachedFile]);
    });

    // input 초기화
    event.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    toast.success('파일이 삭제되었습니다.');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📈';
    return '📎';
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      // FileList를 배열로 변환하여 handleFileUpload와 동일한 로직 사용
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        // 파일 크기 제한 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name}은(는) 파일 크기가 10MB를 초과합니다.`);
          return;
        }

        // 중복 파일 체크
        if (attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
          toast.error(`${file.name}은(는) 이미 첨부된 파일입니다.`);
          return;
        }

        const attachedFile: AttachedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: file.type
        };

        setAttachedFiles(prev => [...prev, attachedFile]);
      });
    }
  };

  const getVacationTypeLabel = (type: string) => {
    switch (type) {
      case 'full': return '전일';
      case 'half_morning': return '오전반차';
      case 'half_afternoon': return '오후반차';
      case 'hours': return '시간단위';
      default: return '';
    }
  };

  const renderFormFields = () => {
    switch (formData.type) {
      case 'vacation':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>휴가 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vacationType">휴가 유형 *</Label>
                <Select value={formData.vacationType} onValueChange={(value) => setFormData(prev => ({ ...prev, vacationType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="휴가 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">연차</SelectItem>
                    <SelectItem value="sick">병가</SelectItem>
                    <SelectItem value="personal">개인사유</SelectItem>
                    <SelectItem value="maternity">출산휴가</SelectItem>
                    <SelectItem value="paternity">육아휴직</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 휴가 일정 리스트 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>휴가 일정 *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVacationSchedule}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    일정 추가
                  </Button>
                </div>

                {vacationSchedules.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-muted rounded-lg">
                    휴가 일정을 추가해주세요
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vacationSchedules.map((schedule, index) => (
                      <Card key={schedule.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVacationSchedule(schedule.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* 날짜 선택 */}
                            <div className="space-y-2">
                              <Label>날짜 *</Label>
                              <Popover 
                                open={openCalendar[`schedule_${schedule.id}`] || false} 
                                onOpenChange={(open) => toggleCalendar(`schedule_${schedule.id}`, open)}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !schedule.date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formatDate(schedule.date)}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={schedule.date}
                                    onSelect={(date) => {
                                      updateVacationSchedule(schedule.id, { date });
                                      toggleCalendar(`schedule_${schedule.id}`, false);
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* 휴가 종류 */}
                            <div className="space-y-2">
                              <Label>휴가 종류 *</Label>
                              <Select 
                                value={schedule.type} 
                                onValueChange={(value: 'full' | 'half_morning' | 'half_afternoon' | 'hours') => 
                                  updateVacationSchedule(schedule.id, { type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="휴가 종류를 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">전일</SelectItem>
                                  <SelectItem value="half_morning">오전반차</SelectItem>
                                  <SelectItem value="half_afternoon">오후반차</SelectItem>
                                  <SelectItem value="hours">시간단위</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* 시간 단위 선택 시 시간 입력 */}
                          {schedule.type === 'hours' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>시작 시간 *</Label>
                                <Input
                                  type="time"
                                  value={schedule.startTime || ''}
                                  onChange={(e) => updateVacationSchedule(schedule.id, { startTime: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>종료 시간 *</Label>
                                <Input
                                  type="time"
                                  value={schedule.endTime || ''}
                                  onChange={(e) => updateVacationSchedule(schedule.id, { endTime: e.target.value })}
                                />
                              </div>
                            </div>
                          )}

                          {/* 사유 */}
                          <div className="space-y-2">
                            <Label>사유</Label>
                            <Input
                              placeholder="휴가 사유를 입력하세요 (선택사항)"
                              value={schedule.reason || ''}
                              onChange={(e) => updateVacationSchedule(schedule.id, { reason: e.target.value })}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* 요약 정보 */}
                {vacationSchedules.length > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">총 {vacationSchedules.length}일:</span>
                        {vacationSchedules.map((schedule, index) => (
                          <Badge key={schedule.id} variant="secondary" className="text-xs">
                            {schedule.date ? formatDate(schedule.date) : '미설정'} 
                            ({getVacationTypeLabel(schedule.type)})
                            {schedule.type === 'hours' && schedule.startTime && schedule.endTime && 
                              ` ${schedule.startTime}~${schedule.endTime}`
                            }
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'business_trip':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>출장 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination">출장지 *</Label>
                <Input
                  id="destination"
                  placeholder="출장지를 입력하세요"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>출장 시작일 *</Label>
                  <Popover open={openCalendar.startDate || false} onOpenChange={(open) => toggleCalendar('startDate', open)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(formData.startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleDateSelect(date, 'startDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>출장 종료일 *</Label>
                  <Popover open={openCalendar.endDate || false} onOpenChange={(open) => toggleCalendar('endDate', open)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(formData.endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => handleDateSelect(date, 'endDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripPurpose">출장 목적 *</Label>
                <Textarea
                  id="tripPurpose"
                  placeholder="출장 목적을 입력하세요"
                  value={formData.tripPurpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, tripPurpose: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">예상 비용</Label>
                <Input
                  id="estimatedCost"
                  placeholder="예상 비용을 입력하세요 (원)"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'expense':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>지출 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expenseCategory">지출 항목 *</Label>
                <Select value={formData.expenseCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, expenseCategory: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="지출 항목을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office_supplies">사무용품</SelectItem>
                    <SelectItem value="travel">교통비</SelectItem>
                    <SelectItem value="meal">식비</SelectItem>
                    <SelectItem value="entertainment">접대비</SelectItem>
                    <SelectItem value="education">교육비</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">금액 *</Label>
                  <Input
                    id="amount"
                    placeholder="금액을 입력하세요 (원)"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">업체명</Label>
                  <Input
                    id="vendor"
                    placeholder="업체명을 입력하세요"
                    value={formData.vendor}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'purchase':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>구매 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">구매 품목 *</Label>
                <Input
                  id="itemName"
                  placeholder="구매할 품목명을 입력하세요"
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">수량 *</Label>
                  <Input
                    id="quantity"
                    placeholder="수량을 입력하세요"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">단가 *</Label>
                  <Input
                    id="unitPrice"
                    placeholder="단가를 입력하세요 (원)"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">공급업체</Label>
                <Input
                  id="vendor"
                  placeholder="공급업체명을 입력하세요"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                />
              </div>

              {/* 총 금액 계산 */}
              {formData.quantity && formData.unitPrice && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">총 금액</span>
                    <span className="text-lg font-semibold text-primary">
                      {(Number(formData.quantity) * Number(formData.unitPrice)).toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}

              {/* 파일 첨부 섹션 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>첨부파일</Label>
                  <span className="text-xs text-muted-foreground">
                    최대 10MB, 여러 파일 선택 가능
                  </span>
                </div>

                {/* 파일 업로드 버튼 */}
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-primary/50 transition-colors"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">파일을 선택하거나 드래그하세요</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        견적서, 사양서, 카탈로그 등을 첨부할 수 있습니다
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, XLS, PPT, 이미지 파일 지원
                      </p>
                    </div>
                  </label>
                </div>

                {/* 첨부된 파일 목록 */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">첨부된 파일 ({attachedFiles.length}개)</p>
                    <div className="space-y-2">
                      {attachedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-lg">{getFileIcon(file.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'education':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>교육 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="educationName">교육명 *</Label>
                <Input
                  id="educationName"
                  placeholder="교육과정명을 입력하세요"
                  value={formData.educationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, educationName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>교육일자 *</Label>
                  <Popover open={openCalendar.educationDate || false} onOpenChange={(open) => toggleCalendar('educationDate', open)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.educationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(formData.educationDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.educationDate}
                        onSelect={(date) => handleDateSelect(date, 'educationDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationCost">교육비용</Label>
                  <Input
                    id="educationCost"
                    placeholder="교육비용을 입력하세요 (원)"
                    value={formData.educationCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, educationCost: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'overtime':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>연장근무 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>연장근무일 *</Label>
                <Popover open={openCalendar.overtimeDate || false} onOpenChange={(open) => toggleCalendar('overtimeDate', open)}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.overtimeDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(formData.overtimeDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.overtimeDate}
                      onSelect={(date) => handleDateSelect(date, 'overtimeDate')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overtimeStartTime">시작 시간 *</Label>
                  <Input
                    id="overtimeStartTime"
                    type="time"
                    value={formData.overtimeStartTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, overtimeStartTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeEndTime">종료 시간 *</Label>
                  <Input
                    id="overtimeEndTime"
                    type="time"
                    value={formData.overtimeEndTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, overtimeEndTime: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">전자결재 기안</h1>
          <p className="text-muted-foreground">새로운 결재 문서를 작성합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 폼 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">결재 유형 *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => {
                      // 결재 유형이 변경될 때 관련 필드들 초기화
                      setFormData(prev => ({ 
                        ...prev, 
                        type: value,
                        // 모든 특별 필드들 초기화
                        vacationType: '',
                        startDate: undefined,
                        endDate: undefined,
                        destination: '',
                        tripPurpose: '',
                        estimatedCost: '',
                        expenseCategory: '',
                        amount: '',
                        vendor: '',
                        itemName: '',
                        quantity: '',
                        unitPrice: '',
                        educationName: '',
                        educationDate: undefined,
                        educationCost: '',
                        overtimeDate: undefined,
                        overtimeStartTime: '',
                        overtimeEndTime: '',
                      }));
                      // 휴가 일정도 초기화
                      setVacationSchedules([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="결재 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">긴급도</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="normal">보통</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="urgent">긴급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  placeholder="결재 제목을 입력하세요"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  placeholder="결재 내용을 입력하세요"
                  className="min-h-[200px]"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* 결재 유형별 동적 폼 */}
          {renderFormFields()}
        </div>

        {/* 결재선 및 참조자 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                결재선
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMemberDialog('approver')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvers.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  결재자를 선택해주세요
                </div>
              ) : (
                <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      <GripVertical className="h-3 w-3" />
                      드래그하여 결재 순서를 변경할 수 있습니다
                    </div>
                    {approvers.map((approver, index) => (
                      <DraggableApprover
                        key={approver.id}
                        approver={approver}
                        index={index}
                        moveApprover={moveApprover}
                        removeMember={removeMember}
                      />
                    ))}
                  </div>
                </DndProvider>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                참조자
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMemberDialog('reference')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {references.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  참조자를 선택해주세요 (선택사항)
                </div>
              ) : (
                <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      <GripVertical className="h-3 w-3" />
                      드래그하여 참조자 순서를 변경할 수 있습니다
                    </div>
                    {references.map((reference, index) => (
                      <DraggableReference
                        key={reference.id}
                        reference={reference}
                        index={index}
                        moveReference={moveReference}
                        removeMember={removeMember}
                      />
                    ))}
                  </div>
                </DndProvider>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button onClick={() => handleSubmit('submit')}>
              결재 요청
            </Button>
            <Button variant="outline" onClick={() => handleSubmit('draft')}>
              임시저장
            </Button>
          </div>
        </div>
      </div>

      {/* 구성원 선택 다이얼로그 */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectingFor === 'approver' ? '결재자' : '참조자'} 선택
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="이름 또는 부서로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {mockMembers
                .filter(member => 
                  member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  member.department.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((member) => (
                  <div
                    key={member.id}
                    onClick={() => addMember(member, selectingFor)}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.department} · {member.position}
                    </div>
                  </div>
                ))}
              {mockMembers.filter(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.department.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}