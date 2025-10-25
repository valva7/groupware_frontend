import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute, PublicRoute } from '@/components/AuthRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

// Approval pages
import { ApprovalDraft } from './pages/approval/ApprovalDraft';
import { ApprovalList } from './pages/approval/ApprovalList';
import { ApprovalDetail } from './pages/approval/ApprovalDetail';

// Project pages
import { ProjectList } from './pages/projects/ProjectList';
import { ProjectResources } from './pages/projects/ProjectResources';
import { ProjectCreate } from './pages/projects/ProjectCreate';
import { ProjectDetail } from './pages/projects/ProjectDetail';

// Vote pages
import { VoteList } from './pages/votes/VoteList';
import { VoteCreate } from './pages/votes/VoteCreate';

// Organization pages
import { DepartmentList } from './pages/organization/DepartmentList';
import { MemberList } from './pages/organization/MemberList';

// Communication pages
import { Board } from './pages/communication/Board';
import { Wiki } from './pages/communication/Wiki';
import { Manual } from './pages/communication/Manual';
import { PostCreate } from './pages/communication/PostCreate';
import { PostDetail } from './pages/communication/PostDetail';
import { WikiCreate } from './pages/communication/WikiCreate';
import { WikiDetail } from './pages/communication/WikiDetail';
import { ManualCreate } from './pages/communication/ManualCreate';
import { ManualDetail } from './pages/communication/ManualDetail';

// Admin pages
import { AdminApproval } from './pages/admin/AdminApproval';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminOrganization } from './pages/admin/AdminOrganization';
import { AdminAssets } from './pages/admin/AdminAssets';
import { AdminApprovalLines } from './pages/admin/AdminApprovalLines';
import { AdminCommonCodes } from './pages/admin/AdminCommonCodes';

// Profile page
import { Profile } from './pages/Profile';

import {useAuthStore} from "@/store/useAuthStore";
import {useEffect} from "react";

export default function App() {

  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession(); // 새로고침/브라우저 재시작 시 세션 복원
  }, [restoreSession]);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Approval routes */}
            <Route path="approval/draft" element={<ApprovalDraft />} />
            <Route path="approval/list" element={<ApprovalList />} />
            <Route path="approval/detail/:id" element={<ApprovalDetail />} />
            
            {/* Project routes */}
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/create" element={<ProjectCreate />} />
            <Route path="projects/detail/:id" element={<ProjectDetail />} />
            <Route path="projects/resources" element={<ProjectResources />} />
            
            {/* Vote routes */}
            <Route path="votes" element={<VoteList />} />
            <Route path="votes/create" element={<VoteCreate />} />
            
            {/* Organization routes */}
            <Route path="organization/departments" element={<DepartmentList />} />
            <Route path="organization/members" element={<MemberList />} />
            
            {/* Communication routes */}
            <Route path="board" element={<Board />} />
            <Route path="board/create" element={<PostCreate />} />
            <Route path="board/detail/:id" element={<PostDetail />} />
            <Route path="wiki" element={<Wiki />} />
            <Route path="wiki/create" element={<WikiCreate />} />
            <Route path="wiki/detail/:id" element={<WikiDetail />} />
            <Route path="manual" element={<Manual />} />
            <Route path="manual/create" element={<ManualCreate />} />
            <Route path="manual/detail/:id" element={<ManualDetail />} />
            
            {/* Admin routes */}
            <Route path="admin/approval" element={<AdminApproval />} />
            <Route path="admin/posts" element={<AdminPosts />} />
            <Route path="admin/posts/detail/:id" element={<PostDetail />} />
            <Route path="admin/posts/edit/:id" element={<PostCreate />} />
            <Route path="admin/members" element={<AdminMembers />} />
            <Route path="admin/organization" element={<AdminOrganization />} />
            <Route path="admin/assets" element={<AdminAssets />} />
            <Route path="admin/approval-lines" element={<AdminApprovalLines />} />
            <Route path="admin/common-codes" element={<AdminCommonCodes />} />
            
            {/* Profile route */}
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}