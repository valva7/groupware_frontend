import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { useNotificationStore } from '../store/notifications';
import { cn } from './ui/utils';

const typeColors = {
  approval: 'bg-blue-100 text-blue-800',
  project: 'bg-green-100 text-green-800',
  vote: 'bg-purple-100 text-purple-800',
  board: 'bg-orange-100 text-orange-800',
  system: 'bg-gray-100 text-gray-800',
};

const typeLabels = {
  approval: '결재',
  project: '프로젝트',
  vote: '투표',
  board: '게시판',
  system: '시스템',
};

export function NotificationCenter() {
  const { notifications, unreadCount, isOpen, setOpen, markAsRead, markAllAsRead } = useNotificationStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className="w-96 sm:max-w-96">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>알림</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              모두 읽음
            </Button>
          </SheetHeader>
          
          <ScrollArea className="h-full mt-4">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  알림이 없습니다.
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50',
                      !notification.isRead && 'bg-primary/5 border-primary/20'
                    )}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className={cn('text-xs', typeColors[notification.type])}
                      >
                        {typeLabels[notification.type]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}