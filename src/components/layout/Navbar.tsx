import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { LayoutDashboard, MessageCircle } from "lucide-react"; // Added MessageCircle for messages icon
import axios from "axios"; // Import axios to fetch messages
import { AuthContext,useData } from "@/contexts/DataContext"; // Ensure AuthContext provides `profile`

const navLinks = [
  { name: "Home", path: "/" },

  { name: "Pricing", path: "/Pricing" },
  { name: "Settings", path: "/settings" },
];

export function Navbar() {
  const { isAuthenticated, profile,token } = useContext(AuthContext);
  const [newMessagesCount, setNewMessagesCount] = useState(0); // State for new message count
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const {isAdmin}=useData();
  // Fetch new messages count on mount
  useEffect(() => {
    if (isAuthenticated && token) {
      // Fetch messages for the logged-in user
      axios
        .get("http://127.0.0.1:8000/api/accounts/messages/list", {
          headers: {
            Authorization: `Token ${token}`, // Add token in Authorization header
          },
        })
        .then((response) => {
          setNewMessagesCount(response.data.length);
        })
        .catch((err) => {
          console.error("Error fetching messages", err);
        });
    }
  }, [isAuthenticated, token]);
  console.log(isAuthenticated)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const profilePicUrl =
    isAuthenticated && profile?.profile?.profile_pic
      ? profile.profile.profile_pic.startsWith("http")
        ? profile.profile.profile_pic
        : `http://127.0.0.1:8000${profile.profile.profile_pic}`
      : "http://127.0.0.1:8000/media/profile_pics/Nothing.png";

  return (
    <nav className="bg-background border-b py-4 fixed w-full top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">AGRoyale</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-foreground/70"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Admin Link */}
          
          <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                location.pathname.startsWith("/admin")
                  ? "text-primary"
                  : "text-foreground/70"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
         

          {/* Messages Tab for Admin */}

        </div>

        {/* Auth and Theme Toggle section for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="hover:underline flex items-center">
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "http://127.0.0.1:8000/media/profile_pics/Nothing.png";
                  }}
                />
                <p className="ml-2">Profile</p>
              </Link>
            </div>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMenuOpen ? "hidden" : "block"}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMenuOpen ? "block" : "hidden"}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 inset-x-0 bg-background shadow-lg rounded-b-lg p-4 md:hidden z-50 border-t animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors hover:bg-muted ${
                    location.pathname === link.path
                      ? "text-primary bg-secondary"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors hover:bg-muted flex items-center gap-2 ${
                    location.pathname.startsWith("/admin")
                      ? "text-primary bg-secondary"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              <div className="border-t pt-2 flex flex-col space-y-2">
                <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
