
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/auth/SignupForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const { action } = useParams<{ action: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if no action specified
    if (!action) {
      navigate("/auth/login", { replace: true });
    }
  }, [action, navigate]);

  // Handle verification case separately
  if (action === "verify") {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col">
        <div className="container-custom flex-grow">
          <EmailVerification />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container-custom flex-grow">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue={action || "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="login"
                onClick={() => navigate("/auth/login")}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                onClick={() => navigate("/auth/signup")}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
