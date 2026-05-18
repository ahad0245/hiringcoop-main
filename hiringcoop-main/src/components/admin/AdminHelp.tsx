
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { FiInfo, FiAlertTriangle, FiKey } from 'react-icons/fi';

export const AdminHelp = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700"
        onClick={() => setOpen(true)}
      >
        <FiInfo className="h-4 w-4" />
        Admin Help
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access Information</DialogTitle>
            <DialogDescription>
              How to access the HiringCoop admin panel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FiKey className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Keyboard Shortcut</h4>
                <p className="text-sm text-muted-foreground">
                  Type <strong>hiringadmin</strong> on any page to access the admin login screen.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FiInfo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Admin Badge</h4>
                <p className="text-sm text-muted-foreground">
                  Once logged in, admins will see an "Admin" badge in their profile dropdown and
                  can directly access the admin panel from there.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FiAlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Admin Code</h4>
                <p className="text-sm text-muted-foreground">
                  Admin access requires the special code: <strong>HC_ADMIN_2025</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  New admin accounts can be created by Super Admins through invitation only.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminHelp;
