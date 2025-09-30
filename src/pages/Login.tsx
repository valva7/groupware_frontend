import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore, mockMember } from '../store/auth';
import { toast } from 'sonner@2.0.3';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    
    // Mock login logic
    setTimeout(() => {
      if (email === 'kim@coev1.com' && password === 'password') {
        login(mockMember);
        toast.success('로그인 되었습니다.');
        navigate('/dashboard');
      } else {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C1</span>
          </div>
          <CardTitle className="text-2xl">Coev1 그룹웨어</CardTitle>
          <CardDescription>
            회사 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@coev1.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">테스트 계정:</p>
            <p className="text-sm font-mono">이메일: kim@coev1.com</p>
            <p className="text-sm font-mono">비밀번호: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}