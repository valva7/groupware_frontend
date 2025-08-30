import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AppHeaderProps {
  pageTitle: string;
  onMobileMenuToggle: () => void;
  onNotificationToggle: () => void;
  unreadCount: number;
  currentUser: any;
  onLogout: () => void;
}

export function AppHeader({
  pageTitle,
  onMobileMenuToggle,
  onNotificationToggle,
  unreadCount,
  currentUser,
  onLogout
}: AppHeaderProps) {
  const handleLogout = () => {
    toast.success("로그아웃되었습니다.");
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* 검색 */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="검색..." className="pl-10 w-64 bg-pastel-blue-50 border-pastel-blue-200" />
          </div>

          {/* 알림 */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={onNotificationToggle}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* 사용자 프로필 정보 */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.profileImage} alt={currentUser?.name || "사용자"} />
              <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                관리
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">관리자</p>
              <p className="text-xs text-muted-foreground">admin@company.com</p>
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </Button>
        </div>
      </div>
    </header>
  );
}