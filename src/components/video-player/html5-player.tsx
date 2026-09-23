"use client";

import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function Html5Player({
  src,
  initialTime = 0,
  onTimeUpdate,
  onEnded,
}: {
  src: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const seekedInitial = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function onLoadedMetadata() {
      if (!video) return;
      setDuration(video.duration);
      if (!seekedInitial.current && initialTime > 0 && initialTime < video.duration - 2) {
        video.currentTime = initialTime;
        seekedInitial.current = true;
      }
    }

    function onTimeUpdateHandler() {
      if (!video) return;
      setCurrent(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration || 0);
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    }

    function onPlay() {
      setPlaying(true);
    }
    function onPause() {
      setPlaying(false);
    }
    function onEndedHandler() {
      setPlaying(false);
      onEnded?.();
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdateHandler);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEndedHandler);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdateHandler);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEndedHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrent(time);
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const v = Number(e.target.value);
    video.volume = v;
    setVolume(v);
    setMuted(v === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function changeSpeed(s: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = s;
    setSpeed(s);
    setSpeedMenuOpen(false);
  }

  function toggleFullscreen() {
    const container = videoRef.current?.closest("[data-video-container]") as HTMLElement | null;
    if (!container) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void container.requestFullscreen();
    }
  }

  return (
    <div
      data-video-container
      className="group relative overflow-hidden rounded-[14px] border border-border-faint bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        className="aspect-video w-full bg-black"
        onClick={togglePlay}
        playsInline
      />

      {!playing && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber text-amber-text">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-8">
        <div className="relative h-1.5 w-full rounded-full bg-white/20">
          <div
            className="absolute h-full rounded-full bg-white/30"
            style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }}
          />
          <div
            className="absolute h-full rounded-full bg-amber"
            style={{ width: `${duration ? (current / duration) * 100 : 0}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={handleSeek}
            aria-label="Seek"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="mt-2 flex items-center gap-3 text-white">
          <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="shrink-0">
            {playing ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <span className="font-mono text-xs tabular-nums">
            {formatDuration(current)} / {formatDuration(duration)}
          </span>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
                {muted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.45 2.45c.03-.2.05-.43.05-.65zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.9 8.9 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06A7 7 0 0 1 19 12zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L18.73 21 20 19.73 4.27 3zM12 4 9.91 6.09 12 8.18z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.23v2.06A7 7 0 0 1 19 12a7 7 0 0 1-5 6.71v2.06A9 9 0 0 0 21 12a9 9 0 0 0-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                aria-label="Volume"
                className="h-1 w-16 accent-amber"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setSpeedMenuOpen((v) => !v)}
                className="font-mono text-xs"
                aria-haspopup="menu"
                aria-expanded={speedMenuOpen}
              >
                {speed}x
              </button>
              {speedMenuOpen && (
                <div
                  role="menu"
                  className="absolute bottom-full right-0 mb-2 w-16 rounded-[8px] border border-border bg-surface py-1 shadow-xl"
                >
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      role="menuitem"
                      onClick={() => changeSpeed(s)}
                      className="block w-full px-3 py-1 text-left font-mono text-xs text-text-body hover:bg-surface-alt"
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} aria-label="Fullscreen">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M4 9V4h5v2H6v3H4zm0 6v5h5v-2H6v-3H4zm16-6V4h-5v2h3v3h2zm0 6v5h-5v-2h3v-3h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
