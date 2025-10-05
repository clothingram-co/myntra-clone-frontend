import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useAuthContext } from "../context/AuthContext";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, register, isLoading } = useAuthContext();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login({ email, password });
      } else {
        await register({ email, password, name });
      }
      onNavigate('home');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-3xl text-[#FF3F6C] cursor-pointer hover:opacity-80 font-normal mb-2"
          >
            clothingram
          </button>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Please login to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLoginMode ? 'Login' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLoginMode
                ? 'Enter your credentials to access your account'
                : 'Sign up to start shopping with us'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginMode}
                    className="focus:ring-[#FF3F6C] focus:border-[#FF3F6C]"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-[#FF3F6C] focus:border-[#FF3F6C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-[#FF3F6C] focus:border-[#FF3F6C]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FF3F6C] hover:bg-[#FF3F6C]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : isLoginMode ? 'Login' : 'Create Account'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-sm text-[#FF3F6C] hover:underline"
                >
                  {isLoginMode
                    ? "Don't have an account? Register"
                    : 'Already have an account? Login'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-600 dark:text-gray-400 hover:text-[#FF3F6C] transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
