import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MoreHorizontal, Edit, Trash2, Eye, Grid } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const items = [
  {
    id: 1,
    name: "웹사이트 리뉴얼",
    type: "프로젝트",
    status: "진행중",
    priority: "높음",
    assignee: "김철수",
    dueDate: "2024-04-15",
    progress: 75
  },
  {
    id: 2,
    name: "모바일 앱 개발",
    type: "프로젝트",
    status: "완료",
    priority: "중간",
    assignee: "이영희",
    dueDate: "2024-03-30",
    progress: 100
  },
  {
    id: 3,
    name: "데이터베이스 최적화",
    type: "태스크",
    status: "대기",
    priority: "높음",
    assignee: "박민수",
    dueDate: "2024-04-20",
    progress: 0
  },
  {
    id: 4,
    name: "사용자 피드백 분석",
    type: "리서치",
    status: "진행중",
    priority: "낮음",
    assignee: "최지영",
    dueDate: "2024-04-05",
    progress: 45
  },
  {
    id: 5,
    name: "보안 감사",
    type: "점검",
    status: "대기",
    priority: "높음",
    assignee: "정민호",
    dueDate: "2024-04-25",
    progress: 0
  },
  {
    id: 6,
    name: "UI/UX 개선",
    type: "디자인",
    status: "진행중",
    priority: "중간",
    assignee: "김철수",
    dueDate: "2024-04-10",
    progress: 60
  },
  {
    id: 7,
    name: "API 문서화",
    type: "문서",
    status: "완료",
    priority: "낮음",
    assignee: "이영희",
    dueDate: "2024-03-25",
    progress: 100
  },
  {
    id: 8,
    name: "성능 테스트",
    type: "테스트",
    status: "진행중",
    priority: "중간",
    assignee: "박민수",
    dueDate: "2024-04-12",
    progress: 30
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "진행중": return "bg-blue-100 text-blue-700";
    case "완료": return "bg-green-100 text-green-700";
    case "대기": return "bg-gray-100 text-gray-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "높음": return "bg-red-100 text-red-700";
    case "중간": return "bg-yellow-100 text-yellow-700";
    case "낮음": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    "프로젝트": "bg-purple-100 text-purple-700",
    "태스크": "bg-blue-100 text-blue-700",
    "리서치": "bg-orange-100 text-orange-700",
    "점검": "bg-red-100 text-red-700",
    "디자인": "bg-pink-100 text-pink-700",
    "문서": "bg-indigo-100 text-indigo-700",
    "테스트": "bg-teal-100 text-teal-700"
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

const getAuthorInitials = (name: string) => {
  return name.length >= 2 ? name.slice(-2) : name;
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  if (progress >= 25) return "bg-orange-500";
  return "bg-gray-300";
};

export function ItemsTable() {
  return (
    <Card className="bg-gradient-to-br from-pastel-blue-50 to-white border-pastel-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid className="h-5 w-5 text-pastel-blue-600" />
          작업 항목 관리
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-pastel-blue-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-pastel-blue-50">
                <TableHead>항목명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>우선순위</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>마감일</TableHead>
                <TableHead>진행률</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-pastel-blue-50/50">
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-pastel-blue-100 text-pastel-blue-700">
                          {getAuthorInitials(item.assignee)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{item.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.dueDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(item.progress)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[3rem]">{item.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          보기
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          편집
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}