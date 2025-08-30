import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { ScrollArea } from "./components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./components/ui/sheet";
import { 
  Home, 
  FileText, 
  FolderPlus, 
  BarChart3, 
  Users, 
  Vote, 
  Building2, 
  User, 
  MessageSquare, 
  BookOpen, 
  HelpCircle, 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Settings,
  Shield
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// 컴포넌트 import
import { DashboardSidebar } from "./components/DashboardSidebar";
import { AppHeader } from "./components/AppHeader";
import { AppRouter } from "./components/AppRouter";
import { VacationCalendar } from "./components/VacationCalendar";
import { LoginPage } from "./components/LoginPage";

// 훅 import
import { useAppState } from "./hooks/useAppState";

// 상수 import
import { PAGE_TITLES } from "./data/constants";

// 데이터 import
import { initialVacationEvents } from "./data/initialData";

// 확장된 알림 데이터
const notifications = [
  {
    id: 1,
    title: "새로운 투표가 생성되었습니다",
    message: "회의실 이용 규칙 개정에 대한 투표가 시작되었습니다.",
    type: "vote",
    timestamp: "5분 전",
    isRead: false,
    icon: <Vote className="h-4 w-4 text-blue-600" />,
    priority: "보통"
  },
  {
    id: 2,
    title: "전자결재 승인 완료",
    message: "출장비 정산 신청이 승인되었습니다.",
    type: "approval",
    timestamp: "1시간 전",
    isRead: false,
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    priority: "높음"
  },
  {
    id: 3,
    title: "휴가 신청 알림",
    message: "김철수님의 연차 휴가 신청이 대기 중입니다.",
    type: "vacation",
    timestamp: "2시간 전",
    isRead: true,
    icon: <Calendar className="h-4 w-4 text-purple-600" />,
    priority: "보통"
  },
  {
    id: 4,
    title: "새 게시물 등록",
    message: "4월 정기 회의 안건 공지가 등록되었습니다.",
    type: "post",
    timestamp: "3시간 전",
    isRead: true,
    icon: <FileText className="h-4 w-4 text-orange-600" />,
    priority: "낮음"
  },
  {
    id: 5,
    title: "시스템 점검 안내",
    message: "내일 새벽 2시부터 시스템 점검이 예정되어 있습니다.",
    type: "system",
    timestamp: "5시간 전",
    isRead: false,
    icon: <AlertCircle className="h-4 w-4 text-red-600" />,
    priority: "높음"
  },
  {
    id: 6,
    title: "프로젝트 마일스톤 달성",
    message: "모바일 앱 리뉴얼 프로젝트가 75% 완료되었습니다.",
    type: "project",
    timestamp: "6시간 전",
    isRead: true,
    icon: <BarChart3 className="h-4 w-4 text-blue-600" />,
    priority: "보통"
  },
  {
    id: 7,
    title: "신입사원 입사 안내",
    message: "내일 신입사원 3명이 입사 예정입니다.",
    type: "hr",
    timestamp: "1일 전",
    isRead: true,
    icon: <Users className="h-4 w-4 text-green-600" />,
    priority: "보통"
  },
  {
    id: 8,
    title: "교육 신청 마감 임박",
    message: "리더십 교육 과정 신청이 내일 마감됩니다.",
    type: "education",
    timestamp: "1일 전",
    isRead: false,
    icon: <BookOpen className="h-4 w-4 text-indigo-600" />,
    priority: "보통"
  }
];

// PWA 아이콘 생성 함수
const generatePWAIcon = (size: number) => {
  const fontSize = Math.floor(size / 6.4); // 크기에 비례한 폰트 사이즈
  const yOffset1 = size * 0.375; // 첫 번째 텍스트 Y 위치
  const yOffset2 = size * 0.625; // 두 번째 텍스트 Y 위치
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="#4f96ff"/>
      <text x="${size/2}" y="${yOffset1}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">CO</text>
      <text x="${size/2}" y="${yOffset2}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">GW</text>
    </svg>
  `;
};

// PWA 매니페스트 생성 함수
const generateManifest = (icon192Url: string, icon512Url: string) => {
  return {
    name: "CO-GW 그룹웨어 시스템",
    short_name: "CO-GW",
    description: "기업용 통합 그룹웨어 시스템",
    start_url: "/",
    display: "standalone",
    background_color: "#4f96ff",
    theme_color: "#4f96ff",
    orientation: "portrait-primary",
    categories: ["business", "productivity"],
    lang: "ko",
    icons: [
      {
        src: icon192Url,
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: icon512Url,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ],
    shortcuts: [
      {
        name: "대시보드",
        short_name: "대시보드",
        description: "메인 대시보드로 이동",
        url: "/?page=dashboard",
        icons: [{ src: icon192Url, sizes: "192x192" }]
      },
      {
        name: "전자결재",
        short_name: "결재",
        description: "전자결재 시스템",
        url: "/?page=approval-list",
        icons: [{ src: icon192Url, sizes: "192x192" }]
      },
      {
        name: "조직도",
        short_name: "조직도",
        description: "회사 조직도 보기",
        url: "/?page=department-list",
        icons: [{ src: icon192Url, sizes: "192x192" }]
      }
    ]
  };
};

// 파비콘 및 PWA 설정 함수
const setFaviconAndPWA = () => {
  // 기존 파비콘 제거
  const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
  existingFavicons.forEach(favicon => favicon.remove());

  // 기존 매니페스트 제거
  const existingManifest = document.querySelector('link[rel="manifest"]');
  if (existingManifest) {
    existingManifest.remove();
  }

  // 파비콘 SVG 생성 (32x32)
  const faviconSvg = generatePWAIcon(32);
  const faviconDataUrl = `data:image/svg+xml;base64,${btoa(faviconSvg)}`;

  // PWA 아이콘들 생성
  const icon192Svg = generatePWAIcon(192);
  const icon512Svg = generatePWAIcon(512);
  const icon192Url = `data:image/svg+xml;base64,${btoa(icon192Svg)}`;
  const icon512Url = `data:image/svg+xml;base64,${btoa(icon512Svg)}`;

  // 파비콘 설정
  const faviconLink = document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.type = 'image/svg+xml';
  faviconLink.href = faviconDataUrl;
  document.head.appendChild(faviconLink);

  // Apple touch icon 설정
  const appleTouchIconLink = document.createElement('link');
  appleTouchIconLink.rel = 'apple-touch-icon';
  appleTouchIconLink.href = icon192Url;
  document.head.appendChild(appleTouchIconLink);

  // Apple mobile web app 메타 태그들 설정
  const appleCapableTag = document.createElement('meta');
  appleCapableTag.name = 'apple-mobile-web-app-capable';
  appleCapableTag.content = 'yes';
  document.head.appendChild(appleCapableTag);

  const appleStatusBarTag = document.createElement('meta');
  appleStatusBarTag.name = 'apple-mobile-web-app-status-bar-style';
  appleStatusBarTag.content = 'default';
  document.head.appendChild(appleStatusBarTag);

  const appleTitleTag = document.createElement('meta');
  appleTitleTag.name = 'apple-mobile-web-app-title';
  appleTitleTag.content = 'CO-GW';
  document.head.appendChild(appleTitleTag);

  // PWA 매니페스트 생성 및 설정
  const manifest = generateManifest(icon192Url, icon512Url);
  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: 'application/json'
  });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = manifestUrl;
  document.head.appendChild(manifestLink);

  // 테마 컬러 메타 태그 설정
  const themeColorTag = document.createElement('meta');
  themeColorTag.name = 'theme-color';
  themeColorTag.content = '#4f96ff';
  document.head.appendChild(themeColorTag);

  // viewport 메타 태그 설정 (PWA 최적화)
  let viewportTag = document.querySelector('meta[name="viewport"]');
  if (!viewportTag) {
    viewportTag = document.createElement('meta');
    viewportTag.setAttribute('name', 'viewport');
    document.head.appendChild(viewportTag);
  }
  viewportTag.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

  // 브라우저 탭 제목 설정
  document.title = 'CO-GW | 그룹웨어 시스템';

  console.log('PWA 매니페스트와 아이콘이 설정되었습니다.');
};

// Service Worker 등록 함수
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // 간단한 Service Worker를 동적으로 생성
    const swCode = `
      const CACHE_NAME = 'cogw-cache-v1';
      const urlsToCache = [
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ];

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
        );
      });

      self.addEventListener('fetch', event => {
        event.respondWith(
          caches.match(event.request)
            .then(response => {
              // 캐시에서 찾으면 반환, 없으면 네트워크에서 가져오기
              return response || fetch(event.request);
            }
          )
        );
      });
    `;

    const swBlob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(swBlob);

    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker 등록 성공:', registration);
      })
      .catch(error => {
        console.log('Service Worker 등록 실패:', error);
      });
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const appState = useAppState();
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    currentPage,
    setCurrentPage,
    currentFormType,
    setCurrentFormType,
    currentUser,
    employees
  } = appState;

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 페이지 제목 가져오기 함수
  const getPageTitle = () => {
    return PAGE_TITLES[currentPage as keyof typeof PAGE_TITLES] || "대시보드";
  };

  // PWA 설치 이벤트 리스너
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallPromptVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // PWA 설치 핸들러
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA 설치 승인됨');
        toast.success('앱이 설치되었습니다!');
      } else {
        console.log('PWA 설치 거부됨');
      }
      
      setDeferredPrompt(null);
      setIsInstallPromptVisible(false);
    }
  };

  // 파비콘 및 PWA 설정
  useEffect(() => {
    setFaviconAndPWA();
    registerServiceWorker();
  }, []);

  // 페이지 제목 동적 변경
  useEffect(() => {
    const pageTitle = getPageTitle();
    document.title = `${pageTitle} | CO-GW`;
  }, [currentPage]);

  // 로그인 처리
  const handleLogin = () => {
    setIsLoggedIn(true);
    // 로그인 후 반드시 대시보드로 이동
    setCurrentPage("dashboard");
    // 기타 상태들 초기화
    setOpenSubmenu(null);
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
    setCurrentFormType("");
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    setOpenSubmenu(null);
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
    setCurrentFormType("");
  };

  // 로그인하지 않은 경우 로그인 페이지 표시
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const menuItems = [
    { 
      id: "dashboard", 
      label: "대시보드", 
      icon: Home 
    },
    {
      id: "approval",
      label: "전자결재",
      icon: FileText,
      submenu: [
        { id: "approval-list", label: "기안함" },
        { id: "approval-request", label: "결재 요청" }
      ]
    },
    {
      id: "project",
      label: "프로젝트 관리",
      icon: FolderPlus,
      submenu: [
        { id: "project-create", label: "프로젝트 생성" },
        { id: "project-status", label: "프로젝트 현황" },
        { id: "resource-management", label: "인력 배정" }
      ]
    },
    {
      id: "vote",
      label: "투표 시스템",
      icon: Vote,
      submenu: [
        { id: "vote-create", label: "투표 생성" },
        { id: "vote-list", label: "투표 목록" }
      ]
    },
    {
      id: "organization",
      label: "조직도",
      icon: Building2,
      submenu: [
        { id: "department-list", label: "부서 목록" },
        { id: "employee-status", label: "직원 현황" }
      ]
    },
    { 
      id: "board", 
      label: "게시판", 
      icon: MessageSquare 
    },
    { 
      id: "wiki", 
      label: "사내 위키", 
      icon: BookOpen 
    },
    { 
      id: "manual", 
      label: "메뉴얼", 
      icon: HelpCircle 
    },
    {
      id: "admin",
      label: "관리자 메뉴",
      icon: Shield,
      submenu: [
        { id: "admin-approval-management", label: "전자결재 관리" },
        { id: "admin-post-management", label: "게시물 관리" },
        { id: "admin-posts", label: "카테고리 관리" },
        { id: "admin-employee-create", label: "직원 생성" },
        { id: "admin-employee-management", label: "직원 관리" },
        { id: "admin-organization", label: "조직 관리" },
        { id: "admin-project-management", label: "프로젝트 관리" },
        { id: "admin-menu-management", label: "메뉴 관리" },
        { id: "admin-assets", label: "비품/자산 관리" },
        { id: "admin-approval-lines", label: "결재선 관리" },
        { id: "admin-common-code", label: "공통 코드 관리" }
      ]
    },
    { 
      id: "my-info", 
      label: "내 정보", 
      icon: User 
    }
  ];

  const handleSubmenuToggle = (menuId: string) => {
    if (isSidebarCollapsed) return;
    setOpenSubmenu(openSubmenu === menuId ? null : menuId);
  };

  const handleMenuItemClick = (itemId: string) => {
    setCurrentPage(itemId);
    setIsMobileMenuOpen(false);
  };

  const handleCreateApproval = (formType: string) => {
    setCurrentFormType(formType);
    setCurrentPage("approval-form");
  };

  const handleBackToApprovalList = () => {
    setCurrentPage("approval-list");
    setCurrentFormType("");
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "vote": return "bg-blue-50 border-blue-200";
      case "approval": return "bg-green-50 border-green-200";
      case "vacation": return "bg-purple-50 border-purple-200";
      case "post": return "bg-orange-50 border-orange-200";
      case "system": return "bg-red-50 border-red-200";
      case "project": return "bg-blue-50 border-blue-200";
      case "hr": return "bg-green-50 border-green-200";
      case "education": return "bg-indigo-50 border-indigo-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "높음": return "bg-red-100 text-red-700";
      case "보통": return "bg-yellow-100 text-yellow-700";
      case "낮음": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <DashboardSidebar
      menuItems={menuItems}
      currentPage={currentPage}
      openSubmenu={openSubmenu}
      isSidebarCollapsed={isSidebarCollapsed && !isMobile}
      onSubmenuToggle={handleSubmenuToggle}
      onMenuItemClick={handleMenuItemClick}
      onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      onCloseMobile={() => setIsMobileMenuOpen(false)}
      isMobile={isMobile}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* PWA 설치 프롬프트 */}
      {isInstallPromptVisible && (
        <div className="fixed top-16 right-4 z-50 bg-white border border-border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pastel-blue-100 rounded-lg">
              <Home className="h-5 w-5 text-pastel-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">앱 설치</h3>
              <p className="text-sm text-muted-foreground mb-3">
                CO-GW를 홈 화면에 추가하여 빠르게 접근하세요.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInstallPWA}>
                  설치
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsInstallPromptVisible(false)}
                >
                  나중에
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInstallPromptVisible(false)}
              className="p-1 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <AppHeader
        pageTitle={getPageTitle()}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        onNotificationToggle={() => setIsNotificationOpen(true)}
        unreadCount={unreadCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 메인 레이아웃 */}
      <div className="flex">
        {/* 데스크톱 사이드바 */}
        <aside className={`
          hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border fixed left-0 top-14 h-[calc(100vh-3.5rem)] 
          transition-all duration-200 z-40 overflow-hidden
          ${isSidebarCollapsed ? 'w-16' : 'w-64'}
        `}>
          <SidebarContent />
        </aside>

        {/* 모바일 사이드바 */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="px-6 py-4 border-b border-sidebar-border flex-shrink-0">
              <SheetTitle className="text-left">메인 메뉴</SheetTitle>
              <SheetDescription>
                그룹웨어의 주요 기능들에 접근할 수 있는 메뉴입니다.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <SidebarContent isMobile />
            </div>
          </SheetContent>
        </Sheet>

        {/* 메인 콘텐츠 */}
        <main className={`flex-1 transition-all duration-200 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <div className="w-full px-6 py-8">
            {/* 대시보드인 경우 휴가 캘린더도 포함 */}
            {currentPage === "dashboard" ? (
              <div className="space-y-8">
                <AppRouter
                  currentPage={currentPage}
                  currentFormType={currentFormType}
                  handleCreateApproval={handleCreateApproval}
                  handleBackToApprovalList={handleBackToApprovalList}
                  appState={appState}
                />
                <VacationCalendar 
                  events={initialVacationEvents} 
                  employees={employees}
                />
              </div>
            ) : (
              <AppRouter
                currentPage={currentPage}
                currentFormType={currentFormType}
                handleCreateApproval={handleCreateApproval}
                handleBackToApprovalList={handleBackToApprovalList}
                appState={appState}
              />
            )}
          </div>
        </main>
      </div>

      {/* 개선된 알림 Sheet */}
      <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-pastel-blue-600" />
              알림 센터
            </SheetTitle>
            <SheetDescription>
              읽지 않은 알림 {unreadCount}개가 있습니다. 각 알림을 클릭하여 자세한 내용을 확인할 수 있습니다.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {/* 알림 필터 버튼들 */}
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" className="text-xs">
                전체
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                읽지 않음
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                중요
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${getNotificationTypeColor(notification.type)} ${
                      !notification.isRead ? "bg-opacity-80 shadow-sm" : "bg-opacity-40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-medium leading-5">{notification.title}</p>
                          <div className="flex items-center gap-2 ml-2">
                            {notification.priority === "높음" && (
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                            )}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-4 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadgeColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* 알림 관리 버튼들 */}
            <div className="flex justify-between pt-4 border-t mt-4">
              <Button variant="outline" size="sm">
                모두 읽음 처리
              </Button>
              <Button variant="ghost" size="sm">
                알림 설정
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}