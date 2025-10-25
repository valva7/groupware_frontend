import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { CheckCircle, XCircle, Clock, MessageSquare, FileText, ArrowLeft, Download, Image, Video, File } from 'lucide-react';
import { toast } from "sonner";
import { Attachment } from '../../types';
import { useNavigate } from 'react-router-dom';

const mockApproval = {
  id: '1',
  title: '2024년 2월 휴가신청서',
  type: '휴가신청',
  requesterId: '1',
  requesterName: '김그룹웨어',
  department: '개발팀',
  position: '선임연구원',
  status: 'pending',
  createdAt: '2024-01-20T09:00:00Z',
  content: `안녕하세요. 개인 사유로 인해 휴가를 신청합니다.

휴가 기간: 2024년 2월 15일 ~ 2024년 2월 16일 (2일)
휴가 사유: 가족 행사 참석

업무 인수인계는 박개발 연구원에게 완료하였으며, 긴급한 사항은 휴대폰으로 연락 가능합니다.

감사합니다.`,
  urgency: 'normal',
  approvers: [
    {
      id: '1',
      memberId: '2',
      memberName: '김팀장',
      department: '개발팀',
      position: '팀장',
      order: 1,
      status: 'pending',
      processedAt: null,
      comment: null,
    },
    {
      id: '2',
      memberId: '3',
      memberName: '이부장',
      department: '개발팀',
      position: '부장',
      order: 2,
      status: 'pending',
      processedAt: null,
      comment: null,
    },
  ],
  references: [
    {
      id: '4',
      name: '홍인사',
      department: '인사팀',
      position: '팀장',
    },
  ],
  attachments: [
    {
      id: '1',
      name: 'vacation_request_form.pdf',
      originalName: '휴가신청서_양식.pdf',
      size: 512000,
      type: 'application/pdf',
      url: '/files/vacation_request_form.pdf',
      uploadedAt: '2024-01-20T09:00:00Z'
    },
    {
      id: '2',
      name: 'medical_certificate.jpg',
      originalName: '의료진단서.jpg',
      size: 1024000,
      type: 'image/jpeg',
      url: '/files/medical_certificate.jpg',
      uploadedAt: '2024-01-20T09:05:00Z'
    },
    {
      id: '3',
      name: 'work_handover_doc.docx',
      originalName: '업무인수인계서.docx',
      size: 256000,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      url: '/files/work_handover_doc.docx',
      uploadedAt: '2024-01-20T09:10:00Z'
    }
  ],
};

const statusConfig = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  approved: { label: '승인', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: '반려', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const urgencyConfig = {
  low: { label: '낮음', color: 'bg-blue-100 text-blue-800' },
  normal: { label: '보통', color: 'bg-gray-100 text-gray-800' },
  high: { label: '높음', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: '긴급', color: 'bg-red-100 text-red-800' },
};

export function ApprovalDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);
  const navigate = useNavigate();

  const handleAction = (action: 'approve' | 'reject') => {
    setSelectedAction(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedAction) return;

    const message = selectedAction === 'approve' ? '승인되었습니다.' : '반려되었습니다.';
    toast.success(message);
    setActionDialogOpen(false);
    setComment('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 타입에 따른 아이콘 반환
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('document') || type.includes('word')) return <FileText className="h-5 w-5 text-blue-600" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileText className="h-5 w-5 text-green-600" />;
    if (type.includes('zip') || type.includes('compressed')) return <File className="h-5 w-5 text-orange-500" />;
    if (type.includes('text/') || type.includes('markdown')) return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // 파일 다운로드 함수
  const downloadFile = async (attachment: Attachment) => {
    try {
      // 실제 환경에서는 인증 토큰과 함께 API 호출
      const response = await fetch(attachment.url, {
        method: 'GET',
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        // }
      });

      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      // Blob 생성
      const blob = await response.blob();
      
      // 다운로드 링크 생성
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = attachment.originalName || attachment.name;
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success(`${attachment.originalName} 파일이 다운로드되었습니다.`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const currentApprover = mockApproval.approvers.find(approver => approver.status === 'pending');
  const canApprove = currentApprover?.memberId === '2'; // 현재 사용자가 결재자인지 확인

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/approval/list')} className="self-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold break-words">{mockApproval.title}</h1>
            <p className="text-muted-foreground text-sm">결재 문서 상세</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{mockApproval.type}</Badge>
                    <Badge variant="secondary" className={urgencyConfig[mockApproval.urgency as keyof typeof urgencyConfig].color}>
                      {urgencyConfig[mockApproval.urgency as keyof typeof urgencyConfig].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>작성자: {mockApproval.requesterName}</span>
                    <span>부서: {mockApproval.department}</span>
                    <span>직급: {mockApproval.position}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    작성일: {formatDate(mockApproval.createdAt)}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={statusConfig[mockApproval.status as keyof typeof statusConfig].color}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {statusConfig[mockApproval.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">결재 내용</h3>
                  <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {mockApproval.content}
                  </div>
                </div>

                {/* 첨부파일 섹션 */}
                {mockApproval.attachments && mockApproval.attachments.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      첨부파일 ({mockApproval.attachments.length})
                    </h3>
                    <div className="space-y-3">
                      {mockApproval.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {getFileIcon(attachment.type)}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate text-sm">
                                {attachment.originalName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(attachment.size)}</span>
                                <span>•</span>
                                <span>{formatDate(attachment.uploadedAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(attachment)}
                            className="shrink-0"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            다운로드
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {canApprove && (
            <Card>
              <CardHeader>
                <CardTitle>결재 처리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button onClick={() => handleAction('approve')} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    승인
                  </Button>
                  <Button variant="destructive" onClick={() => handleAction('reject')} className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    반려
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 사이드바 */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>결재선</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockApproval.approvers.map((approver, index) => {
                  const config = statusConfig[approver.status as keyof typeof statusConfig];
                  const StatusIcon = config.icon;
                  
                  return (
                    <div key={approver.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        {index + 1}차
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{approver.memberName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{approver.memberName}</div>
                        <div className="text-xs text-muted-foreground">
                          {approver.department} · {approver.position}
                        </div>
                      </div>
                      <Badge variant="secondary" className={`text-xs ${config.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {mockApproval.references.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>참조자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockApproval.references.map((reference) => (
                    <div key={reference.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{reference.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{reference.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {reference.department} · {reference.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 결재 처리 다이얼로그 */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'approve' ? '결재 승인' : '결재 반려'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedAction === 'approve' 
                ? '이 결재 문서를 승인하시겠습니까?' 
                : '이 결재 문서를 반려하시겠습니까?'}
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {selectedAction === 'approve' ? '승인 의견' : '반려 사유'}
                {selectedAction === 'reject' && <span className="text-destructive"> *</span>}
              </label>
              <Textarea
                placeholder={selectedAction === 'approve' ? '승인 의견을 입력하세요 (선택사항)' : '반려 사유를 입력하세요'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                취소
              </Button>
              <Button
                onClick={confirmAction}
                variant={selectedAction === 'approve' ? 'default' : 'destructive'}
                disabled={selectedAction === 'reject' && !comment.trim()}
              >
                {selectedAction === 'approve' ? '승인' : '반려'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}