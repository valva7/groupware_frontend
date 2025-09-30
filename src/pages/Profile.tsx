import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { User, Folder, Bell, Calendar, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { toast } from 'sonner@2.0.3';
import { Project } from '../types';
import { ProfileImageUpload } from '../components/ProfileImageUpload';

const mockProjects: Project[] = [
  {
    id: '1',
    name: '웹사이트 리뉴얼 프로젝트',
    description: '회사 홈페이지 및 관리자 시스템 리뉴얼',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-03-31',
    managerId: '1',
    managerName: '김프로젝트',
    members: ['1', '2', '3', '4'],
    progress: 65,
  },
  {
    id: '2',
    name: '모바일 앱 개발',
    description: '고객용 모바일 애플리케이션 개발',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    managerId: '2',
    managerName: '이모바일',
    members: ['1', '5', '6'],
    progress: 100,
  },
];

const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-100 text-blue-800' },
  active: { label: '진행중', color: 'bg-green-100 text-green-800' },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
  'on-hold': { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
};

export function Profile() {
  const member = useAuthStore((state) => state.member);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    bio: '안녕하세요. 열정적인 개발자입니다.',
    profileImage: member?.profileImage || '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    approval: true,
    project: false,
    board: true,
  });

  const handleSave = () => {
    // 실제 환경에서는 API 호출로 프로필 업데이트
    console.log('프로필 업데이트:', formData);
    
    // Zustand store 업데이트
    updateProfile({
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
    });
    
    toast.success('프로필이 업데이트되었습니다.');
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, profileImage: imageUrl }));
    
    // 즉시 프로필 이미지 업데이트
    updateProfile({ profileImage: imageUrl });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('알림 설정이 변경되었습니다.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const calculateWorkYears = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    
    let totalMonths = years * 12 + months;
    if (now.getDate() < join.getDate()) {
      totalMonths -= 1;
    }
    
    const workYears = Math.floor(totalMonths / 12);
    const workMonths = totalMonths % 12;
    
    if (workYears > 0) {
      return `${workYears}년 ${workMonths}개월`;
    } else {
      return `${workMonths}개월`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 정보</h1>
          <p className="text-muted-foreground">개인 정보와 설정을 관리합니다.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            내 정보
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Folder className="h-4 w-4 mr-2" />
            내 프로젝트
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            알림 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 프로필 이미지 및 기본 정보 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 프로필 이미지 업로드 카드 */}
              <Card className="profile-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">프로필 이미지</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ProfileImageUpload
                    currentImageUrl={formData.profileImage}
                    fallbackText={member?.name?.slice(0, 2) || 'U'}
                    onImageChange={handleImageChange}
                    size="xl"
                  />
                </CardContent>
              </Card>

              {/* 기본 정보 카드 */}
              <Card className="profile-card">
                <CardHeader className="text-center">
                  <CardTitle>{member?.name}</CardTitle>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">{member?.department} · {member?.position}</p>
                    <Badge variant={member?.status === 'active' ? 'default' : 'secondary'}>
                      {member?.status === 'active' ? '재직중' : '휴직중'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="profile-info-item flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>입사일: {member?.joinDate ? formatDate(member.joinDate) : '-'}</span>
                    </div>
                    <div className="profile-info-item flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>근속: {member?.joinDate ? calculateWorkYears(member.joinDate) : '-'}</span>
                    </div>
                    <div className="profile-info-item flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{member?.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 정보 수정 폼 */}
            <Card className="lg:col-span-2 profile-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  개인정보 수정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 profile-tab-content">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">주소</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea
                    id="bio"
                    placeholder="자기소개를 입력하세요"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSave}>
                  프로필 업데이트
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                참여 프로젝트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockProjects.map((project) => {
                  const config = statusConfig[project.status];
                  
                  return (
                    <Card key={project.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{project.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                            <Badge variant="secondary" className={`text-xs ${config.color}`}>
                              {config.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">진행률</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>기간: {formatDate(project.startDate)} ~ {formatDate(project.endDate)}</div>
                          <div>PM: {project.managerName}</div>
                          <div>팀원: {project.members.length}명</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              {mockProjects.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>참여중인 프로젝트가 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">이메일 알림</h4>
                    <p className="text-sm text-muted-foreground">
                      중요한 알림을 이메일로 받습니다.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">푸시 알림</h4>
                    <p className="text-sm text-muted-foreground">
                      브라우저 푸시 알림을 받습니다.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">전자결재 알림</h4>
                    <p className="text-sm text-muted-foreground">
                      결재 요청 및 승인 관련 알림을 받습니다.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.approval}
                    onCheckedChange={(checked) => handleNotificationChange('approval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">프로젝트 알림</h4>
                    <p className="text-sm text-muted-foreground">
                      프로젝트 업데이트 및 일정 관련 알림을 받습니다.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.project}
                    onCheckedChange={(checked) => handleNotificationChange('project', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">게시판 알림</h4>
                    <p className="text-sm text-muted-foreground">
                      새로운 공지사항 및 게시글 알림을 받습니다.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.board}
                    onCheckedChange={(checked) => handleNotificationChange('board', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}