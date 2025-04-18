
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Globe, CreditCard } from "lucide-react";

const Settings = () => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [subscriptionStatus, setSubscriptionStatus] = useState("Free");

  // This would be connected to your Django backend in production
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // In production, you'd make an API call to your Django backend:
    // await fetch('/api/settings/language', { method: 'POST', body: JSON.stringify({ language: lang }) })
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container-custom flex-grow">
        <h1 className="page-heading">Settings</h1>
        <p className="text-muted-foreground mb-6">
          Manage your account settings and preferences
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Language Settings */}
          <Card className="animate-slideUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language
              </CardTitle>
              <CardDescription>
                Choose your preferred language for the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("en")}
                >
                  English
                </Button>
                <Button
                  variant={language === "ar" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("ar")}
                >
                  العربية
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="animate-slideUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-lg font-bold">{subscriptionStatus}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Manage Plan</Button>
              <Button>Upgrade</Button>
            </CardFooter>
          </Card>
        </div>

        {/* AI Model Interaction Card */}

      </div>
    </div>
  );
};

export default Settings;
