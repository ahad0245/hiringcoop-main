
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FiMenu, FiX, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  // Get first letter of first and last name for avatar fallback
  const getInitials = () => {
    if (!user?.user_metadata) return 'U';
    const firstName = user.user_metadata.first_name || '';
    const lastName = user.user_metadata.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Function to determine where to navigate based on user type
  const handleDashboardClick = () => {
    const userType = user?.user_metadata?.user_type;
    if (userType === 'employer') {
      navigate('/employer');
    } else {
      navigate('/dashboard');
    }
    setIsOpen(false);
  };
  
  // Function to navigate to admin dashboard
  const handleAdminClick = () => {
    navigate('/admin');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">HiringCoop</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/for-employers" className="text-gray-600 hover:text-primary transition-colors">
              For Employers
            </Link>
            <Link to="/jobs" className="text-gray-600 hover:text-primary transition-colors">
              Find Talent
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              About Us
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                        </span>
                        {isAdmin && <Badge className="bg-primary">Admin</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    <FiUser className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={handleAdminClick}>
                        <FiShield className="mr-2 h-4 w-4" /> Admin Panel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={() => signOut()}>
                    <FiLogOut className="mr-2 h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-primary focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/for-employers" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              For Employers
            </Link>
            <Link 
              to="/jobs" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Find Talent
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <div className="pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleDashboardClick}>
                    <FiUser className="mr-2 h-4 w-4" /> My Dashboard
                  </Button>
                  
                  {isAdmin && (
                    <Button variant="ghost" className="w-full justify-start" onClick={handleAdminClick}>
                      <FiShield className="mr-2 h-4 w-4" /> Admin Panel
                      <Badge className="ml-2 bg-primary">Admin</Badge>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                    <FiLogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Export removed since we're using named export above
