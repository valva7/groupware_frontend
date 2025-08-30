import { HeroPanel } from "./HeroPanel";
import { VotingSection } from "./VotingSection";
import { RecentPosts } from "./RecentPosts";
import { MyVacationInfo } from "./MyVacationInfo";
import { ElectronicApprovalList } from "./ElectronicApprovalList";
import { ApprovalForm } from "./ApprovalForm";
import { ApprovalRequestPage } from "./pages/ApprovalRequestPage";
import { ProjectPages } from "./pages/ProjectPages";
import { BoardPages } from "./pages/BoardPages";
import { OrganizationPages } from "./pages/OrganizationPages";
import { VotePages } from "./pages/VotePages";
import { ResourcePages } from "./pages/ResourcePages";
import { WikiPages } from "./pages/WikiPages";
import { ManualPages } from "./pages/ManualPages";
import { MyInfoPage } from "./pages/MyInfoPage";

// 관리자 페이지 imports
import { AdminApprovalManagementPage } from "./pages/admin/AdminApprovalManagementPage";
import { AdminPostManagementPage } from "./pages/admin/AdminPostManagementPage";
import { AdminPostsPage } from "./pages/admin/AdminPostsPage";
import { AdminEmployeeCreatePage } from "./pages/admin/AdminEmployeeCreatePage";
import { AdminOrganizationPage } from "./pages/admin/AdminOrganizationPage";
import { AdminAssetsPage } from "./pages/admin/AdminAssetsPage";
import { AdminApprovalLinesPage } from "./pages/admin/AdminApprovalLinesPage";
import { AdminCommonCodePage } from "./pages/admin/AdminCommonCodePage";
import { AdminEmployeeManagementPage } from "./pages/admin/AdminEmployeeManagementPage";
import { AdminProjectManagementPage } from "./pages/admin/AdminProjectManagementPage";
import { AdminMenuManagementPage } from "./pages/admin/AdminMenuManagementPage";

import { FileText } from "lucide-react";
import { PAGE_TITLES } from "../data/constants";

interface AppRouterProps {
  currentPage: string;
  currentFormType: string;
  handleCreateApproval: (formType: string) => void;
  handleBackToApprovalList: () => void;
  appState: any; // 모든 상태들을 포함
}

export function AppRouter({
  currentPage,
  currentFormType,
  handleCreateApproval,
  handleBackToApprovalList,
  appState
}: AppRouterProps) {
  const getPageTitle = () => {
    return PAGE_TITLES[currentPage as keyof typeof PAGE_TITLES] || "대시보드";
  };

  // 관리자 메뉴 페이지들
  if (currentPage === "admin-approval-management") {
    return <AdminApprovalManagementPage />;
  }
  
  if (currentPage === "admin-post-management") {
    return <AdminPostManagementPage />;
  }
  
  if (currentPage === "admin-posts") {
    return <AdminPostsPage />;
  }
  
  if (currentPage === "admin-employee-create") {
    return <AdminEmployeeCreatePage />;
  }
  
  if (currentPage === "admin-organization") {
    return <AdminOrganizationPage />;
  }
  
  if (currentPage === "admin-assets") {
    return <AdminAssetsPage />;
  }
  
  if (currentPage === "admin-approval-lines") {
    return <AdminApprovalLinesPage />;
  }
  
  if (currentPage === "admin-common-code") {
    return <AdminCommonCodePage />;
  }
  
  if (currentPage === "admin-employee-management") {
    return <AdminEmployeeManagementPage />;
  }

  if (currentPage === "admin-project-management") {
    return <AdminProjectManagementPage appState={appState} />;
  }

  if (currentPage === "admin-menu-management") {
    return <AdminMenuManagementPage />;
  }

  // 프로젝트 관련 페이지들
  if (["project-create", "project-create-form", "project-detail", "project-status"].includes(currentPage)) {
    return (
      <ProjectPages
        currentPage={currentPage}
        projects={appState.projects}
        setProjects={appState.setProjects}
        employees={appState.employees}
        departments={appState.departments}
        selectedProject={appState.selectedProject}
        setSelectedProject={appState.setSelectedProject}
        setCurrentPage={appState.setCurrentPage}
        projectForm={appState.projectForm}
        setProjectForm={appState.setProjectForm}
      />
    );
  }

  // 게시판 관련 페이지들
  if (["board", "board-create", "board-detail"].includes(currentPage)) {
    return (
      <BoardPages
        currentPage={currentPage}
        boardPosts={appState.boardPosts}
        setBoardPosts={appState.setBoardPosts}
        selectedBoardCategory={appState.selectedBoardCategory}
        setSelectedBoardCategory={appState.setSelectedBoardCategory}
        boardSearchTerm={appState.boardSearchTerm}
        setBoardSearchTerm={appState.setBoardSearchTerm}
        selectedPost={appState.selectedPost}
        setSelectedPost={appState.setSelectedPost}
        setCurrentPage={appState.setCurrentPage}
        boardForm={appState.boardForm}
        setBoardForm={appState.setBoardForm}
        currentUser={appState.currentUser}
        employees={appState.employees}
      />
    );
  }

  // 조직도 관련 페이지들
  if (["department-list", "employee-status"].includes(currentPage)) {
    return (
      <OrganizationPages
        currentPage={currentPage}
        departments={appState.departments}
        setDepartments={appState.setDepartments}
        employees={appState.employees}
        setEmployees={appState.setEmployees}
        selectedDepartmentFilter={appState.selectedDepartmentFilter}
        setSelectedDepartmentFilter={appState.setSelectedDepartmentFilter}
        selectedDepartment={appState.selectedDepartment}
        setSelectedDepartment={appState.setSelectedDepartment}
        selectedEmployee={appState.selectedEmployee}
        setSelectedEmployee={appState.setSelectedEmployee}
        departmentForm={appState.departmentForm}
        setDepartmentForm={appState.setDepartmentForm}
        employeeForm={appState.employeeForm}
        setEmployeeForm={appState.setEmployeeForm}
        currentUser={appState.currentUser}
      />
    );
  }

  // 투표 관련 페이지들
  if (["vote-create", "vote-list"].includes(currentPage)) {
    return (
      <VotePages
        currentPage={currentPage}
        votes={appState.votes}
        setVotes={appState.setVotes}
        selectedVote={appState.selectedVote}
        setSelectedVote={appState.setSelectedVote}
        voteForm={appState.voteForm}
        setVoteForm={appState.setVoteForm}
        employees={appState.employees}
        departments={appState.departments}
        currentUser={appState.currentUser}
      />
    );
  }

  // 리소스 관리 페이지
  if (currentPage === "resource-management") {
    return (
      <ResourcePages
        currentPage={currentPage}
        employees={appState.employees}
        setEmployees={appState.setEmployees}
        departments={appState.departments}
        projects={appState.projects}
        setProjects={appState.setProjects}
      />
    );
  }

  // 사내 위키 페이지
  if (currentPage === "wiki") {
    return (
      <WikiPages
        currentPage={currentPage}
        wikiDocuments={appState.wikiDocuments}
        setWikiDocuments={appState.setWikiDocuments}
        selectedWikiCategory={appState.selectedWikiCategory}
        setSelectedWikiCategory={appState.setSelectedWikiCategory}
        wikiSearchTerm={appState.wikiSearchTerm}
        setWikiSearchTerm={appState.setWikiSearchTerm}
        selectedWikiDoc={appState.selectedWikiDoc}
        setSelectedWikiDoc={appState.setSelectedWikiDoc}
        wikiForm={appState.wikiForm}
        setWikiForm={appState.setWikiForm}
        currentUser={appState.currentUser}
      />
    );
  }

  // 메뉴얼 페이지
  if (currentPage === "manual") {
    return (
      <ManualPages
        currentPage={currentPage}
        manuals={appState.manuals}
        setManuals={appState.setManuals}
        selectedManualCategory={appState.selectedManualCategory}
        setSelectedManualCategory={appState.setSelectedManualCategory}
        manualSearchTerm={appState.manualSearchTerm}
        setManualSearchTerm={appState.setManualSearchTerm}
        selectedManual={appState.selectedManual}
        setSelectedManual={appState.setSelectedManual}
        manualForm={appState.manualForm}
        setManualForm={appState.setManualForm}
        currentUser={appState.currentUser}
      />
    );
  }

  // 내 정보 페이지
  if (currentPage === "my-info") {
    return (
      <MyInfoPage
        currentPage={currentPage}
        currentUser={appState.currentUser}
      />
    );
  }

  switch (currentPage) {
    case "dashboard":
      return (
        <div className="space-y-6 lg:space-y-8">
          {/* 내 휴가 정보 - 최상단 */}
          <MyVacationInfo />
          
          {/* 프로젝트 현황 및 전자결재 목록 */}
          <HeroPanel employees={appState.employees} />
          
          {/* 투표 시스템 및 최근 게시글 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <VotingSection />
            <RecentPosts />
          </div>
        </div>
      );
    case "approval-list":
      return <ElectronicApprovalList onCreateApproval={handleCreateApproval} />;
    case "approval-form":
      return (
        <ApprovalForm 
          formType={currentFormType} 
          onBack={handleBackToApprovalList}
          employees={appState.employees}
          departments={appState.departments}
        />
      );
    case "approval-request":
      return (
        <ApprovalRequestPage
          employees={appState.employees}
          departments={appState.departments}
          currentUser={appState.currentUser}
          onBack={() => appState.setCurrentPage("approval-list")}
        />
      );
    
    default:
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">{getPageTitle()}</h3>
            <p className="text-sm text-muted-foreground">페이지가 개발 중입니다.</p>
          </div>
        </div>
      );
  }
}