
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export function EmailVerification() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("user@example.com"); // In a real app, this would come from a context/state
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified",
      });
      setIsLoading(false);
      // In a real app, you would redirect to login or dashboard here
    }, 1500);
  };

  const handleResend = () => {
    setCanResend(false);
    setTimeLeft(60);
    
    toast({
      title: "Verification code sent",
      description: "A new verification code has been sent to your email",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 p-3 text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>
          We've sent a verification code to<br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              inputMode="numeric"
              required
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
          <div className="text-center text-sm">
            {canResend ? (
              <Button
                variant="link"
                className="p-0 text-primary hover:underline"
                onClick={handleResend}
              >
                Resend code
              </Button>
            ) : (
              <span className="text-muted-foreground">
                Resend code in {timeLeft} seconds
              </span>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
