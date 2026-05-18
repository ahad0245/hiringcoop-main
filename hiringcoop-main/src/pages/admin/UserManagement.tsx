import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FiSearch, FiEdit2, FiLoader, FiUserCheck, FiUserX } from 'react-icons/fi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  user_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Other profile fields may exist but we're not using them here
}

const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState({
    first_name: '',
    last_name: '',
    user_type: ''
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term and userTypeFilter
    const filtered = users.filter(user => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) || 
        user.id.includes(searchTerm.toLowerCase());
      
      const matchesType = userTypeFilter === 'all' || user.user_type === userTypeFilter;
      
      return matchesSearch && matchesType;
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, userTypeFilter, users]);

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditingUser({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      user_type: user.user_type || 'candidate'
    });
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          user_type: editingUser.user_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User information updated successfully"
      });
      
      setShowEditDialog(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user information",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
  };

  const getInitials = (user: Profile) => {
    if (!user.first_name && !user.last_name) return 'U';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getFullName = (user: Profile) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User';
  };

  if (loading) {
    return (
      <DashboardLayout userType="superadmin">
        <div className="p-6 flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin h-8 w-8 mb-4 text-primary" />
            <p>Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="superadmin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage platform users
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between">
                <CardTitle className="text-lg mb-2 sm:mb-0">User Directory</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="candidate">Candidates</SelectItem>
                      <SelectItem value="employer">Employers</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="superadmin">Superadmins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          No users found matching your filters
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || undefined} />
                                <AvatarFallback>{getInitials(user)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{getFullName(user)}</p>
                                <p className="text-xs text-gray-600">{user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className={
                              user.user_type === 'candidate' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              user.user_type === 'employer' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              user.user_type === 'admin' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              user.user_type === 'superadmin' ? 'bg-red-100 text-red-800 border-red-200' : 
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }>
                              {user.user_type || 'Unknown'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <FiEdit2 className="mr-1 h-4 w-4" /> Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4 space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(selectedUser)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-xs">{selectedUser.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      value={editingUser.first_name}
                      onChange={(e) => setEditingUser({
                        ...editingUser, 
                        first_name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      value={editingUser.last_name}
                      onChange={(e) => setEditingUser({
                        ...editingUser, 
                        last_name: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">User Type</label>
                  <Select 
                    value={editingUser.user_type}
                    onValueChange={(value) => setEditingUser({
                      ...editingUser,
                      user_type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate">Candidate</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingUser.user_type === 'superadmin' && (
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <p className="text-yellow-800 text-sm">
                      Warning: Superadmins have full access to all platform features and data. 
                      Grant this permission carefully.
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
