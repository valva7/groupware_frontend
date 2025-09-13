import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Building2, Mail, Lock, Eye, EyeOff, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";


interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: Readonly<LoginPageProps>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 비밀번호 찾기 관련 상태
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (email === "admin@company.com" && password === "admin123") {
        toast.success("로그인에 성공했습니다!");
        onLogin();
      } else {
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      toast.error("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsResetLoading(true);

    try {
      // 비밀번호 재설정 이메일 전송 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 등록된 이메일인지 확인 (데모용)
      if (resetEmail === "admin@company.com" || resetEmail.includes("@company.com")) {
        setResetEmailSent(true);
        toast.success("비밀번호 재설정 이메일이 전송되었습니다!");
      } else {
        toast.error("등록되지 않은 이메일 주소입니다.");
      }
    } catch (error) {
      toast.error("이메일 전송 중 오류가 발생했습니다.");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleResetDialogClose = () => {
    setIsResetDialogOpen(false);
    setResetEmail("");
    setResetEmailSent(false);
    setIsResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue-50 to-pastel-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="p-3 bg-pastel-blue-600 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">그룹웨어 시스템</h1>
          <p className="text-muted-foreground mt-2">업무 효율성을 위한 통합 솔루션</p>
        </div>

        {/* 로그인 폼 */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              계정 정보를 입력하여 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    로그인 중...
                  </div>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>

            {/* 비밀번호 찾기 버튼 */}
            <div className="mt-4 text-center">
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-pastel-blue-600 hover:text-pastel-blue-700 hover:bg-pastel-blue-50"
                  >
                    비밀번호를 잊으셨나요?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-pastel-blue-600" />
                      비밀번호 찾기
                    </DialogTitle>
                    <DialogDescription>
                      {resetEmailSent 
                        ? "비밀번호 재설정 이메일이 전송되었습니다." 
                        : "등록된 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  {resetEmailSent ? (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">이메일 전송 완료!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>{resetEmail}</strong>로<br />
                            비밀번호 재설정 링크를 전송했습니다.
                          </p>
                        </div>
                      </div>
                      
                      <Alert>
                        <AlertDescription className="text-sm">
                          <strong>안내사항:</strong><br />
                          • 이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.<br />
                          • 링크는 24시간 동안 유효합니다.<br />
                          • 문제가 지속되면 관리자에게 문의하세요.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail">이메일 주소</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder="example@company.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-10"
                            disabled={isResetLoading}
                          />
                        </div>
                      </div>
                      
                      <Alert>
                        <AlertDescription className="text-xs">
                          <strong>데모 계정:</strong> admin@company.com 또는 @company.com으로 끝나는 이메일을 입력해보세요.
                        </AlertDescription>
                      </Alert>
                    </form>
                  )}

                  <DialogFooter className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetDialogClose}
                      disabled={isResetLoading}
                    >
                      {resetEmailSent ? "닫기" : "취소"}
                    </Button>
                    {!resetEmailSent && (
                      <Button
                        type="submit"
                        onClick={handlePasswordReset}
                        disabled={isResetLoading || !resetEmail}
                        className="flex items-center gap-2"
                      >
                        {isResetLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            전송 중...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            이메일 전송
                          </>
                        )}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* 데모 계정 안내 */}
            <Alert className="mt-4">
              <AlertDescription>
                <strong>데모 계정:</strong><br />
                이메일: admin@company.com<br />
                비밀번호: admin123
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2024 그룹웨어 시스템. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}