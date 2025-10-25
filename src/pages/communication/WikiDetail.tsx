import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, BookOpen, Edit, Calendar, User, Tag, Download, FileText, Image, Video, File } from 'lucide-react';
import { Wiki, Attachment } from '../../types';
import { toast } from "sonner";

// Mock data (실제로는 API에서 가져올 데이터)
const mockWikis: Wiki[] = [
  {
    id: '1',
    title: '신입사원 온보딩 가이드',
    content: `# 신입사원 온보딩 가이드

신입사원이 Coev1에서 성공적으로 업무를 시작할 수 있도록 도와드리는 종합 가이드입니다.

## 1. 첫 날 준비사항

### 출근 시간 및 위치
- **출근 시간**: 오전 9시
- **점심시간**: 오후 12시 - 1시
- **퇴근 시간**: 오후 6시
- **사무실 위치**: 서울시 강남구 테헤란로 123

### 준비물
- 신분증
- 통장 사본 (급여 계좌 등록용)
- 증명사진 2매
- 입사 관련 서류

## 2. 첫 주 일정

### Day 1: 오리엔테이션
- 회사 소개 및 조직도 설명
- 업무 환경 세팅 (PC, 계정 등)
- 사내 시설 투어

### Day 2-3: 팀 미팅
- 소속 팀 소개
- 프로젝트 현황 브리핑
- 멘토 배정

### Day 4-5: 업무 프로세스 교육
- 업무 도구 사용법
- 결재 시스템 교육
- 커뮤니케이션 도구 교육

## 3. 사내 시설 이용 안내

### 회의실 예약
- 사내 시스템을 통해 예약
- 최대 2시간까지 연속 사용 가능
- 회의 종료 후 정리정돈 필수

### 휴게실
- 커피, 차, 간단한 간식 제공
- 전자레인지, 냉장고 이용 가능
- 개인 컵 사용 권장

### 주차장
- 지하 1층 직원 전용 주차장
- 주차 등록증 발급 후 이용
- 방문자 주차는 1층 안내데스크 문의

## 4. 업무 도구 및 시스템

### 필수 프로그램
- 메신저: Slack
- 이메일: Outlook
- 프로젝트 관리: Jira
- 문서 공유: Confluence

### 계정 발급
- IT팀에서 첫날 계정 발급
- 초기 비밀번호는 변경 필수
- 2단계 인증 설정 권장

## 5. 복리후생

### 휴가
- 연차: 입사일 기준 비례 지급
- 반차: 오전/오후 반차 가능
- 경조사휴가: 결혼, 출산 등

### 교육 지원
- 외부 교육 과정 지원
- 도서 구입비 지원
- 컨퍼런스 참가비 지원

### 식사
- 중식비 지원 (1일 15,000원)
- 회식비 별도 지원
- 간식 상시 제공

## 6. 자주 묻는 질문

### Q: 복장 규정이 있나요?
A: 비즈니스 캐주얼을 권장합니다. 고객 미팅이 있는 날에는 정장 착용을 권장합니다.

### Q: 재택근무가 가능한가요?
A: 주 2회까지 재택근무가 가능합니다. 사전에 팀장 승인이 필요합니다.

### Q: 야근 시 식사는 어떻게 해결하나요?
A: 오후 8시 이후 근무 시 석식비(20,000원)를 지원합니다.

## 7. 연락처

궁금한 사항이 있으시면 언제든 연락주세요!

- **인사팀**: 02-1234-5678
- **IT팀**: 02-1234-5679  
- **총무팀**: 02-1234-5680

환영합니다! 함께 성장해나가요! 🎉`,
    authorId: '1',
    authorName: '홍인사',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    tags: ['신입사원', '온보딩', '가이드'],
    attachments: [
      {
        id: '1',
        name: 'onboarding_checklist.pdf',
        originalName: '신입사원_체크리스트.pdf',
        size: 1024000,
        type: 'application/pdf',
        url: '/files/onboarding_checklist.pdf',
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'company_org_chart.png',
        originalName: '조직도_2024.png',
        size: 512000,
        type: 'image/png',
        url: '/files/company_org_chart.png',
        uploadedAt: '2024-01-15T10:05:00Z'
      },
      {
        id: '3',
        name: 'office_map.pdf',
        originalName: '사무실_배치도.pdf',
        size: 768000,
        type: 'application/pdf',
        url: '/files/office_map.pdf',
        uploadedAt: '2024-01-15T10:10:00Z'
      }
    ],
  },
  {
    id: '2',
    title: 'Git 사용법 및 협업 가이드',
    content: `# Git 사용법 및 협업 가이드

개발팀에서 사용하는 Git 워크플로우와 코드 리뷰 프로세스에 대한 상세 가이드입니다.

## 1. Git 워크플로우

우리 팀은 **Git Flow**를 기반으로 한 브랜치 전략을 사용합니다.

### 브랜치 종류
- **main**: 프로덕션 배포용 브랜치
- **develop**: 개발 통합 브랜치
- **feature/***: 기능 개발 브랜치
- **hotfix/***: 긴급 수정 브랜치
- **release/***: 릴리스 준비 브랜치

### 기본 명령어
\`\`\`bash
# 저장소 클론
git clone <repository-url>

# 새 기능 브랜치 생성
git checkout -b feature/새로운기능

# 변경사항 추가
git add .
git commit -m "feat: 새로운 기능 추가"

# 원격 저장소에 푸시
git push origin feature/새로운기능
\`\`\`

## 2. 커밋 메시지 규칙

### 형식
\`\`\`
<타입>(<범위>): <제목>

<본문>

<푸터>
\`\`\`

### 타입 종류
- **feat**: 새로운 기능
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 스타일 변경
- **refactor**: 코드 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드 관련 수정

### 예시
\`\`\`
feat(user): 회원가입 기능 추가

- 이메일 유효성 검사 추가
- 비밀번호 암호화 적용
- 회원가입 완료 메일 발송

Closes #123
\`\`\`

## 3. Pull Request 프로세스

### 1단계: PR 생성
- 기능 개발 완료 후 develop 브랜치로 PR 생성
- 제목과 설명을 명확하게 작성
- 관련 이슈 번호 연결

### 2단계: 코드 리뷰
- 최소 2명의 리뷰어 지정
- 모든 리뷰어의 승인 필요
- 리뷰 코멘트에 대한 응답 필수

### 3단계: 머지
- 모든 리뷰 완료 후 머지
- Squash and merge 방식 사용
- 기능 브랜치 삭제

## 4. 코드 리뷰 가이드라인

### 리뷰어가 확인해야 할 사항
- [ ] 코드가 요구사항을 충족하는가?
- [ ] 코드 스타일이 일관성 있는가?
- [ ] 성능상 문제가 없는가?
- [ ] 보안 취약점이 없는가?
- [ ] 테스트 코드가 충분한가?

### 리뷰 코멘트 작성 팁
- 건설적인 피드백 제공
- 구체적인 개선 방안 제시
- 칭찬과 격려도 함께 포함
- "왜"에 대한 설명 추가

## 5. 브랜치 관리

### 기능 개발 시나리오
1. develop 브랜치에서 feature 브랜치 생성
2. 기능 개발 및 테스트
3. develop으로 PR 생성
4. 코드 리뷰 및 머지
5. 기능 브랜치 삭제

### 긴급 수정 시나리오
1. main 브랜치에서 hotfix 브랜치 생성
2. 버그 수정
3. main과 develop 모두에 머지
4. 태그 생성 및 배포

## 6. 유용한 Git 명령어

### 히스토리 확인
\`\`\`bash
# 커밋 로그 확인
git log --oneline --graph

# 특정 파일의 변경 이력
git log -p <파일명>

# 브랜치 간 차이점 확인
git diff main..develop
\`\`\`

### 실수 복구
\`\`\`bash
# 마지막 커밋 취소
git reset --soft HEAD~1

# 파일 변경사항 되돌리기
git checkout -- <파일명>

# 특정 커밋으로 되돌리기
git revert <커밋해시>
\`\`\`

## 7. 도구 및 설정

### 권장 도구
- **Git GUI**: SourceTree, GitKraken
- **VS Code 확장**: GitLens, Git Graph
- **터미널**: Oh My Zsh + Git 플러그인

### .gitignore 설정
\`\`\`
node_modules/
.env
.DS_Store
*.log
dist/
build/
\`\`\`

협업을 위한 Git 사용에 대해 궁금한 점이 있으면 언제든 개발팀에 문의해주세요!`,
    authorId: '2',
    authorName: '박개발',
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    tags: ['Git', '개발', '협업', '코드리뷰'],
    attachments: [
      {
        id: '4',
        name: 'git_workflow_diagram.png',
        originalName: 'Git_워크플로우_다이어그램.png',
        size: 384000,
        type: 'image/png',
        url: '/files/git_workflow_diagram.png',
        uploadedAt: '2024-01-12T16:00:00Z'
      },
      {
        id: '5',
        name: 'code_review_template.md',
        originalName: '코드리뷰_템플릿.md',
        size: 8192,
        type: 'text/markdown',
        url: '/files/code_review_template.md',
        uploadedAt: '2024-01-12T16:05:00Z'
      }
    ],
  },
  {
    id: '3',
    title: '디자인 시스템 가이드라인',
    content: `# 디자인 시스템 가이드라인

Coev1 제품의 일관된 사용자 경험을 위한 디자인 시스템입니다.

## 1. 컬러 시스템

### 브랜드 컬러
- **Primary Blue**: #4f96ff
- **Primary Blue Light**: #7bc1ff  
- **Primary Blue Dark**: #1e73ff

### 그레이 스케일
- **Gray 50**: #f9fafb
- **Gray 100**: #f3f4f6
- **Gray 200**: #e5e7eb
- **Gray 300**: #d1d5db
- **Gray 400**: #9ca3af
- **Gray 500**: #6b7280
- **Gray 600**: #4b5563
- **Gray 700**: #374151
- **Gray 800**: #1f2937
- **Gray 900**: #111827

### 시맨틱 컬러
- **Success**: #10b981
- **Warning**: #f59e0b
- **Error**: #ef4444
- **Info**: #3b82f6

## 2. 타이포그래피

### 폰트 패밀리
- **Primary**: Pretendard, -apple-system, sans-serif
- **Monospace**: 'JetBrains Mono', monospace

### 폰트 크기
- **H1**: 32px (2rem)
- **H2**: 24px (1.5rem)
- **H3**: 20px (1.25rem)
- **H4**: 18px (1.125rem)
- **Body**: 16px (1rem)
- **Small**: 14px (0.875rem)
- **XSmall**: 12px (0.75rem)

### 행간
- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75

## 3. 스페이싱

### 기본 단위: 4px

- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

## 4. 컴포넌트

### 버튼

#### 기본 버튼
\`\`\`css
.btn-primary {
  background: #4f96ff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.btn-secondary {
  background: transparent;
  color: #4f96ff;
  border: 1px solid #4f96ff;
  padding: 12px 24px;
  border-radius: 8px;
}
\`\`\`

#### 크기 변형
- **Large**: padding 16px 32px, font-size 18px
- **Medium**: padding 12px 24px, font-size 16px (기본)
- **Small**: padding 8px 16px, font-size 14px

### 입력 필드

\`\`\`css
.input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  background: white;
}

.input:focus {
  border-color: #4f96ff;
  box-shadow: 0 0 0 3px rgba(79, 150, 255, 0.1);
}
\`\`\`

### 카드

\`\`\`css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.card-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}
\`\`\`

## 5. 아이콘

### 스타일
- **선 두께**: 1.5px
- **크기**: 16px, 20px, 24px
- **스타일**: Outline 기본, Filled 강조용

### 사용 규칙
- 텍스트와 함께 사용 시 수직 정렬
- 버튼 내부에서는 텍스트와 4px 간격
- 단독 사용 시 최소 24px 터치 영역 확보

## 6. 레이아웃

### 그리드 시스템
- **컬럼**: 12컬럼 시스템
- **Gutter**: 24px
- **Container**: 최대 1200px

### 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 7. 상태 표현

### 로딩
- 스켈레톤 UI 사용
- 스피너는 긴 작업에만 사용
- 로딩 텍스트 함께 표시

### 에러
- 빨간색 계열 사용
- 명확한 에러 메시지 표시
- 해결 방법 안내

### 성공
- 초록색 계열 사용
- 간결한 성공 메시지
- 3초 후 자동 사라짐

## 8. 접근성

### 컬러 대비
- 텍스트와 배경의 대비비 4.5:1 이상
- 중요한 정보는 7:1 이상

### 키보드 내비게이션
- Tab 키로 모든 요소 접근 가능
- Focus 상태 명확히 표시
- Skip 링크 제공

### 스크린 리더
- 의미 있는 alt 텍스트
- 적절한 heading 구조
- ARIA 라벨 활용

## 9. 모션

### 기본 원칙
- 자연스러운 움직임
- 기능적 목적
- 적절한 지속 시간

### 애니메이션 값
- **Fast**: 150ms
- **Normal**: 250ms  
- **Slow**: 350ms

### Easing
- **Ease**: cubic-bezier(0.25, 0.1, 0.25, 1)
- **Ease In**: cubic-bezier(0.42, 0, 1, 1)
- **Ease Out**: cubic-bezier(0, 0, 0.58, 1)

## 10. 사용 가이드

### Do's
✅ 일관된 컬러 사용  
✅ 적절한 스페이싱 적용  
✅ 접근성 고려  
✅ 의미 있는 애니메이션  

### Don'ts  
❌ 브랜드 컬러 임의 변경  
❌ 과도한 그림자나 효과  
❌ 불필요한 애니메이션  
❌ 일관성 없는 컴포넌트  

디자인 시스템에 대한 문의사항은 디자인팀으로 연락주세요!`,
    authorId: '3',
    authorName: '김디자인',
    createdAt: '2024-01-10T11:30:00Z',
    updatedAt: '2024-01-17T15:45:00Z',
    tags: ['디자인', '시스템', '가이드라인', 'UI'],
  },
  {
    id: '4',
    title: 'API 문서 및 사용법',
    content: `# API 문서 및 사용법

백엔드 API 엔드포인트와 인증 방법, 요청/응답 형식에 대한 상세 문서입니다.

## 1. 기본 정보

### Base URL
- **개발**: https://api-dev.coev1.com
- **스테이징**: https://api-staging.coev1.com  
- **프로덕션**: https://api.coev1.com

### 버전
현재 API 버전: **v1**

모든 엔드포인트는 \`/api/v1\` 으로 시작합니다.

## 2. 인증

### JWT 토큰 인증
API는 JWT(JSON Web Token) 기반 인증을 사용합니다.

#### 로그인
\`\`\`http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@coev1.com",
  "password": "password123"
}
\`\`\`

#### 응답
\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": "123",
      "email": "user@coev1.com",
      "name": "홍길동"
    }
  }
}
\`\`\`

#### 헤더에 토큰 포함
\`\`\`http
Authorization: Bearer <accessToken>
\`\`\`

### 토큰 갱신
\`\`\`http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

## 3. 공통 응답 형식

### 성공 응답
\`\`\`json
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "message": "성공 메시지 (선택적)"
}
\`\`\`

### 오류 응답
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "오류 메시지",
    "details": "상세 오류 정보 (선택적)"
  }
}
\`\`\`

### HTTP 상태 코드
- **200**: 성공
- **201**: 생성됨
- **400**: 잘못된 요청
- **401**: 인증 필요
- **403**: 권한 없음
- **404**: 찾을 수 없음
- **500**: 서버 오류

## 4. 페이지네이션

목록 조회 API는 페이지네이션을 지원합니다.

### 요청 파라미터
- **page**: 페이지 번호 (기본값: 1)
- **limit**: 페이지당 항목 수 (기본값: 20, 최대: 100)
- **sort**: 정렬 기준 (예: "createdAt:desc")

### 응답
\`\`\`json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
\`\`\`

## 5. 주요 엔드포인트

### 사용자 관리

#### 사용자 목록 조회
\`\`\`http
GET /api/v1/users?page=1&limit=20&sort=createdAt:desc
Authorization: Bearer <token>
\`\`\`

#### 사용자 상세 조회
\`\`\`http
GET /api/v1/users/:id
Authorization: Bearer <token>
\`\`\`

#### 사용자 생성
\`\`\`http
POST /api/v1/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@coev1.com",
  "name": "새사용자",
  "department": "개발팀",
  "position": "개발자"
}
\`\`\`

#### 사용자 수정
\`\`\`http
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "수정된이름",
  "department": "기획팀"
}
\`\`\`

#### 사용자 삭제
\`\`\`http
DELETE /api/v1/users/:id
Authorization: Bearer <token>
\`\`\`

### 프로젝트 관리

#### 프로젝트 목록 조회
\`\`\`http
GET /api/v1/projects?status=active&assignee=123
Authorization: Bearer <token>
\`\`\`

#### 프로젝트 생성
\`\`\`http
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "새 프로젝트",
  "description": "프로젝트 설명",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "planning",
  "members": ["123", "456", "789"]
}
\`\`\`

### 전자결재

#### 결재 문서 목록 조회
\`\`\`http
GET /api/v1/approvals?status=pending&type=vacation
Authorization: Bearer <token>
\`\`\`

#### 결재 문서 제출
\`\`\`http
POST /api/v1/approvals
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "vacation",
  "title": "연차 신청",
  "content": "개인 사정으로 연차를 신청합니다.",
  "startDate": "2024-02-01",
  "endDate": "2024-02-02",
  "approvalLine": ["manager-id", "hr-id"]
}
\`\`\`

#### 결재 승인/반려
\`\`\`http
POST /api/v1/approvals/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approve", // "approve" | "reject"
  "comment": "승인합니다."
}
\`\`\`

## 6. 파일 업로드

### 단일 파일 업로드
\`\`\`http
POST /api/v1/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <파일 데이터>
category: "avatar" // "avatar" | "document" | "image"
\`\`\`

### 응답
\`\`\`json
{
  "success": true,
  "data": {
    "id": "file-id",
    "filename": "document.pdf",
    "originalName": "원본파일명.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "url": "https://cdn.coev1.com/files/document.pdf"
  }
}
\`\`\`

## 7. 웹소켓 (실시간 알림)

### 연결
\`\`\`javascript
const socket = io('wss://api.coev1.com', {
  auth: {
    token: '<accessToken>'
  }
});
\`\`\`

### 이벤트
- **notification**: 새 알림
- **approval_update**: 결재 상태 변경
- **project_update**: 프로젝트 업데이트
- **chat_message**: 채팅 메시지

## 8. 에러 코드

### 인증 관련
- **AUTH_001**: 토큰이 없음
- **AUTH_002**: 토큰이 만료됨
- **AUTH_003**: 잘못된 토큰
- **AUTH_004**: 권한 없음

### 데이터 관련
- **DATA_001**: 필수 필드 누락
- **DATA_002**: 잘못된 데이터 형식
- **DATA_003**: 중복된 데이터
- **DATA_004**: 데이터를 찾을 수 없음

### 서버 관련
- **SERVER_001**: 내부 서버 오류
- **SERVER_002**: 데이터베이스 연결 오류
- **SERVER_003**: 외부 서비스 연결 오류

## 9. SDK 및 라이브러리

### JavaScript/TypeScript
\`\`\`bash
npm install @coev1/api-client
\`\`\`

\`\`\`javascript
import { Coev1API } from '@coev1/api-client';

const api = new Coev1API({
  baseURL: 'https://api.coev1.com',
  token: '<accessToken>'
});

// 사용자 조회
const users = await api.users.list();

// 프로젝트 생성
const project = await api.projects.create({
  title: '새 프로젝트',
  description: '프로젝트 설명'
});
\`\`\`

## 10. 요청 제한

### Rate Limiting
- **인증된 사용자**: 1000 requests/hour
- **관리자**: 5000 requests/hour

### 제한 초과 시 응답
\`\`\`json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "요청 한도를 초과했습니다.",
    "retryAfter": 3600
  }
}
\`\`\`

API 사용 중 문제가 발생하면 백엔드팀으로 연락주세요!`,
    authorId: '4',
    authorName: '최백엔드',
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-16T10:10:00Z',
    tags: ['API', '백엔드', '개발', '문서'],
  },
  {
    id: '5',
    title: '마케팅 캠페인 기획 프로세스',
    content: `# 마케팅 캠페인 기획 프로세스

효과적인 마케팅 캠페인을 기획하고 실행하기 위한 단계별 프로세스 가이드입니다.

## 1. 캠페인 기획 단계

### 1.1 목표 설정
- **SMART 목표**: 구체적, 측정가능, 달성가능, 관련성, 시간제한
- **KPI 정의**: 매출, 전환율, 브랜드 인지도 등
- **예산 설정**: 총 예산 및 채널별 배분

### 1.2 타겟 분석
- **페르소나 정의**: 주요 고객층 특성 분석
- **고객 여정 맵핑**: 인지-고려-구매-유지 단계별 접점
- **시장 조사**: 경쟁사 분석 및 시장 트렌드 파악

### 1.3 메시지 개발
- **핵심 메시지**: 브랜드 가치 및 차별점
- **톤앤매너**: 브랜드 일관성 유지
- **크리에이티브 방향**: 비주얼 및 카피 컨셉

## 2. 채널 전략

### 2.1 디지털 채널
- **소셜미디어**: 인스타그램, 페이스북, 링크드인
- **검색광고**: 구글 애즈, 네이버 SA
- **디스플레이**: 배너 광고, 동영상 광고
- **이메일**: 뉴스레터, EDM

### 2.2 오프라인 채널
- **이벤트**: 세미나, 컨퍼런스, 전시회
- **PR**: 보도자료, 미디어 인터뷰
- **파트너십**: 제휴 마케팅, 협업

### 2.3 채널 선택 기준
- 타겟 고객의 미디어 소비 패턴
- 예산 대비 효율성
- 브랜드 적합성
- 측정 가능성

## 3. 콘텐츠 제작

### 3.1 콘텐츠 유형
- **블로그 포스트**: SEO 최적화된 아티클
- **인포그래픽**: 복잡한 정보의 시각화
- **동영상**: 제품 소개, 고객 인터뷰
- **웨비나**: 전문 지식 공유

### 3.2 제작 프로세스
1. **기획**: 주제 선정 및 구성안 작성
2. **제작**: 텍스트, 이미지, 영상 제작
3. **검토**: 내부 검토 및 수정
4. **승인**: 최종 승인 및 배포 준비

### 3.3 품질 관리
- 브랜드 가이드라인 준수
- 맞춤법 및 문법 검토
- 저작권 확인
- 접근성 고려

## 4. 실행 계획

### 4.1 캠페인 일정
- **준비 기간**: 기획-제작-검토 (4-6주)
- **실행 기간**: 캠페인 런칭 및 운영
- **평가 기간**: 성과 분석 및 보고 (1-2주)

### 4.2 역할 분담
- **마케팅 매니저**: 전체 기획 및 관리
- **크리에이티브**: 콘텐츠 제작
- **미디어 플래너**: 매체 운영
- **데이터 분석가**: 성과 측정

### 4.3 예산 관리
- 채널별 예산 배분
- 일별/주별 집행 계획
- 예산 사용 현황 모니터링
- 필요시 예산 재배분

## 5. 성과 측정

### 5.1 주요 지표
- **노출**: 임프레션, 도달률
- **참여**: 클릭률, 좋아요, 댓글
- **전환**: 회원가입, 구매, 문의
- **브랜드**: 인지도, 선호도 조사

### 5.2 측정 도구
- **Google Analytics**: 웹사이트 트래픽 분석
- **Facebook Insights**: 소셜미디어 성과
- **UTM 파라미터**: 캠페인별 추적
- **설문조사**: 브랜드 인식 변화

### 5.3 보고서 작성
- **주간 리포트**: 주요 지표 요약
- **월간 리포트**: 상세 분석 및 인사이트
- **캠페인 종료 보고서**: 전체 성과 및 개선점

## 6. A/B 테스트

### 6.1 테스트 요소
- **제목**: 이메일 제목, 광고 헤드라인
- **이미지**: 메인 비주얼, 제품 사진
- **CTA**: 버튼 텍스트, 색상, 위치
- **랜딩페이지**: 레이아웃, 폼 항목

### 6.2 테스트 설계
- **가설 설정**: 무엇을 왜 테스트하는가
- **샘플 크기**: 통계적 유의성 확보
- **테스트 기간**: 충분한 데이터 수집
- **성공 지표**: 명확한 평가 기준

### 6.3 결과 활용
- 승리 버전으로 전환
- 인사이트 문서화
- 향후 캠페인에 적용
- 지속적 최적화

## 7. 위기 관리

### 7.1 리스크 식별
- **콘텐츠 이슈**: 부적절한 표현, 오타
- **기술적 문제**: 서버 다운, 링크 오류
- **외부 요인**: 사회적 이슈, 경쟁사 대응
- **예산 초과**: 광고비 급증

### 7.2 대응 계획
- **즉시 대응**: 문제 상황 파악 및 임시 조치
- **커뮤니케이션**: 내부 공유 및 고객 안내
- **해결 방안**: 근본적 문제 해결
- **사후 관리**: 재발 방지 및 프로세스 개선

## 8. 캠페인 체크리스트

### 기획 단계
- [ ] 캠페인 목표 명확화
- [ ] 타겟 고객 정의
- [ ] 예산 및 일정 수립
- [ ] 경쟁사 분석 완료

### 제작 단계
- [ ] 크리에이티브 컨셉 확정
- [ ] 콘텐츠 제작 완료
- [ ] 브랜드 가이드라인 준수
- [ ] 법적 검토 완료

### 실행 단계
- [ ] 캠페인 셋업 완료
- [ ] 추적 코드 설치
- [ ] 테스트 런칭 진행
- [ ] 모니터링 체계 구축

### 평가 단계
- [ ] 데이터 수집 완료
- [ ] 성과 분석 진행
- [ ] 인사이트 도출
- [ ] 개선 방안 수립

## 9. 도구 및 플랫폼

### 기획 도구
- **Notion**: 프로젝트 관리 및 문서화
- **Figma**: 와이어프레임 및 디자인
- **Miro**: 아이디어 정리 및 워크샵

### 제작 도구
- **Adobe Creative Suite**: 디자인 제작
- **Canva**: 간단한 소셜미디어 콘텐츠
- **Loom**: 화면 녹화 및 비디오 제작

### 분석 도구
- **Google Analytics**: 웹 분석
- **Mixpanel**: 사용자 행동 분석
- **Hotjar**: 히트맵 및 사용자 세션

## 10. 지속적 개선

### 성공 사례 분석
- 높은 성과를 낸 캠페인 요인 분석
- 베스트 프랙티스 문서화
- 팀 내 지식 공유

### 실패 사례 학습
- 저조한 성과의 원인 파악
- 개선 방안 도출
- 재발 방지책 수립

### 트레드 모니터링
- 업계 동향 파악
- 새로운 플랫폼 및 기술 검토
- 고객 행동 변화 추적

마케팅 캠페인 기획에 대해 궁금한 점이 있으면 마케팅팀으로 연락주세요!`,
    authorId: '5',
    authorName: '한마케팅',
    createdAt: '2024-01-05T13:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    tags: ['마케팅', '캠페인', '기획', '프로세스'],
  },
  {
    id: '6',
    title: '보안 정책 및 개인정보 보호',
    content: `# 보안 정책 및 개인정보 보호

Coev1의 보안 정책과 개인정보 보호를 위한 필수 준수 사항입니다.

## 1. 보안 정책 개요

### 1.1 목적
- 회사 정보 자산 보호
- 개인정보 보호법 준수
- 사이버 보안 위협 대응
- 안전한 업무 환경 조성

### 1.2 적용 범위
- 모든 임직원
- 협력업체 및 파트너
- 회사 시설 및 시스템
- 개인정보 처리 전 과정

### 1.3 보안 원칙
- **기밀성**: 인가되지 않은 접근 차단
- **무결성**: 정보의 정확성 및 완전성 유지
- **가용성**: 필요시 정보에 접근 가능
- **책임추적성**: 모든 활동 기록 및 추적

## 2. 정보 보안 정책

### 2.1 정보 분류 체계

#### 1등급 (극비)
- 경영 전략, M&A 정보
- 개인정보 대량 포함 데이터
- 핵심 기술 정보
- **접근 권한**: 임원진 및 승인된 인원만

#### 2등급 (비밀)
- 재무 정보, 인사 정보
- 고객 정보, 영업 기밀
- 제품 로드맵
- **접근 권한**: 부서장 승인 필요

#### 3등급 (대외비)
- 내부 업무 프로세스
- 조직도, 연락처
- 회의록, 보고서
- **접근 권한**: 관련 부서원

#### 4등급 (일반)
- 공개 가능한 정보
- 마케팅 자료
- 공지사항
- **접근 권한**: 제한 없음

### 2.2 정보 취급 규칙

#### 생성
- 정보 분류 등급 표시
- 작성자 및 날짜 기록
- 승인 절차 준수

#### 저장
- 회사 승인 시스템만 사용
- 개인 클라우드 저장 금지
- 정기적 백업 수행

#### 전송
- 암호화된 채널 사용
- 수신자 확인 후 전송
- 전송 이력 기록

#### 폐기
- 보존 기간 경과 시 폐기
- 복구 불가능한 방법 사용
- 폐기 이력 기록

## 3. 개인정보 보호

### 3.1 개인정보 정의
- **일반 개인정보**: 성명, 주민등록번호, 주소, 전화번호, 이메일 등
- **민감정보**: 사상/신념, 정치적 견해, 건강, 성생활 등
- **고유식별정보**: 주민등록번호, 여권번호, 운전면허번호 등
- **영상정보**: CCTV, 웹캠 등으로 촬영된 영상

### 3.2 개인정보 처리 원칙

#### 처리 최소화
- 목적에 필요한 최소한의 정보만 수집
- 동의 받지 않은 정보 처리 금지
- 보유 기간 최소화

#### 목적 제한
- 수집 목적 범위 내에서만 처리
- 목적 변경 시 별도 동의
- 목적 달성 시 즉시 삭제

#### 정확성 보장
- 정확하고 최신의 정보 유지
- 잘못된 정보 즉시 수정
- 정기적 정보 점검

### 3.3 개인정보 보호 조치

#### 기술적 보호조치
- 접근 권한 관리
- 암호화 저장 및 전송
- 접속 기록 보관
- 보안 프로그램 설치

#### 관리적 보호조치
- 개인정보 보호책임자 지정
- 처리 직원 교육
- 접근 권한 제한
- 처리 현황 점검

#### 물리적 보호조치
- 전산실, 자료보관실 출입 통제
- 개인정보 처리 시스템 접근 제한
- 개인정보가 포함된 서류 잠금 보관

## 4. 계정 및 접근 관리

### 4.1 계정 관리 정책

#### 비밀번호 정책
- **길이**: 최소 12자 이상
- **구성**: 영문 대/소문자, 숫자, 특수문자 조합
- **변경**: 3개월마다 변경
- **재사용 금지**: 최근 5개 비밀번호 재사용 불가

#### 다중 인증 (MFA)
- 모든 업무 시스템에 MFA 적용
- 인증 방법: SMS, 앱, 하드웨어 토큰
- 정기적 인증 설정 점검

#### 계정 생명주기
- **생성**: 인사팀 승인 후 생성
- **변경**: 부서 이동 시 권한 조정
- **삭제**: 퇴사 즉시 계정 비활성화

### 4.2 접근 권한 관리

#### 최소 권한 원칙
- 업무 수행에 필요한 최소 권한만 부여
- 정기적 권한 검토 및 조정
- 임시 권한은 기간 제한

#### 권한 승인 절차
- 부서장 승인 후 권한 부여
- 특수 권한은 보안팀 검토
- 모든 권한 변경 이력 기록

## 5. 네트워크 보안

### 5.1 네트워크 아키텍처
- DMZ 구성으로 내외부망 분리
- 방화벽을 통한 트래픽 제어
- IDS/IPS 시스템 운영
- VPN을 통한 원격 접속

### 5.2 무선 네트워크
- WPA3 암호화 사용
- 게스트 네트워크 분리 운영
- 정기적 비밀번호 변경
- 불법 AP 탐지 시스템 운영

### 5.3 외부 접속 보안
- VPN 필수 사용
- 접속 로그 모니터링
- 비승인 접속 차단
- 정기적 접속 권한 검토

## 6. 시스템 보안

### 6.1 서버 보안
- 최신 보안 패치 적용
- 불필요한 서비스 비활성화
- 정기적 취약점 스캔
- 시스템 로그 모니터링

### 6.2 데이터베이스 보안
- 데이터 암호화 저장
- 접근 권한 최소화
- 쿼리 로그 기록
- 정기적 백업 수행

### 6.3 애플리케이션 보안
- 보안 코딩 가이드라인 준수
- 입력값 검증 및 필터링
- SQL 인젝션 방지
- XSS 공격 방지

## 7. 물리적 보안

### 7.1 사무실 보안
- 출입 통제 시스템 운영
- 방문자 등록 및 동행
- 중요 구역 별도 통제
- CCTV 설치 및 모니터링

### 7.2 장비 보안
- 노트북, PC 자산 관리
- 하드디스크 암호화 의무
- USB 등 이동 저장매체 통제
- 장비 반납 시 데이터 완전 삭제

### 7.3 문서 보안
- 중요 문서 잠금 보관
- 기밀 문서 복사 제한
- 문서 폐기 시 파쇄
- Clean Desk 정책 실시

## 8. 사고 대응

### 8.1 보안 사고 유형
- 개인정보 유출
- 시스템 해킹
- 멀웨어 감염
- 내부자 위협

### 8.2 사고 대응 절차

#### 1단계: 발견 및 신고
- 즉시 보안팀에 신고
- 사고 현황 파악
- 초기 대응 조치

#### 2단계: 조사 및 분석
- 사고 원인 분석
- 피해 범위 확인
- 증거 보전

#### 3단계: 복구 및 복원
- 시스템 복구
- 데이터 복원
- 서비스 재개

#### 4단계: 사후 관리
- 재발 방지책 수립
- 관련 법령에 따른 신고
- 직원 교육 실시

### 8.3 연락처
- **보안팀**: 내선 9999 (24시간)
- **개인정보보호 담당자**: privacy@coev1.com
- **IT 헬프데스크**: help@coev1.com

## 9. 교육 및 인식 제고

### 9.1 보안 교육
- 신입사원 보안 교육 (입사 1주 내)
- 정기 보안 교육 (연 2회)
- 개인정보 보호 교육 (연 1회)
- 보안 사고 사례 공유

### 9.2 인식 제고 활동
- 보안 뉴스레터 발송
- 피싱 메일 모의훈련
- 보안 퀴즈 및 이벤트
- 보안 우수 직원 포상

## 10. 규정 위반 시 조치

### 10.1 위반 행위
- 개인정보 무단 처리
- 비밀번호 공유
- 무단 소프트웨어 설치
- 기밀정보 유출

### 10.2 처벌 수준
- **경고**: 1차 경미한 위반
- **주의**: 2차 위반 또는 중간 수준
- **견책**: 3차 위반 또는 중대한 위반
- **징계**: 고의적이고 심각한 위반

보안 관련 문의나 신고는 언제든지 보안팀으로 연락해주세요!`,
    authorId: '6',
    authorName: '이보안',
    createdAt: '2024-01-03T09:45:00Z',
    updatedAt: '2024-01-20T11:20:00Z',
    tags: ['보안', '개인정보', '정책', '컴플라이언스'],
  },
  {
    id: '7',
    title: '회의실 예약 및 사용 규칙',
    content: `# 회의실 예약 및 사용 규칙

회의실 예약 시스템 사용법과 회의실 이용 에티켓에 대한 안내입니다.

## 1. 회의실 소개

### 1.1 회의실 목록

#### 대회의실 (12층)
- **수용 인원**: 20명
- **시설**: 프로젝터, 화상회의 장비, 화이트보드
- **예약 시간**: 최대 4시간
- **용도**: 임원 회의, 전체 회의, 고객 미팅

#### 중회의실 A, B (11층)
- **수용 인원**: 10명
- **시설**: 모니터, 화상회의 장비, 화이트보드
- **예약 시간**: 최대 3시간
- **용도**: 부서 회의, 프로젝트 미팅

#### 소회의실 1-6 (10층)
- **수용 인원**: 4-6명
- **시설**: 모니터, 화이트보드
- **예약 시간**: 최대 2시간
- **용도**: 팀 미팅, 1:1 면담

#### 전화 부스 1-4 (각 층)
- **수용 인원**: 1명
- **시설**: 방음, 의자, 작은 테이블
- **예약 시간**: 최대 1시간
- **용도**: 개인 통화, 화상 미팅

### 1.2 이용 시간
- **평일**: 오전 8시 - 오후 10시
- **토요일**: 오전 9시 - 오후 6시
- **일요일/공휴일**: 사전 승인 시에만 이용 가능

## 2. 예약 시스템 사용법

### 2.1 시스템 접속
1. 사내 인트라넷 접속
2. "시설 예약" 메뉴 클릭
3. 회의실 예약 페이지 이동

### 2.2 예약 방법

#### 일반 예약
1. **날짜 선택**: 캘린더에서 원하는 날짜 클릭
2. **시간 선택**: 시작 시간과 종료 시간 설정
3. **회의실 선택**: 참석 인원에 맞는 회의실 선택
4. **회의 정보 입력**:
   - 회의 제목 (필수)
   - 회의 목적
   - 참석자 목록
   - 필요 장비
5. **예약 확정**: "예약하기" 버튼 클릭

#### 반복 예약
- 정기 회의의 경우 반복 설정 가능
- 주간/월간 반복 선택
- 최대 6개월까지 설정 가능

### 2.3 예약 규칙

#### 예약 가능 시간
- **사전 예약**: 최대 2주 전부터 가능
- **당일 예약**: 회의 시작 30분 전까지 가능
- **최소 단위**: 30분 단위로 예약

#### 예약 제한
- **개인별 제한**: 1일 최대 6시간
- **연속 사용**: 최대 4시간 (대회의실 기준)
- **No-Show 제한**: 3회 연속 불참 시 1주일 예약 제한

### 2.4 예약 변경 및 취소

#### 변경
- 회의 시작 1시간 전까지 변경 가능
- "내 예약" 페이지에서 수정
- 변경 사유 입력 필수

#### 취소
- 회의 시작 30분 전까지 취소 가능
- 반복 예약의 경우 개별 또는 전체 취소 선택
- 긴급 취소 시 총무팀 연락 (내선: 1004)

## 3. 회의실 이용 에티켓

### 3.1 예약자 책임

#### 사전 준비
- 회의 시작 5분 전 입실
- 필요한 자료 미리 준비
- 참석자들에게 장소 안내

#### 회의 진행
- 정시 시작, 정시 종료
- 예약 시간 엄수
- 다음 예약자를 위한 배려

### 3.2 시설 이용 수칙

#### 입실 시
- 회의실 상태 확인
- 장비 작동 상태 점검
- 문제 발생 시 총무팀 연락

#### 퇴실 시
- 사용한 장비 정리
- 의자 및 테이블 정리
- 쓰레기 정리
- 에어컨, 조명 끄기
- 문 잠금 확인

### 3.3 장비 사용법

#### 프로젝터 (대회의실, 중회의실)
1. 프로젝터 전원 켜기
2. 노트북과 HDMI 케이블 연결
3. 화면 설정 (복제 또는 ���장)
4. 사용 후 전원 끄기

#### 화상회의 장비
1. 화상회의 시스템 켜기
2. 마이크, 카메라 설정 확인
3. 회의 링크 접속
4. 음성/영상 테스트
5. 사용 후 시스템 종료

#### 화이트보드
- 전용 마커만 사용
- 사용 후 깨끗이 지우기
- 마커 뚜껑 꼭 닫기

## 4. 특별 예약 및 승인

### 4.1 우선 예약 대상
- **임원 회의**: 경영진 및 부사장급 이상
- **고객 미팅**: 외부 고객과의 미팅
- **채용 면접**: 인사팀 주관 면접
- **교육 및 세미나**: 전사적 교육 행사

### 4.2 승인 절차
1. 예약 시 승인 요청 선택
2. 해당 부서장 승인
3. 총무팀 최종 확인
4. 승인 완료 알림

### 4.3 외부인 회의실 이용
- 사전 총무팀 승인 필요
- 방문자 등록 및 출입증 발급
- 임직원 동행 의무
- 보안 서약서 작성

## 5. 문제 상황 대응

### 5.1 장비 고장
1. 즉시 총무팀 연락 (내선: 1004)
2. 고장 내용 상세 설명
3. 임시 대체 방안 문의
4. 고장 신고서 작성

### 5.2 예약 충돌
- 시스템 오류로 인한 중복 예약 시
- 먼저 예약한 사용자 우선
- 총무팀에서 대체 회의실 안내
- 필요시 회의 일정 조정 협의

### 5.3 무단 사용
- 예약 없이 회의실 사용 발견 시
- 즉시 총무팀 신고
- 해당 사용자에게 즉시 퇴실 요청
- 반복 시 인사팀 징계 의뢰

## 6. 부가 서비스

### 6.1 케이터링 서비스
- 10명 이상 회의 시 신청 가능
- 3일 전 사전 주문
- 메뉴: 샌드위치, 과일, 음료
- 비용: 회계팀에서 처리

### 6.2 회의 지원 서비스
- 회의 진행 지원 (회의록 작성 등)
- 통역 서비스 (영어, 중국어)
- 사전 예약 필수
- 비용: 부서별 예산에서 차감

### 6.3 추가 장비 대여
- 추가 모니터, 스피커
- 마이크, 녹음기
- 플립 차트
- 무료 대여 (수량 제한)

## 7. 회의 문화 개선

### 7.1 효율적인 회의 운영
- **사전 준비**: 안건 미리 공유
- **시간 관리**: 정해진 시간 내 종료
- **집중**: 핸드폰 사용 자제
- **결론**: 회의 결과 정리 및 공유

### 7.2 회의실 예약 팁
- **적정 규모**: 참석 인원에 맞는 회의실 선택
- **시간 여유**: 회의 전후 이동 시간 고려
- **백업 계획**: 장비 고장에 대비한 대안 준비

### 7.3 친환경 회의
- 종이 자료 최소화
- 전자 문서 활용
- 개인 텀블러 사용
- 불필요한 인쇄물 지양

## 8. 자주 묻는 질문 (FAQ)

### Q1: 회의실 예약을 깜빡하고 사용해도 되나요?
A: 아니요. 반드시 예약 후 사용해야 합니다. 무단 사용 시 다른 예약자에게 피해를 줄 수 있습니다.

### Q2: 예약 시간을 초과해서 사용할 수 있나요?
A: 다음 예약이 없는 경우에 한해 30분까지 연장 가능합니다. 단, 시스템에서 연장 예약을 진행해야 합니다.

### Q3: 외부 방문자와 함께 회의실을 사용할 수 있나요?
A: 가능합니다. 단, 사전에 총무팀 승인을 받고 방문자 등록을 해야 합니다.

### Q4: 회의실에서 음식을 먹어도 되나요?
A: 간단한 음료와 간식은 가능합니다. 단, 냄새가 강한 음식은 피해주세요.

### Q5: 야간이나 주말에도 사용할 수 있나요?
A: 평일 오후 10시 이후나 주말 사용 시에는 사전 승인이 필요합니다.

## 9. 연락처 및 문의

### 총무팀 (회의실 관리)
- **전화**: 내선 1004
- **이메일**: facility@coev1.com
- **위치**: 9층 총무팀

### IT 헬프데스크 (장비 지원)
- **전화**: 내선 2000
- **이메일**: help@coev1.com
- **위치**: 8층 IT팀

### 긴급 상황 (야간/주말)
- **보안실**: 내선 9999
- **건물 관리사무소**: 02-1234-5678

쾌적하고 효율적인 회의 환경을 위해 모든 임직원의 협조를 부탁드립니다! 😊`,
    authorId: '7',
    authorName: '김총무',
    createdAt: '2024-01-02T15:15:00Z',
    tags: ['회의실', '예약', '사용법', '에티켓'],
  },
  {
    id: '8',
    title: '비용 처리 및 경비 정산 가이드',
    content: `# 비용 처리 및 경비 정산 가이드

업무상 발생한 비용의 처리 방법과 경비 정산 프로세스에 대한 종합 안내입니다.

## 1. 경비 정산 개요

### 1.1 정산 대상 비용
- **교통비**: 대중교통, 택시, 주차비, 통행료
- **숙박비**: 출장 시 호텔, 숙박 시설
- **식비**: 업무 미팅, 출장 중 식사
- **접대비**: 고객 접대, 비즈니스 미팅
- **교육비**: 외부 교육, 세미나, 컨퍼런스
- **사무용품**: 업무용 소모품, 도서
- **통신비**: 업무용 휴대폰, 인터넷 비용

### 1.2 정산 불가 항목
- 개인적 용도의 비용
- 음주를 위한 주류비
- 가족/친구와의 식사비
- 개인 쇼핑 비용
- 벌금, 과태료

### 1.3 정산 한도
- **일반 직원**: 월 50만원
- **팀장급**: 월 100만원
- **부장급 이상**: 월 200만원
- **특별 승인**: 한도 초과 시 사전 승인 필요

## 2. 경비 정산 시스템 사용법

### 2.1 시스템 접속
1. 사내 인트라넷 로그인
2. "경비 정산" 메뉴 클릭
3. 정산 신청 페이지 이동

### 2.2 정산 신청 절차

#### 1단계: 기본 정보 입력
- **신청일**: 자동 입력
- **정산 기간**: 시작일~종료일 선택
- **정산 유형**: 출장/업무/교육/기타
- **신청 사유**: 상세 사유 작성

#### 2단계: 비용 항목 입력
- **날짜**: 비용 발생 일자
- **항목**: 교통비/식비/숙박비 등 선택
- **금액**: 실제 지출 금액
- **내용**: 상세 내용 (예: A업체 미팅 점심식사)
- **영수증**: 스캔 또는 사진 첨부

#### 3단계: 검토 및 제출
- 입력 내용 최종 확인
- 영수증 첨부 확인
- "제출" 버튼 클릭

### 2.3 모바일 앱 사용법
- **앱 다운로드**: "Coev1 경비" 앱 설치
- **영수증 촬영**: 카메라로 영수증 자동 인식
- **음성 메모**: 비용 내용 음성으로 기록
- **오프라인 저장**: 네트워크 없이도 임시 저장

## 3. 항목별 정산 가이드

### 3.1 교통비

#### 대중교통
- **버스/지하철**: 교통카드 내역서 또는 영수증
- **기차/고속버스**: 승차권 또는 예약 확인서
- **항공료**: 항공권 영수증 및 탑승권

#### 택시
- **일반 택시**: 택시 영수증 (출발지/도착지 기재)
- **법인택시**: 카드 결제 시 영수증
- **사유**: 대중교통 불가 사유 명시 (야근, 짐 운반 등)

#### 자가용 이용
- **주행거리**: 출발지~목적지 거리 (km)
- **지급 기준**: km당 300원
- **증빙**: 주행경로 캡처 또는 증명서

### 3.2 식비

#### 업무 미팅
- **점심**: 1인당 15,000원 한도
- **저녁**: 1인당 25,000원 한도
- **참석자**: 참석자 명단 및 소속 기재
- **목적**: 미팅 목적 및 안건 간략 기재

#### 출장 중 식사
- **조식**: 1인당 8,000원 한도
- **중식**: 1인당 12,000원 한도
- **석식**: 1인당 20,000원 한도

#### 접대비
- **고객 접대**: 사전 승인 필요
- **한도**: 1회 최대 20만원
- **증빙**: 참석자 명단, 접대 목적서

### 3.3 숙박비

#### 국내 출장
- **일반 호텔**: 1박 최대 12만원
- **비즈니스 호텔**: 1박 최대 8만원
- **모텔/게스트하우스**: 1박 최대 5만원

#### 해외 출장
- **지역별 한도**: 출장 지역에 따라 차등 적용
- **환율**: 결제일 기준 환율 적용
- **증빙**: 호텔 영수증 및 체크인/아웃 확인서

### 3.4 교육비

#### 외부 교육
- **세미나/워크샵**: 참가비 전액 지원
- **자격증 시험**: 합격 시 응시료 지원
- **온라인 강의**: 업무 관련 강의 월 5만원 한도

#### 도서 구입
- **업무 관련 도서**: 월 3만원 한도
- **전자책**: 동일 한도 적용
- **잡지/신문**: 연간 구독료 지원

## 4. 영수증 관리

### 4.1 영수증 요구사항

#### 필수 기재사항
- **발행일자**: 실제 지출 발생일
- **상호명**: 지출처 명칭
- **금액**: 정확한 지출 금액
- **품목**: 구체적인 지출 내역

#### 전자영수증
- 이메일로 받은 영수증도 유효
- PDF 파일 그대로 첨부
- 화면 캡처본도 인정

### 4.2 영수증 분실 시 대응

#### 분실증명서 작성
- 양식: 인트라넷에서 다운로드
- 기재사항: 일시, 장소, 금액, 사유
- 승인: 직속 상관 확인 후 제출

#### 신용카드 내역서
- 카드사에서 발급받은 상세 내역
- 가맹점명, 결제 금액 확인 가능한 것
- 영수증 대용으로 사용 가능

### 4.3 영수증 보관

#### 원본 보관
- 정산 완료 후 1년간 보관
- 세무조사 대비 증빙 자료
- 분실 시 개인 책임

#### 디지털 보관
- 스캔 파일 별도 보관 권장
- 클라우드 저장소 활용
- 파일명: "날짜_항목_금액" 형식

## 5. 승인 및 지급 프로세스

### 5.1 승인 단계

#### 1차 승인: 직속 상관
- 제출 후 2일 내 승인/반려
- 반려 시 반려 사유 통보
- 수정 후 재제출 가능

#### 2차 승인: 회계팀
- 1차 승인 후 자동 이관
- 증빙 서류 검토
- 정산 규정 준수 여부 확인

#### 최종 승인: 재무팀
- 50만원 이상 정산 건
- 월별 정산 한도 검토
- 예산 범위 내 지급 결정

### 5.2 지급 일정
- **정산 마감**: 매월 25일
- **지급일**: 다음 달 10일
- **급여**: 급여와 함께 지급
- **긴급 정산**: 별도 협의

### 5.3 정산 현황 조회
- **실시간 조회**: 시스템에서 진행 상황 확인
- **SMS 알림**: 승인/반려 시 자동 알림
- **이메일 알림**: 지급 완료 시 상세 내역 발송

## 6. 법인카드 사용

### 6.1 발급 대상
- **팀장급 이상**: 기본 발급
- **영업/기획직**: 업무 필요시 발급
- **출장 빈도 높은 직원**: 임시 발급

### 6.2 사용 규칙

#### 사용 가능 항목
- 업무 목적의 모든 비용
- 접대비, 교통비, 숙박비
- 사무용품, 교육비

#### 사용 불가 항목
- 개인적 용도의 비용
- 현금 서비스
- 할부 결제

### 6.3 사용 후 처리
- **사용 즉시**: 영수증 보관
- **월말 정산**: 카드 사용 내역 확인
- **증빙 제출**: 영수증과 함께 사용 목적 기재

## 7. 세무 관련 주의사항

### 7.1 세금계산서 vs 영수증

#### 세금계산서 발급 대상
- 3만원 이상 사업자 지출
- 접대비로 처리되는 비용
- 사무용품, 교육비 등

#### 영수증 발급 대상
- 3만원 미만 소액 지출
- 개인사업자 지출
- 식비, 교통비 등

### 7.2 접대비 한도
- **중소기업**: 연 매출의 0.2% 또는 1,200만원 중 큰 금액
- **초과 시**: 세무상 손금 불인정
- **관리**: 월별 접대비 사용 현황 모니터링

### 7.3 원천징수 대상
- **강사료**: 소득세 8.8% 원천징수
- **원고료**: 소득세 8.8% 원천징수  
- **용역비**: 사업소득세 3.3% 원천징수

## 8. 자주 묻는 질문 (FAQ)

### Q1: 개인 신용카드로 결제한 비용도 정산 가능한가요?
A: 네, 가능합니다. 업무 목적이 명확하고 적정한 영수증이 있으면 정산 가능합니다.

### Q2: 주말 야근 시 택시비도 지원되나요?
A: 네, 업무상 필요에 의한 야근이며 대중교통 이용이 불가능한 경우 택시비를 지원합니다.

### Q3: 영수증을 분실했는데 어떻게 하나요?
A: 분실증명서를 작성하거나 신용카드 결제 내역서를 제출하시면 됩니다.

### Q4: 출장 중 동료와 함께 식사한 경우 어떻게 정산하나요?
A: 1인이 대표로 결제하고 참석자 전원 명단을 기재하여 정산하시면 됩니다.

### Q5: 정산 한도를 초과한 경우에는 어떻게 하나요?
A: 사전에 부서장 승인을 받거나, 부득이한 경우 사후 승인을 받아 처리할 수 있습니다.

## 9. 연락처 및 문의

### 회계팀 (정산 문의)
- **전화**: 내선 1200
- **이메일**: accounting@coev1.com
- **위치**: 9층 회계팀
- **업무시간**: 평일 9시-6시

### IT 헬프데스크 (시스템 문의)
- **전화**: 내선 2000
- **이메일**: help@coev1.com
- **원격지원**: TeamViewer를 통한 원격 지원

### 총무팀 (법인카드 관리)
- **전화**: 내선 1004
- **이메일**: facility@coev1.com
- **카드 발급/분실 신고**: 즉시 연락

올바른 경비 정산으로 회사와 개인 모두에게 도움이 되길 바랍니다! 💰`,
    authorId: '8',
    authorName: '박회계',
    createdAt: '2023-12-28T10:30:00Z',
    updatedAt: '2024-01-11T14:00:00Z',
    tags: ['경비', '정산', '회계', '비용처리'],
  },
];

export function WikiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const wiki = mockWikis.find(w => w.id === id);

  if (!wiki) {
    return (
      <div className="p-6 text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">위키 문서를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">요청하신 문서가 존재하지 않거나 삭제되었습니다.</p>
        <Button onClick={() => navigate('/wiki')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          위키 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpdated = (createdAt: string, updatedAt?: string) => {
    if (!updatedAt) return false;
    return new Date(updatedAt) > new Date(createdAt);
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 타입에 따른 아이콘 반환
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('text/') || type.includes('markdown')) return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // 파일 다운로드 함수
  const downloadFile = async (attachment: Attachment) => {
    try {
      // 실제 환경에서는 인증 토큰과 함께 API 호출
      const response = await fetch(attachment.url, {
        method: 'GET',
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        // }
      });

      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      // Blob 생성
      const blob = await response.blob();
      
      // 다운로드 링크 생성
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = attachment.originalName || attachment.name;
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success(`${attachment.originalName} 파일이 다운로드되었습니다.`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 마크다운 스타일 렌더링을 위한 간단한 변환
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // 헤딩 처리
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 first:mt-0 break-words">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl sm:text-2xl font-semibold mt-5 sm:mt-6 mb-2 sm:mb-3 break-words">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg sm:text-xl font-medium mt-4 sm:mt-5 mb-2 break-words">{line.substring(4)}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-base sm:text-lg font-medium mt-3 sm:mt-4 mb-2 break-words">{line.substring(5)}</h4>;
        }
        
        // 코드 블록 처리
        if (line.startsWith('```')) {
          const codeContent = line.substring(3);
          return (
            <div key={index} className="bg-muted p-3 rounded-lg font-mono text-sm my-2 overflow-x-auto">
              <code className="break-all">{codeContent}</code>
            </div>
          );
        }
        
        // 인라인 코드 처리
        if (line.includes('`')) {
          const parts = line.split('`');
          return (
            <p key={index} className="mb-2 leading-relaxed break-words">
              {parts.map((part, i) => 
                i % 2 === 1 ? 
                  <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono break-all">{part}</code> : 
                  part
              )}
            </p>
          );
        }
        
        // 리스트 처리
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 mb-1 break-words leading-relaxed">
              {line.substring(2)}
            </li>
          );
        }
        
        // 번호 리스트 처리
        if (/^\d+\. /.test(line)) {
          return (
            <li key={index} className="ml-4 mb-1 break-words leading-relaxed list-decimal">
              {line.replace(/^\d+\. /, '')}
            </li>
          );
        }
        
        // 볼드 텍스트 처리
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="mb-2 leading-relaxed break-words">
              {parts.map((part, i) => 
                i % 2 === 1 ? 
                  <strong key={i} className="font-semibold">{part}</strong> : 
                  part
              )}
            </p>
          );
        }
        
        // 빈 줄
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        
        // 일반 텍스트
        return <p key={index} className="mb-2 leading-relaxed break-words text-sm sm:text-base">{line}</p>;
      });
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/wiki')}
          className="self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          위키 목록으로 돌아가기
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            편집
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b p-3 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl leading-tight break-words">
                {wiki.title}
              </CardTitle>
              {isUpdated(wiki.createdAt, wiki.updatedAt) && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  업데이트됨
                </Badge>
              )}
            </div>
          </div>
          
          {/* 메타 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">작성자: {wiki.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="truncate">작성일: {formatDate(wiki.createdAt)}</span>
            </div>
            {wiki.updatedAt && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">수정일: {formatDate(wiki.updatedAt)}</span>
              </div>
            )}
          </div>
          
          {/* 태그 */}
          {wiki.tags && wiki.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              {wiki.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-3 sm:p-6">
          {/* 본문 내용 */}
          <div className="max-w-none overflow-hidden mb-6">
            <div className="space-y-4">
              {renderContent(wiki.content)}
            </div>
          </div>

          {/* 첨부파일 섹션 */}
          {wiki.attachments && wiki.attachments.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Download className="h-5 w-5" />
                첨부파일 ({wiki.attachments.length})
              </h3>
              <div className="space-y-3">
                {wiki.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getFileIcon(attachment.type)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm">
                          {attachment.originalName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(attachment.size)}</span>
                          <span>•</span>
                          <span>{formatDate(attachment.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(attachment)}
                      className="shrink-0"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}