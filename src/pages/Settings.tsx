// src/pages/Settings.tsx (or wherever this component lives)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Assume useTheme provides theme and setTheme function
import { useTheme } from "@/hooks/useTheme"; // Or your actual theme context/hook
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
// Import relevant icons
import { Globe, Palette, Bell, Sun, Moon, Laptop } from "lucide-react";

const Settings = () => {
  // Use theme context/hook
  const { theme, setTheme } = useTheme(); // Make sure setTheme is available from your hook/context

  // State for language preference (as before)
  const [language, setLanguage] = useState("en");

  // State for notification preferences (example)
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailUpdates: true,
    pushNotifications: false,
    inAppAlerts: true,
  });

  // Handler for language change (keep as is)
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    console.log(`Language changed to: ${lang}`); // Placeholder for API call
    // await fetch('/api/settings/language', { method: 'POST', body: JSON.stringify({ language: lang }) })
  };

  // Handler for notification toggle changes
  const handleNotificationChange = (key: keyof typeof notificationPrefs, checked: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: checked }));
    console.log(`Notification ${key} changed to: ${checked}`); // Placeholder for API call
    // await fetch('/api/settings/notifications', { method: 'POST', body: JSON.stringify({ [key]: checked }) })
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col bg-background text-foreground"> {/* Ensure base bg/text */}
      <div className="container-custom flex-grow">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1> {/* Standard heading style */}
        <p className="text-muted-foreground mb-8"> {/* Increased bottom margin */}
          Manage your account settings and preferences.
        </p>

        {/* Use grid layout for setting cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap and added lg breakpoint */}

          {/* Language Settings Card (Existing) */}
          <Card className="animate-slideUp shadow-sm hover:shadow-md transition-shadow duration-300"> {/* Subtle shadow effect */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> {/* Icon color */}
                Language
              </CardTitle>
              <CardDescription>
                Choose your preferred interface language.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Using Buttons for language selection */}
              <div className="flex gap-3 flex-wrap"> {/* Added flex-wrap */}
                <Button
                  size="sm" // Smaller buttons
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("en")}
                >
                  Francais
                </Button>
                <Button
                   size="sm"
                   variant={language === "ar" ? "default" : "outline"}
                   onClick={() => handleLanguageChange("ar")}
                >
                  English
                </Button>
                 {/* Add more languages as needed */}
                 {/* <Button size="sm" variant={language === 'fr' ? 'default' : 'outline'} onClick={() => handleLanguageChange('fr')}>Français</Button> */}
              </div>
            </CardContent>
            {/* Optional: CardFooter for save button if needed */}
            {/* <CardFooter>
              <Button size="sm">Save Language</Button>
            </CardFooter> */}
          </Card>

          {/* Theme Preference Card (New) */}
          <Card className="animate-slideUp shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Palette className="h-5 w-5 text-primary" /> {/* Palette icon */}
                Appearance
              </CardTitle>
              <CardDescription>
                Select your preferred light or dark theme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Using RadioGroup for theme selection */}
              <RadioGroup
                 value={theme} // Controlled by theme state from context
                 onValueChange={(value) => setTheme(value as "light" | "dark" | "system")} // Call setTheme from context
                 className="space-y-2"
               >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                   <Label htmlFor="theme-light" className="flex items-center gap-1.5 cursor-pointer">
                     <Sun className="h-4 w-4"/> Light
                   </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="flex items-center gap-1.5 cursor-pointer">
                     <Moon className="h-4 w-4"/> Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                   <Label htmlFor="theme-system" className="flex items-center gap-1.5 cursor-pointer">
                     <Laptop className="h-4 w-4"/> System
                   </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Notification Preferences Card (New) */}
          <Card className="animate-slideUp shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Bell className="h-5 w-5 text-primary" /> {/* Bell icon */}
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Example notification toggles */}
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-updates" className="flex flex-col space-y-1">
                  <span>Email Updates</span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Receive news and updates via email.
                  </span>
                </Label>
                <Switch
                  id="email-updates"
                  checked={notificationPrefs.emailUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                  aria-label="Email Updates Toggle"
                />
              </div>

               <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                   <span>Push Notifications</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Allow browser push notifications (if supported).
                  </span>
                 </Label>
                 <Switch
                  id="push-notifications"
                  checked={notificationPrefs.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  aria-label="Push Notifications Toggle"
                />
               </div>

               <div className="flex items-center justify-between space-x-2">
                 <Label htmlFor="in-app-alerts" className="flex flex-col space-y-1">
                   <span>In-App Alerts</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                     Show important alerts within the app.
                   </span>
                 </Label>
                <Switch
                  id="in-app-alerts"
                   checked={notificationPrefs.inAppAlerts}
                   onCheckedChange={(checked) => handleNotificationChange('inAppAlerts', checked)}
                   aria-label="In-App Alerts Toggle"
                 />
              </div>
            </CardContent>
            {/* Optional Footer */}
            {/* <CardFooter>
                <Button size="sm" variant="outline">Manage Notification Settings</Button>
            </CardFooter> */}
          </Card>

          {/* Add more static setting cards here if needed */}

        </div>
      </div>
    </div>
  );
};

export default Settings;