import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Vote, Users, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface VoteData {
  id: number;
  title: string;
  description: string;
  status: string;
  endDate: string;
  participants: number;
  totalEmployees: number;
  options?: string[];
  type?: string;
  userVoted?: boolean;
  userSelection?: string | string[];
  results?: { [key: string]: number };
}

const currentVotes: VoteData[] = [
  {
    id: 1,
    title: "회의실 이용 규칙 개정",
    description: "회의실 사용 시간 및 예약 방법에 대한 개정안입니다. 더 효율적인 회의실 운영을 위해 여러분의 의견을 듣고 싶습니다.",
    status: "진행중",
    endDate: "2024-03-30",
    participants: 12,
    totalEmployees: 25,
    options: [
      "현재 시스템 유지 (최대 2시간 예약)",
      "예약 시간 연장 (최대 4시간 예약)",
      "예약 시간 단축 (최대 1시간 예약)",
      "회의실별 차등 시간 적용"
    ],
    type: "single",
    userVoted: false,
    results: {
      "현재 시스템 유지 (최대 2시간 예약)": 3,
      "예약 시간 연장 (최대 4시간 예약)": 5,
      "예약 시간 단축 (최대 1시간 예약)": 2,
      "회의실별 차등 시간 적용": 2
    }
  },
  {
    id: 2,
    title: "사내 카페테리아 메뉴 선정",
    description: "새로운 카페테리아 운영업체 및 메뉴 선정을 위한 투표입니다.",
    status: "완료",
    endDate: "2024-03-15",
    participants: 23,
    totalEmployees: 25,
    options: [
      "한식 위주 메뉴",
      "양식 위주 메뉴", 
      "다양한 국적 요리",
      "샐러드&건강식 위주"
    ],
    type: "single",
    userVoted: true,
    userSelection: "다양한 국적 요리",
    results: {
      "한식 위주 메뉴": 6,
      "양식 위주 메뉴": 4,
      "다양한 국적 요리": 8,
      "샐러드&건강식 위주": 5
    }
  }
];

export function VotingSection() {
  const [votes, setVotes] = useState<VoteData[]>(currentVotes);
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState<VoteData | null>(null);
  const [userSelection, setUserSelection] = useState<string | string[]>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중": return "bg-green-100 text-green-700 border-green-200";
      case "완료": return "bg-blue-100 text-blue-700 border-blue-200";
      case "예정": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleVoteClick = (vote: VoteData) => {
    if (vote.status !== "진행중") {
      if (vote.status === "완료") {
        toast.info("완료된 투표는 결과만 확인할 수 있습니다.");
      } else {
        toast.info("아직 시작되지 않은 투표입니다.");
      }
      return;
    }
    
    setSelectedVote(vote);
    setUserSelection(vote.userSelection || "");
    setIsVoteDialogOpen(true);
  };

  const handleVoteSubmit = () => {
    if (!selectedVote || !userSelection) {
      toast.error("투표 옵션을 선택해주세요.");
      return;
    }

    // 투표 결과 업데이트
    const updatedVotes = votes.map(vote => {
      if (vote.id === selectedVote.id) {
        const updatedResults = { ...vote.results };
        
        // 기존 투표가 있다면 취소
        if (vote.userVoted && vote.userSelection) {
          if (typeof vote.userSelection === "string") {
            updatedResults[vote.userSelection] = Math.max(0, updatedResults[vote.userSelection] - 1);
          }
        }
        
        // 새 투표 추가
        if (typeof userSelection === "string") {
          updatedResults[userSelection] = (updatedResults[userSelection] || 0) + 1;
        }

        return {
          ...vote,
          userVoted: true,
          userSelection: userSelection,
          results: updatedResults,
          participants: vote.userVoted ? vote.participants : vote.participants + 1
        };
      }
      return vote;
    });

    setVotes(updatedVotes);
    setIsVoteDialogOpen(false);
    setSelectedVote(null);
    setUserSelection("");
    
    toast.success("투표가 완료되었습니다!");
  };

  const getRemainingDays = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-gradient-to-br from-pastel-blue-50 to-white border border-pastel-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Vote className="h-5 w-5 text-pastel-blue-600" />
          <h3 className="text-lg font-medium">진행 중인 투표</h3>
        </div>
        <Badge variant="outline" className="bg-pastel-blue-100 text-pastel-blue-700">
          {votes.filter(vote => vote.status === "진행중").length}개 진행중
        </Badge>
      </div>

      <div className="space-y-4">
        {votes.slice(0, 2).map((vote) => {
          const remainingDays = getRemainingDays(vote.endDate);
          const isExpiringSoon = remainingDays <= 2 && remainingDays >= 0;
          
          return (
            <div 
              key={vote.id} 
              className="p-4 bg-white border border-pastel-blue-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleVoteClick(vote)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{vote.title}</h4>
                    {vote.userVoted && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{vote.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isExpiringSoon && vote.status === "진행중" && (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                  <Badge variant="outline" className={getStatusColor(vote.status)}>
                    {vote.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>마감: {vote.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>참여: {vote.participants}/{vote.totalEmployees}명</span>
                  </div>
                  {remainingDays >= 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className={isExpiringSoon ? "text-orange-600 font-medium" : ""}>
                        {remainingDays === 0 ? "오늘 마감" : `${remainingDays}일 남음`}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>참여율</span>
                    <span className="font-medium">{Math.round((vote.participants / vote.totalEmployees) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(vote.participants / vote.totalEmployees) * 100} 
                    className="h-2"
                  />
                </div>

                {vote.status === "진행중" && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {vote.userVoted ? "투표 완료" : "클릭하여 투표하기"}
                    </span>
                    <Button 
                      size="sm" 
                      variant={vote.userVoted ? "outline" : "default"}
                      className={vote.userVoted ? "" : "bg-pastel-blue-500 hover:bg-pastel-blue-600"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVoteClick(vote);
                      }}
                    >
                      {vote.userVoted ? "투표 수정" : "투표하기"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-pastel-blue-200">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>평균 참여율: 78%</span>
          </div>
          <span>총 {votes.length}개 투표</span>
        </div>
      </div>

      {/* 투표 팝업 */}
      <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
        <DialogContent className="max-w-2xl mx-4" aria-describedby="vote-dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-pastel-blue-600" />
              {selectedVote?.userVoted ? "투표 수정" : "투표하기"}
            </DialogTitle>
            <DialogDescription id="vote-dialog-description">
              {selectedVote?.userVoted 
                ? "투표를 수정할 수 있습니다. 기존 투표는 취소됩니다." 
                : "아래 옵션 중 하나를 선택해주세요."
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedVote && (
            <div className="space-y-6">
              {/* 투표 정보 */}
              <div className="p-4 bg-pastel-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">{selectedVote.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedVote.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>마감: {selectedVote.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>참여: {selectedVote.participants}/{selectedVote.totalEmployees}명</span>
                  </div>
                </div>
              </div>

              {/* 투표 옵션 */}
              <div className="space-y-4">
                <h4 className="font-medium">투표 옵션을 선택해주세요</h4>
                
                {selectedVote.type === "single" ? (
                  <RadioGroup 
                    value={userSelection as string} 
                    onValueChange={setUserSelection}
                    className="space-y-3"
                  >
                    {selectedVote.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-pastel-blue-200 rounded-lg hover:bg-pastel-blue-50 transition-colors">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                        {selectedVote.results && (
                          <div className="text-sm text-muted-foreground">
                            {selectedVote.results[option] || 0}표
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {selectedVote.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-pastel-blue-200 rounded-lg">
                        <Checkbox 
                          id={`option-${index}`}
                          checked={Array.isArray(userSelection) && userSelection.includes(option)}
                          onCheckedChange={(checked) => {
                            if (Array.isArray(userSelection)) {
                              if (checked) {
                                setUserSelection([...userSelection, option]);
                              } else {
                                setUserSelection(userSelection.filter(item => item !== option));
                              }
                            } else {
                              setUserSelection(checked ? [option] : []);
                            }
                          }}
                        />
                        <Label 
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                        {selectedVote.results && (
                          <div className="text-sm text-muted-foreground">
                            {selectedVote.results[option] || 0}표
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 현재 투표 현황 */}
              {selectedVote.results && (
                <div className="space-y-3">
                  <h4 className="font-medium">현재 투표 현황</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedVote.results).map(([option, count]) => {
                      const percentage = selectedVote.participants > 0 
                        ? Math.round((count / selectedVote.participants) * 100) 
                        : 0;
                      
                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="truncate flex-1">{option}</span>
                            <span className="font-medium">{count}표 ({percentage}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setIsVoteDialogOpen(false);
                setSelectedVote(null);
                setUserSelection("");
              }}
            >
              취소
            </Button>
            <Button 
              className="flex-1 bg-pastel-blue-500 hover:bg-pastel-blue-600"
              onClick={handleVoteSubmit}
              disabled={!userSelection || (Array.isArray(userSelection) && userSelection.length === 0)}
            >
              {selectedVote?.userVoted ? "투표 수정" : "투표 완료"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}