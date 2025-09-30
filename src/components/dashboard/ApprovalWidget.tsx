import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { Approval } from '../../types';

const mockApprovals: Approval[] = [
  {
    id: '1',
    title: '2024년 2월 휴가신청서',
    type: '휴가신청',
    requesterId: '1',
    requesterName: '김그룹웨어',
    department: '개발팀',
    status: 'pending',
    createdAt: '2024-01-20T09:00:00Z',
    content: '개인 사유로 인한 연차 휴가 신청',
    approvers: [],
  },
  {
    id: '2',
    title: '업무용 노트북 구매 요청',
    type: '구매요청',
    requesterId: '1',
    requesterName: '김그룹웨어',
    department: '개발팀',
    status: 'approved',
    createdAt: '2024-01-18T14:30:00Z',
    content: '개발업무용 MacBook Pro 구매',
    approvers: [],
  },
  {
    id: '3',
    title: '교육 참석 신청서',
    type: '교육신청',
    requesterId: '1',
    requesterName: '김그룹웨어',
    department: '개발팀',
    status: 'draft',
    createdAt: '2024-01-19T16:00:00Z',
    content: 'React 심화 교육 과정 참석',
    approvers: [],
  },
];

const statusConfig = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  approved: { label: '승인', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: '반려', color: 'bg-red-100 text-red-800', icon: XCircle },
  draft: { label: '임시저장', color: 'bg-gray-100 text-gray-800', icon: FileText },
};

export function ApprovalWidget() {
  const navigate = useNavigate();

  const handleItemClick = (approval: Approval) => {
    navigate(`/approval/detail/${approval.id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">내 전자결재 목록</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockApprovals.map((approval) => {
            const config = statusConfig[approval.status];
            const StatusIcon = config.icon;
            
            return (
              <div
                key={approval.id}
                className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleItemClick(approval)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-1">{approval.title}</h4>
                  <Badge variant="secondary" className={`text-xs ${config.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{approval.type}</span>
                  <span>{new Date(approval.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
          
          {mockApprovals.length === 0 && (
            <div className="text-center text-muted-foreground py-6">
              진행중인 결재가 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}