import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  submenu?: Array<{
    id: string;
    label: string;
  }>;
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
  currentPage: string;
  openSubmenu: string | null;
  isSidebarCollapsed: boolean;
  onSubmenuToggle: (menuId: string) => void;
  onMenuItemClick: (itemId: string) => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  isMobile?: boolean;
}

export function DashboardSidebar({ 
  menuItems,
  currentPage,
  openSubmenu,
  isSidebarCollapsed,
  onSubmenuToggle,
  onMenuItemClick,
  onToggleCollapse,
  onCloseMobile,
  isMobile = false
}: DashboardSidebarProps) {

  const handleMenuItemClick = (itemId: string) => {
    onMenuItemClick(itemId);
    if (isMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 헤더 */}
      <div className={`flex items-center gap-3 p-4 flex-shrink-0 ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        {(!isSidebarCollapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pastel-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">C</span>
            </div>
            <span className="font-semibold text-lg">Cove One</span>
          </div>
        )}
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseMobile}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-8 w-8 p-0"
            title={isSidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isSidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* 메뉴 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="space-y-1 px-3 pb-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.id;
              const isActive = currentPage === item.id || 
                (hasSubmenu && item.submenu?.some(sub => sub.id === currentPage));

              return (
                <div key={item.id}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-10 ${
                      isActive ? "bg-pastel-blue-100 text-pastel-blue-700" : ""
                    } ${isSidebarCollapsed && !isMobile ? "px-2" : "px-3"}`}
                    onClick={() => {
                      if (hasSubmenu) {
                        onSubmenuToggle(item.id);
                      } else {
                        handleMenuItemClick(item.id);
                      }
                    }}
                    title={isSidebarCollapsed && !isMobile ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {(!isSidebarCollapsed || isMobile) && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {hasSubmenu && (
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform ${
                              isSubmenuOpen ? "rotate-90" : ""
                            }`} 
                          />
                        )}
                      </>
                    )}
                  </Button>

                  {/* 서브메뉴 */}
                  {hasSubmenu && isSubmenuOpen && (!isSidebarCollapsed || isMobile) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu?.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={currentPage === subItem.id ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-3 h-9 text-sm ${
                            currentPage === subItem.id ? "bg-pastel-blue-100 text-pastel-blue-700" : ""
                          }`}
                          onClick={() => handleMenuItemClick(subItem.id)}
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-current rounded-full" />
                          </div>
                          <span className="flex-1 text-left">{subItem.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* 하단 정보 */}
      {(!isSidebarCollapsed || isMobile) && (
        <div className="p-4 border-t border-pastel-blue-200 flex-shrink-0">
          <div className="text-xs text-muted-foreground">
            <p>Cove One v1.0</p>
            <p>© 2024 Company</p>
          </div>
        </div>
      )}
    </div>
  );
}