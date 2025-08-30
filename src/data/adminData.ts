export const approvers = [
  { id: "emp001", name: "김개발", position: "개발팀장", department: "개발팀" },
  { id: "emp002", name: "박디자인", position: "디자인팀장", department: "디자인팀" },
  { id: "emp003", name: "이마케팅", position: "마케팅팀장", department: "마케팅팀" },
  { id: "emp004", name: "최영업", position: "영업팀장", department: "영업팀" },
  { id: "emp005", name: "정관리", position: "관리팀장", department: "관리팀" },
  { id: "emp006", name: "한재무", position: "재무팀장", department: "재무팀" },
  { id: "ceo001", name: "최대표", position: "대표이사", department: "경영진" },
  { id: "cto001", name: "김CTO", position: "기술이사", department: "경영진" }
];

export interface ApprovalStep {
  id: string;
  order: number;
  approverId: string;
  approverName: string;
  approverPosition: string;
  department: string;
  approvalType: "승인" | "합의" | "참조";
  isRequired: boolean;
}

export interface ApprovalLine {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  steps: ApprovalStep[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const initialApprovalLines: ApprovalLine[] = [
  {
    id: "line001",
    name: "일반 휴가 승인라인",
    code: "VACATION_GENERAL",
    description: "일반 연차/월차 휴가 신청을 위한 기본 승인라인",
    category: "휴가",
    steps: [
      {
        id: "step001",
        order: 1,
        approverId: "emp001",
        approverName: "김개발",
        approverPosition: "개발팀장",
        department: "개발팀",
        approvalType: "승인",
        isRequired: true
      },
      {
        id: "step002",
        order: 2,
        approverId: "emp005",
        approverName: "정관리",
        approverPosition: "관리팀장",
        department: "관리팀",
        approvalType: "승인",
        isRequired: true
      }
    ],
    isActive: true,
    usageCount: 25,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15",
    createdBy: "관리자"
  },
  {
    id: "line002",
    name: "출장비 정산 승인라인",
    code: "EXPENSE_BUSINESS_TRIP",
    description: "출장비 및 경비 정산을 위한 승인라인",
    category: "경비정산",
    steps: [
      {
        id: "step003",
        order: 1,
        approverId: "emp001",
        approverName: "김개발",
        approverPosition: "개발팀장",
        department: "개발팀",
        approvalType: "승인",
        isRequired: true
      },
      {
        id: "step004",
        order: 2,
        approverId: "emp006",
        approverName: "한재무",
        approverPosition: "재무팀장",
        department: "재무팀",
        approvalType: "승인",
        isRequired: true
      }
    ],
    isActive: true,
    usageCount: 18,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",
    createdBy: "관리자"
  },
  {
    id: "line003",
    name: "고액 구매 승인라인",
    code: "PURCHASE_HIGH_VALUE",
    description: "100만원 이상 고액 구매를 위한 다단계 승인라인",
    category: "구매",
    steps: [
      {
        id: "step006",
        order: 1,
        approverId: "emp001",
        approverName: "김개발",
        approverPosition: "개발팀장",
        department: "개발팀",
        approvalType: "승인",
        isRequired: true
      },
      {
        id: "step007",
        order: 2,
        approverId: "emp006",
        approverName: "한재무",
        approverPosition: "재무팀장",
        department: "재무팀",
        approvalType: "합의",
        isRequired: true
      },
      {
        id: "step008",
        order: 3,
        approverId: "cto001",
        approverName: "김CTO",
        approverPosition: "기술이사",
        department: "경영진",
        approvalType: "승인",
        isRequired: true
      }
    ],
    isActive: true,
    usageCount: 7,
    createdAt: "2024-02-01",
    updatedAt: "2024-04-01",
    createdBy: "관리자"
  }
];

export const approvalCategories = ["전체", "휴가", "경비정산", "구매", "업무보고", "인사", "기타"];
export const approvalTypes = [
  { value: "승인", label: "승인", description: "해당 단계에서 승인/반려 결정" },
  { value: "합의", label: "합의", description: "관련 부서와 협의 필요" },
  { value: "참조", label: "참조", description: "참고용으로 전달 (결정권 없음)" }
];