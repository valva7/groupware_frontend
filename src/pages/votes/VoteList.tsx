import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Progress } from '../../components/ui/progress';
import { Search, Plus, Vote as VoteIcon, Users, Calendar, Clock } from 'lucide-react';
import { toast } from "sonner";
import { Vote } from '../../types';

const mockVotes: Vote[] = [
  {
    id: '1',
    title: '사내 카페테리아 메뉴 선호도 조사',
    description: '직원들이 선호하는 카페테리아 메뉴를 조사합니다. 향후 메뉴 구성에 반영할 예정입니다.',
    type: 'single',
    options: [
      { id: '1', text: '한식', votes: 25, voters: [] },
      { id: '2', text: '양식', votes: 18, voters: [] },
      { id: '3', text: '중식', votes: 22, voters: [] },
      { id: '4', text: '일식', votes: 15, voters: [] },
    ],
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-01-25T23:59:59Z',
    creatorId: '1',
    creatorName: '김총무',
    status: 'active',
    totalVotes: 80,
  },
  {
    id: '2',
    title: '회사 워크숍 활동 선택',
    description: '3월에 예정된 워크숍에서 진행할 활동들을 선택해주세요. 복수선택이 가능합니다.',
    type: 'multiple',
    options: [
      { id: '1', text: '팀빌딩 게임', votes: 35, voters: [] },
      { id: '2', text: '바베큐 파티', votes: 42, voters: [] },
      { id: '3', text: '탁구 대회', votes: 28, voters: [] },
      { id: '4', text: '노래방', votes: 31, voters: [] },
      { id: '5', text: '보드게임', votes: 19, voters: [] },
    ],
    startDate: '2024-01-18T00:00:00Z',
    endDate: '2024-01-24T23:59:59Z',
    creatorId: '2',
    creatorName: '이기획',
    status: 'active',
    totalVotes: 45,
  },
  {
    id: '3',
    title: '사내 복지 개선 제안',
    description: '우선적으로 개선했으면 하는 복지 항목을 선택해주세요.',
    type: 'single',
    options: [
      { id: '1', text: '유연근무제 확대', votes: 45, voters: [] },
      { id: '2', text: '휴게공간 확충', votes: 28, voters: [] },
      { id: '3', text: '교육비 지원 확대', votes: 32, voters: [] },
      { id: '4', text: '건강검진 혜택 확대', votes: 20, voters: [] },
      { id: '5', text: '식대 지원 증액', votes: 35, voters: [] },
    ],
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-22T23:59:59Z',
    creatorId: '3',
    creatorName: '홍인사',
    status: 'active',
    totalVotes: 160,
  },
  {
    id: '4',
    title: '사내 동호회 신설 의견',
    description: '새로 만들고 싶은 사내 동호회가 있다면 투표해주세요.',
    type: 'multiple',
    options: [
      { id: '1', text: '등산 동호회', votes: 22, voters: [] },
      { id: '2', text: '독서 동호회', votes: 18, voters: [] },
      { id: '3', text: '요리 동호회', votes: 15, voters: [] },
      { id: '4', text: '사진 동호회', votes: 12, voters: [] },
    ],
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-01-20T23:59:59Z',
    creatorId: '4',
    creatorName: '박기획',
    status: 'closed',
    totalVotes: 30,
  },
];

export function VoteList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [singleSelection, setSingleSelection] = useState('');
  const [multipleSelection, setMultipleSelection] = useState<string[]>([]);

  const filteredVotes = mockVotes.filter(vote => {
    const matchesSearch = vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleVoteClick = (vote: Vote) => {
    if (vote.status === 'closed') {
      return; // 마감된 투표는 투표 불가
    }
    
    setSelectedVote(vote);
    setSingleSelection('');
    setMultipleSelection([]);
    setDialogOpen(true);
  };

  const handleVoteSubmit = () => {
    if (!selectedVote) return;

    if (selectedVote.type === 'single' && !singleSelection) {
      toast.error('투표 항목을 선택해주세요.');
      return;
    }

    if (selectedVote.type === 'multiple' && multipleSelection.length === 0) {
      toast.error('적어도 하나의 항목을 선택해주세요.');
      return;
    }

    toast.success('투표가 완료되었습니다.');
    setDialogOpen(false);
  };

  const handleMultipleSelectionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setMultipleSelection(prev => [...prev, optionId]);
    } else {
      setMultipleSelection(prev => prev.filter(id => id !== optionId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVoteProgress = (vote: Vote) => {
    return vote.options.map(option => ({
      ...option,
      percentage: vote.totalVotes > 0 ? (option.votes / vote.totalVotes) * 100 : 0,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">투표</h1>
          <p className="text-muted-foreground">진행중인 투표에 참여하고 결과를 확인합니다.</p>
        </div>
        <Button onClick={() => navigate('/votes/create')}>
          <Plus className="h-4 w-4 mr-2" />
          새 투표 만들기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="투표 제목 또는 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">진행중</SelectItem>
                <SelectItem value="closed">마감</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVotes.map((vote) => {
              const daysLeft = getDaysLeft(vote.endDate);
              const isActive = vote.status === 'active';
              
              return (
                <Card
                  key={vote.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isActive ? 'hover:border-primary/50' : 'opacity-75'
                  }`}
                  onClick={() => handleVoteClick(vote)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <VoteIcon className="h-5 w-5 text-primary" />
                        <Badge variant={isActive ? 'default' : 'secondary'}>
                          {isActive ? '진행중' : '마감'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {vote.type === 'single' ? '단일선택' : '복수선택'}
                        </Badge>
                      </div>
                      {isActive && (
                        <Badge variant="secondary" className="text-xs">
                          {daysLeft > 0 ? `${daysLeft}일 남음` : '오늘 마감'}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg line-clamp-2">{vote.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vote.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {getVoteProgress(vote).slice(0, 3).map((option) => (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="truncate">{option.text}</span>
                            <span className="text-muted-foreground shrink-0 ml-2">
                              {option.votes}표 ({option.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={option.percentage} className="h-2" />
                        </div>
                      ))}
                      {vote.options.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{vote.options.length - 3}개 항목 더보기
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span>작성자: {vote.creatorName}</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {vote.totalVotes}명 참여
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>~{formatDate(vote.endDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredVotes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <VoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>조건에 맞는 투표가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 투표 참여 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVote?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedVote && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedVote.description}</p>
              
              <div className="space-y-3">
                {selectedVote.type === 'single' ? (
                  <RadioGroup value={singleSelection} onValueChange={setSingleSelection}>
                    {getVoteProgress(selectedVote).map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {option.votes}표 ({option.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full ml-6">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {getVoteProgress(selectedVote).map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={multipleSelection.includes(option.id)}
                            onCheckedChange={(checked) => 
                              handleMultipleSelectionChange(option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {option.votes}표 ({option.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full ml-6">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>총 {selectedVote.totalVotes}명 참여</div>
                  <div>투표 기간: {formatDateTime(selectedVote.startDate)} ~ {formatDateTime(selectedVote.endDate)}</div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleVoteSubmit}>
                    투표하기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}