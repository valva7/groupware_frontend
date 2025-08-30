import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Textarea } from "../../ui/textarea";
import { ScrollArea } from "../../ui/scroll-area";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Switch } from "../../ui/switch";
import { Alert, AlertDescription } from "../../ui/alert";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Pin, 
  MessageSquare, 
  AlertTriangle,
  FileText,
  Filter
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// 게시물 데이터 타입
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  category: string;
  board: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  comments: number;
  likes: number;
  isPinned: boolean;
  isHidden: boolean;
  status: "게시중" | "숨김" | "삭제예정" | "신고됨";
  priority: "높음" | "보통" | "낮음";
  hasAttachments: boolean;
  reportCount: number;
}

const allPosts: Post[] = [
  {
    id: 1,
    title: "4월 정기 회의 안건 공지",
    content: "4월 정기 회의가 4월 15일 오후 2시에 진행됩니다. 주요 안건: 신규 프로젝트 검토, 인사 발령 건...",
    author: "관리자",
    authorId: "admin",
    department: "관리팀",
    category: "공지사항",
    board: "전체공지",
    createdAt: "2024-04-10",
    updatedAt: "2024-04-10",
    views: 127,
    comments: 5,
    likes: 12,
    isPinned: true,
    isHidden: false,
    status: "게시중",
    priority: "높음",
    hasAttachments: true,
    reportCount: 0
  },
  {
    id: 2,
    title: "점심시간 식당 이용 안내",
    content: "식당 리모델링으로 인한 임시 운영 안내드립니다...",
    author: "김철수",
    authorId: "kim001",
    department: "총무팀",
    category: "일반",
    board: "자유게시판",
    createdAt: "2024-04-09",
    updatedAt: "2024-04-09",
    views: 89,
    comments: 12,
    likes: 8,
    isPinned: false,
    isHidden: false,
    status: "게시중",
    priority: "보통",
    hasAttachments: false,
    reportCount: 0
  },
  {
    id: 3,
    title: "보안 교육 필수 참여 안내",
    content: "모든 직원은 4월 말까지 온라인 보안 교육을 필수로 이수해야 합니다...",
    author: "박영희",
    authorId: "park002",
    department: "보안팀",
    category: "교육",
    board: "공지사항",
    createdAt: "2024-04-08",
    updatedAt: "2024-04-08",
    views: 156,
    comments: 8,
    likes: 15,
    isPinned: true,
    isHidden: false,
    status: "게시중",
    priority: "높음",
    hasAttachments: true,
    reportCount: 0
  },
  {
    id: 4,
    title: "부적절한 내용의 게시물",
    content: "개인적인 불만을 표출한 게시물로 신고가 접수되었습니다.",
    author: "최민수",
    authorId: "choi004",
    department: "개발팀",
    category: "일반",
    board: "자유게시판",
    createdAt: "2024-04-06",
    updatedAt: "2024-04-06",
    views: 23,
    comments: 0,
    likes: 0,
    isPinned: false,
    isHidden: true,
    status: "신고됨",
    priority: "낮음",
    hasAttachments: false,
    reportCount: 3
  }
];

const categories = ["전체", "공지사항", "일반", "업무", "교육", "행사"];
const boards = ["전체", "전체공지", "자유게시판", "업무게시판", "공지사항"];
const statusList = ["전체", "게시중", "숨김", "삭제예정", "신고됨"];
const priorityList = ["전체", "높음", "보통", "낮음"];

export function AdminPostManagementPage() {
  const [posts, setPosts] = useState<Post[]>(allPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedBoard, setSelectedBoard] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedPriority, setSelectedPriority] = useState("전체");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    category: "",
    priority: "보통" as Post['priority'],
    isPinned: false,
    isHidden: false
  });

  // 필터링된 게시물
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
    const matchesBoard = selectedBoard === "전체" || post.board === selectedBoard;
    const matchesStatus = selectedStatus === "전체" || post.status === selectedStatus;
    const matchesPriority = selectedPriority === "전체" || post.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesBoard && matchesStatus && matchesPriority;
  });

  // 통계 계산
  const getStats = () => {
    const total = posts.length;
    const published = posts.filter(p => p.status === "게시중").length;
    const hidden = posts.filter(p => p.isHidden || p.status === "숨김").length;
    const reported = posts.filter(p => p.status === "신고됨").length;
    const pinned = posts.filter(p => p.isPinned).length;
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    
    return { total, published, hidden, reported, pinned, totalViews, totalComments, totalLikes };
  };

  const { total, published, hidden, reported, pinned, totalViews, totalComments, totalLikes } = getStats();

  // 액션 핸들러들
  const handleTogglePin = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isPinned: !post.isPinned } : post
    ));
    const post = posts.find(p => p.id === postId);
    toast.success(`게시물이 ${post?.isPinned ? '고정 해제' : '고정'}되었습니다.`);
  };

  const handleToggleHide = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { 
        ...post, 
        isHidden: !post.isHidden,
        status: post.isHidden ? "게시중" : "숨김" as Post['status']
      } : post
    ));
    const post = posts.find(p => p.id === postId);
    toast.success(`게시물이 ${post?.isHidden ? '표시' : '숨김'} 처리되었습니다.`);
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;
    setPosts(posts.filter(post => post.id !== selectedPost.id));
    setIsDeleteDialogOpen(false);
    setSelectedPost(null);
    toast.success("게시물이 삭제되었습니다.");
  };

  const handleEditPost = () => {
    if (!selectedPost) return;

    setPosts(posts.map(post => 
      post.id === selectedPost.id ? { 
        ...post, 
        title: editForm.title,
        content: editForm.content,
        category: editForm.category,
        priority: editForm.priority,
        isPinned: editForm.isPinned,
        isHidden: editForm.isHidden,
        status: editForm.isHidden ? "숨김" : "게시중" as Post['status'],
        updatedAt: new Date().toISOString().split('T')[0]
      } : post
    ));
    setIsEditDialogOpen(false);
    setSelectedPost(null);
    toast.success("게시물이 수정되었습니다.");
  };

  const openEditDialog = (post: Post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      content: post.content,
      category: post.category,
      priority: post.priority,
      isPinned: post.isPinned,
      isHidden: post.isHidden
    });
    setIsEditDialogOpen(true);
  };

  // 배지 컴포넌트들
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "높음":
        return <Badge variant="destructive" className="text-xs">높음</Badge>;
      case "보통":
        return <Badge variant="secondary" className="text-xs">보통</Badge>;
      case "낮음":
        return <Badge variant="outline" className="text-xs">낮음</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">보통</Badge>;
    }
  };

  const getStatusBadge = (status: string, reportCount: number = 0) => {
    switch (status) {
      case "게시중":
        return <Badge className="bg-green-100 text-green-700 text-xs">게시중</Badge>;
      case "숨김":
        return <Badge className="bg-gray-100 text-gray-700 text-xs">숨김</Badge>;
      case "삭제예정":
        return <Badge className="bg-orange-100 text-orange-700 text-xs">삭제예정</Badge>;
      case "신고됨":
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-red-100 text-red-700 text-xs">신고됨</Badge>
            {reportCount > 0 && (
              <span className="text-xs text-red-600">({reportCount}건)</span>
            )}
          </div>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 - 모바일 반응형 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl">게시물 관리</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            전체 게시판의 게시물을 통합 관리하고 모니터링할 수 있습니다.
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          공지사항 작성
        </Button>
      </div>

      {/* 통계 카드 - 모바일 반응형 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">전체 게시물</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl">{total}</div>
            <p className="text-xs text-muted-foreground">
              게시중 {published}개 • 숨김 {hidden}개
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">신고된 게시물</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl text-red-600">{reported}</div>
            <p className="text-xs text-muted-foreground">
              처리 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 조회수</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              댓글 {totalComments}개 • 좋아요 {totalLikes}개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">고정 게시물</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl">{pinned}</div>
            <p className="text-xs text-muted-foreground">
              상단 고정중
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 - 모바일 반응형 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 작성자, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                <SelectTrigger>
                  <SelectValue placeholder="게시판" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map(board => (
                    <SelectItem key={board} value={board}>{board}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  {statusList.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="우선순위" />
                </SelectTrigger>
                <SelectContent>
                  {priorityList.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 게시물 목록 - 모바일 반응형 */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">게시물 목록 ({filteredPosts.length}개)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {/* 데스크톱: 테이블 레이아웃 */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>게시물 정보</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>게시판/카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>우선순위</TableHead>
                    <TableHead>조회/댓글</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className={post.reportCount > 0 ? "bg-red-50" : ""}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-1">
                            {post.isPinned && <Pin className="h-4 w-4 text-pastel-blue-600" />}
                            {post.hasAttachments && <FileText className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{post.title}</div>
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {post.content.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {post.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">{post.author}</div>
                            <div className="text-xs text-muted-foreground">{post.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{post.board}</div>
                          <Badge variant="outline" className="text-xs mt-1">{post.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status, post.reportCount)}</TableCell>
                      <TableCell>{getPriorityBadge(post.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{post.views}</span>
                          <span>/</span>
                          <span>{post.comments}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{post.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsViewDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(post.id)}
                            className={`h-8 w-8 p-0 ${post.isPinned ? "text-pastel-blue-600" : ""}`}
                          >
                            <Pin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* 모바일: 카드 레이아웃 */}
          <div className="lg:hidden">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className={`${post.reportCount > 0 ? "border-red-200 bg-red-50" : ""}`}>
                    <CardContent className="p-4">
                      {/* 게시물 헤더 */}
                      <div className="flex items-start gap-2 mb-3">
                        <div className="flex flex-col items-center gap-1 mt-1 flex-shrink-0">
                          {post.isPinned && <Pin className="h-4 w-4 text-pastel-blue-600" />}
                          {post.hasAttachments && <FileText className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm leading-5 line-clamp-2 mb-2">{post.title}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {getPriorityBadge(post.priority)}
                            {getStatusBadge(post.status, post.reportCount)}
                          </div>
                        </div>
                      </div>

                      {/* 게시물 내용 미리보기 */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {post.content.substring(0, 80)}...
                      </p>

                      {/* 작성자 정보 및 게시판 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {post.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{post.author}</div>
                            <div className="text-xs text-muted-foreground">{post.department}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">{post.board}</div>
                          <Badge variant="outline" className="text-xs mt-1">{post.category}</Badge>
                        </div>
                      </div>

                      {/* 통계 및 날짜 */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-red-500">♥</span>
                            <span>{post.likes}</span>
                          </div>
                        </div>
                        <span>{post.createdAt}</span>
                      </div>

                      {/* 액션 버튼들 */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsViewDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(post.id)}
                            className={`h-8 w-8 p-0 ${post.isPinned ? "text-pastel-blue-600" : ""}`}
                          >
                            <Pin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleHide(post.id)}
                            className={`h-8 w-8 p-0 ${post.isHidden ? "text-red-600" : ""}`}
                          >
                            {post.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-muted-foreground mb-2">게시물이 없습니다</h3>
                    <p className="text-sm text-muted-foreground">검색 조건에 맞는 게시물을 찾을 수 없습니다.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* 게시물 상세보기 다이얼로그 - 모바일 반응형 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" aria-describedby="view-post-description">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-base sm:text-lg">게시물 상세보기</DialogTitle>
            <DialogDescription id="view-post-description" className="text-sm">
              게시물의 상세 내용과 통계를 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {/* 게시물 정보 - 모바일 반응형 */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-medium leading-6 mb-2">{selectedPost.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>작성자: {selectedPost.author} ({selectedPost.department})</span>
                        <span>게시판: {selectedPost.board}</span>
                        <span>카테고리: {selectedPost.category}</span>
                        <span>작성일: {selectedPost.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      {getPriorityBadge(selectedPost.priority)}
                      {getStatusBadge(selectedPost.status, selectedPost.reportCount)}
                    </div>
                  </div>

                  {/* 통계 - 모바일 반응형 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y">
                    <div className="text-center">
                      <div className="text-lg font-medium">{selectedPost.views}</div>
                      <div className="text-sm text-muted-foreground">조회수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">{selectedPost.comments}</div>
                      <div className="text-sm text-muted-foreground">댓글</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">{selectedPost.likes}</div>
                      <div className="text-sm text-muted-foreground">좋아요</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">{selectedPost.reportCount}</div>
                      <div className="text-sm text-muted-foreground">신고</div>
                    </div>
                  </div>

                  {/* 게시물 내용 */}
                  <div>
                    <Label className="text-sm font-medium">게시물 내용</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedPost.content}</p>
                    </div>
                  </div>

                  {/* 신고 알림 */}
                  {selectedPost.reportCount > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        이 게시물은 {selectedPost.reportCount}건의 신고가 접수되었습니다. 내용을 검토하고 적절한 조치를 취해주세요.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
          
          <DialogFooter className="flex-shrink-0 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="w-full sm:w-auto">
              닫기
            </Button>
            {selectedPost && (
              <Select 
                value={selectedPost.status} 
                onValueChange={(value) => {
                  handleStatusChange(selectedPost.id, value as Post['status']);
                  setIsViewDialogOpen(false);
                }}
              >
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="게시중">게시중</SelectItem>
                  <SelectItem value="숨김">숨김</SelectItem>
                  <SelectItem value="삭제예정">삭제예정</SelectItem>
                </SelectContent>
              </Select>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 다이얼로그 - 모바일 반응형 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col" aria-describedby="edit-post-description">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-base sm:text-lg">게시물 수정</DialogTitle>
            <DialogDescription id="edit-post-description" className="text-sm">
              게시물의 제목, 내용, 설정을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                <div>
                  <Label htmlFor="edit-title" className="text-sm">제목 *</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="게시물 제목을 입력하세요"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-content" className="text-sm">내용 *</Label>
                  <Textarea
                    id="edit-content"
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    placeholder="게시물 내용을 입력하세요"
                    rows={6}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category" className="text-sm">카테고리</Label>
                    <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "전체").map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-priority" className="text-sm">우선순위</Label>
                    <Select value={editForm.priority} onValueChange={(value) => setEditForm({...editForm, priority: value as Post['priority']})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="높음">높음</SelectItem>
                        <SelectItem value="보통">보통</SelectItem>
                        <SelectItem value="낮음">낮음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-pinned" className="text-sm">상단 고정</Label>
                    <Switch
                      id="edit-pinned"
                      checked={editForm.isPinned}
                      onCheckedChange={(checked) => setEditForm({...editForm, isPinned: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-hidden" className="text-sm">게시물 숨김</Label>
                    <Switch
                      id="edit-hidden"
                      checked={editForm.isHidden}
                      onCheckedChange={(checked) => setEditForm({...editForm, isHidden: checked})}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter className="flex-shrink-0 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">
              취소
            </Button>
            <Button onClick={handleEditPost} className="w-full sm:w-auto">
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시물 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 게시물을 완전히 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function handleStatusChange(id: number, status: Post['status']) {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status } : post
    ));
    toast.success(`게시물 상태가 '${status}'로 변경되었습니다.`);
  }
}