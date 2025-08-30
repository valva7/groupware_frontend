import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Switch } from "../../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  Menu,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Eye,
  EyeOff,
  Settings,
  Users,
  Shield,
  Lock,
  Unlock,
  MoreVertical,
  Copy,
  Home,
  FileText,
  FolderPlus,
  Vote,
  Building2,
  MessageSquare,
  BookOpen,
  HelpCircle,
  User
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  iconComponent?: any;
  order: number;
  isVisible: boolean;
  isActive: boolean;
  parentId?: string;
  submenu?: MenuItem[];
  permissions: {
    roles: string[];
    departments: string[];
    allUsers: boolean;
  };
  description?: string;
  url?: string;
  target?: "_self" | "_blank";
  createdAt: string;
  updatedAt: string;
}

interface MenuRole {
  id: string;
  name: string;
  description: string;
  level: number;
  color: string;
}

export function AdminMenuManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("전체");
  const [selectedParent, setSelectedParent] = useState("전체");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const [menuForm, setMenuForm] = useState({
    label: "",
    icon: "Home",
    description: "",
    url: "",
    target: "_self" as const,
    parentId: "none",
    permissions: {
      roles: [] as string[],
      departments: [] as string[],
      allUsers: true
    }
  });

  // 메뉴 역할 정의
  const menuRoles: MenuRole[] = [
    { id: "admin", name: "관리자", description: "시스템 전체 관리 권한", level: 1, color: "bg-red-100 text-red-700" },
    { id: "manager", name: "팀장", description: "팀 관리 및 승인 권한", level: 2, color: "bg-orange-100 text-orange-700" },
    { id: "employee", name: "직원", description: "일반 사용자 권한", level: 3, color: "bg-blue-100 text-blue-700" },
    { id: "intern", name: "인턴", description: "제한된 사용자 권한", level: 4, color: "bg-gray-100 text-gray-700" }
  ];

  // 아이콘 매핑
  const iconMap: { [key: string]: any } = {
    Home,
    FileText,
    FolderPlus,
    Vote,
    Building2,
    MessageSquare,
    BookOpen,
    HelpCircle,
    User,
    Shield,
    Settings,
    Users
  };

  const iconOptions = [
    { name: "Home", component: Home },
    { name: "FileText", component: FileText },
    { name: "FolderPlus", component: FolderPlus },
    { name: "Vote", component: Vote },
    { name: "Building2", component: Building2 },
    { name: "MessageSquare", component: MessageSquare },
    { name: "BookOpen", component: BookOpen },
    { name: "HelpCircle", component: HelpCircle },
    { name: "User", component: User },
    { name: "Shield", component: Shield },
    { name: "Settings", component: Settings },
    { name: "Users", component: Users }
  ];

  // 메뉴 구조 데이터
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "dashboard",
      label: "대시보드",
      icon: "Home",
      iconComponent: Home,
      order: 1,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee", "intern"],
        departments: [],
        allUsers: true
      },
      description: "메인 대시보드 화면",
      url: "/dashboard",
      target: "_self",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-25"
    },
    {
      id: "approval",
      label: "전자결재",
      icon: "FileText",
      iconComponent: FileText,
      order: 2,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee"],
        departments: [],
        allUsers: false
      },
      description: "전자결재 시스템",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-20",
      submenu: [
        {
          id: "approval-list",
          label: "전자결재 목록",
          icon: "FileText",
          order: 1,
          isVisible: true,
          isActive: true,
          parentId: "approval",
          permissions: {
            roles: ["admin", "manager", "employee"],
            departments: [],
            allUsers: false
          },
          url: "/approval/list",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-20"
        },
        {
          id: "approval-request",
          label: "결재 요청",
          icon: "FileText",
          order: 2,
          isVisible: true,
          isActive: true,
          parentId: "approval",
          permissions: {
            roles: ["admin", "manager", "employee"],
            departments: [],
            allUsers: false
          },
          url: "/approval/request",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-20"
        }
      ]
    },
    {
      id: "project",
      label: "프로젝트 관리",
      icon: "FolderPlus",
      iconComponent: FolderPlus,
      order: 3,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee"],
        departments: ["개발팀", "디자인팀"],
        allUsers: false
      },
      description: "프로젝트 생성 및 관리",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-25",
      submenu: [
        {
          id: "project-create",
          label: "프로젝트 생성",
          icon: "FolderPlus",
          order: 1,
          isVisible: true,
          isActive: true,
          parentId: "project",
          permissions: {
            roles: ["admin", "manager"],
            departments: ["개발팀", "디자인팀"],
            allUsers: false
          },
          url: "/project/create",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-25"
        },
        {
          id: "project-status",
          label: "프로젝트 현황",
          icon: "FolderPlus",
          order: 2,
          isVisible: true,
          isActive: true,
          parentId: "project",
          permissions: {
            roles: ["admin", "manager", "employee"],
            departments: ["개발팀", "디자인팀"],
            allUsers: false
          },
          url: "/project/status",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-25"
        }
      ]
    },
    {
      id: "vote",
      label: "투표 시스템",
      icon: "Vote",
      iconComponent: Vote,
      order: 4,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee"],
        departments: [],
        allUsers: false
      },
      description: "투표 생성 및 참여",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-22",
      submenu: [
        {
          id: "vote-create",
          label: "투표 생성",
          icon: "Vote",
          order: 1,
          isVisible: true,
          isActive: true,
          parentId: "vote",
          permissions: {
            roles: ["admin", "manager"],
            departments: [],
            allUsers: false
          },
          url: "/vote/create",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-22"
        },
        {
          id: "vote-list",
          label: "투표 목록",
          icon: "Vote",
          order: 2,
          isVisible: true,
          isActive: true,
          parentId: "vote",
          permissions: {
            roles: ["admin", "manager", "employee"],
            departments: [],
            allUsers: false
          },
          url: "/vote/list",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-22"
        }
      ]
    },
    {
      id: "organization",
      label: "조직도",
      icon: "Building2",
      iconComponent: Building2,
      order: 5,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee"],
        departments: [],
        allUsers: false
      },
      description: "조직 구조 및 직원 정보",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-18",
      submenu: [
        {
          id: "department-list",
          label: "부서 목록",
          icon: "Building2",
          order: 1,
          isVisible: true,
          isActive: true,
          parentId: "organization",
          permissions: {
            roles: ["admin", "manager", "employee"],
            departments: [],
            allUsers: false
          },
          url: "/organization/departments",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-18"
        },
        {
          id: "employee-status",
          label: "직원 현황",
          icon: "Building2",
          order: 2,
          isVisible: true,
          isActive: true,
          parentId: "organization",
          permissions: {
            roles: ["admin", "manager"],
            departments: [],
            allUsers: false
          },
          url: "/organization/employees",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-18"
        }
      ]
    },
    {
      id: "board",
      label: "게시판",
      icon: "MessageSquare",
      iconComponent: MessageSquare,
      order: 6,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee"],
        departments: [],
        allUsers: false
      },
      description: "공지사항 및 게시물",
      url: "/board",
      target: "_self",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-20"
    },
    {
      id: "wiki",
      label: "사내 위키",
      icon: "BookOpen",
      iconComponent: BookOpen,
      order: 7,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee"],
        departments: [],
        allUsers: false
      },
      description: "사내 지식 관리 시스템",
      url: "/wiki",
      target: "_self",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-15"
    },
    {
      id: "manual",
      label: "메뉴얼",
      icon: "HelpCircle",
      iconComponent: HelpCircle,
      order: 8,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee", "intern"],
        departments: [],
        allUsers: true
      },
      description: "사용자 가이드 및 도움말",
      url: "/manual",
      target: "_self",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-10"
    },
    {
      id: "admin",
      label: "관리자 메뉴",
      icon: "Shield",
      iconComponent: Shield,
      order: 9,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin"],
        departments: [],
        allUsers: false
      },
      description: "시스템 관리 기능",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-25",
      submenu: [
        {
          id: "admin-approval-management",
          label: "전자결재 관리",
          icon: "Shield",
          order: 1,
          isVisible: true,
          isActive: true,
          parentId: "admin",
          permissions: {
            roles: ["admin"],
            departments: [],
            allUsers: false
          },
          url: "/admin/approval",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-25"
        },
        {
          id: "admin-employee-management",
          label: "직원 관리",
          icon: "Shield",
          order: 2,
          isVisible: true,
          isActive: true,
          parentId: "admin",
          permissions: {
            roles: ["admin"],
            departments: [],
            allUsers: false
          },
          url: "/admin/employees",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-25"
        },
        {
          id: "admin-menu-management",
          label: "메뉴 관리",
          icon: "Shield",
          order: 3,
          isVisible: true,
          isActive: true,
          parentId: "admin",
          permissions: {
            roles: ["admin"],
            departments: [],
            allUsers: false
          },
          url: "/admin/menu",
          target: "_self",
          createdAt: "2024-01-01",
          updatedAt: "2024-03-25"
        }
      ]
    },
    {
      id: "my-info",
      label: "내 정보",
      icon: "User",
      iconComponent: User,
      order: 10,
      isVisible: true,
      isActive: true,
      permissions: {
        roles: ["admin", "manager", "employee", "intern"],
        departments: [],
        allUsers: true
      },
      description: "개인 정보 관리",
      url: "/my-info",
      target: "_self",
      createdAt: "2024-01-01",
      updatedAt: "2024-03-20"
    }
  ]);

  // 필터링된 메뉴 목록
  const filteredMenus = menuItems.filter(menu => {
    const matchesSearch = menu.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "전체" || menu.permissions.roles.includes(selectedRole);
    const isTopLevel = !menu.parentId;
    
    return matchesSearch && matchesRole && isTopLevel;
  });

  // 통계 데이터
  const menuStats = {
    total: menuItems.length,
    active: menuItems.filter(m => m.isActive).length,
    visible: menuItems.filter(m => m.isVisible).length,
    withSubmenu: menuItems.filter(m => m.submenu && m.submenu.length > 0).length
  };

  const handleMenuToggle = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const handleVisibilityToggle = (menuId: string) => {
    setMenuItems(menuItems.map(menu => {
      if (menu.id === menuId) {
        return { ...menu, isVisible: !menu.isVisible, updatedAt: new Date().toISOString().split('T')[0] };
      }
      if (menu.submenu) {
        return {
          ...menu,
          submenu: menu.submenu.map(sub => 
            sub.id === menuId 
              ? { ...sub, isVisible: !sub.isVisible, updatedAt: new Date().toISOString().split('T')[0] }
              : sub
          )
        };
      }
      return menu;
    }));
    toast.success("메뉴 표시 상태가 변경되었습니다.");
  };

  const handleActiveToggle = (menuId: string) => {
    setMenuItems(menuItems.map(menu => {
      if (menu.id === menuId) {
        return { ...menu, isActive: !menu.isActive, updatedAt: new Date().toISOString().split('T')[0] };
      }
      if (menu.submenu) {
        return {
          ...menu,
          submenu: menu.submenu.map(sub => 
            sub.id === menuId 
              ? { ...sub, isActive: !sub.isActive, updatedAt: new Date().toISOString().split('T')[0] }
              : sub
          )
        };
      }
      return menu;
    }));
    toast.success("메뉴 활성 상태가 변경되었습니다.");
  };

  const handleCreateMenu = () => {
    if (!menuForm.label) {
      toast.error("메뉴명을 입력해주세요.");
      return;
    }

    const newMenu: MenuItem = {
      id: `menu-${Date.now()}`,
      label: menuForm.label,
      icon: menuForm.icon,
      iconComponent: iconMap[menuForm.icon],
      order: menuItems.length + 1,
      isVisible: true,
      isActive: true,
      parentId: menuForm.parentId === "none" ? undefined : menuForm.parentId,
      permissions: menuForm.permissions,
      description: menuForm.description,
      url: menuForm.url,
      target: menuForm.target,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (menuForm.parentId !== "none") {
      // 서브메뉴 추가
      setMenuItems(menuItems.map(menu => {
        if (menu.id === menuForm.parentId) {
          return {
            ...menu,
            submenu: [...(menu.submenu || []), newMenu]
          };
        }
        return menu;
      }));
    } else {
      // 최상위 메뉴 추가
      setMenuItems([...menuItems, newMenu]);
    }

    setIsCreateMenuOpen(false);
    resetMenuForm();
    toast.success("메뉴가 생성되었습니다.");
  };

  const handleEditMenu = () => {
    if (!selectedMenu) return;

    const updatedMenu = {
      ...selectedMenu,
      label: menuForm.label,
      icon: menuForm.icon,
      iconComponent: iconMap[menuForm.icon],
      description: menuForm.description,
      url: menuForm.url,
      target: menuForm.target,
      permissions: menuForm.permissions,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setMenuItems(menuItems.map(menu => {
      if (menu.id === selectedMenu.id) {
        return updatedMenu;
      }
      if (menu.submenu) {
        return {
          ...menu,
          submenu: menu.submenu.map(sub => 
            sub.id === selectedMenu.id ? updatedMenu : sub
          )
        };
      }
      return menu;
    }));

    setIsEditMenuOpen(false);
    setSelectedMenu(null);
    resetMenuForm();
    toast.success("메뉴가 수정되었습니다.");
  };

  const handleDeleteMenu = (menuId: string) => {
    setMenuItems(menuItems.filter(menu => {
      if (menu.id === menuId) return false;
      if (menu.submenu) {
        menu.submenu = menu.submenu.filter(sub => sub.id !== menuId);
      }
      return true;
    }));
    toast.success("메뉴가 삭제되었습니다.");
  };

  const openEditDialog = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setMenuForm({
      label: menu.label,
      icon: menu.icon,
      description: menu.description || "",
      url: menu.url || "",
      target: menu.target || "_self",
      parentId: menu.parentId || "none",
      permissions: menu.permissions
    });
    setIsEditMenuOpen(true);
  };

  const resetMenuForm = () => {
    setMenuForm({
      label: "",
      icon: "Home",
      description: "",
      url: "",
      target: "_self",
      parentId: "none",
      permissions: {
        roles: [],
        departments: [],
        allUsers: true
      }
    });
  };

  const getRoleColor = (role: string) => {
    const roleInfo = menuRoles.find(r => r.id === role);
    return roleInfo ? roleInfo.color : "bg-gray-100 text-gray-700";
  };

  const renderMenu = (menu: MenuItem, level: number = 0) => (
    <div key={menu.id} className="space-y-2">
      <div 
        className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-sm transition-shadow ${
          level > 0 ? "ml-4 sm:ml-8 bg-gray-50" : ""
        }`}
      >
        {/* 모바일: 헤더 정보 */}
        <div className="flex items-center gap-3 sm:hidden">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            {menu.iconComponent && <menu.iconComponent className="h-4 w-4 text-pastel-blue-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{menu.label}</h4>
              {menu.submenu && menu.submenu.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMenuToggle(menu.id)}
                  className="h-6 w-6 p-0"
                >
                  {expandedMenus.includes(menu.id) ? 
                    <ChevronDown className="h-3 w-3" /> : 
                    <ChevronRight className="h-3 w-3" />
                  }
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="outline" className={`text-xs ${menu.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {menu.isActive ? "활성" : "비활성"}
              </Badge>
              <Badge variant="outline" className={`text-xs ${menu.isVisible ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                {menu.isVisible ? "표시" : "숨김"}
              </Badge>
              {menu.submenu && menu.submenu.length > 0 && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">
                  서브 {menu.submenu.length}개
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 데스크톱: 기존 레이아웃 */}
        <div className="hidden sm:flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          {menu.iconComponent && <menu.iconComponent className="h-4 w-4 text-pastel-blue-600" />}
        </div>
        
        <div className="flex-1 hidden sm:block">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{menu.label}</h4>
            <Badge variant="outline" className={menu.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
              {menu.isActive ? "활성" : "비활성"}
            </Badge>
            <Badge variant="outline" className={menu.isVisible ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
              {menu.isVisible ? "표시" : "숨김"}
            </Badge>
            {menu.submenu && menu.submenu.length > 0 && (
              <Badge variant="outline" className="bg-purple-100 text-purple-700">
                서브메뉴 {menu.submenu.length}개
              </Badge>
            )}
          </div>
          
          {menu.description && (
            <p className="text-sm text-muted-foreground mb-2">{menu.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>순서: {menu.order}</span>
            {menu.url && <span>• URL: {menu.url}</span>}
            <span>• 수정: {menu.updatedAt}</span>
          </div>
          
          <div className="flex items-center gap-1 mt-2">
            {menu.permissions.allUsers ? (
              <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                모든 사용자
              </Badge>
            ) : (
              <>
                {menu.permissions.roles.map(role => (
                  <Badge key={role} variant="outline" className={`${getRoleColor(role)} text-xs`}>
                    {menuRoles.find(r => r.id === role)?.name || role}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 모바일: 설명 및 추가 정보 */}
        <div className="sm:hidden">
          {menu.description && (
            <p className="text-sm text-muted-foreground mb-2">{menu.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>순서: {menu.order}</span>
            {menu.url && <span>• URL: {menu.url}</span>}
          </div>
          
          <div className="flex items-center gap-1 flex-wrap mb-3">
            {menu.permissions.allUsers ? (
              <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                모든 사용자
              </Badge>
            ) : (
              <>
                {menu.permissions.roles.map(role => (
                  <Badge key={role} variant="outline" className={`${getRoleColor(role)} text-xs`}>
                    {menuRoles.find(r => r.id === role)?.name || role}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVisibilityToggle(menu.id)}
            className="h-8 w-8 p-0"
          >
            {menu.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleActiveToggle(menu.id)}
            className="h-8 w-8 p-0"
          >
            {menu.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(menu)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteMenu(menu.id)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {menu.submenu && menu.submenu.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMenuToggle(menu.id)}
              className="h-8 w-8 p-0 hidden sm:flex"
            >
              {expandedMenus.includes(menu.id) ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          )}
        </div>
      </div>

      {/* 서브메뉴 렌더링 */}
      {menu.submenu && expandedMenus.includes(menu.id) && (
        <div className="space-y-2">
          {menu.submenu.map(submenu => renderMenu(submenu, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 헤더 - 모바일 반응형 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">메뉴 관리</h1>
          <p className="text-muted-foreground text-sm sm:text-base">시스템 메뉴를 생성, 수정, 삭제하고 권한을 관리할 수 있습니다.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsRoleManagementOpen(true)}
            className="w-full sm:w-auto h-10 sm:h-9"
          >
            <Users className="h-4 w-4 mr-2" />
            역할 관리
          </Button>
          <Button 
            onClick={() => {
              resetMenuForm();
              setIsCreateMenuOpen(true);
            }}
            className="bg-pastel-blue-500 hover:bg-pastel-blue-600 w-full sm:w-auto h-10 sm:h-9"
          >
            <Plus className="h-4 w-4 mr-2" />
            메뉴 생성
          </Button>
        </div>
      </div>

      {/* 통계 카드 - 모바일 반응형 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pastel-blue-100 rounded-lg">
                <Menu className="h-4 w-4 lg:h-5 lg:w-5 text-pastel-blue-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-muted-foreground">전체 메뉴</p>
                <p className="text-lg lg:text-2xl font-bold">{menuStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-muted-foreground">활성 메뉴</p>
                <p className="text-lg lg:text-2xl font-bold">{menuStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-muted-foreground">표시 메뉴</p>
                <p className="text-lg lg:text-2xl font-bold">{menuStats.visible}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-muted-foreground">서브메뉴</p>
                <p className="text-lg lg:text-2xl font-bold">{menuStats.withSubmenu}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 - 모바일 반응형 */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="메뉴명 또는 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 역할</SelectItem>
                  {menuRoles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메뉴 목록 */}
      <div className="space-y-4">
        {filteredMenus.map(menu => renderMenu(menu))}

        {filteredMenus.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Menu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">
                메뉴가 없습니다
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                검색 조건에 맞는 메뉴가 없습니다.
              </p>
              <Button onClick={() => setIsCreateMenuOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 메뉴 생성하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 메뉴 생성 다이얼로그 */}
      <Dialog open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="create-menu-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-pastel-blue-600" />
              새 메뉴 생성
            </DialogTitle>
            <DialogDescription id="create-menu-description">
              새로운 메뉴를 생성하고 권한을 설정해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menu-label">메뉴명 *</Label>
                <Input
                  id="menu-label"
                  value={menuForm.label}
                  onChange={(e) => setMenuForm({...menuForm, label: e.target.value})}
                  placeholder="메뉴 이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-icon">아이콘</Label>
                <Select 
                  value={menuForm.icon} 
                  onValueChange={(value) => setMenuForm({...menuForm, icon: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(iconOption => (
                      <SelectItem key={iconOption.name} value={iconOption.name}>
                        <div className="flex items-center gap-2">
                          <iconOption.component className="h-4 w-4" />
                          {iconOption.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="menu-description">설명</Label>
              <Textarea
                id="menu-description"
                value={menuForm.description}
                onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                placeholder="메뉴에 대한 간단한 설명을 입력하세요"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menu-url">URL</Label>
                <Input
                  id="menu-url"
                  value={menuForm.url}
                  onChange={(e) => setMenuForm({...menuForm, url: e.target.value})}
                  placeholder="/path/to/page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-target">링크 타겟</Label>
                <Select 
                  value={menuForm.target} 
                  onValueChange={(value: any) => setMenuForm({...menuForm, target: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">같은 창</SelectItem>
                    <SelectItem value="_blank">새 창</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-parent">상위 메뉴</Label>
                <Select 
                  value={menuForm.parentId} 
                  onValueChange={(value) => setMenuForm({...menuForm, parentId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택 안함" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">없음 (최상위)</SelectItem>
                    {menuItems.filter(m => !m.parentId).map(menu => (
                      <SelectItem key={menu.id} value={menu.id}>{menu.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>접근 권한</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={menuForm.permissions.allUsers}
                    onCheckedChange={(checked) => 
                      setMenuForm({
                        ...menuForm, 
                        permissions: {
                          ...menuForm.permissions,
                          allUsers: checked,
                          roles: checked ? [] : menuForm.permissions.roles
                        }
                      })
                    }
                  />
                  <Label>모든 사용자에게 공개</Label>
                </div>
                
                {!menuForm.permissions.allUsers && (
                  <div className="space-y-2">
                    <Label>접근 가능한 역할</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {menuRoles.map(role => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`role-${role.id}`}
                            checked={menuForm.permissions.roles.includes(role.id)}
                            onChange={(e) => {
                              const roles = e.target.checked
                                ? [...menuForm.permissions.roles, role.id]
                                : menuForm.permissions.roles.filter(r => r !== role.id);
                              setMenuForm({
                                ...menuForm,
                                permissions: { ...menuForm.permissions, roles }
                              });
                            }}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`role-${role.id}`} className="text-sm">
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsCreateMenuOpen(false)}
            >
              취소
            </Button>
            <Button 
              className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
              onClick={handleCreateMenu}
            >
              생성
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 메뉴 수정 다이얼로그 */}
      <Dialog open={isEditMenuOpen} onOpenChange={setIsEditMenuOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="edit-menu-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-pastel-blue-600" />
              메뉴 수정
            </DialogTitle>
            <DialogDescription id="edit-menu-description">
              메뉴 정보를 수정해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-menu-label">메뉴명 *</Label>
                <Input
                  id="edit-menu-label"
                  value={menuForm.label}
                  onChange={(e) => setMenuForm({...menuForm, label: e.target.value})}
                  placeholder="메뉴 이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-menu-icon">아이콘</Label>
                <Select 
                  value={menuForm.icon} 
                  onValueChange={(value) => setMenuForm({...menuForm, icon: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(iconOption => (
                      <SelectItem key={iconOption.name} value={iconOption.name}>
                        <div className="flex items-center gap-2">
                          <iconOption.component className="h-4 w-4" />
                          {iconOption.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-menu-description">설명</Label>
              <Textarea
                id="edit-menu-description"
                value={menuForm.description}
                onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                placeholder="메뉴에 대한 간단한 설명을 입력하세요"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-menu-url">URL</Label>
                <Input
                  id="edit-menu-url"
                  value={menuForm.url}
                  onChange={(e) => setMenuForm({...menuForm, url: e.target.value})}
                  placeholder="/path/to/page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-menu-target">링크 타겟</Label>
                <Select 
                  value={menuForm.target} 
                  onValueChange={(value: any) => setMenuForm({...menuForm, target: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">같은 창</SelectItem>
                    <SelectItem value="_blank">새 창</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>접근 권한</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={menuForm.permissions.allUsers}
                    onCheckedChange={(checked) => 
                      setMenuForm({
                        ...menuForm, 
                        permissions: {
                          ...menuForm.permissions,
                          allUsers: checked,
                          roles: checked ? [] : menuForm.permissions.roles
                        }
                      })
                    }
                  />
                  <Label>모든 사용자에게 공개</Label>
                </div>
                
                {!menuForm.permissions.allUsers && (
                  <div className="space-y-2">
                    <Label>접근 가능한 역할</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {menuRoles.map(role => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`edit-role-${role.id}`}
                            checked={menuForm.permissions.roles.includes(role.id)}
                            onChange={(e) => {
                              const roles = e.target.checked
                                ? [...menuForm.permissions.roles, role.id]
                                : menuForm.permissions.roles.filter(r => r !== role.id);
                              setMenuForm({
                                ...menuForm,
                                permissions: { ...menuForm.permissions, roles }
                              });
                            }}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`edit-role-${role.id}`} className="text-sm">
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsEditMenuOpen(false)}
            >
              취소
            </Button>
            <Button 
              className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
              onClick={handleEditMenu}
            >
              수정
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 역할 관리 다이얼로그 */}
      <Dialog open={isRoleManagementOpen} onOpenChange={setIsRoleManagementOpen}>
        <DialogContent className="max-w-3xl" aria-describedby="role-management-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pastel-blue-600" />
              역할 관리
            </DialogTitle>
            <DialogDescription id="role-management-description">
              시스템에서 사용되는 사용자 역할을 관리할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {menuRoles.map(role => (
              <div key={role.id} className="p-4 bg-white border border-pastel-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={role.color}>
                      {role.name}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">레벨 {role.level}</span>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast.success("새 역할 생성 기능은 추후 구현 예정입니다.")}
            >
              <Plus className="h-4 w-4 mr-2" />
              새 역할 추가
            </Button>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => setIsRoleManagementOpen(false)}
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}