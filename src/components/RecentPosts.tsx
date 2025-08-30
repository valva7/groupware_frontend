import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { FileText, MessageCircle, Eye, Clock, User, Calendar } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const recentPosts = [
  {
    id: 1,
    title: "4월 정기 회의 안건 공지",
    category: "공지사항",
    author: "관리자",
    createdAt: "2024-03-22",
    views: 45,
    comments: 3,
    isNew: true,
    content: `
안녕하세요. 관리자입니다.

4월 정기 회의를 다음과 같이 안내드립니다.

**회의 일정**
- 일시: 2024년 4월 5일 (금) 오후 2시
- 장소: 대회의실 (3층)
- 참석 대상: 전 직원

**주요 안건**
1. 1분기 성과 보고
2. 2분기 사업 계획 발표
3. 신규 프로젝트 소개
4. 인사 발령 공지
5. 복리후생 제도 개선 안내

**준비사항**
- 각 팀별 1분기 실적 보고서 준비
- 개인별 목표 달성률 점검

많은 참석 부탁드립니다.

감사합니다.
    `,
    attachments: ["회의자료.pdf", "안건리스트.xlsx"]
  },
  {
    id: 2,
    title: "신입사원 환영회 참석 여부 조사",
    category: "인사",
    author: "김철수",
    createdAt: "2024-03-21",
    views: 23,
    comments: 7,
    isNew: true,
    content: `
안녕하세요. 인사팀 김철수입니다.

다음 주에 입사하는 신입사원들을 위한 환영회를 개최하고자 합니다.

**환영회 정보**
- 일시: 2024년 3월 29일 (금) 오후 6시
- 장소: 강남구 맛집 '행복한 저녁'
- 예상 참석 인원: 신입사원 5명 + 기존 직원

**참석 여부 조사**
3월 25일 (월)까지 댓글로 참석 여부를 남겨주세요.
- 참석: O
- 불참석: X (사유 간단히 기재)

**비용**
- 회사 지원으로 진행됩니다.
- 개인 부담 없음

신입사원들이 빠르게 적응할 수 있도록 많은 참석 부탁드립니다!

감사합니다.
    `,
    attachments: ["환영회안내.pdf"]
  },
  {
    id: 3,
    title: "프로젝트 A 중간 보고서 제출",
    category: "프로젝트",
    author: "이영희",
    createdAt: "2024-03-20",
    views: 67,
    comments: 12,
    isNew: false,
    content: `
프로젝트 A 팀원들에게 알려드립니다.

**중간 보고서 제출 안내**

프로젝트 진행 상황 점검을 위한 중간 보고서를 제출해주시기 바랍니다.

**제출 기한**
- 2024년 3월 27일 (수) 오후 5시까지

**제출 방법**
- 이메일 제출: project-a@company.com
- 파일명 형식: [팀명]_중간보고서_0327

**보고서 포함 내용**
1. 현재까지 진행 상황 (%)
2. 주요 성과 및 결과물
3. 발생한 이슈 및 해결 방안
4. 향후 일정 및 계획
5. 추가 지원이 필요한 사항

**양식**
첨부된 양식을 활용해주세요.

기한 내 제출 부탁드리며, 질문사항은 언제든 연락주세요.
    `,
    attachments: ["중간보고서양식.docx", "프로젝트일정.xlsx"]
  },
  {
    id: 4,
    title: "사무용품 신청 방법 안내",
    category: "공지사항",
    author: "관리자",
    createdAt: "2024-03-19",
    views: 89,
    comments: 5,
    isNew: false,
    content: `
사무용품 신청 방법이 변경되었습니다.

**변경사항**
기존: 이메일 신청 → 변경: 온라인 시스템 신청

**신청 방법**
1. 사내 포털 접속
2. '사무용품 신청' 메뉴 클릭
3. 필요한 용품 선택 및 수량 입력
4. 신청 사유 작성
5. 부서장 승인 대기

**처리 절차**
- 신청 → 부서장 승인 → 총무팀 검토 → 발주 → 배송

**주의사항**
- 월 1회 일괄 발주 (매월 마지막 주 금요일)
- 긴급한 경우 총무팀에 별도 연락
- 개인 용품은 신청 불가

궁금한 점은 총무팀으로 연락주세요.
    `,
    attachments: ["사무용품목록.pdf"]
  },
  {
    id: 5,
    title: "3월 생일자 축하 이벤트",
    category: "복지",
    author: "박민수",
    createdAt: "2024-03-18",
    views: 34,
    comments: 15,
    isNew: false,
    content: `
3월 생일을 맞으신 직원분들을 축하합니다! 🎉

**3월 생일자**
- 김영수 대리 (3월 5일)
- 이미경 과장 (3월 12일) 
- 정한솔 사원 (3월 23일)
- 최윤정 주임 (3월 28일)

**축하 이벤트**
- 일시: 3월 22일 (금) 오후 3시
- 장소: 1층 라운지
- 내용: 케이크 컷팅 및 축하 메시지

**준비물**
- 케이크는 복리후생팀에서 준비
- 축하 메시지는 개인적으로 준비해주세요

생일자분들과 함께 즐거운 시간을 보내요!
모든 직원분들의 참석을 기다립니다.

생일 축하드립니다! 🎂✨
    `,
    attachments: []
  },
  {
    id: 6,
    title: "보안 점검 일정 안내",
    category: "시스템",
    author: "관리자",
    createdAt: "2024-03-17",
    views: 56,
    comments: 2,
    isNew: false,
    content: `
정기 보안 점검을 실시합니다.

**점검 일정**
- 일시: 2024년 3월 24일 (일) 오전 2시 ~ 오전 6시
- 소요 시간: 약 4시간

**점검 범위**
- 사내 네트워크 보안 시스템
- 방화벽 및 침입 탐지 시스템
- 백업 시스템 무결성 확인
- 보안 패치 적용

**영향 사항**
- 사내 시스템 일시 접속 불가
- 이메일 서비스 일시 중단
- 사내 포털 이용 제한

**주의사항**
- 점검 전 중요 작업은 미리 완료
- 점검 시간 중 원격 접속 불가
- 긴급상황 시 보안팀 연락처: 02-123-4567

안전한 IT 환경 구축을 위한 필수 점검이니 양해 부탁드립니다.
    `,
    attachments: ["보안점검안내.pdf"]
  },
  {
    id: 7,
    title: "팀별 성과 발표 일정",
    category: "인사",
    author: "최지영",
    createdAt: "2024-03-16",
    views: 78,
    comments: 9,
    isNew: false,
    content: `
1분기 팀별 성과 발표 일정을 안내드립니다.

**발표 일정**
- 3월 30일 (토) 오전 9시 ~ 오후 12시
- 장소: 대회의실

**발표 순서**
1. 개발팀 (9:00 - 9:30)
2. 디자인팀 (9:30 - 10:00)
3. 마케팅팀 (10:00 - 10:30)
4. 휴식 (10:30 - 10:45)
5. 영업팀 (10:45 - 11:15)
6. 기획팀 (11:15 - 11:45)
7. 총평 및 시상 (11:45 - 12:00)

**발표 내용**
- 1분기 주요 성과
- 목표 달성률
- 우수 사례 공유
- 2분기 계획

**준비사항**
- 발표 자료 (PPT) 15-20장
- 발표 시간 20분 + 질의응답 10분

우수팀에게는 인센티브가 지급됩니다.
각 팀의 열정적인 발표를 기대합니다!
    `,
    attachments: ["발표가이드.pdf", "평가기준.xlsx"]
  },
  {
    id: 8,
    title: "교육 프로그램 신청 접수",
    category: "교육",
    author: "관리자",
    createdAt: "2024-03-15",
    views: 42,
    comments: 6,
    isNew: false,
    content: `
2024년 상반기 교육 프로그램 신청을 받습니다.

**교육 과정**

1. **리더십 과정**
   - 대상: 팀장급 이상
   - 기간: 4월 8일 ~ 4월 12일 (5일)
   - 내용: 조직 관리, 의사소통, 갈등 해결

2. **디지털 역량 강화**
   - 대상: 전 직원
   - 기간: 4월 15일 ~ 4월 19일 (5일)
   - 내용: AI 활용, 디지털 마케팅, 데이터 분석

3. **신입사원 온보딩**
   - 대상: 입사 6개월 이내
   - 기간: 4월 22일 ~ 4월 26일 (5일)
   - 내용: 회사 문화, 업무 프로세스, 커뮤니케이션

**신청 방법**
- 신청 기간: 3월 15일 ~ 3월 29일
- 신청 방법: 인사팀 이메일 접수
- 선착순 마감 (과정별 20명 한정)

**지원 사항**
- 교육비 100% 회사 지원
- 교육 기간 중 출장 인정
- 수료증 발급

성장의 기회를 놓치지 마세요!
    `,
    attachments: ["교육과정상세.pdf", "신청서양식.docx"]
  },
  {
    id: 9,
    title: "점심 메뉴 개선 제안",
    category: "복지",
    author: "정민호",
    createdAt: "2024-03-14",
    views: 91,
    comments: 23,
    isNew: false,
    content: `
구내식당 점심 메뉴 개선을 위한 의견을 수렴합니다.

**현재 상황**
- 메뉴의 다양성 부족
- 직원 만족도 하락
- 건강한 식단에 대한 요구 증가

**개선 제안**
1. **메뉴 다양화**
   - 주 2회 특식 메뉴 도입
   - 세계 각국 요리 추가
   - 계절별 특선 메뉴 운영

2. **건강식 확대**
   - 샐러드바 상시 운영
   - 저칼로리 메뉴 확대
   - 비건 옵션 추가

3. **맞춤 서비스**
   - 알레르기 정보 제공
   - 개인 맞춤 식단 상담
   - 영양사 상주

**의견 수렴**
댓글로 여러분의 의견을 남겨주세요!
- 추가하고 싶은 메뉴
- 개선이 필요한 부분
- 기타 건의사항

여러분의 소중한 의견을 반영하여 더 나은 식당을 만들어가겠습니다.
    `,
    attachments: ["현재메뉴표.pdf", "만족도조사결과.xlsx"]
  },
  {
    id: 10,
    title: "주차장 이용 수칙 변경",
    category: "공지사항",
    author: "관리자",
    createdAt: "2024-03-13",
    views: 65,
    comments: 4,
    isNew: false,
    content: `
주차장 이용 수칙이 변경되었습니다.

**변경 사유**
- 주차 공간 부족 문제 해결
- 공정한 주차 공간 배분
- 외부 방문자 주차 공간 확보

**주요 변경사항**

1. **지정 주차제 도입**
   - 기존: 자유 주차 → 변경: 개인별 지정 주차
   - 주차 번호는 개별 통보

2. **시간 제한**
   - 평일 오전 7시 ~ 오후 8시
   - 주말/휴일 이용 불가 (사전 신청 시 예외)

3. **방문자 주차**
   - 지하 1층 10-20번 구역
   - 사전 예약 필수 (총무팀)

4. **위반 시 조치**
   - 1차: 경고
   - 2차: 1주일 주차 금지
   - 3차: 1개월 주차 금지

**시행일**
- 2024년 3월 20일 (수)부터

원활한 주차장 운영을 위한 조치이니 많은 협조 부탁드립니다.
    `,
    attachments: ["주차장배치도.pdf", "이용수칙.pdf"]
  }
];

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    "공지사항": "bg-red-100 text-red-700",
    "인사": "bg-blue-100 text-blue-700",
    "프로젝트": "bg-green-100 text-green-700",
    "복지": "bg-purple-100 text-purple-700",
    "시스템": "bg-orange-100 text-orange-700",
    "교육": "bg-indigo-100 text-indigo-700"
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

const getAuthorInitials = (name: string) => {
  return name.length >= 2 ? name.slice(-2) : name;
};

export function RecentPosts() {
  const [selectedPost, setSelectedPost] = useState<typeof recentPosts[0] | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  const handlePostClick = (post: typeof recentPosts[0]) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-pastel-blue-50 to-white border-pastel-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-pastel-blue-600" />
            최근 게시판 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 스크롤 영역으로 감싸고 높이 제한 - 5개 아이템 표시 */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-3 bg-white rounded-lg border border-pastel-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                        {post.isNew && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-pastel-blue-100 text-pastel-blue-700">
                          {getAuthorInitials(post.author)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{post.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 게시물 상세 팝업 */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-pastel-blue-600" />
              게시물 상세 내용
            </DialogTitle>
            <DialogDescription>
              선택된 게시물의 상세 내용을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-6">
              {/* 게시물 헤더 */}
              <div className="p-4 bg-pastel-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
                      {selectedPost.isNew && (
                        <Badge variant="destructive" className="text-xs">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={getCategoryColor(selectedPost.category)}>
                      {selectedPost.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700">
                          {getAuthorInitials(selectedPost.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{selectedPost.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{selectedPost.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{selectedPost.comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 게시물 내용 */}
              <div className="space-y-4">
                <h4 className="font-medium">게시물 내용</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {selectedPost.content}
                  </div>
                </div>
              </div>

              {/* 첨부파일 */}
              {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">첨부파일</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPost.attachments.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-3 bg-white border border-pastel-blue-200 rounded-lg hover:bg-pastel-blue-50 cursor-pointer transition-colors"
                      >
                        <FileText className="h-4 w-4 text-pastel-blue-600" />
                        <span className="text-sm">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 댓글 섹션 placeholder */}
              <div className="space-y-3">
                <h4 className="font-medium">댓글 ({selectedPost.comments})</h4>
                <div className="text-sm text-muted-foreground p-4 bg-gray-50 rounded-lg text-center">
                  댓글 기능은 추후 개발 예정입니다.
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}