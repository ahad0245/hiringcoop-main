
import { useState, useEffect, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUser, FiUsers, FiBriefcase, FiSettings, FiLogOut, FiMenu, FiX, FiClock, FiBookOpen, FiPlus, FiVideo } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';

type UserType = 'candidate' | 'employer' | 'superadmin';

interface DashboardLayoutProps {
  children: ReactNode;
  userType?: UserType;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const DashboardLayout = ({ children, userType = 'candidate' }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Close sidebar when route changes on mobile
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getSidebarNavItems = (): NavItem[] => {
    if (userType === 'candidate') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="h-5 w-5" /> },
        { name: 'My Profile', path: '/candidate/profile', icon: <FiUser className="h-5 w-5" /> },
        { name: 'Applications', path: '/candidate/applications', icon: <FiClock className="h-5 w-5" /> },
        { name: 'Video Library', path: '/dashboard/videos', icon: <FiVideo className="h-5 w-5" /> },
        { name: 'Interview Prep', path: '/candidate/interview-prep', icon: <FiBookOpen className="h-5 w-5" /> },
        { name: 'Browse Jobs', path: '/jobs', icon: <FiBriefcase className="h-5 w-5" /> },
      ];
    } else if (userType === 'employer') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="h-5 w-5" /> },
        { name: 'My Jobs', path: '/dashboard/jobs', icon: <FiBriefcase className="h-5 w-5" /> },
        { name: 'Post Job', path: '/dashboard/jobs/create', icon: <FiPlus className="h-5 w-5" /> },
        { name: 'Company Profile', path: '/dashboard/company', icon: <FiUser className="h-5 w-5" /> },
        { name: 'Candidates', path: '/dashboard/candidates', icon: <FiUsers className="h-5 w-5" /> },
      ];
    } else {
      // superadmin
      return [
        { name: 'Dashboard', path: '/admin', icon: <FiHome className="h-5 w-5" /> },
        { name: 'Jobs Approval', path: '/admin/jobs', icon: <FiBriefcase className="h-5 w-5" /> },
        { name: 'Video Questions', path: '/admin/questions', icon: <FiBookOpen className="h-5 w-5" /> },
        { name: 'Verifications', path: '/admin/verifications', icon: <FiUser className="h-5 w-5" /> },
        { name: 'Users', path: '/admin/users', icon: <FiUsers className="h-5 w-5" /> },
      ];
    }
  };

  const sidebarNavItems = getSidebarNavItems();

  const getInitials = () => {
    if (!profile) return 'U';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user?.email;

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 w-64 h-full border-r bg-card transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 px-4 border-b flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-primary">HiringCoop</Link>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <FiX className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors hover:bg-muted group
                          ${location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userType === 'superadmin' ? 'Administrator' : userType}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b px-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-5 w-5" />
          </Button>
          <div className="flex-1 md:px-4">
            <h1 className="text-lg font-medium">
              {userType === 'candidate' ? 'Candidate Portal' : 
               userType === 'employer' ? 'Employer Portal' : 'Admin Portal'}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
