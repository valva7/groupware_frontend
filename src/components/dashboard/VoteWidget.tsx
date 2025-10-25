import { Vote as VoteIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';
import { toast } from "sonner";
import { Vote } from '../../types';

const mockVotes: Vote[] = [
  {
    id: '1',
    title: '사내 카페테리아 메뉴 선호도 조사',
    description: '직원들이 선호하는 카페테리아 메뉴를 조사합니다.',
    type: 'single',
    options: [
      { id: '1', text: '한식', votes: 15, voters: [] },
      { id: '2', text: '양식', votes: 8, voters: [] },
      { id: '3', text: '중식', votes: 12, voters: [] },
      { id: '4', text: '일식', votes: 6, voters: [] },
    ],
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-01-25T23:59:59Z',
    creatorId: '1',
    creatorName: '김총무',
    status: 'active',
    totalVotes: 41,
  },
  {
    id: '2',
    title: '회사 워크숍 활동 선택',
    description: '워크숍에서 진행할 활동들을 선택해주세요. (복수선택 가능)',
    type: 'multiple',
    options: [
      { id: '1', text: '팀빌딩 게임', votes: 25, voters: [] },
      { id: '2', text: '바베큐 파티', votes: 30, voters: [] },
      { id: '3', text: '탁구 대회', votes: 18, voters: [] },
      { id: '4', text: '노래방', votes: 22, voters: [] },
    ],
    startDate: '2024-01-18T00:00:00Z',
    endDate: '2024-01-24T23:59:59Z',
    creatorId: '2',
    creatorName: '이기획',
    status: 'active',
    totalVotes: 35,
  },
  {
    id: '3',
    title: '사내 복지 개선 제안',
    description: '우선적으로 개선했으면 하는 복지를 선택해주세요.',
    type: 'single',
    options: [
      { id: '1', text: '유연근무제 확대', votes: 28, voters: [] },
      { id: '2', text: '휴게공간 확충', votes: 15, voters: [] },
      { id: '3', text: '교육비 지원 확대', votes: 20, voters: [] },
      { id: '4', text: '건강검진 혜택 확대', votes: 12, voters: [] },
    ],
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-22T23:59:59Z',
    creatorId: '3',
    creatorName: '홍인사',
    status: 'active',
    totalVotes: 75,
  },
];

export function VoteWidget() {
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [singleSelection, setSingleSelection] = useState('');
  const [multipleSelection, setMultipleSelection] = useState<string[]>([]);

  const handleVoteClick = (vote: Vote) => {
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
    return new Date(dateString).toLocaleDateString();
  };

  const getVoteProgress = (vote: Vote) => {
    return vote.options.map(option => ({
      ...option,
      percentage: vote.totalVotes > 0 ? (option.votes / vote.totalVotes) * 100 : 0,
    }));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">진행중인 투표</CardTitle>
          <VoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockVotes.filter(vote => vote.status === 'active').slice(0, 3).map((vote) => (
              <div
                key={vote.id}
                className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleVoteClick(vote)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                    {vote.title}
                  </h4>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {vote.type === 'single' ? '단일선택' : '복수선택'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span>{vote.creatorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {vote.totalVotes}명 참여
                    </span>
                  </div>
                  <span>~{formatDate(vote.endDate)}</span>
                </div>
              </div>
            ))}
            
            {mockVotes.filter(vote => vote.status === 'active').length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                진행중인 투표가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                <div className="text-sm text-muted-foreground">
                  투표 기간: {formatDate(selectedVote.startDate)} ~ {formatDate(selectedVote.endDate)}
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
    </>
  );
}