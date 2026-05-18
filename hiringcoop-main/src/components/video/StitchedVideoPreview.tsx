
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StitchedVideoPreviewProps {
  videoUrl: string | null;
  isStitching: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

const StitchedVideoPreview: React.FC<StitchedVideoPreviewProps> = ({
  videoUrl,
  isStitching,
  isSubmitting,
  onBack,
  onSubmit
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border">
      <h2 className="text-xl font-semibold mb-4">Complete Video Interview</h2>
      
      {isStitching ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Creating your combined video...</p>
        </div>
      ) : videoUrl ? (
        <>
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-600 mb-6">
            Here is your complete interview with all questions answered. You can review it before submitting.
          </p>
        </>
      ) : (
        <div className="py-8 text-center text-gray-500">
          Something went wrong creating the combined video.
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back to Questions
        </Button>
        
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting || isStitching || !videoUrl}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit and View in Library"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StitchedVideoPreview;
