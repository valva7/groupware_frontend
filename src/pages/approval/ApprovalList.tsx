import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, FileText, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Approval } from '../../types';
import { useIsMobile } from '../../components/ui/use-mobile';

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
    requesterId: '2',
    requesterName: '박개발',
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
    requesterId: '3',
    requesterName: '이디자인',
    department: '디자인팀',
    status: 'rejected',
    createdAt: '2024-01-19T16:00:00Z',
    content: 'React 심화 교육 과정 참석',
    approvers: [],
  },
  {
    id: '4',
    title: '출장 신청서 - 부산 지사',
    type: '출장신청',
    requesterId: '4',
    requesterName: '최마케팅',
    department: '마케팅팀',
    status: 'pending',
    createdAt: '2024-01-17T11:20:00Z',
    content: '부산 지사 방문 및 고객 미팅',
    approvers: [],
  },
  {
    id: '5',
    title: '연장근무 신청서',
    type: '연장근무',
    requesterId: '1',
    requesterName: '김그룹웨어',
    department: '개발팀',
    status: 'draft',
    createdAt: '2024-01-21T18:00:00Z',
    content: '프로젝트 마감으로 인한 연장근무',
    approvers: [],
  },
];

const statusConfig = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  approved: { label: '승인', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: '반려', color: 'bg-red-100 text-red-800', icon: XCircle },
  draft: { label: '임시저장', color: 'bg-gray-100 text-gray-800', icon: Edit },
};

export function ApprovalList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const filteredApprovals = mockApprovals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    const matchesType = typeFilter === 'all' || approval.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getApprovalsByStatus = (status: string) => {
    if (status === 'all') return filteredApprovals;
    return filteredApprovals.filter(approval => approval.status === status);
  };

  const handleRowClick = (approval: Approval) => {
    navigate(`/approval/detail/${approval.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 모바일용 카드 렌더링 함수
  const renderMobileCard = (approval: Approval) => {
    const config = statusConfig[approval.status];
    const StatusIcon = config.icon;
    
    return (
      <Card
        key={approval.id}
        className="cursor-pointer hover:shadow-md transition-shadow border border-border"
        onClick={() => handleRowClick(approval)}
      >
        <CardContent className="p-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-medium text-sm line-clamp-2 leading-tight">{approval.title}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3 shrink-0" />
                <span>{approval.type}</span>
              </div>
            </div>
            <Badge variant="secondary" className={`${config.color} shrink-0 text-xs`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="truncate mr-2">작성자: {approval.requesterName}</span>
            <div className="text-right shrink-0 space-y-0.5">
              <div>{approval.department}</div>
              <div>{formatDate(approval.createdAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">결재 목록</h1>
          <p className="text-muted-foreground text-sm sm:text-base">내가 작성하거나 결재해야 할 문서들을 확인합니다.</p>
        </div>
        <Button onClick={() => navigate('/approval/draft')} className="shrink-0">
          <FileText className="h-4 w-4 mr-2" />
          새 결재 작성
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목 또는 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="approved">승인</SelectItem>
                  <SelectItem value="rejected">반려</SelectItem>
                  <SelectItem value="draft">임시저장</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="휴가신청">휴가신청</SelectItem>
                  <SelectItem value="구매요청">구매요청</SelectItem>
                  <SelectItem value="출장신청">출장신청</SelectItem>
                  <SelectItem value="교육신청">교육신청</SelectItem>
                  <SelectItem value="연장근무">연장근무</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className={`${isMobile ? 'space-y-3' : ''}`}>
              <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-5'}`}>
                <TabsTrigger value="all" className={isMobile ? 'text-xs px-1' : ''}>
                  {isMobile ? `전체 (${filteredApprovals.length})` : `전체 (${filteredApprovals.length})`}
                </TabsTrigger>
                <TabsTrigger value="pending" className={isMobile ? 'text-xs px-1' : ''}>
                  {isMobile ? `대기 (${getApprovalsByStatus('pending').length})` : `대기중 (${getApprovalsByStatus('pending').length})`}
                </TabsTrigger>
                {!isMobile && (
                  <>
                    <TabsTrigger value="approved">
                      승인 ({getApprovalsByStatus('approved').length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      반려 ({getApprovalsByStatus('rejected').length})
                    </TabsTrigger>
                    <TabsTrigger value="draft">
                      임시저장 ({getApprovalsByStatus('draft').length})
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              
              {/* 모바일에서 추가 탭들을 버튼으로 표시 */}
              {isMobile && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <TabsTrigger 
                    value="approved" 
                    className="flex-shrink-0 text-xs px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors"
                  >
                    승인 ({getApprovalsByStatus('approved').length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rejected" 
                    className="flex-shrink-0 text-xs px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors"
                  >
                    반려 ({getApprovalsByStatus('rejected').length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="draft" 
                    className="flex-shrink-0 text-xs px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors"
                  >
                    임시저장 ({getApprovalsByStatus('draft').length})
                  </TabsTrigger>
                </div>
              )}
            </div>

            {['all', 'pending', 'approved', 'rejected', 'draft'].map((status) => (
              <TabsContent key={status} value={status} className="mt-4">
                {isMobile ? (
                  <div className="space-y-3">
                    {getApprovalsByStatus(status).map(renderMobileCard)}
                    {getApprovalsByStatus(status).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">해당하는 결재 문서가 없습니다.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>제목</TableHead>
                          <TableHead>유형</TableHead>
                          <TableHead>작성자</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>작성일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getApprovalsByStatus(status).map((approval) => {
                          const config = statusConfig[approval.status];
                          const StatusIcon = config.icon;
                          
                          return (
                            <TableRow
                              key={approval.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleRowClick(approval)}
                            >
                              <TableCell className="font-medium">{approval.title}</TableCell>
                              <TableCell>{approval.type}</TableCell>
                              <TableCell>{approval.requesterName}</TableCell>
                              <TableCell>{approval.department}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`${config.color}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(approval.createdAt)}</TableCell>
                            </TableRow>
                          );
                        })}
                        {getApprovalsByStatus(status).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              해당하는 결재 문서가 없습니다.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}