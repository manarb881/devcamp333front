import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { AuthContext } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { Camera, LogOut, UploadCloud, X, User, Search, ChevronDown, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  const { token, setToken, isAuthenticated, profile, setProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Local states
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true); // Changed to true for skeleton
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Backend base URL
  const BACKEND_BASE_URL = "http://127.0.0.1:8000";

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_BASE_URL}/api/accounts/me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, setProfile]);

  // Handle file selection and generate preview
  const handleFileChange = (e) => {
    console.log("handleFileChange triggered. Files:", e.target.files);
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setImageError(false);
    } else {
      if (file) {
        alert("Please select a valid image file (e.g., PNG, JPEG, GIF, WEBP).");
      }
      setProfilePic(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Trigger file input click
  const handleImageClick = () => {
    console.log("handleImageClick called.");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not available!");
    }
  };

  // Cancel preview
  const cancelPreview = () => {
    setPreview(null);
    setProfilePic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload profile picture
  const handleUpload = async () => {
    if (!profilePic) return;

    const formData = new FormData();
    formData.append("profile_pic", profilePic);

    setIsUploading(true);
    setLoading(true);

    try {
      await axios.post(`${BACKEND_BASE_URL}/api/accounts/profile-pic/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      const response = await axios.get(`${BACKEND_BASE_URL}/api/accounts/me/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setProfile(response.data);
      setPreview(null);
      setProfilePic(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageError(false);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setProfile(null);
    navigate("/auth/login");
  };

  // Image source logic
  const imageSrc = preview
    ? preview
    : profile?.profile?.profile_pic
    ? `${BACKEND_BASE_URL}${profile.profile.profile_pic}`
    : null;

  // Current date for header
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex mt-20">
      {/* Sidebar */}
      <div className="w-16 bg-white shadow-md flex flex-col items-center py-6 space-y-6">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <div className="w-4 h-4 grid grid-cols-2 gap-1">
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-blue-500">
          <User size={24} />
        </button>
        <button className="text-gray-500 hover:text-blue-500">
          <Mail size={24} />
        </button>
        <button className="text-gray-500 hover:text-blue-500">
          <LogOut size={24} onClick={handleLogout} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-10">
        {/* Profile Section */}
        <Card className="max-w-3xl mx-auto bg-white rounded-xl shadow-md animate-slideUp">

          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-60 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : profile ? (
              <>
            <div >
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome, <span className="text-purple-500">{profile?.first_name || profile?.username || "User"}</span>
            </h1>
            </div>
                {/* Profile Picture and Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative group">
                    <Avatar className="w-10 h-16 border-2 border-gray-200">
                      {imageSrc && !imageError ? (
                        <AvatarImage
                          src={imageSrc}
                          alt="Profile"
                          className="object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {profile?.username?.charAt(0)?.toUpperCase() || <User size={24} />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600"
                      aria-label="Change profile picture"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {profile.first_name || profile.last_name
                        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                        : profile.username}
                    </h2>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                  <Button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                    Edit
                  </Button>
                </div>

                {/* Preview Actions */}
                {preview && (
                  <div className="flex justify-center gap-3 mb-6 animate-fade-in">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                      size="sm"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UploadCloud size={16} />
                      )}
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                    <Button
                      onClick={cancelPreview}
                      disabled={isUploading}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-sm text-gray-600">Company Name</Label>
                    <Input
                      value={
                        profile.first_name || profile.last_name
                          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                          : "Your First Name"
                      }
                      className="mt-1 border-gray-300 rounded-md text-gray-500 italic"
                      disabled
                    />
                  </div>


                  <div className="relative">
                    <Label className="text-sm text-gray-600">Country</Label>
                    <Input
                      value="Your First Name"
                      className="mt-1 border-gray-300 rounded-md text-gray-500 italic"
                      disabled
                    />
                    <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-400" />
                  </div>

                </div>

                {/* Email Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">My email Address</h3>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{profile.email}</p>
                      <p className="text-xs text-gray-500">1 month ago</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 text-blue-500 border-blue-500 hover:bg-blue-50"
                  >
                    + Add Email Address
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 animate-fade-in">
                Could not load profile data.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}