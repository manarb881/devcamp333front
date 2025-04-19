// src/components/Navbar.tsx

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext, useMemo, ReactNode } from "react"; // Import React
// **** Import SettingsIcon ****
import { LayoutDashboard, MessageCircle, Settings as SettingsIcon } from "lucide-react";
import axios from "axios";
import { AuthContext, useData } from "@/contexts/DataContext";

// --- Base Nav Links ---
const baseNavLinks = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/Pricing" },
];

// --- Define the structure for link objects ---
interface NavLink {
  name: string;
  path: string;
  icon?: ReactNode; // Type ReactNode for icons
}

export function Navbar() {
  const { isAuthenticated, profile, token } = useContext(AuthContext);
  const { isAdmin } = useData();
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // --- Close menu on route change ---
  useEffect(() => {
    setIsMenuOpen(false); // Close menu when location changes
  }, [location.pathname]);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // --- Dynamically create navigation links based on admin status ---
  const navLinks: NavLink[] = useMemo(() => {
    const links: NavLink[] = [...baseNavLinks]; // Start with base links

    // ***** START SWAP *****
    // Add Settings first
    links.push({
        name: "Settings",
        path: "/settings",
        icon: <SettingsIcon className="h-4 w-4" /> // Add Settings icon
    });

    // Conditionally add Dashboard after Settings
    if (isAdmin) {
      links.push({
        name: "Dashboard",
        path: "/admin",
        icon: <LayoutDashboard className="h-4 w-4" />,
      });
    }
    // ***** END SWAP *****

    return links;
  }, [isAdmin]); // Recalculate only if isAdmin changes

  // Profile Picture Logic
  const profilePicUrl =
    isAuthenticated && profile?.profile?.profile_pic
      ? profile.profile.profile_pic.startsWith("http")
        ? profile.profile.profile_pic
        : `http://127.0.0.1:8000${profile.profile.profile_pic}`
      : "http://127.0.0.1:8000/media/profile_pics/Nothing.png";

  // --- Debugging Log ---
  // useEffect(() => {
  //   console.log("Is Menu Open:", isMenuOpen);
  // }, [isMenuOpen]);
  // ---------------------

  return (
    // Navbar container - z-50 ensures it's on top
    <nav className="bg-background border-b border-border py-3 fixed w-full top-0 z-50">
      <div className="container-custom flex items-center justify-between">

        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src="/agro.png" alt="AGroyality Logo" className="h-[50px] w-auto" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            let isActive;
            // Handle nested routes for active state
            // Make sure this covers all base paths correctly
            if (link.path === "/admin" || link.path === "/settings") {
               isActive = location.pathname.startsWith(link.path);
            } else {
                isActive = location.pathname === link.path;
            }

            return (
               <Link
                 key={link.name}
                 to={link.path}
                 className={`relative text-lg font-medium transition-colors hover:text-primary pb-1 flex items-center gap-1 ${
                   isActive
                     ? "text-primary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary"
                     : "text-foreground/70"
                 }`}
               >
                 {/* Ensure icon is valid before cloning */}
                 {link.icon && React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement, { className: "h-4 w-4 flex-shrink-0" })}
                 {link.name}
               </Link>
            );
           })}
        </div>

        {/* Auth, Theme Toggle Section */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2 hover:text-primary">
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border"
                  onError={(e) => { (e.target as HTMLImageElement).src = "http://127.0.0.1:8000/media/profile_pics/Nothing.png"; }}
                />
              </Link>
              <ThemeToggle />
              {/* Add Logout Button Here */}
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/auth/login"> <Button variant="outline" size="sm">Sign In</Button> </Link>
              <Link to="/auth/signup"> <Button size="sm">Sign Up</Button> </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center md:hidden space-x-2">
            {isAuthenticated && ( <Link to="/messages" className="relative text-foreground/70 hover:text-primary" title="Messages"><MessageCircle className="h-5 w-5" />{newMessagesCount > 0 && ( <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{newMessagesCount}</span> )}</Link> )}
           <ThemeToggle />
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
             {/* Icons remain the same */}
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMenuOpen ? "hidden" : "block"}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMenuOpen ? "block" : "hidden"}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Button>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div
             className="
               absolute top-full inset-x-0                 // Position below navbar, full width
               p-4 md:hidden                               // Padding, hide on medium+ screens
               z-40                                        // Below navbar (z-50) but above page content
               border-t border-border                      // Top border separation
               shadow-lg rounded-b-lg                      // Visual styling
               animate-fadeIn                              // Animation class
               bg-background                               // Use theme background
             "
          >
            <div className="flex flex-col space-y-2">
               {/* Map over dynamic navLinks for mobile */}
              {navLinks.map((link) => {
                   let isActive;
                    // Handle nested routes for active state
                   if (link.path === "/admin" || link.path === "/settings") {
                      isActive = location.pathname.startsWith(link.path);
                   } else {
                       isActive = location.pathname === link.path;
                   }
                  return (
                     <Link
                         key={`mobile-${link.name}`}
                         to={link.path}
                         onClick={toggleMenu} // Close menu on click
                         className={`flex items-center gap-2 text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted ${isActive ? "text-primary bg-secondary" : "text-foreground/90"}`}
                     >
                       {/* Ensure icon is valid, consistent size, prevent shrinking */}
                       {link.icon && React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement, { className: "h-5 w-5 flex-shrink-0" })}
                       {link.name}
                     </Link>
                  )
                }
              )}
              <div className="border-t border-border my-2"></div>
              {/* Mobile Auth links */}
              {isAuthenticated ? (
                 <Link
                    to="/profile"
                    onClick={toggleMenu} // Close on click
                    className={`flex items-center gap-2 text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted ${location.pathname === "/profile" ? "text-primary bg-secondary" : "text-foreground/90"}`}
                >
                     <img
                       src={profilePicUrl}
                       alt="Profile"
                       className="w-8 h-8 rounded-full object-cover border flex-shrink-0"
                       onError={(e) => { (e.target as HTMLImageElement).src = "http://127.0.0.1:8000/media/profile_pics/Nothing.png"; }}
                     /> Profile
                 </Link>
                // Optional: Mobile Logout Button
              ) : (
                <>
                  <Link to="/auth/login" onClick={toggleMenu}>
                     <Button variant="outline" className="w-full justify-center">Sign In</Button>
                  </Link>
                  <Link to="/auth/signup" onClick={toggleMenu}>
                     <Button className="w-full justify-center">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}