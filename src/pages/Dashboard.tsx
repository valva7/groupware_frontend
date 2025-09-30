import { LeaveWidget } from '../components/dashboard/LeaveWidget';
import { ApprovalWidget } from '../components/dashboard/ApprovalWidget';
import { CalendarWidget } from '../components/dashboard/CalendarWidget';
import { PostWidget } from '../components/dashboard/PostWidget';
import { VoteWidget } from '../components/dashboard/VoteWidget';
import { ProjectWidget } from '../components/dashboard/ProjectWidget';
import { useAuthStore } from '../store/auth';

export function Dashboard() {
  const member = useAuthStore((state) => state.member);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground text-sm sm:text-base truncate">
            안녕하세요, {member?.name}님! 오늘도 좋은 하루 되세요.
          </p>
        </div>
        <div className="text-left sm:text-right text-xs sm:text-sm text-muted-foreground shrink-0">
          <div>{new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}</div>
        </div>
      </div>

      {/* 첫 번째 행: 개인 정보 위젯들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <LeaveWidget />
        <ApprovalWidget />
        <PostWidget />
      </div>

      {/* 두 번째 행: 캘린더와 투표 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="lg:col-span-2">
          <CalendarWidget />
        </div>
        <VoteWidget />
      </div>

      {/* 세 번째 행: 프로젝트 현황 */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6">
        <ProjectWidget />
      </div>
    </div>
  );
}