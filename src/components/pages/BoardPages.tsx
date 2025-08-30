import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus, ArrowLeft, Edit, Search, Eye, MessageSquare, Heart, Calendar, User, Send } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { BOARD_CATEGORIES } from "../../data/constants";

interface BoardPagesProps {
  currentPage: string;
  boardPosts: any[];
  setBoardPosts: (posts: any[]) => void;
  selectedBoardCategory: string;
  setSelectedBoardCategory: (category: string) => void;
  boardSearchTerm: string;
  setBoardSearchTerm: (term: string) => void;
  selectedPost: any;
  setSelectedPost: (post: any) => void;
  setCurrentPage: (page: string) => void;
  boardForm: any;
  setBoardForm: (form: any) => void;
  currentUser: any;
  employees: any[];
}

export function BoardPages({
  currentPage,
  boardPosts,
  setBoardPosts,
  selectedBoardCategory,
  setSelectedBoardCategory,
  boardSearchTerm,
  setBoardSearchTerm,
  selectedPost,
  setSelectedPost,
  setCurrentPage,
  boardForm,
  setBoardForm,
  currentUser,
  employees
}: BoardPagesProps) {
  const [newComment, setNewComment] = useState("");

  if (currentPage === "board") {
    const filteredPosts = boardPosts.filter(post => 
      (selectedBoardCategory === "전체" || post.category === selectedBoardCategory) &&
      (boardSearchTerm === "" || 
       post.title.toLowerCase().includes(boardSearchTerm.toLowerCase()) ||
       post.content.toLowerCase().includes(boardSearchTerm.toLowerCase())
      )
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">게시판</h1>
            <p className="text-muted-foreground">회사 소식과 정보를 공유하는 공간입니다.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="게시글 검색..." 
                className="pl-10 w-64 bg-pastel-blue-50 border-pastel-blue-200"
                value={boardSearchTerm}
                onChange={(e) => setBoardSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
              onClick={() => {
                setBoardForm({
                  title: "",
                  content: "",
                  category: "공지사항"
                });
                setCurrentPage("board-create");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              글쓰기
            </Button>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">전체 게시글</span>
            </div>
            <p className="text-2xl font-semibold">{boardPosts.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">공지사항</span>
            </div>
            <p className="text-2xl font-semibold">{boardPosts.filter(p => p.category === "공지사항").length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">총 조회수</span>
            </div>
            <p className="text-2xl font-semibold">{boardPosts.reduce((sum, post) => sum + post.views, 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">내 게시글</span>
            </div>
            <p className="text-2xl font-semibold">{boardPosts.filter(p => p.author === currentUser.name).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 카테고리 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-pastel-blue-600" />
                카테고리
              </h3>
              <div className="space-y-1">
                {BOARD_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedBoardCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedBoardCategory === category 
                        ? "bg-pastel-blue-100 text-pastel-blue-700 font-medium" 
                        : "hover:bg-pastel-blue-50"
                    }`}
                  >
                    {category}
                    <span className="float-right text-xs text-muted-foreground">
                      {category === "전체" 
                        ? boardPosts.length 
                        : boardPosts.filter(post => post.category === category).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 인기 게시글 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-pastel-blue-600" />
                인기 게시글
              </h3>
              <div className="space-y-2">
                {boardPosts
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 3)
                  .map(post => (
                    <div 
                      key={post.id} 
                      className="p-2 hover:bg-pastel-blue-50 rounded cursor-pointer"
                      onClick={() => {
                        setSelectedPost(post);
                        setCurrentPage("board-detail");
                      }}
                    >
                      <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.views}회 조회</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 게시글 목록 */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-medium">게시글 목록</h3>
                <div className="flex gap-2">
                  <Select value={selectedBoardCategory} onValueChange={setSelectedBoardCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARD_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredPosts
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(post => (
                    <div 
                      key={post.id} 
                      className="p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md hover:border-pastel-blue-300 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedPost(post);
                        setCurrentPage("board-detail");
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                              {post.category}
                            </Badge>
                            {post.category === "공지사항" && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                공지
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{post.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.createdAt}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views}회
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {post.comments.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "board-create") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">게시글 작성</h1>
            <p className="text-muted-foreground">새로운 게시글을 작성해주세요.</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage("board")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </div>

        <div className="max-w-4xl">
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-title">제목</Label>
                  <Input
                    id="post-title"
                    placeholder="게시글 제목을 입력하세요"
                    value={boardForm.title}
                    onChange={(e) => setBoardForm({...boardForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-category">카테고리</Label>
                  <Select value={boardForm.category} onValueChange={(value) => setBoardForm({...boardForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARD_CATEGORIES.filter(cat => cat !== "전체").map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="post-content">내용</Label>
                <Textarea
                  id="post-content"
                  placeholder="게시글 내용을 입력하세요..."
                  value={boardForm.content}
                  onChange={(e) => setBoardForm({...boardForm, content: e.target.value})}
                  rows={15}
                  className="min-h-[400px]"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setBoardForm({ title: "", content: "", category: "공지사항" });
                    setCurrentPage("board");
                  }}
                >
                  취소
                </Button>
                <Button 
                  className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                  onClick={() => {
                    if (!boardForm.title || !boardForm.content) {
                      toast.error("제목과 내용을 모두 입력해주세요.");
                      return;
                    }
                    
                    const newPost = {
                      id: boardPosts.length + 1,
                      title: boardForm.title,
                      content: boardForm.content,
                      category: boardForm.category,
                      author: currentUser.name,
                      createdAt: new Date().toISOString().split('T')[0],
                      views: 0,
                      likes: 0,
                      comments: []
                    };
                    
                    setBoardPosts([newPost, ...boardPosts]);
                    toast.success("게시글이 성공적으로 등록되었습니다!");
                    
                    setCurrentPage("board");
                    setBoardForm({ title: "", content: "", category: "공지사항" });
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  등록
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "board-detail" && selectedPost) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">게시글 상세</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setCurrentPage("board")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
            {selectedPost.author === currentUser.name && (
              <Button 
                className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  setBoardForm({
                    title: selectedPost.title,
                    content: selectedPost.content,
                    category: selectedPost.category
                  });
                  setCurrentPage("board-create");
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* 게시글 내용 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                  {selectedPost.category}
                </Badge>
                {selectedPost.category === "공지사항" && (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    공지
                  </Badge>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-4">{selectedPost.title}</h2>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={employees.find(emp => emp.name === selectedPost.author)?.profileImage} />
                    <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-xs">
                      {selectedPost.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {selectedPost.createdAt}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {selectedPost.views}회
                </div>
              </div>
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updatedPosts = boardPosts.map(post => 
                      post.id === selectedPost.id 
                        ? { ...post, likes: post.likes + 1 }
                        : post
                    );
                    setBoardPosts(updatedPosts);
                    setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
                    toast.success("좋아요를 눌렀습니다!");
                  }}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  좋아요 ({selectedPost.likes})
                </Button>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">
                댓글 ({selectedPost.comments.length})
              </h3>
              
              {/* 댓글 작성 */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={currentUser.profileImage} />
                    <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-sm">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="댓글을 작성해주세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
                        onClick={() => {
                          if (!newComment.trim()) {
                            toast.error("댓글 내용을 입력해주세요.");
                            return;
                          }
                          
                          const newCommentObj = {
                            id: selectedPost.comments.length + 1,
                            author: currentUser.name,
                            content: newComment,
                            createdAt: new Date().toISOString().split('T')[0]
                          };
                          
                          const updatedPost = {
                            ...selectedPost,
                            comments: [...selectedPost.comments, newCommentObj]
                          };
                          
                          const updatedPosts = boardPosts.map(post => 
                            post.id === selectedPost.id ? updatedPost : post
                          );
                          
                          setBoardPosts(updatedPosts);
                          setSelectedPost(updatedPost);
                          setNewComment("");
                          toast.success("댓글이 등록되었습니다!");
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        등록
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 댓글 목록 */}
              <div className="space-y-4">
                {selectedPost.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-white rounded-lg border border-pastel-blue-200">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={employees.find(emp => emp.name === comment.author)?.profileImage} />
                      <AvatarFallback className="bg-pastel-blue-100 text-pastel-blue-700 text-sm">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">게시글 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">작성자</span>
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">작성일</span>
                  <span>{selectedPost.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">조회수</span>
                  <span>{selectedPost.views}회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">좋아요</span>
                  <span>{selectedPost.likes}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">댓글</span>
                  <span>{selectedPost.comments.length}개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}