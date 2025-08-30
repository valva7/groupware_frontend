import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { PendingApprovalList } from "./PendingApprovalList";
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Users,
  BarChart3,
  Target,
  Briefcase
} from "lucide-react";

interface ApprovalItem {
  id: number;
  title: string;
  type: string;
  status: string;
  date: string;
  requestDate: string;
  approvalLine: Array<{
    order: number;
    name: string;
    position: string;
    department: string;
    status: "대기" | "승인" | "반려";
    approvedAt?: string;
    comment?: string;
  }>;
  content: string;
  amount?: string;
  attachments?: string[];
  requester: {
    name: string;
    department: string;
    position: string;
  };
}

interface ProjectDetail {
  id: number;
  name: string;
  team: string;
  members: number;
  total: number;
  progress: number;
  startDate: string;
  endDate: string;
  manager: string;
  description: string;
  status: string;
  budget: string;
  assignedMembers: Array<{
    name: string;
    role: string;
    department: string;
    allocation: number; // 투입률 (%)
    tasks: string[];
  }>;
  milestones: Array<{
    name: string;
    date: string;
    status: "완료" | "진행중" | "예정";
    description: string;
  }>;
  tasks: Array<{
    name: string;
    assignee: string;
    progress: number;
    dueDate: string;
    priority: "높음" | "보통" | "낮음";
  }>;
}

interface HeroPanelProps {
  employees?: any[];
}

export function HeroPanel({ employees = [] }: HeroPanelProps) {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [isApprovalDetailOpen, setIsApprovalDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);

  const approvalItems: ApprovalItem[] = [
    { 
      id: 1,
      title: "출장비 정산 신청", 
      type: "경비", 
      status: "승인", 
      date: "2024-03-20",
      requestDate: "2024-03-18",
      requester: {
        name: "관리자",
        department: "관리팀",
        position: "팀장"
      },
      content: "서울-부산 출장 관련 교통비 및 숙박비 정산을 신청합니다.\n\n출장 목적: 신규 거래처 미팅\n출장 기간: 2024년 3월 15일 ~ 3월 16일 (1박 2일)\n\n세부 내역:\n- KTX 왕복 교통비: 118,000원\n- 숙박비 (1박): 80,000원\n- 식비: 45,000원\n- 기타 교통비: 12,000원\n\n총 정산 금액: 255,000원",
      amount: "255,000원",
      attachments: ["출장보고서.pdf", "영수증모음.zip", "출장계획서.docx"],
      approvalLine: [
        {
          order: 1,
          name: "김철수",
          position: "부장",
          department: "관리팀",
          status: "승인",
          approvedAt: "2024-03-19 10:30",
          comment: "출장 내역 확인 완료. 승인합니다."
        },
        {
          order: 2,
          name: "최지영",
          position: "이사",
          department: "경영지원팀",
          status: "승인",
          approvedAt: "2024-03-20 14:15",
          comment: "정산 내역 검토 완료."
        }
      ]
    },
    { 
      id: 2,
      title: "연차 신청서", 
      type: "휴가", 
      status: "대기", 
      date: "2024-03-22",
      requestDate: "2024-03-22",
      requester: {
        name: "관리자",
        department: "관리팀",
        position: "팀장"
      },
      content: "개인 사정으로 연차휴가를 신청합니다.\n\n휴가 사유: 가족 행사 참석\n휴가 기간: 2024년 3월 28일 ~ 3월 29일 (2일간)\n\n업무 인수인계:\n- 진행 중인 프로젝트는 김철수 부장님께 인계\n- 긴급 연락은 휴대전화로 가능\n- 복귀 후 업무 보고 예정",
      approvalLine: [
        {
          order: 1,
          name: "김철수",
          position: "부장",
          department: "관리팀",
          status: "대기"
        },
        {
          order: 2,
          name: "최지영",
          position: "이사",
          department: "경영지원팀",
          status: "대기"
        }
      ]
    },
    { 
      id: 3,
      title: "구매 요청서", 
      type: "구매", 
      status: "진행중", 
      date: "2024-03-23",
      requestDate: "2024-03-21",
      requester: {
        name: "관리자",
        department: "관리팀",
        position: "팀장"
      },
      content: "사무용품 구매를 요청합니다.\n\n구매 목적: 신입사원 입사 대비 사무용품 보충\n\n구매 품목:\n1. 노트북 (MacBook Pro 14인치) x 2대 - 6,000,000원\n2. 모니터 (27인치 4K) x 2대 - 800,000원\n3. 키보드, 마우스 세트 x 2세트 - 200,000원\n4. 사무용 의자 x 2개 - 600,000원\n\n총 구매 예상 금액: 7,600,000원\n\n납기 희망일: 2024년 4월 1일",
      amount: "7,600,000원",
      attachments: ["구매품목상세.xlsx", "견적서.pdf"],
      approvalLine: [
        {
          order: 1,
          name: "김철수",
          position: "부장",
          department: "관리팀",
          status: "승인",
          approvedAt: "2024-03-22 09:20",
          comment: "필요한 품목들로 확인됩니다."
        },
        {
          order: 2,
          name: "최지영",
          position: "이사",
          department: "경영지원팀",
          status: "대기"
        }
      ]
    },
    { 
      id: 4,
      title: "교육비 지원 신청", 
      type: "교육", 
      status: "승인", 
      date: "2024-03-21",
      requestDate: "2024-03-19",
      requester: {
        name: "관리자",
        department: "관리팀",
        position: "팀장"
      },
      content: "외부 교육 과정 수강을 위한 교육비 지원을 신청합니다.\n\n교육 과정명: 리더십 역량 강화 과정\n교육 기관: 한국경영개발원\n교육 기간: 2024년 4월 8일 ~ 4월 12일 (5일간)\n교육 방식: 집합 교육\n\n교육 목적:\n- 팀 관리 역량 향상\n- 효과적인 의사소통 기법 습득\n- 갈등 관리 및 해결 능력 개발\n\n교육비: 1,200,000원 (교육비 + 교재비 포함)",
      amount: "1,200,000원",
      attachments: ["교육과정안내.pdf", "교육신청서.pdf"],
      approvalLine: [
        {
          order: 1,
          name: "김철수",
          position: "부장",
          department: "관리팀",
          status: "승인",
          approvedAt: "2024-03-20 11:45",
          comment: "업무에 도움이 될 교육과정입니다."
        },
        {
          order: 2,
          name: "최지영",
          position: "이사",
          department: "경영지원팀",
          status: "승인",
          approvedAt: "2024-03-21 16:30",
          comment: "교육비 지원 승인합니다."
        }
      ]
    }
  ];

  const projectDetails: ProjectDetail[] = [
    {
      id: 1,
      name: "모바일 앱 리뉴얼",
      team: "개발팀",
      members: 3,
      total: 8,
      progress: 75,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      manager: "김철수",
      description: "기존 모바일 앱의 UI/UX를 개선하고 새로운 기능을 추가하는 프로젝트입니다. 사용자 경험 향상과 최신 기술 스택 적용을 통해 앱의 경쟁력을 강화하고자 합니다.",
      status: "진행중",
      budget: "5,000만원",
      assignedMembers: [
        {
          name: "김철수",
          role: "프로젝트 매니저",
          department: "개발팀",
          allocation: 50,
          tasks: ["프로젝트 관리", "기술 리뷰", "품질 관리"]
        },
        {
          name: "임수진",
          role: "시니어 개발자",
          department: "개발팀",
          allocation: 100,
          tasks: ["백엔드 개발", "API 설계", "데이터베이스 최적화"]
        },
        {
          name: "오태현",
          role: "주니어 개발자",
          department: "개발팀",
          allocation: 80,
          tasks: ["프론트엔드 개발", "UI 구현", "테스트 코드 작성"]
        }
      ],
      milestones: [
        {
          name: "요구사항 분석 완료",
          date: "2024-02-01",
          status: "완료",
          description: "사용자 요구사항 분석 및 기능 정의 완료"
        },
        {
          name: "UI/UX 디자인 완료",
          date: "2024-02-28",
          status: "완료",
          description: "새로운 디자인 시스템 적용 및 화면 설계 완료"
        },
        {
          name: "개발 75% 완료",
          date: "2024-03-25",
          status: "진행중",
          description: "핵심 기능 개발 및 테스트 진행 중"
        },
        {
          name: "베타 테스트",
          date: "2024-04-05",
          status: "예정",
          description: "내부 베타 테스트 및 버그 수정"
        }
      ],
      tasks: [
        {
          name: "사용자 인증 시스템 개선",
          assignee: "임수진",
          progress: 90,
          dueDate: "2024-03-30",
          priority: "높음"
        },
        {
          name: "새로운 대시보드 UI 구현",
          assignee: "오태현",
          progress: 70,
          dueDate: "2024-04-02",
          priority: "보통"
        },
        {
          name: "푸시 알림 기능 추가",
          assignee: "임수진",
          progress: 60,
          dueDate: "2024-04-05",
          priority: "보통"
        }
      ]
    },
    {
      id: 2,
      name: "고객 관리 시스템",
      team: "개발팀",
      members: 3,
      total: 8,
      progress: 45,
      startDate: "2024-02-01",
      endDate: "2024-05-30",
      manager: "김철수",
      description: "고객 정보를 체계적으로 관리할 수 있는 CRM 시스템 개발 프로젝트입니다. 영업 효율성 향상과 고객 관계 강화를 목표로 합니다.",
      status: "진행중",
      budget: "8,000만원",
      assignedMembers: [
        {
          name: "김철수",
          role: "프로젝트 매니저",
          department: "개발팀",
          allocation: 40,
          tasks: ["프로젝트 관리", "요구사항 정의"]
        },
        {
          name: "임수진",
          role: "시니어 개발자",
          department: "개발팀",
          allocation: 70,
          tasks: ["시스템 아키텍처", "백엔드 개발"]
        },
        {
          name: "윤지호",
          role: "주니어 개발자",
          department: "개발팀",
          allocation: 90,
          tasks: ["프론트엔드 개발", "데이터 시각화"]
        }
      ],
      milestones: [
        {
          name: "시스템 설계 완료",
          date: "2024-02-28",
          status: "완료",
          description: "CRM 시스템 아키텍처 및 DB 설계 완료"
        },
        {
          name: "기본 기능 개발",
          date: "2024-04-15",
          status: "진행중",
          description: "고객 등록, 조회, 수정 기능 개발 중"
        },
        {
          name: "고급 기능 개발",
          date: "2024-05-15",
          status: "예정",
          description: "보고서, 분석 기능 개발 예정"
        }
      ],
      tasks: [
        {
          name: "고객 데이터베이스 설계",
          assignee: "임수진",
          progress: 100,
          dueDate: "2024-03-15",
          priority: "높음"
        },
        {
          name: "고객 등록 화면 개발",
          assignee: "윤지호",
          progress: 80,
          dueDate: "2024-03-25",
          priority: "높음"
        },
        {
          name: "고객 검색 기능 구현",
          assignee: "윤지호",
          progress: 30,
          dueDate: "2024-04-05",
          priority: "보통"
        }
      ]
    },
    {
      id: 3,
      name: "브랜드 리뉴얼",
      team: "마케팅팀",
      members: 2,
      total: 5,
      progress: 20,
      startDate: "2024-01-10",
      endDate: "2024-06-20",
      manager: "박민수",
      description: "회사 브랜드 아이덴티티를 전면 개편하는 리브랜딩 프로젝트입니다. 새로운 브랜드 이미지 구축을 통해 시장에서의 인지도와 경쟁력을 강화하고자 합니다.",
      status: "지연",
      budget: "3,000만원",
      assignedMembers: [
        {
          name: "박민수",
          role: "마케팅 매니저",
          department: "마케팅팀",
          allocation: 60,
          tasks: ["브랜드 전략 수립", "프로젝트 관리"]
        },
        {
          name: "송미래",
          role: "마케터",
          department: "마케팅팀",
          allocation: 80,
          tasks: ["시장 조사", "브랜드 분석", "캠페인 기획"]
        }
      ],
      milestones: [
        {
          name: "브랜드 분석",
          date: "2024-02-15",
          status: "완료",
          description: "현재 브랜드 현황 분석 및 시장 조사 완료"
        },
        {
          name: "새 브랜드 컨셉 수립",
          date: "2024-04-30",
          status: "진행중",
          description: "새로운 브랜드 아이덴티티 컨셉 개발 중"
        },
        {
          name: "브랜드 가이드라인 제작",
          date: "2024-06-15",
          status: "예정",
          description: "브랜드 사용 가이드라인 문서 제작"
        }
      ],
      tasks: [
        {
          name: "경쟁사 브랜드 분석",
          assignee: "송미래",
          progress: 100,
          dueDate: "2024-02-20",
          priority: "높음"
        },
        {
          name: "브랜드 컨셉 개발",
          assignee: "박민수",
          progress: 40,
          dueDate: "2024-04-15",
          priority: "높음"
        },
        {
          name: "로고 디자인 방향성 수립",
          assignee: "송미래",
          progress: 20,
          dueDate: "2024-05-01",
          priority: "보통"
        }
      ]
    },
    {
      id: 4,
      name: "웹사이트 개편",
      team: "디자인팀",
      members: 2,
      total: 4,
      progress: 60,
      startDate: "2024-01-20",
      endDate: "2024-04-30",
      manager: "이영희",
      description: "회사 홈페이지의 전체적인 리뉴얼 프로젝트입니다. 최신 웹 기술과 반응형 디자인을 적용하여 사용자 경험을 개선하고 브랜드 이미지를 강화합니다.",
      status: "진행중",
      budget: "4,000만원",
      assignedMembers: [
        {
          name: "이영희",
          role: "디자인 팀장",
          department: "디자인팀",
          allocation: 70,
          tasks: ["프로젝트 관리", "디자인 시스템 구축"]
        },
        {
          name: "한소연",
          role: "UI/UX 디자이너",
          department: "디자인팀",
          allocation: 100,
          tasks: ["페이지 디자인", "사용자 경험 설계"]
        }
      ],
      milestones: [
        {
          name: "웹사이트 기획 완료",
          date: "2024-02-15",
          status: "완료",
          description: "사이트맵 및 와이어프레임 완료"
        },
        {
          name: "디자인 시스템 구축",
          date: "2024-03-15",
          status: "완료",
          description: "컬러, 타이포그래피, 컴포넌트 정의"
        },
        {
          name: "주요 페이지 디자인",
          date: "2024-04-10",
          status: "진행중",
          description: "메인 페이지 및 서브 페이지 디자인 진행"
        },
        {
          name: "반응형 최적화",
          date: "2024-04-25",
          status: "예정",
          description: "모바일 및 태블릿 최적화"
        }
      ],
      tasks: [
        {
          name: "메인 페이지 디자인",
          assignee: "한소연",
          progress: 90,
          dueDate: "2024-03-30",
          priority: "높음"
        },
        {
          name: "서브 페이지 디자인",
          assignee: "한소연",
          progress: 50,
          dueDate: "2024-04-15",
          priority: "보통"
        },
        {
          name: "모바일 반응형 작업",
          assignee: "이영희",
          progress: 40,
          dueDate: "2024-04-25",
          priority: "보통"
        }
      ]
    }
  ];

  const projectList = [
    { id: 1, name: "모바일 앱 리뉴얼", team: "개발팀", members: 3, total: 8, progress: 75 },
    { id: 2, name: "고객 관리 시스템", team: "개발팀", members: 3, total: 8, progress: 45 },
    { id: 3, name: "브랜드 리뉴얼", team: "마케팅팀", members: 2, total: 5, progress: 20 },
    { id: 4, name: "웹사이트 개편", team: "디자인팀", members: 2, total: 4, progress: 60 }
  ];

  const handleApprovalClick = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setIsApprovalDetailOpen(true);
  };

  const handleProjectClick = (projectId: number) => {
    const project = projectDetails.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsProjectDetailOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인": return "bg-green-100 text-green-700";
      case "대기": return "bg-orange-100 text-orange-700";
      case "진행중": return "bg-blue-100 text-blue-700";
      case "반려": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "승인": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "대기": return <Clock className="h-4 w-4 text-orange-600" />;
      case "진행중": return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "반려": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "진행중": return "bg-blue-100 text-blue-700";
      case "완료": return "bg-green-100 text-green-700";
      case "지연": return "bg-red-100 text-red-700";
      case "예정": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "완료": return "bg-green-100 text-green-700";
      case "진행중": return "bg-blue-100 text-blue-700";
      case "예정": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음": return "bg-red-100 text-red-700";
      case "보통": return "bg-yellow-100 text-yellow-700";
      case "낮음": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* 첫 번째 행: 프로젝트 투입 현황 */}
        <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <div className="w-5 h-5 bg-pastel-blue-500 rounded-full"></div>
            프로젝트 투입 현황
          </h3>
          <div className="space-y-3">
            {projectList.map((project, index) => (
              <div 
                key={index}
                className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                title={`투입 인원: ${project.members}명 / ${project.total}명`}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium group-hover:text-pastel-blue-600 transition-colors">{project.name}</h4>
                  <span className="text-sm text-muted-foreground">{project.team}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pastel-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  투입: {project.members}명 / {project.total}명
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 두 번째 행: 전자결재 목록들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 내 전자 결재 목록 */}
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-pastel-blue-500 rounded-full"></div>
              내 전자 결재 목록
            </h3>
            <div className="space-y-3">
              {approvalItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handleApprovalClick(item)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium group-hover:text-pastel-blue-600 transition-colors">{item.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.type}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 승인 필요 결재 목록 */}
          <PendingApprovalList />
        </div>
      </div>

      {/* 프로젝트 상세 팝업 */}
      <Dialog open={isProjectDetailOpen} onOpenChange={setIsProjectDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-pastel-blue-600" />
              프로젝트 투입 현황 상세
            </DialogTitle>
            <DialogDescription>
              선택된 프로젝트의 상세 투입 현황과 진행 상태를 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              {/* 프로젝트 기본 정보 */}
              <div className="p-4 bg-pastel-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
                      <Badge variant="outline" className={getProjectStatusColor(selectedProject.status)}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-white">
                        {selectedProject.team}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        {selectedProject.budget}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>시작: {selectedProject.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>완료 예정: {selectedProject.endDate}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{selectedProject.description}</p>

                {/* 진행률 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">전체 진행률</span>
                    <span className="text-sm font-medium">{selectedProject.progress}%</span>
                  </div>
                  <Progress value={selectedProject.progress} className="h-3" />
                </div>
              </div>

              <Separator />

              {/* 투입 인력 현황 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pastel-blue-600" />
                  <h4 className="font-medium">투입 인력 현황</h4>
                  <Badge variant="outline">
                    {selectedProject.members}명 / {selectedProject.total}명 투입
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.assignedMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-pastel-blue-200 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{member.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {member.allocation}% 투입
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {member.department} · {member.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.tasks.join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 마일스톤 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-pastel-blue-600" />
                  <h4 className="font-medium">마일스톤</h4>
                </div>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white border border-pastel-blue-200 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-pastel-blue-100 text-pastel-blue-700 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{milestone.name}</span>
                          <Badge variant="outline" className={getMilestoneStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{milestone.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{milestone.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 세부 업무 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-pastel-blue-600" />
                  <h4 className="font-medium">세부 업무 현황</h4>
                </div>
                <div className="space-y-3">
                  {selectedProject.tasks.map((task, index) => (
                    <div key={index} className="p-3 bg-white border border-pastel-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{task.name}</span>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">진행률</span>
                          <span className="text-sm font-medium">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>마감일: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 내 전자결재 상세보기 팝업 */}
      <Dialog open={isApprovalDetailOpen} onOpenChange={setIsApprovalDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-pastel-blue-600" />
              전자결재 상세 내용
            </DialogTitle>
            <DialogDescription>
              선택된 전자결재 문서의 상세 내용을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-6">
              {/* 문서 헤더 */}
              <div className="p-4 bg-pastel-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {selectedApproval.title}
                      </h3>
                      <Badge variant="outline" className={getStatusColor(selectedApproval.status)}>
                        {selectedApproval.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      신청자: {selectedApproval.requester.name} ({selectedApproval.requester.position})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      신청일: {selectedApproval.requestDate}
                    </span>
                  </div>
                  {selectedApproval.amount && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        금액: {selectedApproval.amount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* 문서 내용 */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-pastel-blue-600" />
                  신청 내용
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-normal">
                    {selectedApproval.content}
                  </pre>
                </div>
              </div>

              {/* 첨부파일 */}
              {selectedApproval.attachments && selectedApproval.attachments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Download className="h-4 w-4 text-pastel-blue-600" />
                    첨부파일
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApproval.attachments.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {file}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* 결재선 */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-pastel-blue-600" />
                  결재선
                </h4>
                <div className="space-y-3">
                  {selectedApproval.approvalLine.map((approver, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white border border-pastel-blue-200 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-pastel-blue-100 text-pastel-blue-700 rounded-full text-sm font-medium">
                        {approver.order}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{approver.name} {approver.position}</span>
                          <span className="text-sm text-muted-foreground">({approver.department})</span>
                          <Badge variant="outline" className={getStatusColor(approver.status)}>
                            {approver.status}
                          </Badge>
                        </div>
                        {approver.approvedAt && (
                          <div className="text-xs text-muted-foreground mb-1">
                            결재일시: {approver.approvedAt}
                          </div>
                        )}
                        {approver.comment && (
                          <div className="text-sm text-muted-foreground">
                            의견: {approver.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}