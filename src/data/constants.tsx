import { MessageSquare, CheckCircle, Calendar, FileText, AlertCircle } from "lucide-react";

// 알림 데이터
export const notifications = [
  {
    id: 1,
    title: "새로운 투표가 생성되었습니다",
    message: "회의실 이용 규칙 개정에 대한 투표가 시작되었습니다.",
    type: "vote",
    timestamp: "5분 전",
    isRead: false,
    icon: <MessageSquare className="h-4 w-4 text-blue-600" />
  },
  {
    id: 2,
    title: "전자결재 승인 완료",
    message: "출장비 정산 신청이 승인되었습니다.",
    type: "approval",
    timestamp: "1시간 전",
    isRead: false,
    icon: <CheckCircle className="h-4 w-4 text-green-600" />
  },
  {
    id: 3,
    title: "휴가 신청 알림",
    message: "김철수님의 휴가 신청이 대기 중입니다.",
    type: "vacation",
    timestamp: "2시간 전",
    isRead: true,
    icon: <Calendar className="h-4 w-4 text-purple-600" />
  },
  {
    id: 4,
    title: "새 게시물 등록",
    message: "4월 정기 회의 안건 공지가 등록되었습니다.",
    type: "post",
    timestamp: "3시간 전",
    isRead: true,
    icon: <FileText className="h-4 w-4 text-orange-600" />
  },
  {
    id: 5,
    title: "시스템 점검 안내",
    message: "내일 새벽 2시부터 시스템 점검이 예정되어 있습니다.",
    type: "system",
    timestamp: "1일 전",
    isRead: true,
    icon: <AlertCircle className="h-4 w-4 text-red-600" />
  }
];

// 설정 데이터
export const settingsData = {
  account: {
    name: "관리자",
    email: "admin@company.com",
    department: "관리팀",
    position: "팀장"
  },
  preferences: {
    theme: "light",
    language: "ko",
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    weekStartDay: "monday"
  },
  privacy: {
    profileVisible: true,
    contactInfoVisible: false,
    activityVisible: true
  }
};

// 페이지 제목 매핑
export const PAGE_TITLES = {
  dashboard: "대시보드",
  "approval-list": "기안함",
  "approval-form": "전자결재 작성",
  "approval-request": "결재 요청",
  "project-create": "프로젝트 생성",
  "project-create-form": "프로젝트 생성",
  "project-detail": "프로젝트 상세",
  "project-status": "프로젝트 현황",
  "resource-management": "인력 배정 관리",
  "vote-create": "투표 생성",
  "vote-list": "투표 목록",
  "department-list": "부서 목록",
  "employee-status": "직원 현황",
  "my-info": "내 정보",
  board: "게시판",
  "board-create": "게시글 작성",
  "board-detail": "게시글 상세",
  wiki: "사내 위키",
  manual: "메뉴얼",
  settings: "설정",
  "admin-approval-management": "전자결재 관리",
  "admin-post-management": "게시물 관리",
  "admin-posts": "게시물 카테고리 관리",
  "admin-employee-create": "직원 생성",
  "admin-employee-management": "직원 관리",
  "admin-organization": "조직 관리",
  "admin-assets": "비품/자산 관리",
  "admin-approval-lines": "결재선 관리",
  "admin-common-code": "공통 코드 관리",
  "admin-project-management": "프로젝트 관리",
  "admin-menu-management": "메뉴 관리"
};

// 게시판 카테고리
export const BOARD_CATEGORIES = [
  "전체",
  "공지사항", 
  "행사",
  "업무",
  "일반",
  "질문",
  "건의사항"
];