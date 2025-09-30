import { useState } from 'react';
import { Calendar, Clock, Plus, FileText, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { Leave } from '../../types';

const mockLeaveHistory: Leave[] = [
  {
    id: '1',
    memberId: '1',
    memberName: '김그룹웨어',
    department: '개발팀',
    type: 'annual',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    duration: 8,
    status: 'approved',
    reason: '개인사유',
  },
  {
    id: '2',
    memberId: '1',
    memberName: '김그룹웨어',
    department: '개발팀',
    type: 'annual',
    startDate: '2024-01-08',
    endDate: '2024-01-08',
    duration: 5,
    status: 'approved',
    reason: '병원진료',
  },
];

export function LeaveWidget() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data
  const leaveData = {
    totalDays: 15,
    usedDays: 2,
    usedHours: 5,
    remainingDays: 13,
    remainingHours: 3,
  };

  const usagePercentage = ((leaveData.usedDays * 8 + leaveData.usedHours) / (leaveData.totalDays * 8)) * 100;

  const handleWidgetClick = () => {
    setDialogOpen(true);
  };

  const handleLeaveRequest = () => {
    setDialogOpen(false);
    navigate('/approval/draft');
  };

  return (
    <>
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleWidgetClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">나의 휴가 현황</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                {leaveData.remainingDays}일 {leaveData.remainingHours}시간
              </div>
              <div className="text-sm text-muted-foreground">
                남음
              </div>
            </div>
            
            <Progress value={usagePercentage} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>총 휴가</span>
                </div>
                <div className="font-medium">{leaveData.totalDays}일</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>사용</span>
                </div>
                <div className="font-medium">
                  {leaveData.usedDays}일 {leaveData.usedHours}시간
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              나의 휴가 현황
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 휴가 통계 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{leaveData.totalDays}</div>
                  <div className="text-sm text-muted-foreground">총 휴가일</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{leaveData.usedDays}</div>
                  <div className="text-sm text-muted-foreground">사용일수</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{leaveData.usedHours}</div>
                  <div className="text-sm text-muted-foreground">사용시간</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{leaveData.remainingDays}</div>
                  <div className="text-sm text-muted-foreground">잔여일수</div>
                </CardContent>
              </Card>
            </div>

            {/* 진행률 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">휴가 사용률</span>
                <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={usagePercentage} className="h-3" />
            </div>

            {/* 최근 휴가 내역 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">최근 휴가 내역</h4>
                <Button size="sm" onClick={handleLeaveRequest}>
                  <Plus className="h-4 w-4 mr-1" />
                  휴가 신청
                </Button>
              </div>
              
              <div className="space-y-2">
                {mockLeaveHistory.map((leave) => (
                  <div key={leave.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">
                            {leave.type === 'annual' ? '연차' : 
                             leave.type === 'sick' ? '병가' : 
                             leave.type === 'personal' ? '개인' : '기타'}
                          </Badge>
                          <Badge variant={leave.status === 'approved' ? 'default' : 'outline'}>
                            {leave.status === 'approved' ? '승인' : 
                             leave.status === 'pending' ? '대기' : '반려'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {leave.startDate === leave.endDate ? 
                            new Date(leave.startDate).toLocaleDateString() :
                            `${new Date(leave.startDate).toLocaleDateString()} ~ ${new Date(leave.endDate).toLocaleDateString()}`
                          }
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{leave.duration}시간</div>
                        <div className="text-xs text-muted-foreground">
                          {leave.duration === 8 ? '1일' : `${leave.duration/8}일`}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">사유:</span> {leave.reason}
                    </div>
                  </div>
                ))}
                
                {mockLeaveHistory.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    휴가 사용 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                닫기
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/approval/list')}>
                  <FileText className="h-4 w-4 mr-1" />
                  전체 내역
                </Button>
                <Button onClick={handleLeaveRequest}>
                  <Plus className="h-4 w-4 mr-1" />
                  휴가 신청
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}