import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Leave } from '../../types';

const mockLeaves: Leave[] = [
  {
    id: '1',
    memberId: '2',
    memberName: '박개발',
    department: '개발팀',
    type: 'annual',
    startDate: '2024-01-22',
    endDate: '2024-01-22',
    duration: 8,
    status: 'approved',
    reason: '개인사유',
  },
  {
    id: '2',
    memberId: '3',
    memberName: '이디자인',
    department: '디자인팀',
    type: 'annual',
    startDate: '2024-01-22',
    endDate: '2024-01-23',
    duration: 16,
    status: 'approved',
    reason: '가족여행',
  },
  {
    id: '3',
    memberId: '4',
    memberName: '최마케팅',
    department: '마케팅팀',
    type: 'sick',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    duration: 8,
    status: 'approved',
    reason: '병원진료',
  },
  {
    id: '4',
    memberId: '5',
    memberName: '김영업',
    department: '영업팀',
    type: 'annual',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    duration: 16,
    status: 'approved',
    reason: '연차휴가',
  },
  {
    id: '5',
    memberId: '6',
    memberName: '홍인사',
    department: '인사팀',
    type: 'personal',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    duration: 4,
    status: 'approved',
    reason: '개인사유',
  },
];

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const current = new Date(startDate);

  while (current <= lastDay || days.length % 7 !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getLeavesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockLeaves.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const target = new Date(dateStr);
      return target >= start && target <= end;
    });
  };

  const handleDateClick = (date: Date) => {
    const leaves = getLeavesForDate(date);
    if (leaves.length > 0) {
      setSelectedDate(date.toISOString().split('T')[0]);
      setDialogOpen(true);
    }
  };

  const selectedLeaves = selectedDate ? mockLeaves.filter(leave => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const target = new Date(selectedDate);
    return target >= start && target <= end;
  }) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">직원 휴가 일정</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-sm sm:text-base">
                {year}년 {month + 1}월
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} className="p-1 sm:p-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === month;
                const leaves = getLeavesForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[50px] sm:min-h-[60px] p-0.5 sm:p-1 border rounded cursor-pointer hover:bg-accent/50 transition-colors
                      ${!isCurrentMonth ? 'text-muted-foreground bg-muted/30' : ''}
                      ${isToday ? 'bg-primary/10 border-primary' : ''}
                    `}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="text-xs font-medium mb-0.5 sm:mb-1">{day.getDate()}</div>
                    <div className="space-y-0.5 sm:space-y-1">
                      {leaves.slice(0, window.innerWidth < 640 ? 1 : 2).map((leave, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-primary/20 text-primary px-0.5 sm:px-1 py-0.5 rounded truncate"
                        >
                          {window.innerWidth < 640 ? leave.memberName.slice(0, 2) : leave.memberName}
                        </div>
                      ))}
                      {leaves.length > (window.innerWidth < 640 ? 1 : 2) && (
                        <div className="text-xs text-muted-foreground">
                          +{leaves.length - (window.innerWidth < 640 ? 1 : 2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && new Date(selectedDate).toLocaleDateString()} 휴가자 목록
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedLeaves.map((leave) => (
              <div key={leave.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{leave.memberName}</h4>
                    <p className="text-sm text-muted-foreground">{leave.department}</p>
                  </div>
                  <Badge variant="secondary">
                    {leave.type === 'annual' ? '연차' : 
                     leave.type === 'sick' ? '병가' : 
                     leave.type === 'personal' ? '개인' : '기타'}
                  </Badge>
                </div>
                <div className="text-sm">
                  <p><span className="text-muted-foreground">기간:</span> {leave.startDate} ~ {leave.endDate}</p>
                  <p><span className="text-muted-foreground">사유:</span> {leave.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}