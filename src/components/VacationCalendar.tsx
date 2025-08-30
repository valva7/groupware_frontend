import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock, MapPin } from "lucide-react";

interface VacationEvent {
  id: number;
  employeeId?: number;
  name: string;
  type: string;
  date: string;
  duration: string;
  department?: string;
  reason?: string;
}

interface VacationCalendarProps {
  events: VacationEvent[];
  employees?: any[];
}

export function VacationCalendar({ events, employees = [] }: VacationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateDetailOpen, setIsDateDetailOpen] = useState(false);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 월의 첫 번째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 달력에 표시할 첫 번째 날 (이전 달의 마지막 주 포함)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  // 달력에 표시할 마지막 날 (다음 달의 첫 주 포함)
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  // 달력에 표시할 모든 날짜 생성
  const calendarDays = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 특정 날짜의 이벤트 찾기
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  // 이전/다음 달로 이동
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayEvents = getEventsForDate(date);
    
    if (dayEvents.length > 0) {
      setSelectedDate(dateString);
      setIsDateDetailOpen(true);
    }
  };

  // 휴가 타입별 색상
  const getVacationTypeColor = (type: string) => {
    switch (type) {
      case "연차": return "bg-blue-500";
      case "반차": return "bg-green-500";
      case "병가": return "bg-red-500";
      case "특별휴가": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // 휴가 기간 포맷팅
  const formatVacationPeriod = (event: VacationEvent) => {
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });

    if (event.duration.includes('일')) {
      const days = parseInt(event.duration);
      if (days > 1) {
        const endDate = new Date(eventDate);
        endDate.setDate(endDate.getDate() + days - 1);
        const endDateStr = endDate.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric'
        });
        return `${dateStr} ~ ${endDateStr} (${event.duration})`;
      } else {
        return `${dateStr} (${event.duration})`;
      }
    } else {
      // 반차의 경우
      return `${dateStr} (${event.duration})`;
    }
  };

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const selectedDateEvents = selectedDate ? events.filter(event => event.date === selectedDate) : [];

  return (
    <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-pastel-blue-600" />
          <h3 className="text-lg font-medium">직원 휴가 일정</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-sm font-medium min-w-[80px] text-center">
            {year}년 {monthNames[month]}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 데스크톱 캘린더 */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(date);
            
            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border border-gray-100 rounded-lg relative cursor-pointer transition-all hover:bg-gray-50
                  ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                  ${isToday ? "ring-2 ring-pastel-blue-500" : ""}
                  ${dayEvents.length > 0 ? "hover:shadow-md" : ""}
                `}
                onClick={() => handleDateClick(date)}
              >
                <div className={`
                  text-sm font-medium mb-2
                  ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}
                  ${isToday ? "text-pastel-blue-600 font-semibold" : ""}
                `}>
                  {date.getDate()}
                </div>
                
                {/* 휴가자 정보 표시 - 이름 포함 */}
                {dayEvents.length > 0 && (
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="flex items-center gap-1 p-1 bg-white rounded border"
                        title={`${event.name} - ${event.type} (${event.duration})`}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getVacationTypeColor(event.type)}`} />
                        <span className="text-xs text-gray-700 truncate font-medium">
                          {event.name}
                        </span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center bg-gray-100 rounded px-1 py-0.5">
                        +{dayEvents.length - 2}명
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 모바일용 캘린더 */}
      <div className="sm:hidden">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(date);
            
            return (
              <div
                key={index}
                className={`
                  aspect-square flex flex-col items-center justify-center text-xs rounded-lg relative cursor-pointer
                  ${isCurrentMonth ? "bg-white border border-gray-200" : "bg-gray-50"}
                  ${isToday ? "ring-2 ring-pastel-blue-500 font-semibold text-pastel-blue-600" : ""}
                `}
                onClick={() => handleDateClick(date)}
              >
                <span className={isCurrentMonth ? "text-foreground" : "text-muted-foreground"}>
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`w-1.5 h-1.5 rounded-full ${getVacationTypeColor(event.type)}`}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 모바일용 이벤트 리스트 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">이번 달 휴가 일정</h4>
          {events
            .filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getMonth() === month && eventDate.getFullYear() === year;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getVacationTypeColor(event.type)}`} />
                  <div className="text-sm">
                    <div className="font-medium">{event.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {event.department} · {event.type}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <div>{new Date(event.date).getDate()}일</div>
                  <div>{event.duration}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-4 pt-4 border-t border-pastel-blue-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>연차</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>반차</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>병가</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span>특별휴가</span>
          </div>
        </div>
      </div>

      {/* 날짜별 휴가자 상세 팝업 - DialogDescription 추가 */}
      <Dialog open={isDateDetailOpen} onOpenChange={setIsDateDetailOpen}>
        <DialogContent className="max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-pastel-blue-600" />
              {selectedDate && new Date(selectedDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 휴가자 현황
            </DialogTitle>
            <DialogDescription>
              선택된 날짜의 휴가자 정보와 휴가 기간, 사유 등을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const employee = employees.find(emp => emp.name === event.name);
                  return (
                    <div key={event.id} className="p-4 bg-pastel-blue-50 rounded-lg border border-pastel-blue-200">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={employee?.profileImage} alt={event.name} />
                          <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                            {event.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-base">{event.name}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                event.type === "연차" ? "bg-blue-100 text-blue-700 border-blue-300" :
                                event.type === "반차" ? "bg-green-100 text-green-700 border-green-300" :
                                event.type === "병가" ? "bg-red-100 text-red-700 border-red-300" :
                                "bg-purple-100 text-purple-700 border-purple-300"
                              }`}
                            >
                              {event.type}
                            </Badge>
                          </div>
                          
                          {/* 휴가 기간 정보 */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-pastel-blue-600" />
                              <span className="font-medium text-pastel-blue-700">휴가 기간:</span>
                              <span>{formatVacationPeriod(event)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">부서:</span>
                              <span>{event.department || employee?.department || "부서 미상"}</span>
                            </div>
                            
                            {event.reason && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">사유:</span>
                                <span>{event.reason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-base">이 날짜에는 휴가자가 없습니다.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => setIsDateDetailOpen(false)}
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}