import React, { useState, useRef, useEffect } from 'react';

interface Segment {
  signedUrl: string;
  questionText: string;
}

interface InterviewPlayerProps {
  segments: Segment[];
  playing: boolean;
  onTogglePlay: () => void;
}

const InterviewPlayer: React.FC<InterviewPlayerProps> = ({ segments, playing, onTogglePlay }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = segments[currentIndex];

  // When playing state changes externally
  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [playing, currentIndex]);

  const handleEnded = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back or stop
      setCurrentIndex(0);
      onTogglePlay();
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  if (!current) return null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-t-lg overflow-hidden">
      <video
        ref={videoRef}
        src={current.signedUrl}
        className="w-full h-full object-contain"
        onEnded={handleEnded}
        controls={playing}
      />

      {/* Question overlay */}
      <div className="absolute top-0 left-0 right-0 bg-black/60 px-4 py-3 pointer-events-none">
        <p className="text-white text-sm font-medium truncate">
          Q{currentIndex + 1}: {current.questionText}
        </p>
      </div>

      {/* Segment dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
        {segments.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); handleDotClick(i); }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
        <span className="text-white/80 text-xs ml-1">
          Q{currentIndex + 1} of {segments.length}
        </span>
      </div>

      {/* Play overlay when not playing */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors"
          onClick={onTogglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPlayer;
