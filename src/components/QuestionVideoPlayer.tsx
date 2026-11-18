import { useState, useEffect, useRef } from "react";

interface QuestionVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  questionNumber: number;
  totalQuestions: number;
  simulatedDurationSeconds?: number;
  onVideoEnd: () => void;
  isRevealed: boolean;
  onSkip: () => void;
}

export function QuestionVideoPlayer({
  videoUrl,
  posterUrl = "/assets/reader-portrait.jpg",
  questionNumber,
  totalQuestions,
  simulatedDurationSeconds = 6,
  onVideoEnd,
  isRevealed,
  onSkip,
}: QuestionVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUnmuteNotice, setShowUnmuteNotice] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Fallback simulation timer when no real video file is loaded
  useEffect(() => {
    setHasEnded(false);
    setProgress(0);
    setIsPlaying(true);

    if (!videoUrl) {
      const startTime = performance.now();
      const totalMs = simulatedDurationSeconds * 1000;
      let animId: number;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const currentProgress = Math.min(1, elapsed / totalMs);
        setProgress(currentProgress * 100);

        if (currentProgress < 1) {
          animId = requestAnimationFrame(tick);
        } else {
          setHasEnded(true);
          onVideoEnd();
        }
      };

      animId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animId);
    } else if (videoRef.current) {
      const vid = videoRef.current;
      vid.currentTime = 0;
      vid
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowUnmuteNotice(false);
        })
        .catch(() => {
          // If browser restricts unmuted autoplay, mute and retry
          vid.muted = true;
          setIsMuted(true);
          setShowUnmuteNotice(true);
          vid.play().catch(() => {});
        });
    }
  }, [videoUrl, questionNumber, simulatedDurationSeconds, onVideoEnd]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const vid = videoRef.current;
      if (vid.duration) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    setHasEnded(true);
    setIsPlaying(false);
    onVideoEnd();
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      setShowUnmuteNotice(false);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleReplay = () => {
    setHasEnded(false);
    setProgress(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="mt-8 flex w-full max-w-[420px] flex-col items-center">
      {/* Video Status Header */}
      <div className="mb-3 flex w-full items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          {!hasEnded ? (
            <span className="flex items-center gap-1.5 font-medium text-gold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold"></span>
              </span>
              <span>Pergunta {questionNumber} de {totalQuestions}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span>✓ Pergunta concluída</span>
            </span>
          )}
        </div>

        {/* Audio Waveform Indicator */}
        {!hasEnded && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-foreground/60">Ouça o vídeo</span>
            <div className="flex h-3 items-end gap-0.5">
              <span className="audio-bar inline-block w-0.5 rounded-full bg-gold" style={{ animationDelay: "0ms" }} />
              <span className="audio-bar inline-block w-0.5 rounded-full bg-gold" style={{ animationDelay: "150ms" }} />
              <span className="audio-bar inline-block w-0.5 rounded-full bg-gold" style={{ animationDelay: "300ms" }} />
              <span className="audio-bar inline-block w-0.5 rounded-full bg-gold" style={{ animationDelay: "450ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Main Video Box Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-gold/40 bg-black/90 shadow-gold-soft">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative h-full w-full">
            <img
              src={posterUrl}
              alt="Modelo Leitora"
              className={`h-full w-full object-cover transition-transform duration-700 ${
                !hasEnded ? "scale-105" : "scale-100 opacity-90"
              }`}
            />
            {/* Gradient Overlays for VSL aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Speaking animation badge over portrait */}
            {!hasEnded && (
              <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-center px-4 text-center">
                <div className="flex items-center gap-2 rounded-full border border-gold/60 bg-black/70 px-4 py-1.5 text-xs text-gold backdrop-blur-md">
                  <div className="flex h-3 items-end gap-0.5">
                    <span className="audio-bar inline-block w-1 rounded-full bg-gold" style={{ animationDelay: "0ms" }} />
                    <span className="audio-bar inline-block w-1 rounded-full bg-gold" style={{ animationDelay: "200ms" }} />
                    <span className="audio-bar inline-block w-1 rounded-full bg-gold" style={{ animationDelay: "400ms" }} />
                  </div>
                  <span className="font-medium tracking-wide">A modelo está a falar...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unmute Notice / Sound Overlay */}
        {showUnmuteNotice && (
          <button
            type="button"
            onClick={toggleSound}
            className="absolute inset-x-4 top-4 z-20 flex items-center justify-center gap-2 rounded-full border border-gold/70 bg-black/85 py-2 text-xs font-medium text-gold shadow-lg backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
          >
            <span>🔊 Toque aqui para ativar o som do vídeo</span>
          </button>
        )}

        {/* Video Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-gold transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Overlay Controls (Replay / Sound) */}
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          {hasEnded && (
            <button
              type="button"
              onClick={handleReplay}
              title="Ouvir novamente"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-black/70 text-xs text-gold backdrop-blur transition-colors hover:bg-gold hover:text-black cursor-pointer"
            >
              ↺
            </button>
          )}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? "Ativar som" : "Desativar som"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-black/70 text-xs text-gold backdrop-blur transition-colors hover:bg-gold hover:text-black cursor-pointer"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Helper skip button under video */}
      {!isRevealed && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-3 text-xs tracking-wider text-foreground/50 underline transition-colors hover:text-gold cursor-pointer"
        >
          Pular vídeo e responder agora →
        </button>
      )}
    </div>
  );
}
