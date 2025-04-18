import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { AuthContext } from "@/contexts/DataContext";
import { useContext } from "react";

import { useData } from "@/contexts/DataContext";
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsAdmin } = useData();  
  const { setToken,setIsAuthenticated } = useContext(AuthContext); 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send login request to the backend API
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
        username,
        password,
      });

      // Assuming the backend sends a token or user info on successful login
      if (response.data.token) {
        setToken(response.data.token); 
        setIsAuthenticated(true); 
        // Store the token (example: in localStorage)
        localStorage.setItem("authToken", response.data.token);
        const userResponse = await axios.get("http://127.0.0.1:8000/api/accounts/me/", {
          headers: {
            "Authorization": `Token ${response.data.token}`
          }
        });

        // Check if the profile field indicates admin status
        if (userResponse.data.profile && userResponse.data.profile.is_admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        toast({
          title: "Logged in successfully",
          description: "Welcome back to HackPrep!",
        });
        navigate("/"); 
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.detail || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">user name</Label>
            <Input
              id="email"
              type="text"
              placeholder="name@example.com"
              value={username}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/auth/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
