import { useEffect } from 'react';
import { useAuth } from "@/contexts/DataContext"; // Adjust path if needed
import { useData } from '@/contexts/DataContext'; // Adjust path if needed

/**
 * This component listens for changes in the authentication profile
 * and updates the isAdmin status in the DataContext accordingly.
 * It renders nothing itself.
 */
const AdminStatusSynchronizer = () => {
  const { profile } = useAuth();
  const { setIsAdmin } = useData();

  useEffect(() => {
    // Check if the profile exists and indicates an admin user
    if (profile?.profile?.is_admin === true) {
      // console.log("Sync: User is admin, setting isAdmin=true in DataContext");
      setIsAdmin(true);
    } else {
      // Otherwise, ensure isAdmin is false
      // console.log("Sync: User is not admin or profile not loaded, setting isAdmin=false in DataContext");
      setIsAdmin(false);
    }
    // Re-run only when the profile object changes or setIsAdmin function changes (stable)
  }, [profile, setIsAdmin]);

  // This component doesn't render anything visual
  return null;
};

export default AdminStatusSynchronizer;