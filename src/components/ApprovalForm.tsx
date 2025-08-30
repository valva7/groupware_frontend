import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Plus, X, User, ChevronRight, Calendar } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ApprovalFormProps {
  formType: string;
  onBack: () => void;
  employees: any[];
  departments: any[];
}

export function ApprovalForm({ formType, onBack, employees, departments }: ApprovalFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    amount: "",
    period: "",
    reason: "",
    department: "",
    startDate: "",
    endDate: "",
    urgency: "보통"
  });

  const [approvalLine, setApprovalLine] = useState<any[]>([]);
  const [isSelectingApprover, setIsSelectingApprover] = useState(false);

  const getFormTypeLabel = (type: string) => {
    switch (type) {
      case "vacation": return "휴가 신청";
      case "expense": return "경비 신청";
      case "purchase": return "구매 신청";
      case "overtime": return "초과 근무 신청";
      default: return "결재 신청";
    }
  };

  const addApprover = (employee: any) => {
    if (approvalLine.find(approver => approver.id === employee.id)) {
      toast.error("이미 결재선에 추가된 직원입니다.");
      return;
    }
    
    setApprovalLine([...approvalLine, {
      ...employee,
      order: approvalLine.length + 1,
      status: "대기"
    }]);
    setIsSelectingApprover(false);
    toast.success(`${employee.name}님이 결재선에 추가되었습니다.`);
  };

  const removeApprover = (employeeId: number) => {
    const updatedLine = approvalLine
      .filter(approver => approver.id !== employeeId)
      .map((approver, index) => ({ ...approver, order: index + 1 }));
    
    setApprovalLine(updatedLine);
    toast.success("결재자가 제거되었습니다.");
  };

  const moveApprover = (fromIndex: number, toIndex: number) => {
    const updatedLine = [...approvalLine];
    const [movedItem] = updatedLine.splice(fromIndex, 1);
    updatedLine.splice(toIndex, 0, movedItem);
    
    // 순서 재정렬
    const reorderedLine = updatedLine.map((approver, index) => ({
      ...approver,
      order: index + 1
    }));
    
    setApprovalLine(reorderedLine);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{getFormTypeLabel(formType)}</h1>
          <p className="text-muted-foreground">결재 신청서를 작성해주세요.</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 폼 */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  placeholder="결재 제목을 입력하세요"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {formType === "vacation" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pastel-blue-600" />
                        시작일
                      </Label>
                      <div className="relative">
                        <Input
                          id="start-date"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="date-input"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pastel-blue-600" />
                        종료일
                      </Label>
                      <div className="relative">
                        <Input
                          id="end-date"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="date-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">휴가 사유</Label>
                    <Textarea
                      id="reason"
                      placeholder="휴가 사유를 입력하세요"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {formType === "expense" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="amount">금액</Label>
                    <Input
                      id="amount"
                      placeholder="금액을 입력하세요"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">사용 내역</Label>
                    <Textarea
                      id="content"
                      placeholder="경비 사용 내역을 상세히 입력하세요"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={4}
                    />
                  </div>
                </>
              )}

              {formType === "purchase" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="amount">구매 금액</Label>
                    <Input
                      id="amount"
                      placeholder="구매 금액을 입력하세요"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">구매 품목</Label>
                    <Textarea
                      id="content"
                      placeholder="구매할 품목과 사유를 입력하세요"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={4}
                    />
                  </div>
                </>
              )}

              {formType === "overtime" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pastel-blue-600" />
                        근무일
                      </Label>
                      <div className="relative">
                        <Input
                          id="start-date"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="date-input"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period">근무 시간</Label>
                      <Input
                        id="period"
                        placeholder="예: 18:00 ~ 22:00"
                        value={formData.period}
                        onChange={(e) => setFormData({...formData, period: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">초과 근무 사유</Label>
                    <Textarea
                      id="reason"
                      placeholder="초과 근무가 필요한 사유를 입력하세요"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="urgency">긴급도</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="긴급도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="낮음">낮음</SelectItem>
                    <SelectItem value="보통">보통</SelectItem>
                    <SelectItem value="높음">높음</SelectItem>
                    <SelectItem value="긴급">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* 결재선 설정 */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">결재선 설정</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectingApprover(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                추가
              </Button>
            </div>

            {approvalLine.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">결재자를 추가해주세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvalLine.map((approver, index) => (
                  <div key={approver.id} className="flex items-center gap-3 p-3 bg-white border border-pastel-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium text-pastel-blue-600 bg-pastel-blue-100 rounded-full w-6 h-6 flex items-center justify-center">
                        {approver.order}
                      </span>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={approver.profileImage} alt={approver.name} />
                        <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xs">
                          {approver.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{approver.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{approver.position}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveApprover(index, index - 1)}
                        >
                          ↑
                        </Button>
                      )}
                      {index < approvalLine.length - 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveApprover(index, index + 1)}
                        >
                          ↓
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeApprover(approver.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 결재자 선택 모달 */}
            {isSelectingApprover && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[70vh] overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">결재자 선택</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSelectingApprover(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {departments.map(dept => (
                      <div key={dept.id}>
                        <h5 className="font-medium text-sm text-muted-foreground mb-2">{dept.name}</h5>
                        <div className="space-y-2">
                          {employees
                            .filter(emp => emp.department === dept.name)
                            .filter(emp => emp.position.includes("팀장") || emp.position.includes("부장") || emp.position.includes("이사"))
                            .map(employee => (
                              <button
                                key={employee.id}
                                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => addApprover(employee)}
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={employee.profileImage} alt={employee.name} />
                                  <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xs">
                                    {employee.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-medium">{employee.name}</p>
                                  <p className="text-xs text-muted-foreground">{employee.position}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </button>
                            ))
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-pastel-blue-200">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onBack}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  onClick={() => {
                    if (!formData.title) {
                      toast.error("제목을 입력해주세요.");
                      return;
                    }
                    if (approvalLine.length === 0) {
                      toast.error("결재자를 최소 1명 이상 추가해주세요.");
                      return;
                    }
                    
                    toast.success("결재 신청이 완료되었습니다!");
                    onBack();
                  }}
                >
                  신청
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}