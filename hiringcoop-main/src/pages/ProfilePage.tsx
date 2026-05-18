
import { useState } from 'react';
import { useUserProfile, ProfileType } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiAlertCircle, FiEdit, FiSave, FiX, FiUser } from 'react-icons/fi';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileType>>({});
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setFormData({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        title: profile?.title || '',
        bio: profile?.bio || '',
      });
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdating(true);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (err: any) {
      setUpdateError(err.message || 'An error occurred while updating your profile');
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = () => {
    if (!profile) return 'U';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Convert admin type to superadmin for dashboard compatibility
  const getDashboardUserType = (userType?: string) => {
    if (userType === 'admin') return 'superadmin';
    return (userType as 'candidate' | 'employer') || 'candidate';
  };

  if (loading) {
    return (
      <DashboardLayout userType={getDashboardUserType()}>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={getDashboardUserType(profile?.user_type)}>
      <div className="container max-w-4xl py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <FiAlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {updateError && (
          <Alert variant="destructive" className="mb-6">
            <FiAlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleEditToggle}
              disabled={updating}
            >
              {isEditing ? <FiX className="h-4 w-4" /> : <FiEdit className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <p className="mt-2 text-sm text-muted-foreground">{profile?.user_type}</p>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      rows={5}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updating}
                      className="flex items-center gap-2"
                    >
                      {updating ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FiSave className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">First Name</Label>
                      <p>{profile?.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Last Name</Label>
                      <p>{profile?.last_name || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Email</Label>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Professional Title</Label>
                    <p>{profile?.title || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Bio</Label>
                    <p className="whitespace-pre-line">{profile?.bio || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
