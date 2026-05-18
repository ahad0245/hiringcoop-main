
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminShortcut = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Store pressed keys
    const keys: string[] = [];
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    // Secret key sequence for admin access: "hiringadmin"
    const secretCode = ['h', 'i', 'r', 'i', 'n', 'g', 'a', 'd', 'm', 'i', 'n'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the key to the array
      keys.push(e.key.toLowerCase());
      
      // Reset the keys after a delay
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        keys.length = 0;
      }, 1500);
      
      // Check if the last pressed keys match the secret code
      const lastKeys = keys.slice(-secretCode.length);
      if (
        lastKeys.length === secretCode.length &&
        lastKeys.every((key, i) => key === secretCode[i])
      ) {
        navigate('/hcadmin2025');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);
  
  // This component doesn't render anything visible
  return null;
};

export default AdminShortcut;
