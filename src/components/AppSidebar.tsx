import {
  Calendar,
  ChevronDown,
  FileText,
  Folder,
  Home,
  MessageSquare,
  Settings,
  Users,
  Vote,
  Building,
  ClipboardList,
  BookOpen,
  User,
  Package,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { useLocation, useNavigate } from 'react-router-dom';

// 메뉴 구조 정의
const menuItems = [
  {
    title: '대시보드',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: '전자결재',
    icon: FileText,
    items: [
      { title: '기안함', url: '/approval/draft' },
      { title: '결재 목록', url: '/approval/list' },
    ],
  },
  {
    title: '프로젝트 관리',
    icon: Folder,
    items: [
      { title: '프로젝트', url: '/projects' },
      { title: '인력 배정', url: '/projects/resources' },
    ],
  },
  {
    title: '투표',
    url: '/votes',
    icon: Vote,
  },
  {
    title: '조직 관리',
    icon: Building,
    items: [
      { title: '부서 목록', url: '/organization/departments' },
      { title: '직원 현황', url: '/organization/members' },
    ],
  },
  {
    title: '커뮤니케이션',
    icon: MessageSquare,
    items: [
      { title: '게시판', url: '/board' },
      { title: '사내 위키', url: '/wiki' },
      { title: '메뉴얼', url: '/manual' },
    ],
  },
  {
    title: '관리자 메뉴',
    icon: Settings,
    items: [
      { title: '전자결재 관리', url: '/admin/approval' },
      { title: '게시물 관리', url: '/admin/posts' },
      { title: '직원 생성/관리', url: '/admin/members' },
      { title: '조직 관리', url: '/admin/organization' },
      { title: '비품/자산 관리', url: '/admin/assets' },
      { title: '결재선 관리', url: '/admin/approval-lines' },
      { title: '공통 코드 관리', url: '/admin/common-codes' },
    ],
  },
  {
    title: '내 정보',
    url: '/profile',
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  const isParentActive = (items: { url: string }[]) => {
    return items.some(item => isActive(item.url));
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold px-2 mb-2">
            Coev1 그룹웨어
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      defaultOpen={isParentActive(item.items)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className={isParentActive(item.items) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isActive(subItem.url)}
                              >
                                <button
                                  onClick={() => navigate(subItem.url)}
                                  className="w-full text-left"
                                >
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive(item.url!)}
                    >
                      <button
                        onClick={() => navigate(item.url!)}
                        className="w-full text-left"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}