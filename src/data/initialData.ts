// 초기 데이터
export const initialVotes = [
  { id: 1, title: "회의실 이용 규칙 개정", description: "회의실 사용 시간 및 예약 방법에 대한 개정안", status: "진행중", endDate: "2024-03-30", participants: 12, totalEmployees: 25 },
  { id: 2, title: "사내 카페테리아 메뉴 선정", description: "새로운 카페테리아 운영업체 및 메뉴 선정", status: "완료", endDate: "2024-03-15", participants: 23, totalEmployees: 25 },
  { id: 3, title: "휴가 정책 변경", description: "연차 사용 방법 및 대체휴가 정책 변경", status: "예정", endDate: "2024-04-05", participants: 0, totalEmployees: 25 },
];

export const initialDepartments = [
  { id: 1, name: "개발팀", employees: 8, manager: "김철수", budget: "500만원", description: "소프트웨어 개발 및 유지보수" },
  { id: 2, name: "디자인팀", employees: 4, manager: "이영희", budget: "200만원", description: "UI/UX 디자인 및 브랜딩" },
  { id: 3, name: "마케팅팀", employees: 5, manager: "박민수", budget: "300만원", description: "마케팅 전략 및 홍보" },
  { id: 4, name: "기획팀", employees: 3, manager: "정한솔", budget: "150만원", description: "사업 기획 및 전략 수립" },
  { id: 5, name: "인사팀", employees: 2, manager: "최지영", budget: "100만원", description: "인사 관리 및 채용" },
  { id: 6, name: "회계팀", employees: 3, manager: "강민호", budget: "120만원", description: "재무 관리 및 회계 업무" },
];

export const initialEmployees = [
  { id: 1, name: "김철수", department: "개발팀", position: "팀장", email: "kim@company.com", phone: "010-1234-5678", joinDate: "2020-03-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzbWFufGVufDF8fHx8MTc1NTg4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 2, name: "이영희", department: "디자인팀", position: "팀장", email: "lee@company.com", phone: "010-2345-6789", joinDate: "2021-01-15", status: "재직중", profileImage: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzd29tYW58ZW58MXx8fHwxNzU1ODgyMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 3, name: "박민수", department: "마케팅팀", position: "팀장", email: "park@company.com", phone: "010-3456-7890", joinDate: "2020-08-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1661854236305-b02cef4aa0af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwa29yZWFuJTIwbWFsZXxlbnwxfHx8fDE3NTU4ODIxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 4, name: "정한솔", department: "기획팀", position: "팀장", email: "jung@company.com", phone: "010-4567-8901", joinDate: "2021-06-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzbWFufGVufDF8fHx8MTc1NTg4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 5, name: "최지영", department: "인사팀", position: "팀장", email: "choi@company.com", phone: "010-5678-9012", joinDate: "2019-11-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwa29yZWFuJTIwd29tYW58ZW58MXx8fHwxNzU1ODgyMTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 6, name: "강민호", department: "회계팀", position: "팀장", email: "kang@company.com", phone: "010-6789-0123", joinDate: "2020-05-15", status: "재직중", profileImage: "https://images.unsplash.com/photo-1661854236305-b02cef4aa0af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwa29yZWFuJTIwbWFsZXxlbnwxfHx8fDE3NTU4ODIxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 7, name: "임수진", department: "개발팀", position: "시니어 개발자", email: "lim@company.com", phone: "010-7890-1234", joinDate: "2021-09-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1562894363-43b6c762ca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhlYWRzaG90JTIwYXNpYW4lMjBmZW1hbGV8ZW58MXx8fHwxNzU1ODgyMTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 8, name: "오태현", department: "개발팀", position: "주니어 개발자", email: "oh@company.com", phone: "010-8901-2345", joinDate: "2022-03-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1706025090794-7ade2c1b6208?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHlvdW5nfGVufDF8fHx8MTc1NTg4MjEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 9, name: "한소연", department: "디자인팀", position: "디자이너", email: "han@company.com", phone: "010-9012-3456", joinDate: "2023-03-15", status: "재직중", profileImage: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzd29tYW58ZW58MXx8fHwxNzU1ODgyMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 10, name: "윤지호", department: "개발팀", position: "주니어 개발자", email: "yoon@company.com", phone: "010-0123-4567", joinDate: "2023-07-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1706025090794-7ade2c1b6208?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHlvdW5nfGVufDF8fHx8MTc1NTg4MjEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 11, name: "송미래", department: "마케팅팀", position: "마케터", email: "song@company.com", phone: "010-1234-5679", joinDate: "2023-09-01", status: "재직중", profileImage: "https://images.unsplash.com/photo-1562894363-43b6c762ca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhlYWRzaG90JTIwYXNpYW4lMjBmZW1hbGV8ZW58MXx8fHwxNzU1ODgyMTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 12, name: "장현우", department: "기획팀", position: "기획자", email: "jang@company.com", phone: "010-2345-6780", joinDate: "2023-11-15", status: "재직중", profileImage: "https://images.unsplash.com/photo-1661854236305-b02cef4aa0af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwa29yZWFuJTIwbWFsZXxlbnwxfHx8fDE3NTU4ODIxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 13, name: "조은진", department: "인사팀", position: "인사담당자", email: "jo@company.com", phone: "010-3456-7891", joinDate: "2022-06-01", status: "휴직중", profileImage: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwa29yZWFuJTIwd29tYW58ZW58MXx8fHwxNzU1ODgyMTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: 14, name: "류승호", department: "회계팀", position: "회계사", email: "ryu@company.com", phone: "010-4567-8902", joinDate: "2021-11-01", status: "휴직중", profileImage: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzbWFufGVufDF8fHx8MTc1NTg4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

export const initialProjects = [
  { 
    id: 1, 
    name: "모바일 앱 리뉴얼", 
    description: "기존 모바일 앱의 UI/UX를 개선하고 새로운 기능을 추가하는 프로젝트입니다.",
    status: "진행 중", 
    progress: 75, 
    team: "개발팀", 
    manager: "김철수",
    deadline: "2024-04-15",
    startDate: "2024-01-15",
    budget: "500만원",
    members: ["김철수", "임수진", "오태현"],
    tasks: ["UI 개선", "새 기능 개발", "테스트", "배포"],
    files: []
  },
  { 
    id: 2, 
    name: "고객 관리 시스템", 
    description: "고객 정보를 체계적으로 관리할 수 있는 CRM 시스템 개발 프로젝트입니다.",
    status: "진행 중", 
    progress: 45, 
    team: "개발팀", 
    manager: "김철수",
    deadline: "2024-05-30",
    startDate: "2024-02-01",
    budget: "800만원",
    members: ["김철수", "임수진", "윤지호"],
    tasks: ["요구사항 분석", "DB 설계", "백엔드 개발", "프론트엔드 개발"],
    files: []
  },
  { 
    id: 3, 
    name: "브랜드 리뉴얼", 
    description: "회사 브랜드 아이덴티티를 전면 개편하는 리브랜딩 프로젝트입니다.",
    status: "지연", 
    progress: 20, 
    team: "마케팅팀", 
    manager: "박민수",
    deadline: "2024-06-20",
    startDate: "2024-01-10",
    budget: "300만원",
    members: ["박민수", "송미래"],
    tasks: ["브랜드 분석", "로고 디자인", "가이드라인 제작"],
    files: []
  },
  { 
    id: 4, 
    name: "웹사이트 개편", 
    description: "회사 홈페이지의 전체적인 리뉴얼 프로젝트입니다.",
    status: "진행 중", 
    progress: 60, 
    team: "디자인팀", 
    manager: "이영희",
    deadline: "2024-04-30",
    startDate: "2024-01-20",
    budget: "400만원",
    members: ["이영희", "한소연"],
    tasks: ["와이어프레임", "디자인", "퍼블리싱", "CMS 연동"],
    files: []
  }
];

export const initialWikiDocuments = [
  { id: 1, title: "신입사원 온보딩 가이드", content: "신입사원을 위한 회사 소개 및 업무 가이드", category: "인사", author: "최지영", updatedAt: "2024-03-20", views: 156, tags: ["신입사원", "온보딩", "가이드"] },
  { id: 2, title: "개발팀 코딩 컨벤션", content: "개발팀에서 사용하는 코딩 스타일 및 규칙", category: "개발", author: "김철수", updatedAt: "2024-03-18", views: 89, tags: ["개발", "컨벤션", "코딩"] },
  { id: 3, title: "마케팅 캠페인 가이드라인", content: "효과적인 마케팅 캠페인 기획 및 실행 방법", category: "마케팅", author: "박민수", updatedAt: "2024-03-15", views: 134, tags: ["마케팅", "캠페인", "가이드라인"] },
  { id: 4, title: "보안 정책 및 준수사항", content: "회사 보안 정책과 직원이 준수해야 할 사항들", category: "보안", author: "관리자", updatedAt: "2024-03-10", views: 245, tags: ["보안", "정책", "준수사항"] },
  { id: 5, title: "디자인 시스템 가이드", content: "브랜드 아이덴티티 및 디자인 시스템 사용법", category: "디자인", author: "이영희", updatedAt: "2024-03-08", views: 98, tags: ["디자인", "브랜딩", "시스템"] },
];

export const initialManuals = [
  { id: 1, title: "그룹웨어 사용 설명서", description: "Cove One 그룹웨어 시스템의 모든 기능 설명", category: "시스템", type: "PDF", size: "2.5MB", downloadCount: 145, updatedAt: "2024-03-22" },
  { id: 2, title: "전자결재 시스템 가이드", description: "전자결재 신청부터 승인까지의 전 과정 안내", category: "시스템", type: "PDF", size: "1.8MB", downloadCount: 89, updatedAt: "2024-03-20" },
  { id: 3, title: "인사 정책 매뉴얼", description: "채용, 평가, 복리후생 등 인사 관련 정책 모음", category: "인사", type: "DOCX", size: "3.2MB", downloadCount: 76, updatedAt: "2024-03-18" },
  { id: 4, title: "회계 업무 절차서", description: "예산 편성, 지출 승인, 정산 등 회계 업무 절차", category: "회계", type: "PDF", size: "2.1MB", downloadCount: 54, updatedAt: "2024-03-15" },
  { id: 5, title: "보안 가이드라인", description: "정보보안 정책 및 개인정보 보호 지침", category: "보안", type: "PDF", size: "1.5MB", downloadCount: 198, updatedAt: "2024-03-12" },
  { id: 6, title: "원격 근무 매뉴얼", description: "재택근무 및 원격업무 시 준수사항과 도구 사용법", category: "업무", type: "PDF", size: "1.9MB", downloadCount: 123, updatedAt: "2024-03-10" },
];

// 게시판 데이터 추가
export const initialBoardPosts = [
  { 
    id: 1, 
    title: "4월 정기 회의 안건 공지", 
    content: "4월 정기 회의에서 논의할 안건들을 미리 공지드립니다. 각 팀별로 준비해주시기 바랍니다.",
    category: "공지사항", 
    author: "관리자", 
    createdAt: "2024-03-22", 
    views: 156,
    likes: 12,
    comments: [
      { id: 1, author: "김철수", content: "개발팀 준비 완료했습니다.", createdAt: "2024-03-22" },
      { id: 2, author: "이영희", content: "디자인팀도 준비되었습니다.", createdAt: "2024-03-22" }
    ]
  },
  { 
    id: 2, 
    title: "신입사원 환영회 일정 안내", 
    content: "이번 달 입사한 신입사원들을 환영하는 자리를 마련했습니다. 많은 참여 부탁드립니다.",
    category: "행사", 
    author: "최지영", 
    createdAt: "2024-03-20", 
    views: 89,
    likes: 23,
    comments: []
  },
  { 
    id: 3, 
    title: "보안 정책 업데이트 알림", 
    content: "회사 보안 정책이 업데이트되었습니다. 새로운 정책을 숙지해주시기 바랍니다.",
    category: "공지사항", 
    author: "관리자", 
    createdAt: "2024-03-18", 
    views: 134,
    likes: 5,
    comments: [
      { id: 1, author: "박민수", content: "확인했습니다.", createdAt: "2024-03-18" }
    ]
  },
  { 
    id: 4, 
    title: "회사 창립기념일 행사 안내", 
    content: "회사 창립 10주년을 맞아 기념 행사를 개최합니다. 자세한 일정은 추후 공지드리겠습니다.",
    category: "행사", 
    author: "관리자", 
    createdAt: "2024-03-15", 
    views: 245,
    likes: 45,
    comments: [
      { id: 1, author: "임수진", content: "기대됩니다!", createdAt: "2024-03-15" },
      { id: 2, author: "오태현", content: "10주년 축하드립니다.", createdAt: "2024-03-15" }
    ]
  },
  { 
    id: 5, 
    title: "사내 도서관 신간 도서 안내", 
    content: "사내 도서관에 새로운 도서들이 입고되었습니다. 업무에 도움이 되는 좋은 책들이니 많이 활용해주세요.",
    category: "일반", 
    author: "한소연", 
    createdAt: "2024-03-12", 
    views: 67,
    likes: 8,
    comments: []
  },
  { 
    id: 6, 
    title: "주차장 이용 안내", 
    content: "주차장 공사로 인해 일부 구역 이용이 제한됩니다. 대체 주차장을 이용해주시기 바랍니다.",
    category: "공지사항", 
    author: "관리자", 
    createdAt: "2024-03-10", 
    views: 198,
    likes: 3,
    comments: [
      { id: 1, author: "강민호", content: "대체 주차장 위치가 어디인가요?", createdAt: "2024-03-10" }
    ]
  }
];

// 휴가 일정 데이터 - 더 많은 휴가자 추가
export const initialVacationEvents = [
  // 3월 휴가자들
  { id: 1, employeeId: 1, name: "김철수", type: "연차", date: "2024-03-25", duration: "1일", department: "개발팀", reason: "개인 사정" },
  { id: 2, employeeId: 2, name: "이영희", type: "반차", date: "2024-03-25", duration: "오후", department: "디자인팀", reason: "병원 진료" },
  { id: 3, employeeId: 3, name: "박민수", type: "연차", date: "2024-03-26", duration: "1일", department: "마케팅팀", reason: "가족 행사" },
  { id: 4, employeeId: 7, name: "임수진", type: "반차", date: "2024-03-26", duration: "오전", department: "개발팀", reason: "개인 업무" },
  { id: 5, employeeId: 4, name: "정한솔", type: "연차", date: "2024-03-27", duration: "1일", department: "기획팀", reason: "휴식" },
  { id: 6, employeeId: 8, name: "오태현", type: "연차", date: "2024-03-27", duration: "1일", department: "개발팀", reason: "개인 사정" },
  { id: 7, employeeId: 9, name: "한소연", type: "반차", date: "2024-03-27", duration: "오후", department: "디자인팀", reason: "치과 진료" },
  { id: 8, employeeId: 5, name: "최지영", type: "연차", date: "2024-03-28", duration: "2일", department: "인사팀", reason: "여행" },
  { id: 9, employeeId: 6, name: "강민호", type: "연차", date: "2024-03-28", duration: "1일", department: "회계팀", reason: "가족 행사" },
  { id: 10, employeeId: 10, name: "윤지호", type: "반차", date: "2024-03-28", duration: "오전", department: "개발팀", reason: "개인 업무" },
  { id: 11, employeeId: 11, name: "송미래", type: "연차", date: "2024-03-29", duration: "1일", department: "마케팅팀", reason: "휴식" },
  { id: 12, employeeId: 12, name: "장현우", type: "반차", date: "2024-03-29", duration: "오후", department: "기획팀", reason: "개인 사정" },

  // 4월 휴가자들
  { id: 13, employeeId: 1, name: "김철수", type: "연차", date: "2024-04-01", duration: "1일", department: "개발팀", reason: "휴식" },
  { id: 14, employeeId: 3, name: "박민수", type: "반차", date: "2024-04-01", duration: "오전", department: "마케팅팀", reason: "병원 진료" },
  { id: 15, employeeId: 7, name: "임수진", type: "연차", date: "2024-04-02", duration: "1일", department: "개발팀", reason: "개인 사정" },
  { id: 16, employeeId: 2, name: "이영희", type: "연차", date: "2024-04-02", duration: "1일", department: "디자인팀", reason: "가족 행사" },
  { id: 17, employeeId: 9, name: "한소연", type: "반차", date: "2024-04-02", duration: "오후", department: "디자인팀", reason: "개인 업무" },
  { id: 18, employeeId: 4, name: "정한솔", type: "병가", date: "2024-04-03", duration: "1일", department: "기획팀", reason: "감기 치료" },
  { id: 19, employeeId: 8, name: "오태현", type: "연차", date: "2024-04-03", duration: "1일", department: "개발팀", reason: "휴식" },
  { id: 20, employeeId: 5, name: "최지영", type: "연차", date: "2024-04-04", duration: "1일", department: "인사팀", reason: "개인 사정" },
  { id: 21, employeeId: 10, name: "윤지호", type: "반차", date: "2024-04-04", duration: "오전", department: "개발팀", reason: "치과 진료" },
  { id: 22, employeeId: 6, name: "강민호", type: "연차", date: "2024-04-05", duration: "3일", department: "회계팀", reason: "가족 여행" },
  { id: 23, employeeId: 11, name: "송미래", type: "연차", date: "2024-04-05", duration: "1일", department: "마케팅팀", reason: "휴식" },
  { id: 24, employeeId: 12, name: "장현우", type: "반차", date: "2024-04-05", duration: "오후", department: "기획팀", reason: "개인 업무" },
  { id: 25, employeeId: 1, name: "김철수", type: "반차", date: "2024-04-08", duration: "오전", department: "개발팀", reason: "병원 진료" },
  { id: 26, employeeId: 7, name: "임수진", type: "연차", date: "2024-04-10", duration: "1일", department: "개발팀", reason: "개인 사정" },
  { id: 27, employeeId: 2, name: "이영희", type: "반차", date: "2024-04-10", duration: "오후", department: "디자인팀", reason: "개인 업무" },
  { id: 28, employeeId: 8, name: "오태현", type: "연차", date: "2024-04-12", duration: "1일", department: "개발팀", reason: "휴식" },
  { id: 29, employeeId: 9, name: "한소연", type: "연차", date: "2024-04-15", duration: "2일", department: "디자인팀", reason: "가족 행사" },
  { id: 30, employeeId: 3, name: "박민수", type: "반차", date: "2024-04-15", duration: "오전", department: "마케팅팀", reason: "개인 업무" },
  { id: 31, employeeId: 4, name: "정한솔", type: "연차", date: "2024-04-18", duration: "1일", department: "기획팀", reason: "휴식" },
  { id: 32, employeeId: 10, name: "윤지호", type: "반차", date: "2024-04-18", duration: "오후", department: "개발팀", reason: "치과 진료" },
  { id: 33, employeeId: 5, name: "최지영", type: "연차", date: "2024-04-19", duration: "1일", department: "인사팀", reason: "개인 사정" },
  { id: 34, employeeId: 11, name: "송미래", type: "연차", date: "2024-04-22", duration: "1일", department: "마케팅팀", reason: "휴식" },
  { id: 35, employeeId: 12, name: "장현우", type: "반차", date: "2024-04-22", duration: "오전", department: "기획팀", reason: "병원 진료" },
  { id: 36, employeeId: 6, name: "강민호", type: "연차", date: "2024-04-25", duration: "1일", department: "회계팀", reason: "개인 사정" },
  { id: 37, employeeId: 1, name: "김철수", type: "반차", date: "2024-04-26", duration: "오후", department: "개발팀", reason: "개인 업무" },
  { id: 38, employeeId: 7, name: "임수진", type: "연차", date: "2024-04-29", duration: "1일", department: "개발팀", reason: "휴식" },
  { id: 39, employeeId: 2, name: "이영희", type: "연차", date: "2024-04-30", duration: "1일", department: "디자인팀", reason: "개인 사정" }
];

export const currentUser = {
  id: 999,
  name: "관리자",
  department: "관리팀",
  position: "팀장",
  email: "admin@company.com",
  phone: "010-0000-0000",
  joinDate: "2019-01-01",
  status: "재직중",
  profileImage: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzbWFufGVufDF8fHx8MTc1NTg4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  address: "서울특별시 강남구 테헤란로 123",
  emergencyContact: "010-1111-1111",
  birthday: "1990-01-01"
};