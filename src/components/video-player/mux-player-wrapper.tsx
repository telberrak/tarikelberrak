"use client";

import MuxPlayer from "@mux/mux-player-react";

export function MuxPlayerWrapper({
  playbackId,
  initialTime = 0,
  onTimeUpdate,
  onEnded,
}: {
  playbackId: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border-faint">
      <MuxPlayer
        playbackId={playbackId}
        startTime={initialTime}
        streamType="on-demand"
        playbackRates={[0.75, 1, 1.25, 1.5, 2]}
        accentColor="#E8A33D"
        onTimeUpdate={(e) => {
          const el = e.target as HTMLMediaElement;
          onTimeUpdate?.(el.currentTime, el.duration || 0);
        }}
        onEnded={onEnded}
        style={{ aspectRatio: "16/9", width: "100%" }}
      />
    </div>
  );
}
