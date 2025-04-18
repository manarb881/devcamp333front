// src/components/Navbar.tsx

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import axios from "axios";
import { AuthContext, useData } from "@/contexts/DataContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/Pricing" },
  { name: "Settings", path: "/settings" },
];

export function Navbar() {
  const { isAuthenticated, profile, token } = useContext(AuthContext);
  const { isAdmin } = useData();
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Profile Picture Logic
  const profilePicUrl =
    isAuthenticated && profile?.profile?.profile_pic
      ? profile.profile.profile_pic.startsWith("http")
        ? profile.profile.profile_pic
        : `http://127.0.0.1:8000${profile.profile.profile_pic}`
      : "http://127.0.0.1:8000/media/profile_pics/Nothing.png";

  return (
    <nav className="bg-background border-b border-border py-3 fixed w-full top-0 z-50">
      <div className="container-custom flex items-center justify-between">

        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src="/agro.png" alt="AGroyality Logo" className="h-[50px] w-auto" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
             const isActive = location.pathname === link.path;
             return (
               <Link
                 key={link.name}
                 to={link.path}
                 className={`relative text-bold font-medium transition-colors hover:text-primary pb-1 ${
                   isActive
                     ? "text-primary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary"
                     : "text-foreground/70"
                 }`}
               >
                 {link.name}
               </Link>
            );
           })}
          {isAdmin && (() => {
            const isActive = location.pathname.startsWith("/admin");
            return (
                <Link
                    to="/admin"
                    className={`relative text-bold font-medium transition-colors hover:text-primary flex items-center gap-1 pb-1 ${
                      isActive
                         ? "text-primary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary"
                         : "text-foreground/70"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
            );
          })()}
        </div>

        {/* Auth, Theme Toggle, and Messages Section (Right Side) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* --- INCREASED PROFILE PIC SIZE (DESKTOP) --- */}
              <Link to="/profile" className="flex items-center space-x-2 hover:text-primary">
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  // Changed from w-8 h-8
                  className="w-9 h-9 rounded-full object-cover border"
                  onError={(e) => { (e.target as HTMLImageElement).src = "http://127.0.0.1:8000/media/profile_pics/Nothing.png"; }}
                />
              </Link>
              {/* --- END CHANGE --- */}
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
           {isAuthenticated && ( <Link to="/messages" className="relative text-gray-900 hover:text-primary" title="Messages"><MessageCircle className="h-5 w-5" />{newMessagesCount > 0 && ( <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{newMessagesCount}</span> )}</Link> )}
           <ThemeToggle />
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMenuOpen ? "hidden" : "block"}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMenuOpen ? "block" : "hidden"}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Button>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="absolute top-full inset-x-0 bg-background shadow-lg rounded-b-lg p-4 md:hidden z-40 border-t animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`block text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted ${location.pathname === link.path ? "text-primary bg-secondary" : ""}`} onClick={() => setIsMenuOpen(false)} >
                  {link.name}
                </Link>
              ))}
              {isAdmin && ( <Link to="/admin" className={`flex items-center gap-2 text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted ${location.pathname.startsWith("/admin") ? "text-primary bg-secondary" : ""}`} onClick={() => setIsMenuOpen(false)}><LayoutDashboard className="h-5 w-5" /> Dashboard</Link> )}
              <div className="border-t my-2"></div>
              {isAuthenticated ? (
                 <Link to="/profile" className={`flex items-center gap-2 text-base font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted ${location.pathname === "/profile" ? "text-primary bg-secondary" : ""}`} onClick={() => setIsMenuOpen(false)}>
                     {/* --- INCREASED PROFILE PIC SIZE (MOBILE) --- */}
                     <img
                       src={profilePicUrl}
                       alt="Profile"
                       // Changed from w-6 h-6
                       className="w-8 h-8 rounded-full object-cover border"
                       onError={(e) => { (e.target as HTMLImageElement).src = "http://127.0.0.1:8000/media/profile_pics/Nothing.png"; }}
                     /> Profile
                     {/* --- END CHANGE --- */}
                 </Link>
                // Add Mobile Logout Button
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
                  <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}><Button className="w-full">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}