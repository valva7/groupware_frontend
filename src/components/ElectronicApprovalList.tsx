import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  FileCheck,
  Search,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Building2,
  Filter,
  Users,
  DollarSign,
  ShoppingCart,
  Briefcase,
  ChevronRight,
  FileText,
} from "lucide-react";

interface ElectronicApprovalListProps {
  onCreateApproval?: (formType: string) => void;
}

// 전자결재 카테고리 및 종류 정의
const approvalCategories = [
  {
    id: "hr",
    name: "인사/휴가",
    icon: <Users className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    forms: [
      {
        id: "annual-leave",
        name: "연차 휴가 신청",
        description: "연차, 개인 휴가 신청",
      },
      {
        id: "sick-leave",
        name: "병가 신청",
        description: "병가, 간병휴가 신청",
      },
      {
        id: "maternity-leave",
        name: "육아휴직 신청",
        description: "출산휴가, 육아휴직 신청",
      },
      {
        id: "special-leave",
        name: "경조휴가 신청",
        description: "결혼, 장례 등 경조사 휴가",
      },
      {
        id: "substitute-leave",
        name: "대체 휴가 신청",
        description: "휴일 근무에 대한 대체 휴가",
      },
    ],
  },
  {
    id: "expense",
    name: "경비/정산",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
    forms: [
      {
        id: "expense-report",
        name: "출장비 정산",
        description: "교통비, 숙박비, 식비 정산",
      },
      {
        id: "corporate-card",
        name: "법인카드 사용 신청",
        description: "법인카드 사용 승인 요청",
      },
      {
        id: "entertainment",
        name: "접대비 신청",
        description: "고객 접대, 회식비 신청",
      },
      {
        id: "education-expense",
        name: "교육비 신청",
        description: "외부 교육, 세미나 참가비",
      },
    ],
  },
  {
    id: "purchase",
    name: "구매/계약",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    forms: [
      {
        id: "purchase-request",
        name: "구매 요청",
        description: "사무용품, 장비 구매 요청",
      },
      {
        id: "service-contract",
        name: "서비스 계약",
        description: "외부 서비스 계약 승인",
      },
      {
        id: "maintenance-contract",
        name: "유지보수 계약",
        description: "장비, 시설 유지보수 계약",
      },
      {
        id: "software-license",
        name: "소프트웨어 라이선스",
        description: "소프트웨어 구매 및 갱신",
      },
    ],
  },
  {
    id: "project",
    name: "업무/프로젝트",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    forms: [
      {
        id: "project-approval",
        name: "프로젝트 승인",
        description: "신규 프로젝트 승인 요청",
      },
      {
        id: "budget-request",
        name: "예산 신청",
        description: "부서별, 프로젝트별 예산",
      },
      {
        id: "work-report",
        name: "업무 보고",
        description: "프로젝트 진행 상황 보고",
      },
      {
        id: "proposal-approval",
        name: "기획서 승인",
        description: "사업 기획서, 제안서 승인",
      },
    ],
  },
];

// 전자결재 목록 데이터
const approvalData = [
  {
    id: 1,
    title: "출장비 정산 신청",
    type: "경비 정산",
    requester: "김철수",
    department: "영업팀",
    requestDate: "2024-03-22",
    status: "승인 완료",
    amount: "450,000원",
    description: "서울-부산 출장 관련 교통비 및 숙박비 정산",
    approver: "박팀장",
    approvalDate: "2024-03-23",
    content: `
출장 목적: 고객사 미팅 및 계약 체결
출장 기간: 2024년 3월 15일 ~ 2024년 3월 17일 (2박 3일)
출장 장소: 부산광역시

[상세 내역]
1. 교통비
   - KTX 서울→부산: 59,800원
   - KTX 부산→서울: 59,800원
   - 시내 택시비: 45,000원
   - 소계: 164,600원

2. 숙박비
   - 호텔 숙박 (2박): 180,000원
   - 소계: 180,000원

3. 식비
   - 3월 15일 저녁: 35,000원
   - 3월 16일 중식: 15,000원
   - 3월 16일 저녁: 45,000원
   - 3월 17일 중식: 12,000원
   - 소계: 107,000원

총 금액: 451,600원
    `,
    attachments: [
      "영수증_교통비.pdf",
      "영수증_숙박비.pdf",
      "영수증_식비.pdf",
    ],
  },
  {
    id: 2,
    title: "연차 휴가 신청",
    type: "휴가",
    requester: "이영희",
    department: "개발팀",
    requestDate: "2024-03-21",
    status: "대기중",
    amount: "",
    description: "가족 여행을 위한 연차 휴가 신청 (3일)",
    approver: "최팀장",
    approvalDate: "",
    content: `
휴가 종류: 연차 휴가
휴가 기간: 2024년 4월 1일 ~ 2024년 4월 3일 (3일간)
휴가 사유: 가족 여행

[세부 사항]
- 휴가 기간 중 업무 인수인계: 박개발자에게 완료
- 긴급 연락 가능 시간: 오전 9시 ~ 오후 6시
- 복귀 예정일: 2024년 4월 4일 (목)

현재 연차 잔여일수: 12일
신청 연차 일수: 3일
신청 후 잔여일수: 9일

업무 공백 최소화를 위해 모든 진행 중인 프로젝트의 중간 점검을 완료했으며,
필요시 원격으로 지원 가능합니다.
    `,
    attachments: ["업무인수인계서.docx"],
  },
  {
    id: 3,
    title: "신규 장비 구매 요청",
    type: "구매",
    requester: "박민수",
    department: "기획팀",
    requestDate: "2024-03-20",
    status: "반려",
    amount: "2,500,000원",
    description: "업무용 노트북 및 모니터 구매 요청",
    approver: "김이사",
    approvalDate: "2024-03-21",
    content: `
구매 목적: 기존 장비 노후화로 인한 업무 효율성 저하 해결
구매 요청 사유: 현재 사용 중인 노트북(2019년 구매)의 성능 한계 및 잦은 오류 발생

[구매 항목 상세]
1. 노트북
   - 모델: MacBook Pro 14" M3
   - 사양: 8GB RAM, 512GB SSD
   - 가격: 2,390,000원
   - 수량: 1대

2. 외장 모니터
   - 모델: LG 27인치 4K 모니터
   - 사양: 27UP850-W
   - 가격: 450,000원
   - 수량: 1대

총 구매 금액: 2,840,000원

[반려 사유]
예산 초과로 인한 반려. 내년도 예산 편성 시 재검토 요청.
    `,
    attachments: ["견적서.pdf", "기존장비상태보고서.docx"],
  },
  {
    id: 4,
    title: "교육 참가 신청",
    type: "교육",
    requester: "정한솔",
    department: "마케팅팀",
    requestDate: "2024-03-19",
    status: "승인 완료",
    amount: "300,000원",
    description: "디지털 마케팅 전문 과정 교육 참가",
    approver: "이부장",
    approvalDate: "2024-03-20",
    content: `
교육 과정명: 디지털 마케팅 전문가 양성 과정
교육 기관: 한국디지털마케팅협회
교육 기간: 2024년 4월 8일 ~ 2024년 4월 12일 (5일간)
교육 시간: 오전 9시 ~ 오후 6시

[교육 내용]
1일차: 디지털 마케팅 개론 및 트렌드 분석
2일차: SEO 및 SEM 전략 수립
3일차: 소셜미디어 마케팅 실무
4일차: 데이터 분석 및 성과 측정
5일차: 통합 마케팅 전략 수립 및 발표

[교육비 내역]
- 수강료: 250,000원
- 교재비: 30,000원
- 교통비: 20,000원
- 총액: 300,000원

[기대 효과]
- 최신 디지털 마케팅 트렌드 습득
- 데이터 기반 마케팅 전략 수립 능력 향상
- ROI 측정 및 분석 역량 강화

교육 완료 후 팀 내 지식 공유 세션을 통해 학습 내용을 전파할 예정입니다.
    `,
    attachments: ["교육과정안내서.pdf", "교육기관정보.pdf"],
  },
  {
    id: 5,
    title: "야근 수당 신청",
    type: "급여",
    requester: "최윤정",
    department: "개발팀",
    requestDate: "2024-03-18",
    status: "대기중",
    amount: "120,000원",
    description: "프로젝트 마감을 위한 야근 수당 신청",
    approver: "최팀장",
    approvalDate: "",
    content: `
야근 사유: 고객사 프로젝트 마감 대응
야근 기간: 2024년 3월 11일 ~ 2024년 3월 15일

[야근 상세 내역]
- 3월 11일 (월): 18:00 ~ 22:00 (4시간)
- 3월 12일 (화): 18:00 ~ 23:00 (5시간)  
- 3월 13일 (수): 18:00 ~ 21:00 (3시간)
- 3월 14일 (목): 18:00 ~ 24:00 (6시간)
- 3월 15일 (금): 18:00 ~ 22:00 (4시간)

총 야근 시간: 22시간
시간당 야근 수당: 15,000원
총 야근 수당: 330,000원

[업무 내용]
- 고객 요구사항에 따른 추가 기능 개발
- 버그 수정 및 성능 최적화
- 사용자 테스트 대응 및 피드백 반영
- 배포 준비 및 문서 작성

모든 야근은 팀장 승인 하에 진행되었으며, 관련 증빙 자료를 첨부합니다.
    `,
    attachments: ["야근승인서.pdf", "업무일지.xlsx"],
  },
];

// 참조 결재 문서 데이터
const referenceApprovalData = [
  {
    id: 6,
    title: "신입사원 채용 계획서",
    type: "인사",
    requester: "김인사",
    department: "인사팀",
    requestDate: "2024-03-15",
    status: "승인 완료",
    amount: "",
    description: "2024년 상반기 신입사원 채용 계획",
    approver: "이상무",
    approvalDate: "2024-03-18",
    content: `
2024년 상반기 신입사원 채용 계획

[채용 개요]
- 채용 규모: 총 15명
- 채용 분야: 개발팀 8명, 마케팅팀 4명, 영업팀 3명
- 채용 기간: 2024년 4월 ~ 2024년 6월

[부서별 채용 계획]
1. 개발팀 (8명)
   - 프론트엔드 개발자: 3명
   - 백엔드 개발자: 3명  
   - 모바일 개발자: 2명

2. 마케팅팀 (4명)
   - 디지털 마케터: 2명
   - 컨텐츠 기획자: 1명
   - 데이터 분석가: 1명

3. 영업팀 (3명)
   - 기업영업: 2명  
   - 해외영업: 1명

[채용 일정]
- 공고 게시: 2024년 4월 1일
- 서류 접수: 2024년 4월 1일 ~ 4월 15일
- 1차 면접: 2024년 4월 22일 ~ 4월 26일
- 2차 면접: 2024년 5월 7일 ~ 5월 10일
- 최종 합격자 발표: 2024년 5월 15일
- 입문 교육: 2024년 6월 3일 ~ 6월 14일

참조자로 지정되어 관련 정보를 공유드립니다.
    `,
    attachments: ["채용계획서.pdf", "예산계획서.xlsx"],
    isReference: true,
  },
  {
    id: 7,
    title: "사무실 이전 계획",
    type: "시설",
    requester: "박총무",
    department: "총무팀",
    requestDate: "2024-03-10",
    status: "진행중",
    amount: "50,000,000원",
    description: "본사 사무실 이전 관련 계획서",
    approver: "최사장",
    approvalDate: "",
    content: `
본사 사무실 이전 계획

[이전 개요]
- 이전 사유: 임대료 절감 및 업무환경 개선
- 이전 예정지: 강남구 테헤란로 신규 건물
- 이전 예정일: 2024년 7월 1일
- 소요 예산: 5천만원

[이전 세부 사항]
1. 신규 사무실 정보
   - 위치: 강남구 테헤란로 123
   - 면적: 500평 (기존 300평 → 200평 확장)
   - 임대료: 월 2,500만원 (기존 3,000만원)

2. 이전 일정
   - 계약 체결: 2024년 4월 30일
   - 인테리어 공사: 2024년 5월 1일 ~ 6월 15일
   - 이사 작업: 2024년 6월 29일 ~ 7월 1일
   - 업무 재개: 2024년 7월 2일

3. 소요 비용
   - 보증금: 1억원
   - 인테리어: 3,000만원
   - 이사비용: 1,000만원
   - 기타비용: 1,000만원

각 팀장님들께 참조로 공유드립니다.
    `,
    attachments: ["이전계획서.pdf", "건물정보.pdf", "견적서.xlsx"],
    isReference: true,
  },
  {
    id: 8,
    title: "2024년 회사 워크샵 계획",
    type: "행사",
    requester: "정기획",
    department: "기획팀",
    requestDate: "2024-03-12",
    status: "승인 완료",
    amount: "15,000,000원",
    description: "전 직원 대상 연례 워크샵 계획",
    approver: "김상무",
    approvalDate: "2024-03-14",
    content: `
2024년 전 직원 워크샵 계획

[워크샵 개요]
- 일정: 2024년 6월 14일(금) ~ 15일(토) 1박 2일
- 장소: 제주도 신화월드 리조트
- 참가 인원: 전 직원 80명
- 총 예산: 1,500만원

[프로그램 일정]
첫째 날 (6월 14일)
- 09:00 김포공항 집합
- 11:00 제주도 도착, 리조트 체크인
- 13:00 점심식사 및 휴식
- 15:00 팀빌딩 액티비티
- 18:00 BBQ 저녁 파티
- 21:00 자유시간

둘째 날 (6월 15일)  
- 08:00 조식
- 10:00 제주도 관광 (성산일출봉)
- 12:00 점심식사
- 14:00 공항 이동
- 16:00 서울 도착

[소요 예산]
- 항공료: 600만원 (80명 × 75,000원)
- 숙박비: 400만원 (40실 × 100,000원)  
- 식비: 400만원
- 프로그램비: 100만원

모든 팀장님들께 참조로 공유하여 일정 조율 부탁드립니다.
    `,
    attachments: ["워크샵계획서.pdf", "리조트정보.pdf"],
    isReference: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "승인 완료":
      return "bg-green-100 text-green-700";
    case "대기중":
      return "bg-yellow-100 text-yellow-700";
    case "반려":
      return "bg-red-100 text-red-700";
    case "진행중":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "승인 완료":
      return <CheckCircle className="h-4 w-4" />;
    case "대기중":
      return <Clock className="h-4 w-4" />;
    case "반려":
      return <XCircle className="h-4 w-4" />;
    case "진행중":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "경비 정산": "bg-blue-100 text-blue-700",
    휴가: "bg-purple-100 text-purple-700",
    구매: "bg-orange-100 text-orange-700",
    교육: "bg-green-100 text-green-700",
    급여: "bg-indigo-100 text-indigo-700",
    인사: "bg-cyan-100 text-cyan-700",
    시설: "bg-amber-100 text-amber-700",
    행사: "bg-pink-100 text-pink-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

const getAuthorInitials = (name: string) => {
  return name.length >= 2 ? name.slice(-2) : name;
};

export function ElectronicApprovalList({
  onCreateApproval,
}: ElectronicApprovalListProps) {
  const [selectedApproval, setSelectedApproval] = useState<
    (typeof approvalData | typeof referenceApprovalData)[0] | null
  >(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showApprovalTypes, setShowApprovalTypes] =
    useState(false);

  // 현재 탭에 따라 사용할 데이터 결정
  const currentData = statusFilter === "참조" ? referenceApprovalData : approvalData;

  const filteredData = currentData.filter((item) => {
    const matchesSearch =
      item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.requester
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.department
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || statusFilter === "참조" || item.status === statusFilter;
    const matchesType =
      typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDetailClick = (
    approval: (typeof approvalData | typeof referenceApprovalData)[0],
  ) => {
    setSelectedApproval(approval);
    setIsDetailDialogOpen(true);
  };

  const handleCreateApproval = (formType: string) => {
    if (onCreateApproval) {
      onCreateApproval(formType);
    }
  };

  const statusCounts = {
    all: approvalData.length,
    대기중: approvalData.filter(
      (item) => item.status === "대기중",
    ).length,
    "승인 완료": approvalData.filter(
      (item) => item.status === "승인 완료",
    ).length,
    반려: approvalData.filter((item) => item.status === "반려")
      .length,
    참조: referenceApprovalData.length,
  };

  if (showApprovalTypes) {
    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApprovalTypes(false)}
              aria-label="목록으로 돌아가기"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                전자결재 양식 선택
              </h1>
              <p className="text-muted-foreground">
                작성하실 전자결재 양식을 선택해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 카테고리별 양식 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {approvalCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-gradient-to-br from-pastel-blue-50 to-white border-pastel-blue-200"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {category.forms.map((form) => (
                        <div
                          key={form.id}
                          className="p-3 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group flex-shrink-0"
                          onClick={() =>
                            handleCreateApproval(form.id)
                          }
                        >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium group-hover:text-pastel-blue-600 transition-colors">
                            {form.name}
                          </h4>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-pastel-blue-600 transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {form.description}
                        </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              기안함
            </h1>
            <p className="text-muted-foreground">
              전자결재 문서와 참조 문서를 조회하고 관리할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <Card className="bg-gradient-to-br from-pastel-blue-50 to-white border-pastel-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="제목, 신청자, 부서로 검색..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-10 bg-white border-pastel-blue-200"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-40 bg-white border-pastel-blue-200">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      전체 상태
                    </SelectItem>
                    <SelectItem value="대기중">
                      대기중
                    </SelectItem>
                    <SelectItem value="승인 완료">
                      승인 완료
                    </SelectItem>
                    <SelectItem value="반려">반려</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-40 bg-white border-pastel-blue-200">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      전체 유형
                    </SelectItem>
                    <SelectItem value="경비 정산">
                      경비 정산
                    </SelectItem>
                    <SelectItem value="휴가">휴가</SelectItem>
                    <SelectItem value="구매">구매</SelectItem>
                    <SelectItem value="교육">교육</SelectItem>
                    <SelectItem value="급여">급여</SelectItem>
                    <SelectItem value="인사">인사</SelectItem>
                    <SelectItem value="시설">시설</SelectItem>
                    <SelectItem value="행사">행사</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상태별 탭 */}
        <Tabs
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 bg-pastel-blue-100">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-pastel-blue-500 data-[state=active]:text-white"
            >
              전체 ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger
              value="대기중"
              className="data-[state=active]:bg-pastel-blue-500 data-[state=active]:text-white"
            >
              대기중 ({statusCounts["대기중"]})
            </TabsTrigger>
            <TabsTrigger
              value="승인 완료"
              className="data-[state=active]:bg-pastel-blue-500 data-[state=active]:text-white"
            >
              승인완료 ({statusCounts["승인 완료"]})
            </TabsTrigger>
            <TabsTrigger
              value="반려"
              className="data-[state=active]:bg-pastel-blue-500 data-[state=active]:text-white"
            >
              반려 ({statusCounts["반려"]})
            </TabsTrigger>
            <TabsTrigger
              value="참조"
              className="data-[state=active]:bg-pastel-blue-500 data-[state=active]:text-white"
            >
              참조 ({statusCounts["참조"]})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            <Card className="bg-gradient-to-br from-pastel-blue-50 to-white border-pastel-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {statusFilter === "참조" ? (
                    <FileText className="h-5 w-5 text-pastel-blue-600" />
                  ) : (
                    <FileCheck className="h-5 w-5 text-pastel-blue-600" />
                  )}
                  {statusFilter === "참조" ? "참조 문서 목록" : "결재 문서 목록"}
                  <Badge variant="outline" className="ml-2">
                    {filteredData.length}건
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredData.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white rounded-lg border border-pastel-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleDetailClick(item)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">
                                {item.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={getTypeColor(
                                  item.type,
                                )}
                              >
                                {item.type}
                              </Badge>
                              {(item as any)?.isReference && (
                                <Badge
                                  variant="outline"
                                  className="bg-orange-100 text-orange-700 border-orange-200"
                                >
                                  참조
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {item.description}
                            </p>
                            {item.amount && (
                              <p className="text-sm font-medium text-pastel-blue-600">
                                {item.amount}
                              </p>
                            )}
                          </div>
                          <Badge
                            className={`${getStatusColor(item.status)} border-0`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              {item.status}
                            </div>
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-pastel-blue-100 text-pastel-blue-700">
                                  {getAuthorInitials(
                                    item.requester,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {item.requester}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {item.department}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.requestDate}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredData.length === 0 && (
                      <div className="text-center py-12">
                        {statusFilter === "참조" ? (
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        ) : (
                          <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        )}
                        <h3 className="font-medium text-muted-foreground mb-2">
                          {statusFilter === "참조" ? "참조 문서가 없습니다" : "결재 문서가 없습니다"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {statusFilter === "참조" 
                            ? "참조로 지정된 문서가 없습니다."
                            : "검색 조건을 변경하거나 새로운 결재를 요청해보세요."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 상세보기 팝업 */}
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {(selectedApproval as any)?.isReference ? (
                <FileText className="h-5 w-5 text-pastel-blue-600" />
              ) : (
                <FileCheck className="h-5 w-5 text-pastel-blue-600" />
              )}
              {(selectedApproval as any)?.isReference ? "참조 문서 상세 내용" : "전자결재 상세 내용"}
            </DialogTitle>
            <DialogDescription>
              {(selectedApproval as any)?.isReference 
                ? "참조로 지정된 문서의 상세 내용을 확인할 수 있습니다."
                : "선택된 전자결재 문서의 상세 내용을 확인할 수 있습니다."
              }
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
                      <Badge
                        variant="outline"
                        className={getTypeColor(
                          selectedApproval.type,
                        )}
                      >
                        {selectedApproval.type}
                      </Badge>
                      {(selectedApproval as any)?.isReference && (
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-700 border-orange-200"
                        >
                          참조 문서
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedApproval.description}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(selectedApproval.status)} border-0`}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedApproval.status)}
                      {selectedApproval.status}
                    </div>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      신청자: {selectedApproval.requester}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      부서: {selectedApproval.department}
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

                {selectedApproval.approver && (
                  <div className="mt-3 pt-3 border-t border-pastel-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          결재자: {selectedApproval.approver}
                        </span>
                      </div>
                      {selectedApproval.approvalDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            결재일:{" "}
                            {selectedApproval.approvalDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 문서 내용 */}
              <div className="space-y-4">
                <h4 className="font-medium">문서 내용</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedApproval.content}
                  </pre>
                </div>
              </div>

              {/* 첨부파일 */}
              {selectedApproval.attachments && selectedApproval.attachments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">첨부파일</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedApproval.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}