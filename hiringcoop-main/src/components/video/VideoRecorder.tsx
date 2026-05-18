
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { FiCamera, FiVideo, FiRefreshCw, FiPlay, FiPause, FiX, FiCheck } from 'react-icons/fi';

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  timeLimit?: number; // in seconds
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onVideoRecorded, 
  questionText, 
  questionNumber, 
  totalQuestions,
  timeLimit = 60 // default 60 seconds
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Reset timer when time limit changes
  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);
  
  // Timer countdown during recording
  useEffect(() => {
    let interval: number | undefined;
    
    if (capturing && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            handleStopCapture();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [capturing, timeRemaining]);
  
  const handleStartCapture = useCallback(() => {
    setCapturing(true);
    setPreviewUrl(null);
    setTimeRemaining(timeLimit);
    
    if (webcamRef.current && webcamRef.current.stream) {
      const options: MediaRecorderOptions = { mimeType: 'video/webm' };
      // Cap bitrate to keep files small and uploads reliable
      try {
        options.videoBitsPerSecond = 500_000; // 500 kbps
      } catch {}
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, options);
      
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      
      mediaRecorderRef.current.start(1000);
    }
  }, [webcamRef, mediaRecorderRef, timeLimit]);
  
  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => [...prev, data]);
      }
    },
    [setRecordedChunks]
  );
  
  const handleStopCapture = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);
  
  const handleReset = useCallback(() => {
    setRecordedChunks([]);
    setPreviewUrl(null);
    setTimeRemaining(timeLimit);
  }, [timeLimit]);
  
  useEffect(() => {
    if (recordedChunks.length > 0 && !capturing) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }
  }, [recordedChunks, capturing]);
  
  const handleAccept = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      onVideoRecorded(blob);
      // Reset after accepting
      setRecordedChunks([]);
      setPreviewUrl(null);
    }
  }, [recordedChunks, onVideoRecorded]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <div className="text-sm font-medium text-gray-500 mb-1">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-xl font-semibold">{questionText}</h2>
        <p className="mt-2 text-gray-600">
          You have {formatTime(timeLimit)} to respond. Feel free to retry as many times as needed.
        </p>
      </div>
      
      <div className="video-container aspect-video border bg-gray-900 rounded-xl overflow-hidden">
        {cameraError ? (
          <div className="h-full flex flex-col items-center justify-center text-white p-4">
            <FiX className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Camera Access Error</h3>
            <p className="text-center mb-4">{cameraError}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="bg-white text-gray-800 hover:bg-gray-100"
            >
              Retry Camera Access
            </Button>
          </div>
        ) : previewUrl ? (
          <video 
            src={previewUrl} 
            controls 
            className="w-full h-full object-contain"
          />
        ) : (
          <Webcam
            audio
            ref={webcamRef}
            className="w-full h-full object-contain"
            videoConstraints={{
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 }
            }}
            onUserMedia={() => setCameraReady(true)}
            onUserMediaError={(error) => {
              console.error("Camera error:", error);
              setCameraError("Unable to access your camera or microphone. Please make sure they are connected and you've granted permission to use them.");
            }}
          />
        )}
        
        {/* Recording indicator */}
        {capturing && (
          <div className="absolute top-4 right-4 flex items-center bg-black/70 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
            <span className="text-sm">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {previewUrl ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center"
            >
              <FiRefreshCw className="mr-2" /> Record Again
            </Button>
            <Button 
              onClick={handleAccept}
              className="flex items-center"
            >
              <FiCheck className="mr-2" /> Accept & Continue
            </Button>
          </>
        ) : (
          <>
            {!capturing && cameraReady && (
              <Button 
                onClick={handleStartCapture} 
                disabled={capturing}
                className="flex items-center"
              >
                <FiVideo className="mr-2" /> Start Recording
              </Button>
            )}
            {capturing && (
              <Button 
                variant="destructive" 
                onClick={handleStopCapture}
                className="flex items-center"
              >
                <FiPause className="mr-2" /> Stop Recording
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
