import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { 
  Calendar, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  User,
  Building2
} from "lucide-react";

interface VacationRecord {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "승인" | "대기중" | "반려";
  reason: string;
  appliedDate: string;
}

export function MyVacationInfo() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 휴가 정보 데이터
  const vacationInfo = {
    totalDays: 15, // 연간 총 휴가 일수
    usedDays: 8,   // 사용한 휴가 일수
    remainingDays: 7, // 남은 휴가 일수
    pendingDays: 2  // 승인 대기 중인 휴가 일수
  };

  // 최근 휴가 신청 내역
  const recentVacations: VacationRecord[] = [
    {
      id: 1,
      type: "연차",
      startDate: "2024-03-28",
      endDate: "2024-03-29",
      days: 2,
      status: "대기중",
      reason: "가족 행사 참석",
      appliedDate: "2024-03-22"
    },
    {
      id: 2,
      type: "연차",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      days: 1,
      status: "승인",
      reason: "개인 사정",
      appliedDate: "2024-03-10"
    },
    {
      id: 3,
      type: "반차",
      startDate: "2024-03-08",
      endDate: "2024-03-08",
      days: 0.5,
      status: "승인",
      reason: "병원 진료",
      appliedDate: "2024-03-05"
    },
    {
      id: 4,
      type: "연차",
      startDate: "2024-02-20",
      endDate: "2024-02-21",
      days: 2,
      status: "승인",
      reason: "여행",
      appliedDate: "2024-02-15"
    },
    {
      id: 5,
      type: "연차",
      startDate: "2024-02-09",
      endDate: "2024-02-09",
      days: 1,
      status: "승인",
      reason: "개인 사정",
      appliedDate: "2024-02-05"
    }
  ];

  const usagePercentage = (vacationInfo.usedDays / vacationInfo.totalDays) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인": return "bg-green-100 text-green-700";
      case "대기중": return "bg-yellow-100 text-yellow-700";
      case "반려": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "승인": return <CheckCircle2 className="h-3 w-3" />;
      case "대기중": return <Clock className="h-3 w-3" />;
      case "반려": return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return startDate;
    }
    return `${startDate} ~ ${endDate}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 남은 휴가 */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">남은 휴가</p>
                <p className="text-2xl font-bold text-blue-600">{vacationInfo.remainingDays}일</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사용한 휴가 */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">사용한 휴가</p>
                <p className="text-2xl font-bold text-green-600">{vacationInfo.usedDays}일</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 전체 휴가 */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">연간 총 휴가</p>
                <p className="text-2xl font-bold text-purple-600">{vacationInfo.totalDays}일</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 휴가 사용률 및 최근 내역 */}
        <Card className="bg-gradient-to-br from-pastel-blue-50 to-white border-pastel-blue-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">휴가 사용률</p>
                  <p className="text-sm font-bold text-pastel-blue-600">
                    {Math.round(usagePercentage)}%
                  </p>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {vacationInfo.usedDays}/{vacationInfo.totalDays}일 사용
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setIsDetailOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                휴가 내역 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 휴가 내역 상세보기 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pastel-blue-600" />
              내 휴가 사용 내역
            </DialogTitle>
            <DialogDescription>
              올해 사용한 휴가와 신청 중인 휴가 내역을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 휴가 요약 */}
            <div className="p-4 bg-pastel-blue-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">연간 총 휴가</p>
                  <p className="text-lg font-bold text-pastel-blue-600">
                    {vacationInfo.totalDays}일
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">사용한 휴가</p>
                  <p className="text-lg font-bold text-green-600">
                    {vacationInfo.usedDays}일
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">승인 대기</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {vacationInfo.pendingDays}일
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">남은 휴가</p>
                  <p className="text-lg font-bold text-blue-600">
                    {vacationInfo.remainingDays}일
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">전체 사용률</span>
                  <span className="text-sm font-bold text-pastel-blue-600">
                    {Math.round(usagePercentage)}%
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-3" />
              </div>
            </div>

            <Separator />

            {/* 휴가 내역 목록 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-pastel-blue-600" />
                  휴가 신청 내역
                </h4>
                <Badge variant="outline">
                  총 {recentVacations.length}건
                </Badge>
              </div>

              <div className="space-y-3">
                {recentVacations.map((vacation) => (
                  <div 
                    key={vacation.id} 
                    className="p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-pastel-blue-50">
                            {vacation.type}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(vacation.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(vacation.status)}
                              {vacation.status}
                            </div>
                          </Badge>
                          <span className="text-sm font-medium text-pastel-blue-600">
                            {vacation.days}일
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          사유: {vacation.reason}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>휴가기간: {formatDateRange(vacation.startDate, vacation.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>신청일: {vacation.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recentVacations.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">
                    휴가 신청 내역이 없습니다
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    아직 올해 신청한 휴가가 없습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 새 휴가 신청 버튼 */}
            <div className="pt-4 border-t">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                새 휴가 신청하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}