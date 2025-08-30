import { useState } from "react";
import { 
  initialVotes, 
  initialDepartments, 
  initialEmployees, 
  initialProjects, 
  initialWikiDocuments, 
  initialManuals,
  initialBoardPosts,
  currentUser as initialCurrentUser 
} from "../data/initialData";

export function useAppState() {
  // 기본 상태
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentFormType, setCurrentFormType] = useState<string>("");
  
  // 데이터 상태들
  const [votes, setVotes] = useState(initialVotes);
  const [departments, setDepartments] = useState(initialDepartments);
  const [employees, setEmployees] = useState(initialEmployees);
  const [projects, setProjects] = useState(initialProjects);
  const [wikiDocuments, setWikiDocuments] = useState(initialWikiDocuments);
  const [manuals, setManuals] = useState(initialManuals);
  const [boardPosts, setBoardPosts] = useState(initialBoardPosts);
  const [currentUser] = useState(initialCurrentUser);

  // 게시판 관련 상태
  const [selectedBoardCategory, setSelectedBoardCategory] = useState("전체");
  const [boardSearchTerm, setBoardSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [boardForm, setBoardForm] = useState({
    title: "",
    content: "",
    category: "공지사항"
  });

  // 필터 상태
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("전체");
  const [selectedWikiCategory, setSelectedWikiCategory] = useState("전체");
  const [selectedManualCategory, setSelectedManualCategory] = useState("전체");
  const [wikiSearchTerm, setWikiSearchTerm] = useState("");
  const [manualSearchTerm, setManualSearchTerm] = useState("");
  
  // 선택된 아이템들
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedVote, setSelectedVote] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedWikiDoc, setSelectedWikiDoc] = useState<any>(null);
  const [selectedManual, setSelectedManual] = useState<any>(null);
  
  // 폼 데이터
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    template: "",
    manager: "",
    team: "",
    startDate: "",
    endDate: "",
    budget: "",
    files: [] as File[]
  });
  
  const [voteForm, setVoteForm] = useState({
    title: "",
    description: "",
    type: "single",
    options: ["", ""],
    startDate: "",
    endDate: "",
    target: "all",
    anonymous: false
  });
  
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    manager: "",
    budget: ""
  });
  
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    joinDate: ""
  });

  const [wikiForm, setWikiForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });
  
  const [manualForm, setManualForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    file: null as File | null
  });

  return {
    // 기본 상태
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
    
    // 데이터 상태
    votes,
    setVotes,
    departments,
    setDepartments,
    employees,
    setEmployees,
    projects,
    setProjects,
    wikiDocuments,
    setWikiDocuments,
    manuals,
    setManuals,
    boardPosts,
    setBoardPosts,
    currentUser,
    
    // 게시판 상태
    selectedBoardCategory,
    setSelectedBoardCategory,
    boardSearchTerm,
    setBoardSearchTerm,
    selectedPost,
    setSelectedPost,
    boardForm,
    setBoardForm,
    
    // 필터 상태
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
    selectedWikiCategory,
    setSelectedWikiCategory,
    selectedManualCategory,
    setSelectedManualCategory,
    wikiSearchTerm,
    setWikiSearchTerm,
    manualSearchTerm,
    setManualSearchTerm,
    
    // 선택된 아이템들
    selectedProject,
    setSelectedProject,
    selectedVote,
    setSelectedVote,
    selectedDepartment,
    setSelectedDepartment,
    selectedEmployee,
    setSelectedEmployee,
    selectedWikiDoc,
    setSelectedWikiDoc,
    selectedManual,
    setSelectedManual,
    
    // 폼 데이터
    projectForm,
    setProjectForm,
    voteForm,
    setVoteForm,
    departmentForm,
    setDepartmentForm,
    employeeForm,
    setEmployeeForm,
    wikiForm,
    setWikiForm,
    manualForm,
    setManualForm
  };
}