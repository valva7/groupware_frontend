import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Building2,
  DollarSign,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PendingApprovalItem {
  id: number;
  title: string;
  type: string;
  requester: {
    name: string;
    department: string;
    position: string;
  };
  requestDate: string;
  amount?: string;
  description: string;
  content: string;
  attachments?: string[];
  urgency: "긴급" | "보통" | "낮음";
}

export function PendingApprovalList() {
  const [selectedApproval, setSelectedApproval] = useState<PendingApprovalItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingApprovals: PendingApprovalItem[] = [
    {
      id: 1,
      title: "신규 장비 구매 요청",
      type: "구매",
      requester: {
        name: "김철수",
        department: "개발팀",
        position: "주임"
      },
      requestDate: "2024-03-24",
      amount: "2,850,000원",
      description: "개발용 노트북 및 모니터 구매 요청",
      content: `구매 목적: 신입 개발자용 장비 구매

구매 요청 내역:
1. MacBook Pro 14" M3 (16GB RAM, 512GB SSD)
   - 가격: 2,390,000원
   - 수량: 1대
   - 사용자: 신입 개발자

2. 외장 모니터 (LG 27인치 4K)
   - 가격: 460,000원
   - 수량: 1대

총 구매 금액: 2,850,000원

구매 사유:
- 신입 개발자 입사에 따른 업무용 장비 필요
- 기존 장비로는 최신 개발 환경 구축 어려움
- 생산성 향상을 위한 필수 장비

납기 희망일: 2024년 4월 1일`,
      attachments: ["견적서.pdf", "사양서.pdf"],
      urgency: "보통"
    },
    {
      id: 2,
      title: "야근 수당 신청",
      type: "급여",
      requester: {
        name: "이영희",
        department: "마케팅팀",
        position: "대리"
      },
      requestDate: "2024-03-23",
      amount: "180,000원",
      description: "프로젝트 마감 관련 야근 수당 신청",
      content: `야근 사유: 브랜드 리뉴얼 프로젝트 마감 대응

야근 기간: 2024년 3월 18일 ~ 3월 22일 (5일간)

야근 시간 상세:
- 3월 18일 (월): 18:00 ~ 22:00 (4시간)
- 3월 19일 (화): 18:00 ~ 21:00 (3시간)
- 3월 20일 (수): 18:00 ~ 23:00 (5시간)
- 3월 21일 (목): 18:00 ~ 22:30 (4.5시간)
- 3월 22일 (금): 18:00 ~ 20:30 (2.5시간)

총 야근 시간: 19시간
시간당 수당: 10,000원
총 야근 수당: 190,000원

업무 내용:
- 브랜드 컨셉 최종 검토 및 수정
- 클라이언트 피드백 반영
- 최종 프레젠테이션 자료 준비
- 브랜드 가이드라인 문서 작성`,
      attachments: ["야근승인서.pdf", "업무일지.xlsx"],
      urgency: "보통"
    },
    {
      id: 3,
      title: "긴급 출장비 신청",
      type: "경비",
      requester: {
        name: "박민수",
        department: "영업팀",
        position: "과장"
      },
      requestDate: "2024-03-24",
      amount: "480,000원",
      description: "긴급 고객사 미팅을 위한 출장비 신청",
      content: `출장 목적: 긴급 고객사 미팅 (계약 이슈 해결)

출장 일정: 2024년 3월 26일 ~ 3월 27일 (1박 2일)
출장 장소: 대구광역시

출장 사유:
- 주요 고객사에서 긴급 미팅 요청
- 계약 조건 재협상 필요
- 프로젝트 지연 방지를 위한 즉시 대응 필요

예상 경비 내역:
1. 교통비
   - KTX 서울↔대구 왕복: 118,000원
   - 시내 교통비: 30,000원

2. 숙박비
   - 호텔 숙박 (1박): 120,000원

3. 식비 및 기타
   - 식비: 80,000원
   - 기타 비용: 32,000원

총 예상 금액: 380,000원
예비비 포함: 480,000원`,
      attachments: ["고객사요청서.pdf", "출장계획서.docx"],
      urgency: "긴급"
    },
    {
      id: 4,
      title: "교육 과정 참가 신청",
      type: "교육",
      requester: {
        name: "정한솔",
        department: "인사팀",
        position: "사원"
      },
      requestDate: "2024-03-23",
      amount: "450,000원",
      description: "HR 전문 교육 과정 참가 신청",
      content: `교육 과정명: 전략적 인사관리 전문가 과정

교육 기관: 한국인사관리협회
교육 기간: 2024년 4월 15일 ~ 4월 19일 (5일간)
교육 시간: 09:00 ~ 18:00
교육 장소: 서울 강남구 교육센터

교육 목적:
- 최신 인사관리 트렌드 습득
- 채용 및 평가 시스템 개선 방안 학습
- 조직 문화 개선 전략 수립

교육 커리큘럼:
1일차: 전략적 인사관리 개론
2일차: 채용 시스템 혁신
3일차: 성과관리 및 평가 체계
4일차: 조직문화 진단 및 개선
5일차: 실습 및 액션플랜 수립

교육비 내역:
- 교육비: 380,000원
- 교재비: 50,000원
- 교통비: 20,000원

총 교육비: 450,000원

기대 효과:
- 인사 업무 전문성 향상
- 조직 내 인사 정책 개선
- 직무 역량 강화`,
      attachments: ["교육과정안내.pdf", "교육신청서.pdf"],
      urgency: "보통"
    }
  ];

  const handleApprovalClick = (approval: PendingApprovalItem) => {
    setSelectedApproval(approval);
    setIsDetailDialogOpen(true);
    setApprovalComment("");
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;
    
    setIsProcessing(true);
    
    // 승인 처리 시뮬레이션
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${selectedApproval.title} 결재가 승인되었습니다.`);
      setIsDetailDialogOpen(false);
      setSelectedApproval(null);
      setApprovalComment("");
    } catch (error) {
      toast.error("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
    setRejectReason("");
  };

  const handleRejectConfirm = async () => {
    if (!selectedApproval) return;
    
    if (!rejectReason.trim()) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }
    
    setIsProcessing(true);
    
    // 반려 처리 시뮬레이션
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${selectedApproval.title} 결재가 반려되었습니다.`);
      setIsRejectDialogOpen(false);
      setIsDetailDialogOpen(false);
      setSelectedApproval(null);
      setApprovalComment("");
      setRejectReason("");
    } catch (error) {
      toast.error("반려 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "긴급": return "bg-red-100 text-red-700";
      case "보통": return "bg-yellow-100 text-yellow-700";
      case "낮음": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "구매": "bg-orange-100 text-orange-700",
      "급여": "bg-indigo-100 text-indigo-700",
      "경비": "bg-blue-100 text-blue-700",
      "교육": "bg-green-100 text-green-700",
      "휴가": "bg-purple-100 text-purple-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getAuthorInitials = (name: string) => {
    return name.length >= 2 ? name.slice(-2) : name;
  };

  return (
    <>
      <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded-full"></div>
          승인 필요 결재 목록
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            {pendingApprovals.length}건
          </Badge>
        </h3>
        <div className="space-y-3">
          {pendingApprovals.map((item) => (
            <div 
              key={item.id}
              className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleApprovalClick(item)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium group-hover:text-pastel-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <Badge variant="outline" className={getUrgencyColor(item.urgency)}>
                      {item.urgency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                    {item.description}
                  </p>
                  {item.amount && (
                    <p className="text-sm font-medium text-pastel-blue-600">
                      {item.amount}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-pastel-blue-100 text-pastel-blue-700">
                      {getAuthorInitials(item.requester.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{item.requester.name}</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {item.requester.department}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.requestDate}
                </div>
              </div>
            </div>
          ))}

          {pendingApprovals.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium text-muted-foreground mb-2">
                승인 대기 중인 결재가 없습니다
              </h4>
              <p className="text-sm text-muted-foreground">
                모든 결재가 처리 완료되었습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 승인 결재 상세보기 팝업 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              결재 승인 요청
            </DialogTitle>
            <DialogDescription>
              아래 결재 문서를 검토하고 승인 또는 반려 처리해주세요.
            </DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-6">
              {/* 문서 헤더 */}
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {selectedApproval.title}
                      </h3>
                      <Badge variant="outline" className={getTypeColor(selectedApproval.type)}>
                        {selectedApproval.type}
                      </Badge>
                      <Badge variant="outline" className={getUrgencyColor(selectedApproval.urgency)}>
                        {selectedApproval.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedApproval.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      신청자: {selectedApproval.requester.name} ({selectedApproval.requester.position})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      부서: {selectedApproval.requester.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      신청일: {selectedApproval.requestDate}
                    </span>
                  </div>
                  {selectedApproval.amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        금액: {selectedApproval.amount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* 문서 내용 */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-pastel-blue-600" />
                  신청 내용
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-normal">
                    {selectedApproval.content}
                  </pre>
                </div>
              </div>

              {/* 첨부파일 */}
              {selectedApproval.attachments && selectedApproval.attachments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Download className="h-4 w-4 text-pastel-blue-600" />
                    첨부파일
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApproval.attachments.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {file}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* 승인 의견 */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-pastel-blue-600" />
                  승인 의견 (선택사항)
                </h4>
                <Textarea
                  placeholder="승인 시 추가 의견이 있으시면 입력해주세요..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              variant="outline"
              onClick={handleRejectClick}
              disabled={isProcessing}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              반려
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  처리 중...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  승인
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 반려 사유 작성 팝업 */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              결재 반려
            </DialogTitle>
            <DialogDescription>
              반려 사유를 입력해주세요. 신청자에게 전달됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedApproval && (
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-sm mb-1">{selectedApproval.title}</h4>
                <p className="text-xs text-muted-foreground">
                  신청자: {selectedApproval.requester.name} ({selectedApproval.requester.department})
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                반려 사유 <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="반려 사유를 구체적으로 입력해주세요..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[120px] border-red-200 focus:border-red-300 focus:ring-red-100"
              />
              <p className="text-xs text-muted-foreground">
                반려 사유는 신청자에게 알림으로 전달됩니다.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={isProcessing || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  반려 처리 중...
                </div>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  반려 확정
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}