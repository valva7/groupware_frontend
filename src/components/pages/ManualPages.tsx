import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { HelpCircle, Plus, Search, Download, Edit, Trash2, FileText, Calendar, User, Eye, Upload, BarChart3 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ManualPagesProps {
  currentPage: string;
  manuals: any[];
  setManuals: (manuals: any[]) => void;
  selectedManualCategory: string;
  setSelectedManualCategory: (category: string) => void;
  manualSearchTerm: string;
  setManualSearchTerm: (term: string) => void;
  selectedManual: any;
  setSelectedManual: (manual: any) => void;
  manualForm: any;
  setManualForm: (form: any) => void;
  currentUser: any;
}

const MANUAL_CATEGORIES = [
  "전체",
  "시스템",
  "인사",
  "회계",
  "보안",
  "업무",
  "가이드"
];

const FILE_TYPES = [
  { value: "PDF", label: "PDF", icon: "📄" },
  { value: "DOCX", label: "Word", icon: "📝" },
  { value: "PPTX", label: "PowerPoint", icon: "📊" },
  { value: "XLSX", label: "Excel", icon: "📈" },
  { value: "ZIP", label: "압축파일", icon: "🗜️" }
];

export function ManualPages({
  currentPage,
  manuals,
  setManuals,
  selectedManualCategory,
  setSelectedManualCategory,
  manualSearchTerm,
  setManualSearchTerm,
  selectedManual,
  setSelectedManual,
  manualForm,
  setManualForm,
  currentUser
}: ManualPagesProps) {
  const [isManualEditOpen, setIsManualEditOpen] = useState(false);
  const [isManualDetailOpen, setIsManualDetailOpen] = useState(false);

  if (currentPage === "manual") {
    const filteredManuals = manuals.filter(manual => 
      (selectedManualCategory === "전체" || manual.category === selectedManualCategory) &&
      (manualSearchTerm === "" || 
       manual.title.toLowerCase().includes(manualSearchTerm.toLowerCase()) ||
       manual.description.toLowerCase().includes(manualSearchTerm.toLowerCase())
      )
    );

    const getFileIcon = (type: string) => {
      const fileType = FILE_TYPES.find(ft => ft.value === type);
      return fileType ? fileType.icon : "📄";
    };

    const getFileTypeColor = (type: string) => {
      switch (type) {
        case "PDF": return "bg-red-100 text-red-700 border-red-200";
        case "DOCX": return "bg-blue-100 text-blue-700 border-blue-200";
        case "PPTX": return "bg-orange-100 text-orange-700 border-orange-200";
        case "XLSX": return "bg-green-100 text-green-700 border-green-200";
        case "ZIP": return "bg-purple-100 text-purple-700 border-purple-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">메뉴얼</h1>
            <p className="text-muted-foreground">업무에 필요한 각종 매뉴얼과 가이드 문서를 관리할 수 있습니다.</p>
          </div>
          <Button 
            className="bg-pastel-blue-500 hover:bg-pastel-blue-600"
            onClick={() => {
              setManualForm({ title: "", description: "", category: "업무", type: "PDF", file: null });
              setSelectedManual(null);
              setIsManualEditOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            새 메뉴얼 등록
          </Button>
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">전체 메뉴얼</span>
            </div>
            <p className="text-2xl font-semibold">{manuals.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">총 다운로드</span>
            </div>
            <p className="text-2xl font-semibold">{manuals.reduce((sum, manual) => sum + manual.downloadCount, 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">카테고리</span>
            </div>
            <p className="text-2xl font-semibold">{MANUAL_CATEGORIES.length - 1}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">평균 용량</span>
            </div>
            <p className="text-2xl font-semibold">
              {manuals.length > 0 
                ? (manuals.reduce((sum, manual) => sum + parseFloat(manual.size), 0) / manuals.length).toFixed(1)
                : "0"
              }MB
            </p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="메뉴얼 검색 (제목, 설명)..." 
              className="pl-10 bg-pastel-blue-50 border-pastel-blue-200"
              value={manualSearchTerm}
              onChange={(e) => setManualSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedManualCategory} onValueChange={setSelectedManualCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {MANUAL_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 카테고리 및 인기 메뉴얼 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-pastel-blue-600" />
                카테고리
              </h3>
              <div className="space-y-1">
                {MANUAL_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedManualCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedManualCategory === category 
                        ? "bg-pastel-blue-100 text-pastel-blue-700 font-medium" 
                        : "hover:bg-pastel-blue-50"
                    }`}
                  >
                    {category}
                    <span className="float-right text-xs text-muted-foreground">
                      {category === "전체" 
                        ? manuals.length 
                        : manuals.filter(manual => manual.category === category).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 인기 메뉴얼 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-pastel-blue-600" />
                인기 메뉴얼
              </h3>
              <div className="space-y-2">
                {manuals
                  .sort((a, b) => b.downloadCount - a.downloadCount)
                  .slice(0, 5)
                  .map(manual => (
                    <div 
                      key={manual.id} 
                      className="p-2 hover:bg-pastel-blue-50 rounded cursor-pointer"
                      onClick={() => {
                        setSelectedManual(manual);
                        setIsManualDetailOpen(true);
                      }}
                    >
                      <p className="text-sm font-medium line-clamp-1">{manual.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        <span>{manual.downloadCount}회</span>
                        <Badge variant="outline" className="text-xs">{manual.category}</Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* 파일 유형별 통계 */}
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">파일 유형</h3>
              <div className="space-y-2">
                {FILE_TYPES.map(fileType => {
                  const count = manuals.filter(manual => manual.type === fileType.value).length;
                  return (
                    <div key={fileType.value} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{fileType.icon}</span>
                        <span>{fileType.label}</span>
                      </div>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 메뉴얼 목록 */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-medium">메뉴얼 목록 ({filteredManuals.length}개)</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    최근 본 메뉴얼
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredManuals
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map(manual => (
                    <div 
                      key={manual.id} 
                      className="p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md hover:border-pastel-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl">
                          {getFileIcon(manual.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-2 mb-1">{manual.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{manual.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className={getFileTypeColor(manual.type)}>
                          {manual.type}
                        </Badge>
                        <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                          {manual.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{manual.size}</span>
                        <span>{manual.downloadCount}회 다운로드</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>업데이트: {manual.updatedAt}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                          onClick={() => {
                            // 다운로드 카운트 증가
                            const updatedManuals = manuals.map(m => 
                              m.id === manual.id ? { ...m, downloadCount: m.downloadCount + 1 } : m
                            );
                            setManuals(updatedManuals);
                            toast.success(`${manual.title} 다운로드를 시작합니다.`);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          다운로드
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedManual(manual);
                            setIsManualDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setManualForm({
                              title: manual.title,
                              description: manual.description,
                              category: manual.category,
                              type: manual.type,
                              file: null
                            });
                            setSelectedManual(manual);
                            setIsManualEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* 메뉴얼 편집 팝업 */}
        <Dialog open={isManualEditOpen} onOpenChange={setIsManualEditOpen}>
          <DialogContent className="max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-pastel-blue-600" />
                {selectedManual ? "메뉴얼 수정" : "새 메뉴얼 등록"}
              </DialogTitle>
              <DialogDescription>
                {selectedManual ? "메뉴얼 정보를 수정해주세요." : "새로운 메뉴얼을 등록해주세요."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-title">메뉴얼 제목</Label>
                <Input
                  id="manual-title"
                  placeholder="메뉴얼 제목을 입력하세요"
                  value={manualForm.title}
                  onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manual-description">메뉴얼 설명</Label>
                <textarea
                  id="manual-description"
                  placeholder="메뉴얼에 대한 상세한 설명을 입력하세요"
                  value={manualForm.description}
                  onChange={(e) => setManualForm({...manualForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-category">카테고리</Label>
                  <Select value={manualForm.category} onValueChange={(value) => setManualForm({...manualForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {MANUAL_CATEGORIES.filter(cat => cat !== "전체").map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-type">파일 유형</Label>
                  <Select value={manualForm.type} onValueChange={(value) => setManualForm({...manualForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="파일 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILE_TYPES.map(fileType => (
                        <SelectItem key={fileType.value} value={fileType.value}>
                          {fileType.icon} {fileType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manual-file">파일 첨부</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="manual-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setManualForm({...manualForm, file: file});
                      }
                    }}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    선택
                  </Button>
                </div>
                {manualForm.file && (
                  <p className="text-sm text-muted-foreground">
                    선택된 파일: {manualForm.file.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsManualEditOpen(false);
                  setManualForm({ title: "", description: "", category: "업무", type: "PDF", file: null });
                  setSelectedManual(null);
                }}
              >
                취소
              </Button>
              <Button 
                className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  if (!manualForm.title || !manualForm.description) {
                    toast.error("제목과 설명을 모두 입력해주세요.");
                    return;
                  }
                  
                  if (selectedManual) {
                    // 수정
                    const updatedManuals = manuals.map(manual => 
                      manual.id === selectedManual.id 
                        ? { 
                            ...manual, 
                            title: manualForm.title,
                            description: manualForm.description,
                            category: manualForm.category,
                            type: manualForm.type,
                            updatedAt: new Date().toISOString().split('T')[0]
                          }
                        : manual
                    );
                    setManuals(updatedManuals);
                    toast.success("메뉴얼이 수정되었습니다!");
                  } else {
                    // 새 메뉴얼 등록
                    const newManual = {
                      id: manuals.length + 1,
                      title: manualForm.title,
                      description: manualForm.description,
                      category: manualForm.category,
                      type: manualForm.type,
                      size: manualForm.file ? `${(manualForm.file.size / 1024 / 1024).toFixed(1)}MB` : "1.5MB",
                      downloadCount: 0,
                      updatedAt: new Date().toISOString().split('T')[0]
                    };
                    setManuals([newManual, ...manuals]);
                    toast.success("새 메뉴얼이 등록되었습니다!");
                  }
                  
                  setIsManualEditOpen(false);
                  setManualForm({ title: "", description: "", category: "업무", type: "PDF", file: null });
                  setSelectedManual(null);
                }}
              >
                {selectedManual ? "수정" : "등록"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 메뉴얼 상세 팝업 */}
        <Dialog open={isManualDetailOpen} onOpenChange={setIsManualDetailOpen}>
          <DialogContent className="max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-pastel-blue-600" />
                메뉴얼 상세 정보
              </DialogTitle>
            </DialogHeader>
            
            {selectedManual && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {getFileIcon(selectedManual.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">{selectedManual.title}</h3>
                    <p className="text-muted-foreground mb-3">{selectedManual.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={getFileTypeColor(selectedManual.type)}>
                        {selectedManual.type}
                      </Badge>
                      <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
                        {selectedManual.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">파일 크기:</span>
                    <span className="ml-2 font-medium">{selectedManual.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">다운로드:</span>
                    <span className="ml-2 font-medium">{selectedManual.downloadCount}회</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">업데이트:</span>
                    <span className="ml-2 font-medium">{selectedManual.updatedAt}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">파일 형식:</span>
                    <span className="ml-2 font-medium">{selectedManual.type}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  if (selectedManual) {
                    const updatedManuals = manuals.map(m => 
                      m.id === selectedManual.id ? { ...m, downloadCount: m.downloadCount + 1 } : m
                    );
                    setManuals(updatedManuals);
                    toast.success(`${selectedManual.title} 다운로드를 시작합니다.`);
                    setIsManualDetailOpen(false);
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  if (selectedManual) {
                    setManualForm({
                      title: selectedManual.title,
                      description: selectedManual.description,
                      category: selectedManual.category,
                      type: selectedManual.type,
                      file: null
                    });
                    setIsManualDetailOpen(false);
                    setIsManualEditOpen(true);
                  }
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsManualDetailOpen(false)}
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