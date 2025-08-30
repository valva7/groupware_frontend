import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { BookOpen, Plus, Search, Edit, Eye, Trash2, Tag, User, Calendar, TrendingUp, Star, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface WikiPagesProps {
  currentPage: string;
  wikiDocuments: any[];
  setWikiDocuments: (docs: any[]) => void;
  selectedWikiCategory: string;
  setSelectedWikiCategory: (category: string) => void;
  wikiSearchTerm: string;
  setWikiSearchTerm: (term: string) => void;
  selectedWikiDoc: any;
  setSelectedWikiDoc: (doc: any) => void;
  wikiForm: any;
  setWikiForm: (form: any) => void;
  currentUser: any;
}

const WIKI_CATEGORIES = [
  "전체",
  "인사",
  "개발",
  "마케팅",
  "디자인",
  "보안",
  "업무",
  "가이드"
];

export function WikiPages({
  currentPage,
  wikiDocuments,
  setWikiDocuments,
  selectedWikiCategory,
  setSelectedWikiCategory,
  wikiSearchTerm,
  setWikiSearchTerm,
  selectedWikiDoc,
  setSelectedWikiDoc,
  wikiForm,
  setWikiForm,
  currentUser
}: WikiPagesProps) {
  const [isWikiEditOpen, setIsWikiEditOpen] = useState(false);
  const [isWikiDetailOpen, setIsWikiDetailOpen] = useState(false);

  if (currentPage === "wiki") {
    const filteredDocs = wikiDocuments.filter(doc => 
      (selectedWikiCategory === "전체" || doc.category === selectedWikiCategory) &&
      (wikiSearchTerm === "" || 
       doc.title.toLowerCase().includes(wikiSearchTerm.toLowerCase()) ||
       doc.content.toLowerCase().includes(wikiSearchTerm.toLowerCase()) ||
       doc.tags.some((tag: string) => tag.toLowerCase().includes(wikiSearchTerm.toLowerCase()))
      )
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">사내 위키</h1>
            <p className="text-muted-foreground">회사 내부 지식과 문서를 체계적으로 관리할 수 있습니다.</p>
          </div>
          <Button 
            className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
            onClick={() => {
              setWikiForm({ title: "", content: "", category: "업무", tags: "" });
              setSelectedWikiDoc(null);
              setIsWikiEditOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            새 문서 작성
          </Button>
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">전체 문서</span>
            </div>
            <p className="text-2xl font-semibold">{wikiDocuments.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">총 조회수</span>
            </div>
            <p className="text-2xl font-semibold">{wikiDocuments.reduce((sum, doc) => sum + doc.views, 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">카테고리</span>
            </div>
            <p className="text-2xl font-semibold">{WIKI_CATEGORIES.length - 1}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">내 문서</span>
            </div>
            <p className="text-2xl font-semibold">{wikiDocuments.filter(doc => doc.author === currentUser.name).length}</p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="문서 검색 (제목, 내용, 태그)..." 
              className="pl-10 bg-pastel-blue-50 border-pastel-blue-200"
              value={wikiSearchTerm}
              onChange={(e) => setWikiSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedWikiCategory} onValueChange={setSelectedWikiCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {WIKI_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 카테고리 및 인기 문서 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-pastel-blue-600" />
                카테고리
              </h3>
              <div className="space-y-1">
                {WIKI_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedWikiCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedWikiCategory === category 
                        ? "bg-pastel-blue-100 text-pastel-blue-700 font-medium" 
                        : "hover:bg-pastel-blue-50"
                    }`}
                  >
                    {category}
                    <span className="float-right text-xs text-muted-foreground">
                      {category === "전체" 
                        ? wikiDocuments.length 
                        : wikiDocuments.filter(doc => doc.category === category).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 인기 문서 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-pastel-blue-600" />
                인기 문서
              </h3>
              <div className="space-y-2">
                {wikiDocuments
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map(doc => (
                    <div 
                      key={doc.id} 
                      className="p-2 hover:bg-pastel-blue-50 rounded cursor-pointer"
                      onClick={() => {
                        setSelectedWikiDoc(doc);
                        setIsWikiDetailOpen(true);
                      }}
                    >
                      <p className="text-sm font-medium line-clamp-1">{doc.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{doc.views}회</span>
                        <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 문서 목록 */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-medium">문서 목록 ({filteredDocs.length}개)</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    즐겨찾기
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    최근 본 문서
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredDocs
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map(doc => (
                    <div 
                      key={doc.id} 
                      className="p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md hover:border-pastel-blue-300 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 
                              className="font-medium hover:text-pastel-blue-600 cursor-pointer"
                              onClick={() => {
                                // 조회수 증가
                                const updatedDocs = wikiDocuments.map(d => 
                                  d.id === doc.id ? { ...d, views: d.views + 1 } : d
                                );
                                setWikiDocuments(updatedDocs);
                                setSelectedWikiDoc({ ...doc, views: doc.views + 1 });
                                setIsWikiDetailOpen(true);
                              }}
                            >
                              {doc.title}
                            </h4>
                            <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                              {doc.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doc.content}</p>
                          
                          {/* 태그 */}
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1">
                              {doc.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-100">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {doc.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.updatedAt}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {doc.views}회
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWikiDoc(doc);
                              setIsWikiDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {doc.author === currentUser.name && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWikiForm({
                                    title: doc.title,
                                    content: doc.content,
                                    category: doc.category,
                                    tags: doc.tags.join(", ")
                                  });
                                  setSelectedWikiDoc(doc);
                                  setIsWikiEditOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`"${doc.title}" 문서를 삭제하시겠습니까?`)) {
                                    setWikiDocuments(wikiDocuments.filter(d => d.id !== doc.id));
                                    toast.success("문서가 삭제되었습니다.");
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* 문서 편집 팝업 */}
        <Dialog open={isWikiEditOpen} onOpenChange={setIsWikiEditOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pastel-blue-600" />
                {selectedWikiDoc ? "문서 수정" : "새 문서 작성"}
              </DialogTitle>
              <DialogDescription>
                {selectedWikiDoc ? "문서 내용을 수정해주세요." : "새로운 위키 문서를 작성해주세요."}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wiki-title">문서 제목</Label>
                    <Input
                      id="wiki-title"
                      placeholder="문서 제목을 입력하세요"
                      value={wikiForm.title}
                      onChange={(e) => setWikiForm({...wikiForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wiki-category">카테고리</Label>
                    <Select value={wikiForm.category} onValueChange={(value) => setWikiForm({...wikiForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {WIKI_CATEGORIES.filter(cat => cat !== "전체").map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wiki-tags">태그 (쉼표로 구분)</Label>
                  <Input
                    id="wiki-tags"
                    placeholder="태그1, 태그2, 태그3..."
                    value={wikiForm.tags}
                    onChange={(e) => setWikiForm({...wikiForm, tags: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wiki-content">내용</Label>
                  <Textarea
                    id="wiki-content"
                    placeholder="문서 내용을 입력하세요..."
                    value={wikiForm.content}
                    onChange={(e) => setWikiForm({...wikiForm, content: e.target.value})}
                    rows={15}
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsWikiEditOpen(false);
                  setWikiForm({ title: "", content: "", category: "업무", tags: "" });
                  setSelectedWikiDoc(null);
                }}
              >
                취소
              </Button>
              <Button 
                className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  if (!wikiForm.title || !wikiForm.content) {
                    toast.error("제목과 내용을 모두 입력해주세요.");
                    return;
                  }
                  
                  const tags = wikiForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
                  
                  if (selectedWikiDoc) {
                    // 수정
                    const updatedDocs = wikiDocuments.map(doc => 
                      doc.id === selectedWikiDoc.id 
                        ? { 
                            ...doc, 
                            title: wikiForm.title,
                            content: wikiForm.content,
                            category: wikiForm.category,
                            tags: tags,
                            updatedAt: new Date().toISOString().split('T')[0]
                          }
                        : doc
                    );
                    setWikiDocuments(updatedDocs);
                    toast.success("문서가 수정되었습니다!");
                  } else {
                    // 새 문서 생성
                    const newDoc = {
                      id: wikiDocuments.length + 1,
                      title: wikiForm.title,
                      content: wikiForm.content,
                      category: wikiForm.category,
                      author: currentUser.name,
                      updatedAt: new Date().toISOString().split('T')[0],
                      views: 0,
                      tags: tags
                    };
                    setWikiDocuments([newDoc, ...wikiDocuments]);
                    toast.success("새 문서가 작성되었습니다!");
                  }
                  
                  setIsWikiEditOpen(false);
                  setWikiForm({ title: "", content: "", category: "업무", tags: "" });
                  setSelectedWikiDoc(null);
                }}
              >
                {selectedWikiDoc ? "수정" : "작성"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 문서 상세 팝업 */}
        <Dialog open={isWikiDetailOpen} onOpenChange={setIsWikiDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pastel-blue-600" />
                문서 상세
              </DialogTitle>
            </DialogHeader>
            
            {selectedWikiDoc && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{selectedWikiDoc.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {selectedWikiDoc.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {selectedWikiDoc.updatedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {selectedWikiDoc.views}회 조회
                          </div>
                          <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                            {selectedWikiDoc.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* 태그 */}
                    {selectedWikiDoc.tags && selectedWikiDoc.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {selectedWikiDoc.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs bg-gray-100">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-6 rounded-lg">
                      {selectedWikiDoc.content}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}

            <div className="flex gap-2 pt-4 border-t">
              {selectedWikiDoc?.author === currentUser.name && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (selectedWikiDoc) {
                      setWikiForm({
                        title: selectedWikiDoc.title,
                        content: selectedWikiDoc.content,
                        category: selectedWikiDoc.category,
                        tags: selectedWikiDoc.tags.join(", ")
                      });
                      setIsWikiDetailOpen(false);
                      setIsWikiEditOpen(true);
                    }
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsWikiDetailOpen(false)}
              >
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}