import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Vote, Plus, Edit, Trash2, Eye, Calendar, Users, TrendingUp, BarChart3, Clock, CheckCircle, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface VotePagesProps {
  currentPage: string;
  votes: any[];
  setVotes: (votes: any[]) => void;
  selectedVote: any;
  setSelectedVote: (vote: any) => void;
  voteForm: any;
  setVoteForm: (form: any) => void;
  employees: any[];
  departments: any[];
  currentUser: any;
}

export function VotePages({
  currentPage,
  votes,
  setVotes,
  selectedVote,
  setSelectedVote,
  voteForm,
  setVoteForm,
  employees,
  departments,
  currentUser
}: VotePagesProps) {
  const [isVoteCreateOpen, setIsVoteCreateOpen] = useState(false);
  const [isVoteDetailOpen, setIsVoteDetailOpen] = useState(false);
  const [selectedVoteType, setSelectedVoteType] = useState<string>("");
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [votingData, setVotingData] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [rankingOptions, setRankingOptions] = useState<string[]>([]);

  if (currentPage === "vote-create") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">투표 생성</h1>
            <p className="text-muted-foreground">새로운 투표를 생성하고 직원들의 의견을 수집할 수 있습니다.</p>
          </div>
        </div>

        {/* 투표 유형 선택 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">투표 유형</h3>
            <div className="space-y-3">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVoteType === "single" 
                    ? "border-pastel-blue-300 bg-pastel-blue-100" 
                    : "border-pastel-blue-200 bg-white hover:shadow-md"
                }`}
                onClick={() => {
                  setSelectedVoteType("single");
                  setVoteForm({...voteForm, type: "single"});
                  setIsVoteCreateOpen(true);
                }}
              >
                <h4 className="font-medium">단일 선택 투표</h4>
                <p className="text-sm text-muted-foreground">하나의 옵션만 선택할 수 있는 투표</p>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVoteType === "multiple" 
                    ? "border-pastel-blue-300 bg-pastel-blue-100" 
                    : "border-pastel-blue-200 bg-white hover:shadow-md"
                }`}
                onClick={() => {
                  setSelectedVoteType("multiple");
                  setVoteForm({...voteForm, type: "multiple"});
                  setIsVoteCreateOpen(true);
                }}
              >
                <h4 className="font-medium">다중 선택 투표</h4>
                <p className="text-sm text-muted-foreground">여러 옵션을 선택할 수 있는 투표</p>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVoteType === "ranking" 
                    ? "border-pastel-blue-300 bg-pastel-blue-100" 
                    : "border-pastel-blue-200 bg-white hover:shadow-md"
                }`}
                onClick={() => {
                  setSelectedVoteType("ranking");
                  setVoteForm({...voteForm, type: "ranking"});
                  setIsVoteCreateOpen(true);
                }}
              >
                <h4 className="font-medium">순위 투표</h4>
                <p className="text-sm text-muted-foreground">옵션에 순위를 매기는 투표</p>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVoteType === "anonymous" 
                    ? "border-pastel-blue-300 bg-pastel-blue-100" 
                    : "border-pastel-blue-200 bg-white hover:shadow-md"
                }`}
                onClick={() => {
                  setSelectedVoteType("anonymous");
                  setVoteForm({...voteForm, type: "single", anonymous: true});
                  setIsVoteCreateOpen(true);
                }}
              >
                <h4 className="font-medium">익명 투표</h4>
                <p className="text-sm text-muted-foreground">투표자 정보가 공개되지 않는 투표</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">투표 설정 가이드</h3>
            <div className="space-y-4">
              <div className="p-3 bg-white border border-pastel-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">투표 기간 설정</h4>
                <p className="text-xs text-muted-foreground">
                  투표 시작일과 종료일을 설정합니다. 충분한 참여 시간을 제공해주세요.
                </p>
              </div>
              
              <div className="p-3 bg-white border border-pastel-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">참여 대상 설정</h4>
                <p className="text-xs text-muted-foreground">
                  전체 직원 또는 특정 부서별로 투표 참여 대상을 설정할 수 있습니다.
                </p>
              </div>
              
              <div className="p-3 bg-white border border-pastel-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">결과 공개 설정</h4>
                <p className="text-xs text-muted-foreground">
                  투표 진행 중 실시간 결과 공개 여부를 결정할 수 있습니다.
                </p>
              </div>

              <div className="p-3 bg-white border border-pastel-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">익명성 보장</h4>
                <p className="text-xs text-muted-foreground">
                  민감한 주제의 경우 익명 투표를 통해 솔직한 의견을 수집하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 투표 현황 */}
        <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">최근 투표 현황</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {votes.slice(0, 3).map((vote) => (
              <div key={vote.id} className="p-4 bg-white border border-pastel-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium line-clamp-1">{vote.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={
                      vote.status === "진행중" ? "bg-green-100 text-green-700" :
                      vote.status === "완료" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {vote.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{vote.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>참여: {vote.participants}/{vote.totalEmployees}명</span>
                  <span>마감: {vote.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 투표 생성 팝업 - 모바일 반응형 최적화 */}
        <Dialog open={isVoteCreateOpen} onOpenChange={setIsVoteCreateOpen}>
          <DialogContent 
            className="w-[96vw] sm:w-[90vw] max-w-4xl h-[96vh] sm:h-[90vh] mx-auto flex flex-col p-0 gap-0 overflow-hidden" 
            aria-describedby="vote-create-description"
          >
            {/* 헤더 - 고정 */}
            <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-4 border-b bg-white">
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Vote className="h-5 w-5 text-pastel-blue-600" />
                {selectedVote ? "투표 수정" : "새 투표 생성"}
              </DialogTitle>
              <DialogDescription id="vote-create-description" className="text-sm text-muted-foreground">
                {selectedVote ? "투표 정보를 수정해주세요." : "새로운 투표를 만들어보세요."}
              </DialogDescription>
            </DialogHeader>
            
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4 sm:px-6">
                <div className="space-y-6 py-4">
                {/* 투표 기본 정보 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vote-title" className="text-sm font-medium">투표 제목 *</Label>
                      <Input
                        id="vote-title"
                        placeholder="투표 제목을 입력하세요"
                        value={voteForm.title}
                        onChange={(e) => setVoteForm({...voteForm, title: e.target.value})}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">투표 유형</Label>
                      <Select value={voteForm.type} onValueChange={(value) => setVoteForm({...voteForm, type: value})}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="투표 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">단일 선택</SelectItem>
                          <SelectItem value="multiple">다중 선택</SelectItem>
                          <SelectItem value="ranking">순위 투표</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vote-description" className="text-sm font-medium">투표 설명 *</Label>
                    <Textarea
                      id="vote-description"
                      placeholder="투표에 대한 상세한 설명을 입력하세요"
                      value={voteForm.description}
                      onChange={(e) => setVoteForm({...voteForm, description: e.target.value})}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* 투표 옵션 */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">투표 옵션 (최소 2개)</Label>
                  <div className="space-y-3">
                    {voteForm.options.map((option: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`옵션 ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...voteForm.options];
                            newOptions[index] = e.target.value;
                            setVoteForm({...voteForm, options: newOptions});
                          }}
                          className="h-10 flex-1"
                        />
                        {voteForm.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 flex-shrink-0"
                            onClick={() => {
                              const newOptions = voteForm.options.filter((_: string, i: number) => i !== index);
                              setVoteForm({...voteForm, options: newOptions});
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVoteForm({...voteForm, options: [...voteForm.options, ""]});
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    옵션 추가
                  </Button>
                </div>
                
                {/* 투표 기간 */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">투표 기간</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vote-start" className="text-sm text-muted-foreground">시작일</Label>
                      <Input
                        id="vote-start"
                        type="date"
                        value={voteForm.startDate}
                        onChange={(e) => setVoteForm({...voteForm, startDate: e.target.value})}
                        className="h-10 date-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vote-end" className="text-sm text-muted-foreground">종료일 *</Label>
                      <Input
                        id="vote-end"
                        type="date"
                        value={voteForm.endDate}
                        onChange={(e) => setVoteForm({...voteForm, endDate: e.target.value})}
                        className="h-10 date-input"
                      />
                    </div>
                  </div>
                </div>
                
                {/* 투표 설정 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">참여 대상</Label>
                    <Select value={voteForm.target} onValueChange={(value) => setVoteForm({...voteForm, target: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="참��� 대상 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 직원</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-pastel-blue-50 border border-pastel-blue-200 rounded-lg">
                    <div>
                      <Label htmlFor="anonymous-vote" className="text-sm font-medium">익명 투표</Label>
                      <p className="text-xs text-muted-foreground mt-1">투표자의 신원을 공개하지 않습니다</p>
                    </div>
                    <Switch
                      id="anonymous-vote"
                      checked={voteForm.anonymous}
                      onCheckedChange={(checked) => setVoteForm({...voteForm, anonymous: checked})}
                    />
                  </div>
                </div>

                {/* 하단 여백 추가 (버튼 영역을 위한 공간) */}
                <div className="h-4"></div>
                </div>
              </ScrollArea>
            </div>

            {/* 버튼 그룹 - 고정 위치 */}
            <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t bg-white">
              <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-11"
                onClick={() => {
                  setIsVoteCreateOpen(false);
                  setVoteForm({
                    title: "",
                    description: "",
                    type: "single",
                    options: ["", ""],
                    startDate: "",
                    endDate: "",
                    target: "all",
                    anonymous: false
                  });
                  setSelectedVote(null);
                  setSelectedVoteType("");
                }}
              >
                취소
              </Button>
              <Button 
                className="flex-1 h-11 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                onClick={() => {
                  if (!voteForm.title || !voteForm.description || !voteForm.endDate) {
                    toast.error("필수 항목을 모두 입력해주세요.");
                    return;
                  }
                  
                  const validOptions = voteForm.options.filter((option: string) => option.trim() !== "");
                  if (validOptions.length < 2) {
                    toast.error("최소 2개의 옵션을 입력해주세요.");
                    return;
                  }
                  
                  if (selectedVote) {
                    // 수정
                    const updatedVotes = votes.map(vote => 
                      vote.id === selectedVote.id 
                        ? { 
                            ...vote, 
                            title: voteForm.title,
                            description: voteForm.description,
                            endDate: voteForm.endDate
                          }
                        : vote
                    );
                    setVotes(updatedVotes);
                    toast.success("투표가 수정되었습니다!");
                  } else {
                    // 새 투표 생성
                    const newVote = {
                      id: votes.length + 1,
                      title: voteForm.title,
                      description: voteForm.description,
                      status: new Date(voteForm.startDate || new Date().toISOString().split('T')[0]) <= new Date() ? "진행중" : "예정",
                      endDate: voteForm.endDate,
                      participants: 0,
                      totalEmployees: voteForm.target === "all" ? employees.length : employees.filter(emp => emp.department === voteForm.target).length,
                      options: validOptions,
                      type: voteForm.type,
                      anonymous: voteForm.anonymous,
                      target: voteForm.target
                    };
                    setVotes([newVote, ...votes]);
                    toast.success("새 투표가 생성되었습니다!");
                  }
                  
                  setIsVoteCreateOpen(false);
                  setVoteForm({
                    title: "",
                    description: "",
                    type: "single",
                    options: ["", ""],
                    startDate: "",
                    endDate: "",
                    target: "all",
                    anonymous: false
                  });
                  setSelectedVote(null);
                  setSelectedVoteType("");
                }}
              >
                {selectedVote ? "수정" : "생성"}
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (currentPage === "vote-list") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">투표 목록</h1>
            <p className="text-muted-foreground">진행 중인 투표와 완료된 투표 목록을 확인할 수 있습니다.</p>
          </div>
        </div>

        {/* 통계 섹션 - 모바일 반응형 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs lg:text-sm font-medium">전체 투표</span>
            </div>
            <p className="text-xl lg:text-2xl font-semibold">{votes.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs lg:text-sm font-medium">진행 중</span>
            </div>
            <p className="text-xl lg:text-2xl font-semibold">{votes.filter(v => v.status === "진행중").length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs lg:text-sm font-medium">완료</span>
            </div>
            <p className="text-xl lg:text-2xl font-semibold">{votes.filter(v => v.status === "완료").length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-3 lg:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs lg:text-sm font-medium">평균 참여율</span>
            </div>
            <p className="text-xl lg:text-2xl font-semibold">
              {votes.length > 0 ? Math.round(
                votes.reduce((sum, vote) => sum + (vote.participants / vote.totalEmployees * 100), 0) / votes.length
              ) : 0}%
            </p>
          </div>
        </div>

        {/* 투표 목록 - 모바일 반응형 */}
        <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4 lg:p-6">
          <h3 className="text-lg font-medium mb-4">투표 목록</h3>
          <div className="space-y-4">
            {votes.map((vote) => (
              <div key={vote.id} className="p-3 lg:p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-shadow">
                {/* 모바일: 카드형 레이아웃, 데스크톱: 가로형 레이아웃 */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-0 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm lg:text-base line-clamp-2">{vote.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`w-fit text-xs ${
                          vote.status === "진행중" ? "bg-green-100 text-green-700" :
                          vote.status === "완료" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {vote.status}
                      </Badge>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground mb-3 line-clamp-2">{vote.description}</p>
                    
                    {/* 모바일: 세로 정렬, 태블릿 이상: 가로 정렬 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">마감: {vote.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">참여: {vote.participants}/{vote.totalEmployees}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">참여율: {Math.round((vote.participants / vote.totalEmployees) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 버튼 그룹 - 모바일 최적화 */}
                  <div className="flex items-center justify-end gap-1 lg:gap-2 flex-shrink-0">
                    {vote.status === "진행중" && (
                      <Button 
                        className="bg-pastel-blue-500 hover:bg-pastel-blue-600 text-white text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-9"
                        size="sm"
                        onClick={() => {
                          setVotingData(vote);
                          setSelectedOptions([]);
                          setRankingOptions([...vote.options]);
                          setIsVotingOpen(true);
                        }}
                      >
                        <Vote className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="hidden sm:inline">투표하기</span>
                        <span className="sm:hidden">투표</span>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 lg:h-9 lg:w-9 p-0"
                      onClick={() => {
                        setSelectedVote(vote);
                        setIsVoteDetailOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                    {vote.status === "진행중" && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 lg:h-9 lg:w-9 p-0"
                        onClick={() => {
                          setVoteForm({
                            title: vote.title,
                            description: vote.description,
                            type: vote.type || "single",
                            options: vote.options || ["", ""],
                            startDate: "",
                            endDate: vote.endDate,
                            target: vote.target || "all",
                            anonymous: vote.anonymous || false
                          });
                          setSelectedVote(vote);
                          setIsVoteCreateOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 lg:h-9 lg:w-9 p-0 text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm(`"${vote.title}" 투표를 삭제하시겠습니까?`)) {
                          setVotes(votes.filter(v => v.id !== vote.id));
                          toast.success("투표가 삭제되었습니다.");
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* 진행률 바 */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pastel-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(vote.participants / vote.totalEmployees) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs lg:text-sm font-medium flex-shrink-0">{Math.round((vote.participants / vote.totalEmployees) * 100)}%</span>
                </div>
              </div>
            ))}
            
            {/* 빈 상태 */}
            {votes.length === 0 && (
              <div className="text-center py-12">
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">투표가 없습니다</h3>
                <p className="text-sm text-muted-foreground">새로운 투표를 생성해보세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* 투표하기 팝업 - 모바일 반응형 */}
        <Dialog open={isVotingOpen} onOpenChange={setIsVotingOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] mx-4 overflow-y-auto" aria-describedby="voting-description">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-pastel-blue-600" />
                투표하기
              </DialogTitle>
              <DialogDescription id="voting-description">
                다음 투표에 참여해주세요. 투표 결과는 실시간으로 반영됩니다.
              </DialogDescription>
            </DialogHeader>
            
            {votingData && (
              <div className="space-y-6">
                {/* 투표 정보 */}
                <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">{votingData.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{votingData.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>마감: {votingData.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>참여: {votingData.participants}/{votingData.totalEmployees}명</span>
                    </div>
                  </div>
                </div>

                {/* 투표 옵션 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">투표 옵션</h4>
                    <Badge variant="outline" className="text-xs">
                      {votingData.type === "single" ? "단일 선택" : 
                       votingData.type === "multiple" ? "다중 선택" : 
                       votingData.type === "ranking" ? "순위 투표" : "투표"}
                    </Badge>
                  </div>

                  {votingData.type === "single" && (
                    <div className="space-y-3">
                      {votingData.options.map((option: string, index: number) => (
                        <div 
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedOptions.includes(option) 
                              ? "border-pastel-blue-300 bg-pastel-blue-100" 
                              : "border-pastel-blue-200 hover:border-pastel-blue-300 hover:bg-pastel-blue-50"
                          }`}
                          onClick={() => {
                            setSelectedOptions([option]);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedOptions.includes(option) 
                                ? "border-pastel-blue-500 bg-pastel-blue-500" 
                                : "border-gray-300"
                            }`}>
                              {selectedOptions.includes(option) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {votingData.type === "multiple" && (
                    <div className="space-y-3">
                      {votingData.options.map((option: string, index: number) => (
                        <div 
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedOptions.includes(option) 
                              ? "border-pastel-blue-300 bg-pastel-blue-100" 
                              : "border-pastel-blue-200 hover:border-pastel-blue-300 hover:bg-pastel-blue-50"
                          }`}
                          onClick={() => {
                            if (selectedOptions.includes(option)) {
                              setSelectedOptions(selectedOptions.filter(opt => opt !== option));
                            } else {
                              setSelectedOptions([...selectedOptions, option]);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedOptions.includes(option) 
                                ? "border-pastel-blue-500 bg-pastel-blue-500" 
                                : "border-gray-300"
                            }`}>
                              {selectedOptions.includes(option) && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {votingData.type === "ranking" && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        드래그하여 순위를 정하거나 클릭하여 선택해주세요.
                      </p>
                      {rankingOptions.map((option: string, index: number) => (
                        <div 
                          key={index}
                          className="p-3 border border-pastel-blue-200 rounded-lg cursor-move hover:border-pastel-blue-300 hover:bg-pastel-blue-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-pastel-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="flex-1">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 투표 안내 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5"></div>
                    <div>
                      <h5 className="font-medium text-sm mb-1">투표 안내</h5>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {votingData.type === "single" && (
                          <li>• 하나의 옵션만 선택할 수 있습니다.</li>
                        )}
                        {votingData.type === "multiple" && (
                          <li>• 여러 옵션을 선택할 수 있습니다.</li>
                        )}
                        {votingData.type === "ranking" && (
                          <li>• 선호하는 순서대로 순위를 매겨주세요.</li>
                        )}
                        <li>• 투표 후에는 수정할 수 없습니다.</li>
                        {votingData.anonymous && (
                          <li>• 이 투표는 익명으로 진행됩니다.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 버튼 그룹 */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsVotingOpen(false);
                      setSelectedOptions([]);
                      setRankingOptions([]);
                      setVotingData(null);
                    }}
                  >
                    취소
                  </Button>
                  <Button 
                    className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
                    disabled={
                      (votingData.type === "single" && selectedOptions.length === 0) ||
                      (votingData.type === "multiple" && selectedOptions.length === 0)
                    }
                    onClick={() => {
                      // 투표 제출 로직
                      const voteResult = votingData.type === "ranking" 
                        ? rankingOptions 
                        : selectedOptions;
                      
                      if (voteResult.length === 0) {
                        toast.error("선택된 옵션이 없습니다.");
                        return;
                      }

                      // 참여자 수 증가 및 투표 데이터 업데이트
                      const updatedVotes = votes.map(vote => 
                        vote.id === votingData.id 
                          ? { 
                              ...vote, 
                              participants: vote.participants + 1,
                              // 실제 구현에서는 여기에 투표 결과를 저장
                              userVotes: {
                                ...vote.userVotes,
                                [currentUser.id]: {
                                  options: voteResult,
                                  timestamp: new Date().toISOString(),
                                  anonymous: votingData.anonymous
                                }
                              }
                            }
                          : vote
                      );
                      
                      setVotes(updatedVotes);
                      toast.success("투표가 완료되었습니다!");
                      
                      setIsVotingOpen(false);
                      setSelectedOptions([]);
                      setRankingOptions([]);
                      setVotingData(null);
                    }}
                  >
                    <Vote className="h-4 w-4 mr-2" />
                    투표하기
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 투표 상세 팝업 */}
        <Dialog open={isVoteDetailOpen} onOpenChange={setIsVoteDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] mx-4 overflow-y-auto" aria-describedby="vote-detail-description">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-pastel-blue-600" />
                투표 결과
              </DialogTitle>
              <DialogDescription id="vote-detail-description">
                투표 상세 정보와 현재까지의 결과를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            
            {selectedVote && (
              <div className="space-y-6">
                {/* 투표 기본 정보 */}
                <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{selectedVote.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{selectedVote.description}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        selectedVote.status === "진행중" ? "bg-green-100 text-green-700" :
                        selectedVote.status === "완료" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }
                    >
                      {selectedVote.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">투표 유형</span>
                      <p className="font-medium">
                        {selectedVote.type === "single" ? "단일 선택" : 
                         selectedVote.type === "multiple" ? "다중 선택" : 
                         selectedVote.type === "ranking" ? "순위 투표" : "일반 투표"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">마감일</span>
                      <p className="font-medium">{selectedVote.endDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">참여율</span>
                      <p className="font-medium">{Math.round((selectedVote.participants / selectedVote.totalEmployees) * 100)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">참여자 수</span>
                      <p className="font-medium">{selectedVote.participants}/{selectedVote.totalEmployees}명</p>
                    </div>
                  </div>
                </div>

                {/* 투표 결과 */}
                <div className="space-y-4">
                  <h4 className="font-medium">투표 결과</h4>
                  {selectedVote.options && selectedVote.options.map((option: string, index: number) => {
                    // 임시 결과 데이터 (실제로는 서버에서 가져와야 함)
                    const voteCount = Math.floor(Math.random() * selectedVote.participants) + 1;
                    const percentage = selectedVote.participants > 0 ? Math.round((voteCount / selectedVote.participants) * 100) : 0;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{option}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{voteCount}표</span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-pastel-blue-500 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 투표 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-pastel-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold text-pastel-blue-600 mb-1">
                      {selectedVote.participants}
                    </div>
                    <div className="text-sm text-muted-foreground">총 참여자</div>
                  </div>
                  <div className="bg-white border border-pastel-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold text-green-600 mb-1">
                      {Math.round((selectedVote.participants / selectedVote.totalEmployees) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">참여율</div>
                  </div>
                  <div className="bg-white border border-pastel-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold text-orange-600 mb-1">
                      {selectedVote.totalEmployees - selectedVote.participants}
                    </div>
                    <div className="text-sm text-muted-foreground">미참여자</div>
                  </div>
                </div>

                {/* 닫기 버튼 */}
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsVoteDetailOpen(false);
                      setSelectedVote(null);
                    }}
                  >
                    닫기
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}